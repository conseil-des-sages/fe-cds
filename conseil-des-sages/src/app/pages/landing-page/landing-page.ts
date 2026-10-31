import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BASE_SAGES, QUESTION } from '../../data/sages';
import { CouncilRingComponent } from '../../ui/council-ring.component';
import { IconComponent } from '../../ui/icon.component';
import { SageCardComponent } from '../../ui/sage-card.component';

const HERO_LINES: Record<string, string> = {
  prudent: 'Et si le contrat n’est pas signé avant juin ?',
  optimiste: 'Deux ans d’expérience, c’est un vrai tremplin.',
  financier: 'Environ 59 000 € d’écart sur deux ans.',
  avocat: 'Tout le monde penche pour Lyon. Attaquons Lyon.',
  futur: 'Dans dix ans, je me souviens surtout des gens.',
};

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink, CouncilRingComponent, IconComponent, SageCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  protected readonly sages = BASE_SAGES;
  protected readonly question = QUESTION;
  protected readonly activeIndex = signal(2);
  protected readonly active = computed(() => this.sages[this.activeIndex()]);
  protected readonly line = computed(() => HERO_LINES[this.active().id]);

  protected readonly steps = [
    {
      icon: 'message',
      title: 'Pose ta question',
      text: 'Décris ton dilemme en une phrase. Ajoute du contexte si tu veux : budget, délais, ce qui compte pour toi.',
      example: '« Alternance à Lyon ou master à Paris ? »',
    },
    {
      icon: 'users',
      title: 'Les sages débattent',
      text: 'Cinq personnalités opposées s’affrontent en direct, en trois temps, et te posent parfois une question.',
      example: 'Ouverture · Confrontation · Position finale',
    },
    {
      icon: 'sparkles',
      title: 'Reçois une synthèse',
      text: 'Un tableau de scores, les points de consensus, les vrais désaccords et les questions qui restent à te poser.',
      example: 'Coût · Épanouissement · Perspectives · Risque',
    },
  ];

  constructor() {
    const id = setInterval(() => this.activeIndex.update((i) => (i + 1) % this.sages.length), 3200);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }
}
