import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

import { ComponentsModule } from '@placeos-tools/components';

import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar.component';
import { InterfacesComponent } from './interfaces/interfaces.component';
import { LandingPageComponent } from './landing-page.component';
import { OrganisationComponent } from './organisation/organisation.component';
import { BuildingComponent } from './organisation/building.component';
import { OrganisationLevelComponent } from './organisation/level.component';
import { OrganisationBuildingModalComponent } from './organisation/building-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrganisationLevelModalComponent } from './organisation/level-modal.component';
import { InterfaceDetailsComponent } from './interfaces/interface-details.component';
import { SpaceModalComponent } from './spaces/space-modal.component';
import { SpacesComponent } from './spaces/spaces.component';
import { SpaceDetailsComponent } from './spaces/space-details.component';

const ROUTES: Route[] = [
    { path: 'home', component: LandingPageComponent },
    { path: 'organisation', component: OrganisationComponent },
    { path: 'interfaces/:id', component: InterfacesComponent },
    { path: 'interfaces', redirectTo: `/interfaces/root` },
    { path: 'spaces', component: SpacesComponent },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        OrganisationComponent,
        BuildingComponent,
        OrganisationBuildingModalComponent,
        OrganisationLevelComponent,
        OrganisationLevelModalComponent,
        InterfacesComponent,
        InterfaceDetailsComponent,
        LandingPageComponent,
        SpaceModalComponent,
        SpacesComponent,
        SpaceDetailsComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(ROUTES, {
            initialNavigation: 'enabledBlocking',
            useHash: true,
        }),
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        MatDialogModule,
        MatSelectModule,
        MatCheckboxModule,
        MatButtonModule,
        MatChipsModule,
        ComponentsModule,
        ClipboardModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
