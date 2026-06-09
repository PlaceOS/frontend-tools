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
import { LandingPageComponent } from './app/landing-page.component';
import { OrganisationComponent } from './app/organisation/organisation.component';
import { InterfacesComponent } from './app/interfaces/interfaces.component';
import { SpacesComponent } from './app/spaces/spaces.component';
import { FloorPlansComponent } from './app/floorplans/floorplans.component';
import { CateringComponent } from './app/catering/catering.component';
import { DesksComponent } from './app/desks/desks.component';
import { LockersComponent } from './app/lockers/lockers.component';
import { ZonesComponent } from './app/zoning/zoning.component';
import { CarSpacesComponent } from './app/car-spaces/car-spaces.component';
import { AssetsComponent } from './app/assets/assets.component';
import { MonitoringComponent } from './app/monitoring/monitoring.component';
import { AccessControlsComponent } from './app/access-control/access-control.component';
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
    { path: 'home', component: LandingPageComponent },
    { path: 'organisation', component: OrganisationComponent },
    { path: 'interfaces/:id', component: InterfacesComponent },
    { path: 'interfaces', redirectTo: `/interfaces/root` },
    { path: 'spaces', component: SpacesComponent },
    { path: 'floorplans', component: FloorPlansComponent },
    { path: 'catering', component: CateringComponent },
    { path: 'desks', component: DesksComponent },
    { path: 'lockers', component: LockersComponent },
    { path: 'zoning', component: ZonesComponent },
    { path: 'parking', component: CarSpacesComponent },
    { path: 'assets', component: AssetsComponent },
    { path: 'monitoring', component: MonitoringComponent },
    { path: 'access-control', component: AccessControlsComponent },
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
