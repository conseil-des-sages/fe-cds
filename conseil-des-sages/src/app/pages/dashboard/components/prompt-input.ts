import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { Sage } from '@/models/sage.model';
import { IconComponent } from '@/ui/icon.component';
import { SageAvatarComponent } from '@/ui/sage-avatar/sage-avatar.component';

export interface PromptSubmission {
  question: string;
  context?: string;
}

const MIN_QUESTION_LENGTH = 5;

/** Le champ central du dashboard, qui lance un débat. */
@Component({
  selector: 'app-prompt-input',
  imports: [IconComponent, SageAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './prompt-input.html',
  styleUrl: './prompt-input.css',
})
export class PromptInputComponent {
  readonly council = input.required<Sage[]>();
  readonly starting = input(false);
  readonly ready = input(true);
  readonly customize = output<void>();
  readonly submitted = output<PromptSubmission>();

  protected readonly question = signal('');
  protected readonly context = signal('');
  protected readonly showContext = signal(false);
  protected readonly canSend = computed(
    () => this.question().trim().length >= MIN_QUESTION_LENGTH && !this.starting() && this.ready(),
  );
  protected readonly councilLabel = computed(() => `Conseil : ${this.council().map((sage) => sage.name).join(', ')}`);

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
    event.preventDefault();
    this.send();
  }

  protected send(): void {
    if (!this.canSend()) return;
    const context = this.context().trim();
    this.submitted.emit({ question: this.question().trim(), ...(context ? { context } : {}) });
  }

  protected value(event: Event): string {
    return (event.target as HTMLTextAreaElement).value;
  }
}
