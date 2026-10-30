import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { SUGGESTIONS, TRENDS, USER } from '../../data/sages';
import { CouncilStore } from '../../services/council.store';
import { IconComponent } from '../../ui/icon.component';
import { SageAvatarComponent } from '../../ui/sage-avatar.component';
import { CustomizeCouncilComponent } from './customize-council.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [IconComponent, SageAvatarComponent, CustomizeCouncilComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage {
  private readonly router = inject(Router);
  protected readonly store = inject(CouncilStore);

  /** ?personnaliser=1 opens the dialog, ?personnaliser=creer opens the create form */
  readonly personnaliser = input<string | undefined>(undefined);

  protected readonly user = USER;
  protected readonly trends = TRENDS;
  protected readonly suggestions = SUGGESTIONS;

  protected readonly draft = signal('');
  protected readonly canSend = computed(() => this.draft().trim().length >= 5);
  protected readonly dialogOpen = signal(false);
  protected readonly dialogView = signal<'grid' | 'form'>('grid');
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly councilNames = computed(() =>
    this.store
      .council()
      .map((s) => s.shortName)
      .join(', '),
  );

  constructor() {
    effect(() => {
      const p = this.personnaliser();
      if (p) {
        this.dialogView.set(p === 'creer' ? 'form' : 'grid');
        this.dialogOpen.set(true);
      }
    });
    effect(() => {
      const el = this.dialog()?.nativeElement;
      if (!el) return;
      if (this.dialogOpen() && !el.open) el.showModal();
      if (!this.dialogOpen() && el.open) el.close();
    });
  }

  protected openCustomize(): void {
    this.dialogView.set('grid');
    this.dialogOpen.set(true);
  }

  protected onKeydown(e: KeyboardEvent): void {
    if (e.key !== 'Enter' || e.shiftKey) return;
    if (e.isComposing || e.keyCode === 229) return;
    e.preventDefault();
    this.send();
  }

  protected send(): void {
    if (!this.canSend()) return;
    this.store.question.set(this.draft().trim());
    this.router.navigateByUrl('/salle');
  }
}
