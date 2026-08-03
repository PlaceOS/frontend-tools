import {
    enableProdMode,
    importProvidersFrom,
    inject,
    provideAppInitializer,
    provideZonelessChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Route, withHashLocation } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app/app.component';
import { PlaceOSService } from './app/data/placeos.service';
import { environment } from './environments/environment';

const routes: Route[] = [
    // Full-screen pages, no chrome
    {
        path: 'editor/:floorplan_id',
        loadComponent: () =>
            import('./app/editor/editor.component').then(
                (m) => m.EditorComponent,
            ),
    },
    {
        path: 'kiosk/:project_id',
        loadComponent: () =>
            import('./app/kiosk/kiosk.component').then((m) => m.KioskComponent),
    },
    {
        path: 'kiosk/:project_id/:floorplan_id',
        loadComponent: () =>
            import('./app/kiosk/kiosk.component').then((m) => m.KioskComponent),
    },
    // Standard pages, wrapped in the app chrome
    {
        path: '',
        loadComponent: () =>
            import('./app/layout.component').then((m) => m.LayoutComponent),
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./app/pages/projects.component').then(
                        (m) => m.ProjectsComponent,
                    ),
            },
            {
                path: 'project/:id',
                loadComponent: () =>
                    import('./app/pages/project-detail.component').then(
                        (m) => m.ProjectDetailComponent,
                    ),
            },
            {
                path: 'import',
                loadComponent: () =>
                    import('./app/pages/import.component').then(
                        (m) => m.ImportComponent,
                    ),
            },
            {
                path: 'settings',
                loadComponent: () =>
                    import('./app/pages/settings.component').then(
                        (m) => m.SettingsComponent,
                    ),
            },
        ],
    },
    { path: '**', redirectTo: '' },
];

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideZonelessChangeDetection(),
        provideAppInitializer(() => inject(PlaceOSService).init()),
        provideRouter(routes, withHashLocation()),
        importProvidersFrom(
            ServiceWorkerModule.register('ngsw-worker.js', {
                enabled: environment.production,
            }),
            BrowserAnimationsModule,
        ),
    ],
}).catch((err) => console.error(err));
