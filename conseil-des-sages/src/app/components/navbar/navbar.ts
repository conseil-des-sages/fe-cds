import { ZardButtonComponent } from '@/shared/components/button';
import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideMenu, LucideX, LucideArrowUpRight } from '@lucide/angular';
import { AuthService } from '../../services/auth.service';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

@Component({
  selector: 'app-navbar',
  imports: [ThemeToggle, ZardButtonComponent, RouterLink, RouterLinkActive, LucideMenu, LucideX, LucideArrowUpRight],
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
  host: { '(document:keydown.escape)': 'close()' },
})
export class Navbar {
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly open = signal(false);

  protected readonly links = this.router.config
    .filter((r) => r.data?.['showInMenu'] === true)
    .map((r) => ({
      path: '/' + r.path,
      label: r.title as string,
      order: (r.data?.['order'] ?? 99) as number,
    }))
    .sort((a, b) => a.order - b.order);

  protected toggle() { this.open.update((v) => !v); }
  protected close()  { this.open.set(false); }

  protected logout() {
    this.auth.logout().subscribe(() => {
      this.close();
      void this.router.navigateByUrl('/landing-page');
    });
  }

  constructor() {
    // Bloque le défilement de la page quand le menu est ouvert
    effect(() => {
      this.doc.body.style.overflow = this.open() ? 'hidden' : '';
    });
    this.destroyRef.onDestroy(() => (this.doc.body.style.overflow = ''));

    // Referme le menu si on passe en version bureau (navigateur seulement : pas de window côté serveur)
    afterNextRender(() => {
      const mq = window.matchMedia('(min-width: 768px)');
      const onChange = (e: MediaQueryListEvent) => e.matches && this.close();
      mq.addEventListener('change', onChange);
      this.destroyRef.onDestroy(() => mq.removeEventListener('change', onChange));
    });
  }
}
