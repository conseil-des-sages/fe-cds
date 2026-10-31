import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DebateStatus, DebateSummary } from '@/models/debate.model';
import { IconComponent } from '@/ui/icon.component';
import { SageAvatarComponent } from '@/ui/sage-avatar/sage-avatar.component';

const STATUS: Record<DebateStatus, { label: string; icon: string }> = {
  IN_PROGRESS: { label: 'En cours', icon: 'circle-dot' },
  FINISHED: { label: 'Terminé', icon: 'circle-check' },
  ARCHIVED: { label: 'Archivé', icon: 'archive' },
};

@Component({
  selector: 'app-debate-history',
  imports: [DatePipe, RouterLink, IconComponent, SageAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './debate-history.html',
  styleUrl: './debate-history.css',
})
export class DebateHistoryComponent {
  readonly debates = input.required<DebateSummary[] | null>();
  readonly archived = output<DebateSummary>();
  readonly deleted = output<DebateSummary>();

  protected readonly status = STATUS;
  /** Supprimer demande une confirmation : un débat supprimé ne revient pas. */
  protected readonly confirmingId = signal<number | null>(null);

  protected confirmDelete(debate: DebateSummary): void {
    this.confirmingId.set(null);
    this.deleted.emit(debate);
  }
}
