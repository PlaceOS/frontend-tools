import { Component, inject, signal } from '@angular/core';
import { SettingsStateService } from './settings-state.service';
import { MatTabNav, MatTabLink } from '@angular/material/tabs';
import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'placeos-tools-root',
    template: `
        <div class="flex flex-col h-full">
            <nav mat-tab-nav-bar class="w-[768px] max-w-full mx-auto">
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
            <div class="flex-1 h-1/2 overflow-auto">
                <div class="w-[768px] max-w-full mx-auto">
                    <router-outlet />
                </div>
            </div>
        </div>
        @if ((loading | async)) {
        <div
            class="absolute inset-0 bg-white/80 flex flex-col items-center justify-center"
        >
            <mat-spinner diameter="32" />
            <p>{{ loading | async }}</p>
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
        AsyncPipe,
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
