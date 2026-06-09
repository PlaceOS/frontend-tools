import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar.component';

@Component({
    selector: 'placeos-tools-root',
    template: `
        <div class="absolute inset-0 flex overflow-hidden dark:bg-neutral-600">
            <sidebar class="h-full" />
            <div class="h-full w-1/2 flex-1 border-l border-neutral-500">
                <router-outlet />
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
