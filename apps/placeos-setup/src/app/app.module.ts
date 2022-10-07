import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ComponentsModule } from '@placeos-tools/components';

import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar.component';
import { InterfacesComponent } from './interfaces/interfaces.component';
import { LandingPageComponent } from './landing-page.component';
import { OrganisationComponent } from './organisation/organisation.component';
import { BuildingComponent } from './organisation/building.component';
import { OrganisationLevelComponent } from './organisation/level.component';

const ROUTES: Route[] = [
    { path: 'home', component: LandingPageComponent },
    { path: 'organisation', component: OrganisationComponent },
    { path: 'interfaces', component: InterfacesComponent },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        OrganisationComponent,
        BuildingComponent,
        OrganisationLevelComponent,
        InterfacesComponent,
        LandingPageComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(ROUTES, {
            initialNavigation: 'enabledBlocking',
            useHash: true,
        }),
        MatCheckboxModule,
        MatButtonModule,
        ComponentsModule,
        ClipboardModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
