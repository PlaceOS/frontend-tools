import {
    enableProdMode,
    importProvidersFrom,
    provideZonelessChangeDetection,
} from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import {
    withEnabledBlockingInitialNavigation,
    withHashLocation,
    provideRouter,
    Route,
} from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app/app.component';

const routes: Route[] = [
    {
        path: 'shared',
        loadComponent: () =>
            import('./app/shared/shared.component').then(
                (m) => m.AppSharedComponent
            ),
    },
    {
        path: 'workplace',
        loadComponent: () =>
            import('./app/workplace/workplace.component').then(
                (m) => m.AppWorkplaceComponent
            ),
    },
    {
        path: 'concierge',
        loadComponent: () =>
            import('./app/concierge/concierge.component').then(
                (m) => m.AppConciergeComponent
            ),
    },
    { path: '**', redirectTo: 'shared' },
];

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideZonelessChangeDetection(),
        importProvidersFrom(
            BrowserAnimationsModule,
            ServiceWorkerModule.register('ngsw-worker.js', {
                enabled: environment.production,
                // Register the ServiceWorker as soon as the app is stable
                // or after 30 seconds (whichever comes first).
                registrationStrategy: 'registerWhenStable:30000',
            }),
            MatButtonModule,
            MatTabsModule,
            MatFormFieldModule,
            MatInputModule,
            MatSelectModule,
            MatCheckboxModule,
            MatProgressSpinnerModule,
            FormsModule,
            ReactiveFormsModule
        ),
        provideRouter(
            routes,
            withEnabledBlockingInitialNavigation(),
            withHashLocation()
        ),
    ],
}).catch((err) => console.error(err));
