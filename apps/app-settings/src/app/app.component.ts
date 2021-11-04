import { Component } from '@angular/core';

@Component({
    selector: 'placeos-tools-root',
    template: `
        <div class="flex flex-col h-full">
            <nav mat-tab-nav-bar class="w-[768px] max-w-full mx-auto">
                <a
                    mat-tab-link
                    *ngFor="let link of links"
                    [routerLink]="[link.path]"
                    (click)="path = link.path"
                    [active]="path === link.path"
                    routerLinkActive="active"
                >
                    {{ link.name }}
                </a>
            </nav>
            <div class="flex-1 h-1/2 overflow-auto">
                <div class="w-[768px] max-w-full mx-auto">
                    <router-outlet></router-outlet>
                </div>
            </div>
        </div>
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
}
