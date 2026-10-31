import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Synthesis } from '@/models/debate.model';

/** Ce que le Greffier remet à la fin du débat. Le contenu défile dans le panneau, jamais dans la page. */
@Component({
  selector: 'app-synthesis-view',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './synthesis-view.html',
  styleUrl: './synthesis-view.css',
})
export class SynthesisViewComponent {
  readonly synthesis = input.required<Synthesis>();
}
