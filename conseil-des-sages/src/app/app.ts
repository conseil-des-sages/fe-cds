import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackdropComponent } from './ui/backdrop/backdrop.component';
import { Navbar } from './components/navbar/navbar';

@Component({
  imports: [RouterOutlet, BackdropComponent, Navbar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('conseil-des-sages');
}
