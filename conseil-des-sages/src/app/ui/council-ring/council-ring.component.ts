import { ChangeDetectionStrategy, Component, ElementRef, afterRenderEffect, computed, input, output, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { AvatarState, Sage } from '@/models/sage.model';
import { SageAvatarComponent } from '../sage-avatar/sage-avatar.component';
import { SeatNote, SeatNotesComponent } from './seat-notes';

const CENTER_COLUMN = 0.2;

/**
 * La table ronde : les sages en cercle, le contenu projeté au centre.
 * Les positions sont en %, le cercle suit donc son conteneur. Sur mobile, il devient une rangée.
 */
@Component({
  selector: 'app-council-ring',
  imports: [NgTemplateOutlet, SageAvatarComponent, SeatNotesComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.--avatar.px]': 'avatarSize()' },
  templateUrl: './council-ring.component.html',
  styleUrl: './council-ring.component.css',
})
export class CouncilRingComponent {
  readonly sages = input.required<Sage[]>();
  readonly activeId = input<number | null>(null);
  readonly thinkingId = input<number | null>(null);
  readonly avatarSize = input(72);
  /** Rayons de l'ellipse, en % du conteneur */
  readonly rx = input(42);
  readonly ry = input(40);
  readonly label = input('Le conseil');
  /** Ce qu'a dit chaque sage. Renseigné, un survol l'affiche et un clic émet seatOpened. */
  readonly notes = input<Record<number, SeatNote[]> | null>(null);
  readonly seatOpened = output<number>();

  protected readonly seats = computed(() => {
    const list = this.sages();
    return list.map((sage, index) => {
      const angle = ((-90 + (360 / list.length) * index) * Math.PI) / 180;
      return {
        sage,
        state: this.stateOf(sage.id),
        left: 50 + this.rx() * Math.cos(angle),
        top: 50 + this.ry() * Math.sin(angle),
        side: this.popoverSide(Math.cos(angle), Math.sin(angle)),
      };
    });
  });

  private readonly seatList = viewChild.required<ElementRef<HTMLElement>>('seatList');

  constructor() {
    // Rangée mobile trop longue : le sage qui parle reste visible, sans faire défiler la page.
    afterRenderEffect(() => {
      this.seats();
      const list = this.seatList().nativeElement;
      const seat = list.querySelector<HTMLElement>('[aria-current]');
      if (seat && list.scrollWidth > list.clientWidth) {
        list.scrollTo({ left: seat.offsetLeft - (list.clientWidth - seat.offsetWidth) / 2 });
      }
    });
  }

  /** La bulle s'ouvre vers le centre du cercle, pour rester dans l'écran. */
  private popoverSide(x: number, y: number): 'left' | 'right' | 'above' | 'below' {
    if (x > CENTER_COLUMN) return 'left';
    if (x < -CENTER_COLUMN) return 'right';
    return y < 0 ? 'below' : 'above';
  }

  private stateOf(id: number): AvatarState {
    if (id === this.thinkingId()) return 'thinking';
    const active = this.activeId() ?? this.thinkingId();
    if (id === this.activeId()) return 'speaking';
    return active ? 'dimmed' : 'idle';
  }
}
