import { ChangeDetectionStrategy, Component, ElementRef, afterRenderEffect, effect, input, viewChild } from '@angular/core';
import { Sage, replyLabel } from '@/models/sage.model';
import { IconComponent } from '../icon.component';
import { SageAvatarComponent } from '../sage-avatar/sage-avatar.component';

const FOLLOW_THRESHOLD_PX = 24;

/** Le panneau central de la salle : le sage qui parle, écrit au fil du flux. Le texte défile dans le panneau. */
@Component({
  selector: 'app-intervention-panel',
  imports: [IconComponent, SageAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './intervention-panel.component.html',
  styleUrl: './intervention-panel.component.css',
})
export class InterventionPanelComponent {
  readonly sage = input.required<Sage>();
  readonly text = input('');
  readonly thinking = input(false);
  readonly typing = input(false);
  readonly repliesTo = input<Sage | null>(null);
  readonly stepLabel = input('');

  protected readonly replyLabel = replyLabel;
  private readonly body = viewChild<ElementRef<HTMLElement>>('body');
  /** Le texte suit l'écriture tant qu'on n'est pas remonté le relire. */
  private followWriting = true;

  constructor() {
    // Chaque sage repart du haut de son texte, en suivant l'écriture.
    effect(() => {
      this.sage();
      this.followWriting = true;
    });
    afterRenderEffect(() => {
      this.text();
      const element = this.body()?.nativeElement;
      if (element && this.followWriting) element.scrollTop = element.scrollHeight;
    });
  }

  protected onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    this.followWriting = element.scrollHeight - element.scrollTop - element.clientHeight < FOLLOW_THRESHOLD_PX;
  }
}
