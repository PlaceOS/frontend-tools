import {
    enableProdMode,
    importProvidersFrom,
    provideZonelessChangeDetection,
} from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    withEnabledBlockingInitialNavigation,
    withHashLocation,
    provideRouter,
    Route,
} from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app/app.component';

const ROUTES: Route[] = [
    {
        path: 'home',
        loadComponent: () =>
            import('./app/landing-page.component').then(
                (m) => m.LandingPageComponent
            ),
    },
    {
        path: 'organisation',
        loadComponent: () =>
            import('./app/organisation/organisation.component').then(
                (m) => m.OrganisationComponent
            ),
    },
    {
        path: 'interfaces/:id',
        loadComponent: () =>
            import('./app/interfaces/interfaces.component').then(
                (m) => m.InterfacesComponent
            ),
    },
    { path: 'interfaces', redirectTo: `/interfaces/root` },
    {
        path: 'spaces',
        loadComponent: () =>
            import('./app/spaces/spaces.component').then(
                (m) => m.SpacesComponent
            ),
    },
    {
        path: 'floorplans',
        loadComponent: () =>
            import('./app/floorplans/floorplans.component').then(
                (m) => m.FloorPlansComponent
            ),
    },
    {
        path: 'catering',
        loadComponent: () =>
            import('./app/catering/catering.component').then(
                (m) => m.CateringComponent
            ),
    },
    {
        path: 'desks',
        loadComponent: () =>
            import('./app/desks/desks.component').then((m) => m.DesksComponent),
    },
    {
        path: 'lockers',
        loadComponent: () =>
            import('./app/lockers/lockers.component').then(
                (m) => m.LockersComponent
            ),
    },
    {
        path: 'zoning',
        loadComponent: () =>
            import('./app/zoning/zoning.component').then(
                (m) => m.ZonesComponent
            ),
    },
    {
        path: 'parking',
        loadComponent: () =>
            import('./app/car-spaces/car-spaces.component').then(
                (m) => m.CarSpacesComponent
            ),
    },
    {
        path: 'assets',
        loadComponent: () =>
            import('./app/assets/assets.component').then(
                (m) => m.AssetsComponent
            ),
    },
    {
        path: 'monitoring',
        loadComponent: () =>
            import('./app/monitoring/monitoring.component').then(
                (m) => m.MonitoringComponent
            ),
    },
    {
        path: 'access-control',
        loadComponent: () =>
            import('./app/access-control/access-control.component').then(
                (m) => m.AccessControlsComponent
            ),
    },
    { path: '**', redirectTo: '/home' },
];

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideZonelessChangeDetection(),
        importProvidersFrom(
            BrowserAnimationsModule,
            MatFormFieldModule,
            MatInputModule,
            MatTooltipModule,
            MatDialogModule,
            MatSelectModule,
            MatCheckboxModule,
            MatButtonModule,
            MatChipsModule,
            MatAutocompleteModule,
            MatTabsModule,
            MatMenuModule,
            ClipboardModule,
            FormsModule,
            ReactiveFormsModule
        ),
        provideRouter(
            ROUTES,
            withEnabledBlockingInitialNavigation(),
            withHashLocation()
        ),
    ],
}).catch((err) => console.error(err));
