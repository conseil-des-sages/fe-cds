import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

type Mode = 'connexion' | 'inscription';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login-page',
  styleUrl: './login-page.css',
  templateUrl: './login-page.html',
})
export class LoginPage {
  readonly mode = signal<Mode>('connexion');
  readonly showPassword = signal(false);

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  setMode(mode: Mode) {
    this.mode.set(mode);
  }

  togglePasswordVisibility() {
    this.showPassword.update((visible) => !visible);
  }

  onSubmit(): void {
  }
}
