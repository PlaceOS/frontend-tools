import { Component, inject, signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTabLink, MatTabNav } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SettingsStateService } from './settings-state.service';

@Component({
    selector: 'placeos-tools-root',
    template: `
        <div class="flex h-full flex-col">
            <nav mat-tab-nav-bar class="mx-auto w-[768px] max-w-full">
                @for (link of links; track link) {
                    <a
                        mat-tab-link
                        [routerLink]="[link.path]"
                        (click)="path.set(link.path)"
                        [active]="path() === link.path"
                        routerLinkActive="active"
                    >
                        {{ link.name }}
                    </a>
                }
            </nav>
            <div class="h-1/2 flex-1 overflow-auto">
                <div class="mx-auto w-[768px] max-w-full">
                    <router-outlet />
                </div>
            </div>
        </div>
        @if (loading()) {
            <div
                class="absolute inset-0 flex flex-col items-center justify-center bg-white/80"
            >
                <mat-spinner diameter="32" />
                <p>{{ loading() }}</p>
            </div>
        }
    `,
    styles: [``],
    imports: [
        MatTabNav,
        MatTabLink,
        RouterLinkActive,
        RouterLink,
        RouterOutlet,
        MatProgressSpinner,
    ],
})
export class AppComponent {
    private _state = inject(SettingsStateService);

    public readonly path = signal('');
    public readonly links = [
        { path: '/shared', name: 'Shared' },
        { path: '/workplace', name: 'Workplace' },
        { path: '/concierge', name: 'Concierge' },
    ];
    public readonly loading = this._state.loading;
}
