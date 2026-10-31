import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Profile } from '@/models/account.model';
import { IconComponent } from '@/ui/icon.component';

@Component({
  selector: 'app-profile-hero',
  imports: [DatePipe, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cds-glass cds-glass--strong hero">
      <span class="initial heading-2" aria-hidden="true">{{ initial() }}</span>
      <div class="who">
        @if (renaming()) {
          <form class="rename" (submit)="$event.preventDefault(); confirm()">
            <label class="sr-only" for="profile-name">Ton pseudo</label>
            <input
              id="profile-name"
              class="cds-input"
              maxlength="100"
              [value]="draft()"
              (input)="draft.set($any($event.target).value)"
            />
            <button type="submit" class="cds-btn cds-btn--sm" [disabled]="!draft().trim()">Enregistrer</button>
            <button type="button" class="cds-btn cds-btn--ghost cds-btn--sm" (click)="renaming.set(false)">Annuler</button>
          </form>
        } @else {
          <h1 class="heading-1">
            {{ profile().name }}
            <button type="button" class="cds-btn cds-btn--ghost cds-btn--icon edit" aria-label="Changer de pseudo" (click)="startRename()">
              <app-icon name="pencil" [size]="16" />
            </button>
          </h1>
        }
        <p class="body email">{{ profile().email }}</p>
        <p class="caption since">Au conseil depuis {{ profile().createdAt | date: 'MMMM y' : '' : 'fr' }}</p>
      </div>
      <dl class="figures">
        <div><dt class="cds-label">Débats</dt><dd class="cds-metric">{{ profile().debates }}</dd></div>
        <div><dt class="cds-label">Sages créés</dt><dd class="cds-metric">{{ profile().sages }}</dd></div>
      </dl>
    </section>
  `,
  styleUrl: './profile-hero.css',
})
export class ProfileHeroComponent {
  readonly profile = input.required<Profile>();
  readonly renamed = output<string>();

  protected readonly renaming = signal(false);
  protected readonly draft = signal('');
  protected readonly initial = computed(() => this.profile().name.charAt(0).toUpperCase());

  protected startRename(): void {
    this.draft.set(this.profile().name);
    this.renaming.set(true);
  }

  protected confirm(): void {
    const name = this.draft().trim();
    if (!name) return;
    this.renamed.emit(name);
    this.renaming.set(false);
  }
}
