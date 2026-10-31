import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DebateMessage, DebateStep, ScribeNote } from '@/models/debate.model';
import { Sage, replyLabel } from '@/models/sage.model';
import { IconComponent } from '@/ui/icon.component';
import { SageAvatarComponent } from '@/ui/sage-avatar/sage-avatar.component';

/** Tout ce qui a été dit, étape par étape. */
@Component({
  selector: 'app-transcript',
  imports: [IconComponent, SageAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transcript.html',
  styleUrl: './transcript.css',
})
export class TranscriptComponent {
  readonly steps = input.required<DebateStep[]>();
  readonly sages = input.required<Sage[]>();
  readonly scribe = input<Sage | null>(null);
  readonly notes = input<ScribeNote[]>([]);

  /** Chaque étape, avec les remarques du Greffier à leur place entre les interventions */
  protected readonly sections = computed(() => {
    let spoken = 0;
    return this.steps().map((step) => ({
      step,
      entries: step.messages.map((message) => {
        if (!message.fromUser) spoken += 1;
        const turn = spoken;
        return {
          message,
          notes: message.fromUser ? [] : this.notes().filter((note) => note.afterTurns === turn),
        };
      }),
    }));
  });

  protected readonly replyLabel = replyLabel;

  protected author(message: DebateMessage): Sage | null {
    return this.sages().find((sage) => sage.id === message.participantId) ?? null;
  }

  protected repliedSage(message: DebateMessage): Sage | null {
    return this.sages().find((sage) => sage.id === message.repliesToParticipantId) ?? null;
  }
}
