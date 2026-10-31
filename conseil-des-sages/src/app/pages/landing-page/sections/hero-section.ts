import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LANDING_LINES, LANDING_QUESTION, LANDING_SAGES } from '@/data/landing';
import { CouncilRingComponent } from '@/ui/council-ring/council-ring.component';
import { IconComponent } from '@/ui/icon.component';

const ROTATION_MS = 3200;

@Component({
  selector: 'app-hero-section',
  imports: [RouterLink, CouncilRingComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css',
})
export class HeroSection {
  protected readonly sages = LANDING_SAGES;
  protected readonly question = LANDING_QUESTION;
  private readonly activeIndex = signal(2);
  protected readonly active = computed(() => this.sages[this.activeIndex()]);
  protected readonly line = computed(() => LANDING_LINES[this.active().id]);

  constructor() {
    const destroyRef = inject(DestroyRef);
    // Dans le navigateur seulement : un minuteur empêcherait le pré-rendu de se terminer.
    afterNextRender(() => {
      const timer = setInterval(() => this.activeIndex.update((i) => (i + 1) % this.sages.length), ROTATION_MS);
      destroyRef.onDestroy(() => clearInterval(timer));
    });
  }
}
