import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Deep gradient + 3 slowly drifting blurred shapes. Pure CSS, GPU-friendly (transform only). */
@Component({
  selector: 'app-backdrop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <div class="blob blob--a"></div>
    <div class="blob blob--b"></div>
    <div class="blob blob--c"></div>
  `,
  styles: `
    :host {
      position: fixed;
      inset: 0;
      z-index: -1;
      overflow: hidden;
      background:
        radial-gradient(120% 90% at 10% 0%, var(--bg-2) 0%, transparent 60%),
        radial-gradient(90% 80% at 100% 100%, var(--bg-3) 0%, transparent 65%),
        linear-gradient(160deg, var(--bg-1) 0%, var(--bg-2) 55%, var(--bg-3) 100%);
      transition: background 400ms;
    }
    .blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
      opacity: var(--blob-opacity);
      will-change: transform;
    }
    .blob--a {
      width: 46vmax;
      height: 46vmax;
      left: -12vmax;
      top: -10vmax;
      background: var(--blob-a);
      animation: drift-a 38s ease-in-out infinite alternate;
    }
    .blob--b {
      width: 40vmax;
      height: 40vmax;
      right: -10vmax;
      top: 18vh;
      background: var(--blob-b);
      animation: drift-b 46s ease-in-out infinite alternate;
    }
    .blob--c {
      width: 34vmax;
      height: 34vmax;
      left: 28vw;
      bottom: -16vmax;
      background: var(--blob-c);
      animation: drift-c 52s ease-in-out infinite alternate;
    }
    @keyframes drift-a {
      to { transform: translate(14vw, 12vh) scale(1.08); }
    }
    @keyframes drift-b {
      to { transform: translate(-16vw, 10vh) scale(0.92); }
    }
    @keyframes drift-c {
      to { transform: translate(10vw, -14vh) scale(1.1); }
    }
  `,
})
export class BackdropComponent {}
