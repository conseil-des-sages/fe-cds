import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { Sage, SageOrigin } from '@/models/sage.model';
import { IconComponent } from '@/ui/icon.component';
import { SageCardComponent } from '@/ui/sage-card/sage-card.component';

const FILTERS: { id: SageOrigin; label: string }[] = [
  { id: 'base', label: 'Catalogue' },
  { id: 'mine', label: 'Mes sages' },
  { id: 'library', label: 'Communauté' },
];

/** La grille des sages disponibles, filtrable et cherchable. */
@Component({
  selector: 'app-sage-picker',
  imports: [IconComponent, SageCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sage-picker.html',
  styleUrl: './sage-picker.css',
})
export class SagePickerComponent {
  readonly sages = input.required<Sage[]>();
  readonly selectedIds = input.required<number[]>();
  readonly full = input(false);
  readonly filter = input<SageOrigin>('base');
  readonly filterChange = output<SageOrigin>();
  readonly toggled = output<number>();
  readonly create = output<void>();
  readonly edit = output<Sage>();
  readonly remove = output<Sage>();

  protected readonly filters = FILTERS;
  protected readonly query = signal('');

  protected readonly visible = computed(() => {
    const query = this.query().trim().toLowerCase();
    return this.sages()
      .filter((sage) => sage.origin === this.filter())
      .filter((sage) =>
        !query || [sage.name, sage.description, sage.creator ?? ''].some((text) => text.toLowerCase().includes(query)),
      );
  });

  protected countFor(origin: SageOrigin): number {
    return this.sages().filter((sage) => sage.origin === origin).length;
  }

  protected search(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
