import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroSection } from './sections/hero-section';
import { HowSection } from './sections/how-section';
import { MeetSection } from './sections/meet-section';

@Component({
  selector: 'app-landing-page',
  imports: [HeroSection, HowSection, MeetSection],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {}
