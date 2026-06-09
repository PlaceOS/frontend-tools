import {
    enableProdMode,
    importProvidersFrom,
    provideZonelessChangeDetection,
} from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideRouter, Route, withHashLocation } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ServiceWorkerModule } from '@angular/service-worker';
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
        path: 'editor/:src',
        loadComponent: () =>
            import('./app/editor/editor.component').then(
                (m) => m.WayfindingEditorComponent
            ),
    },
    {
        path: 'playground/:src',
        loadComponent: () =>
            import('./app/playground/playground.component').then(
                (m) => m.WayfindingPlaygroundComponent
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
            BrowserAnimationsModule,
            FormsModule,
            ReactiveFormsModule,
            MatFormFieldModule,
            MatInputModule,
            MatSelectModule,
            MatButtonModule,
            ClipboardModule,
            MatTooltipModule,
            ServiceWorkerModule.register('ngsw-worker.js', {
                enabled: environment.production,
                // Register the ServiceWorker as soon as the application is stable
                // or after 30 seconds (whichever comes first).
                registrationStrategy: 'registerWhenStable:30000',
            })
        ),
    ],
}).catch((err) => console.error(err));
