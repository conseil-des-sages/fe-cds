import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { IconComponent } from '../../ui/icon.component';

type Mode = 'connexion' | 'inscription';

@Component({
  imports: [ReactiveFormsModule, IconComponent],
  selector: 'app-login-page',
  styleUrl: './login-page.css',
  templateUrl: './login-page.html',
})
export class LoginPage {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);

  readonly mode = signal<Mode>('connexion');
  readonly showPassword = signal(false);
  protected readonly submitted = signal(false);
  protected readonly pending = signal(false);
  protected readonly authError = signal('');

  form: FormGroup = new FormGroup({
    pseudo: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  setMode(mode: Mode) {
    this.mode.set(mode);
    this.submitted.set(false);
    this.authError.set('');
    const pseudo = this.form.controls['pseudo'];
    const password = this.form.controls['password'];
    if (mode === 'inscription') {
      pseudo.setValidators([Validators.required, Validators.minLength(2)]);
      password.setValidators([Validators.required, Validators.minLength(8)]);
    } else {
      pseudo.clearValidators();
      password.setValidators([Validators.required]);
    }
    pseudo.updateValueAndValidity();
    password.updateValueAndValidity();
  }

  togglePasswordVisibility() {
    this.showPassword.update((visible) => !visible);
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.authError.set('');
    this.pending.set(true);
    const value = this.form.getRawValue();
    const request = this.mode() === 'inscription'
      ? this.auth.register({ name: value.pseudo.trim(), email: value.email.trim(), password: value.password })
      : this.auth.login({ email: value.email.trim(), password: value.password });

    request.pipe(finalize(() => this.pending.set(false))).subscribe({
      next: () => void this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('returnUrl') ?? '/app'),
      error: (error: unknown) => this.authError.set(this.backendError(error)),
    });
  }

  protected shouldShowError(name: string): boolean {
    const control = this.form.get(name);
    return !!control && control.invalid && (control.touched || this.submitted());
  }

  protected errorText(name: string): string {
    const control = this.form.get(name);
    if (control?.hasError('required')) {
      return name === 'pseudo' ? 'Le pseudo est obligatoire.' : 'Ce champ est obligatoire.';
    }
    if (control?.hasError('email')) return 'Saisis une adresse email valide.';
    if (control?.hasError('minlength')) {
      return name === 'pseudo'
        ? 'Le pseudo doit contenir au moins 2 caractères.'
        : 'Le mot de passe doit contenir au moins 8 caractères.';
    }
    return '';
  }

  private backendError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) return 'Le serveur ne répond pas. Réessaie dans un instant.';
      if (error.status === 401) return 'Email ou mot de passe incorrect.';
      if (error.status === 409) return 'Un compte existe déjà avec cette adresse email.';
      const detail = (error.error as { detail?: unknown } | null)?.detail;
      if (typeof detail === 'string' && detail.trim()) return detail;
    }
    return 'Une erreur est survenue, on relance ?';
  }
}
