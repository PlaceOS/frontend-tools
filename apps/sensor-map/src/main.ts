import {
    enableProdMode,
    importProvidersFrom,
    provideZonelessChangeDetection,
} from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideRouter, Route, withHashLocation } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { AppComponent } from './app/app.component';

const routes: Route[] = [
    {
        path: '',
        loadComponent: () =>
            import('./app/bootstrap.component').then(
                (m) => m.BootstrapComponent
            ),
    },
    {
        path: 'editor',
        loadComponent: () =>
            import('./app/editor/editor.component').then(
                (m) => m.EditorComponent
            ),
    },
    {
        path: 'editor/:src',
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
            FormsModule,
            ServiceWorkerModule.register('ngsw-worker.js', {
                enabled: environment.production,
            }),
            BrowserAnimationsModule,
            MatButtonModule,
            MatFormFieldModule,
            MatInputModule,
            MatRippleModule,
            MatTooltipModule,
            MatMenuModule,
            ClipboardModule
        ),
    ],
}).catch((err) => console.error(err));
