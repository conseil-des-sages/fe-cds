import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AvatarState, SageColor } from '@/models/sage.model';
import { IconComponent } from '../icon.component';

/** Avatar rond d'un sage. Il est identifié par son symbole et son nom, jamais par sa seule couleur. */
@Component({
  selector: 'app-sage-avatar',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': 'decorative() ? null : "img"',
    '[attr.aria-label]': 'decorative() ? null : name()',
    '[attr.aria-hidden]': 'decorative() ? "true" : null',
  },
  templateUrl: './sage-avatar.component.html',
  styleUrl: './sage-avatar.component.css',
})
export class SageAvatarComponent {
  readonly icon = input.required<string>();
  readonly color = input.required<SageColor>();
  readonly name = input('');
  readonly size = input(72);
  readonly state = input<AvatarState>('idle');
  readonly decorative = input(false);

  protected readonly colorVar = computed(() => `var(--sage-${this.color()})`);
  protected readonly iconSize = computed(() => Math.round(this.size() * 0.42));
}
