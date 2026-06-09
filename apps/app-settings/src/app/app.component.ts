import { Component } from '@angular/core';
import { SettingsStateService } from './settings-state.service';

@Component({
    standalone: false,
    selector: 'placeos-tools-root',
    template: `
        <div class="flex flex-col h-full">
          <nav mat-tab-nav-bar class="w-[768px] max-w-full mx-auto">
            @for (link of links; track link) {
              <a
                mat-tab-link
                [routerLink]="[link.path]"
                (click)="path = link.path"
                [active]="path === link.path"
                routerLinkActive="active"
                >
                {{ link.name }}
              </a>
            }
          </nav>
          <div class="flex-1 h-1/2 overflow-auto">
            <div class="w-[768px] max-w-full mx-auto">
              <router-outlet></router-outlet>
            </div>
          </div>
        </div>
        @if ((loading | async)) {
          <div class="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
            <mat-spinner diameter="32"></mat-spinner>
            <p>{{ loading | async }}</p>
          </div>
        }
        `,
    styles: [``],

})
export class AppComponent {
    public path = '';
    public readonly links = [
        { path: '/shared', name: 'Shared' },
        { path: '/workplace', name: 'Workplace' },
        { path: '/concierge', name: 'Concierge' },
    ];
    public readonly loading = this._state.loading;

    constructor(private _state: SettingsStateService) {}
}
