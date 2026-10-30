import { ThemeProvider } from '@/services/ThemeProvider/theme-provider';
import { Component, inject } from '@angular/core';
import { LucideMoon, LucideSun } from '@lucide/angular';
import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  imports: [ZardButtonComponent, LucideMoon, LucideSun],
  selector: 'app-theme-toggle',
  styleUrl: './theme-toggle.css',
  templateUrl: './theme-toggle.html',
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeProvider)
}
