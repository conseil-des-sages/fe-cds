import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

type Mode = 'connexion' | 'inscription';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login-page',
  styleUrl: './login-page.css',
  templateUrl: './login-page.html',
})
export class LoginPage {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  readonly mode = signal<Mode>('connexion');
  readonly showPassword = signal(false);
  protected readonly submitted = signal(false);

  form: FormGroup = new FormGroup({
    pseudo: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  setMode(mode: Mode) {
    this.mode.set(mode);
    this.submitted.set(false);
    const pseudo = this.form.controls['pseudo'];
    if (mode === 'inscription') {
      pseudo.setValidators([Validators.required, Validators.minLength(2)]);
    } else {
      pseudo.clearValidators();
    }
    pseudo.updateValueAndValidity();
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

    // Temporary frontend-only sign-in until the project has a real auth API.
    this.auth.signIn();
    void this.router.navigateByUrl('/app');
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
}
