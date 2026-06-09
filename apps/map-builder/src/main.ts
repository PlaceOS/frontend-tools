import {
    enableProdMode,
    importProvidersFrom,
    provideZonelessChangeDetection,
} from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation, Route } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { AppComponent } from './app/app.component';

const routes: Route[] = [
    {
        path: '',
        loadComponent: () =>
            import('./app/home.component').then((m) => m.HomeComponent),
    },
    {
        path: 'editor/:id',
        loadComponent: () =>
            import('./app/editor/editor.component').then(
                (m) => m.EditorComponent
            ),
    },
    { path: '**', redirectTo: '' },
];

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes, withHashLocation()),
        importProvidersFrom(
            ServiceWorkerModule.register('ngsw-worker.js', {
                enabled: environment.production,
            }),
            BrowserAnimationsModule,
            MatButtonModule
        ),
    ],
}).catch((err) => console.error(err));
