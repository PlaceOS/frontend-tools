import { Component } from '@angular/core';
import { SidebarComponent } from './components/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'placeos-tools-root',
    template: `
        <div class="absolute inset-0 overflow-hidden flex dark:bg-neutral-600">
            <sidebar class="h-full"></sidebar>
            <div class="flex-1 w-1/2 h-full border-l border-neutral-500">
                <router-outlet></router-outlet>
            </div>
        </div>
    `,
    styles: [
        `
            a.active {
                background-color: #fff3 !important;
                color: var(--ternary) !important;
            }
        `,
    ],
    imports: [SidebarComponent, RouterOutlet],
})
export class AppComponent {}
