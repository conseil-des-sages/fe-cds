import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SageCardComponent } from '../../ui/sage-card.component';
import { CouncilStore } from '../../services/council.store';
import { USER } from '../../data/sages';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [SageCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="profile-page">
      <section class="profile-hero glass-panel">
        <div class="user-avatar">C</div><div><p class="eyebrow">Mon profil</p><h1>{{ user.fullName }}</h1><p>{{ user.email }}</p></div>
      </section>
      <section class="glass-panel history"><div class="section-heading"><div><p class="eyebrow">Activité</p><h2>Mes débats</h2></div><span class="count">12 débats</span></div>
        @for (debate of debates; track debate.title) { <div class="debate-row"><span class="status" [class.done]="debate.status === 'Terminé'"></span><div><strong>{{ debate.title }}</strong><small>{{ debate.date }}</small></div><span class="muted">{{ debate.status }}</span></div> }
      </section>
      <section><div class="section-heading"><div><p class="eyebrow">Créations</p><h2>Mes sages</h2></div></div><div class="sage-grid">@for (sage of store.mySages(); track sage.id) { <app-sage-card [sage]="sage" /> }</div></section>
    </main>
  `,
  styles: [`
    .profile-page { max-width: 1040px; margin: 0 auto; padding: 7rem 2rem 2rem; display: grid; gap: 1.25rem; }
    .glass-panel { padding: 1.5rem; border: 1px solid var(--glass-border); border-radius: 28px; background: var(--glass-3); box-shadow: var(--glass-shadow); backdrop-filter: blur(24px); }
    .profile-hero { display:flex; align-items:center; gap:1rem; } .user-avatar { width:58px; height:58px; display:grid; place-items:center; border-radius:50%; background:linear-gradient(135deg,var(--brand-accent),#8568ff); font-weight:800; font-size:1.4rem; } h1,h2,p { margin:0; } h1 { margin:.2rem 0; } h2 { font-size:1.25rem; } .eyebrow { color:var(--text-3); text-transform:uppercase; letter-spacing:.12em; font-size:.7rem; } .section-heading { display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; } .count,.muted,small { color:var(--text-3); } .debate-row { display:flex; align-items:center; gap:.8rem; padding:.9rem 0; border-top:1px solid var(--glass-border); } .debate-row div { flex:1; display:grid; gap:.2rem; } .status { width:9px; height:9px; border-radius:50%; background:var(--sage-orange); } .status.done { background:var(--sage-vert); } .sage-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; } @media(max-width:700px){.profile-page{padding:6.5rem 1rem 1rem}.sage-grid{grid-template-columns:1fr}.muted{display:none}}
  `],
})
export class ProfilePage { protected readonly store = inject(CouncilStore); protected readonly user = USER; protected readonly debates = [{ title: 'Alternance à Lyon ou master à Paris ?', date: 'Aujourd’hui', status: 'En cours' }, { title: 'Partir six mois à Montréal ?', date: '12 septembre 2026', status: 'Terminé' }, { title: 'Changer de voie professionnelle ?', date: '28 août 2026', status: 'Terminé' }]; }
