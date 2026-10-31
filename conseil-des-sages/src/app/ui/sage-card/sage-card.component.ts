import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Sage } from '@/models/sage.model';
import { IconComponent } from '../icon.component';
import { SageAvatarComponent } from '../sage-avatar/sage-avatar.component';

/** Carte d'un sage. États : au choix, dans le conseil, conseil complet, aperçu statique. */
@Component({
  selector: 'app-sage-card',
  imports: [SageAvatarComponent, IconComponent, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sage-card.component.html',
  styleUrl: './sage-card.component.css',
})
export class SageCardComponent {
  readonly sage = input.required<Sage>();
  readonly selected = input(false);
  readonly disabled = input(false);
  readonly preview = input(false);
  readonly toggled = output<number>();

  protected readonly originLabel = computed(() => {
    const sage = this.sage();
    if (sage.origin === 'base') return 'Sage du conseil';
    if (sage.origin === 'mine') return 'Par toi';
    return `Par ${sage.creator}`;
  });
}
