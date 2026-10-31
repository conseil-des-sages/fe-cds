import { afterNextRender, DOCUMENT, inject, Service, signal } from '@angular/core';

export type Theme = 'dark' | 'light'
const KEY = 'theme'

@Service()
export class ThemeProvider {
    private readonly doc = inject(DOCUMENT)
    
    readonly current = signal<Theme>('dark')

    constructor() {
        afterNextRender(() => this.set(this.readInitial(), false))
    }

    toggle(event? : Event) {
        const next: Theme = this.current() === 'dark' ? 'light' : 'dark'
        const apply = () => this.set(next, true)
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (event && 'startViewTransition' in this.doc && !reduceMotion) {
            // Centre du bouton = point de départ du cercle
            const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
            const x = rect.left + rect.width / 2
            const y = rect.top + rect.height / 2

            // Rayon nécessaire pour atteindre le coin le plus éloigné de l'écran
            const radius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y),
            )

            const style = this.doc.documentElement.style
            style.setProperty('--tx', `${x}px`)
            style.setProperty('--ty', `${y}px`)
            style.setProperty('--tr', `${radius}px`)

            this.doc.startViewTransition(apply)
        } else {
            apply()
        }
        
    }

    private set(theme: Theme, save: boolean) {
        this.current.set(theme)
        this.doc.documentElement.setAttribute('data-theme', theme)
        if (save){
            try{
                localStorage.setItem(KEY, theme)
            }
            catch{

            }
        }

    }

    private readInitial(): Theme {
        try{
            const saved = localStorage.getItem(KEY);
            if (saved==='light' || saved==='dark'){
                return saved
            }
        }
        catch{
        }
        return 'dark'
    }
}
