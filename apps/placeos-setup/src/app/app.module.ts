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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';

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
import { DeskModalComponent } from './desks/desk-modal.component';
import { DesksComponent } from './desks/desks.component';
import { DeskDetailsComponent } from './desks/desk-details.component';
import { LockerModalComponent } from './lockers/locker-modal.component';
import { LockersComponent } from './lockers/lockers.component';
import { LockerDetailsComponent } from './lockers/locker-details.component';
import { ZoneModalComponent } from './zoning/zone-modal.component';
import { ZonesComponent } from './zoning/zoning.component';
import { ZoneDetailsComponent } from './zoning/zone-details.component';
import { CarSpacesComponent } from './car-spaces/car-spaces.component';
import { CarSpaceModalComponent } from './car-spaces/car-space-modal.component';
import { CarSpaceDetailsComponent } from './car-spaces/car-space-details.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { MonitoringItemDetailsComponent } from './monitoring/item-details.component';
import { MonitoringItemModalComponent } from './monitoring/item-modal.component';
import { AssetsComponent } from './assets/assets.component';
import { AssetDetailsComponent } from './assets/asset-details.component';
import { AssetModalComponent } from './assets/asset-modal.component';
import { AccessControlsComponent } from './access-control/access-control.component';
import { AccessControlModalComponent } from './access-control/access-control-modal.component';
import { AccessControlDetailsComponent } from './access-control/access-control-details.component';
import { FloorPlansComponent } from './floorplans/floorplans.component';
import { FloorPlanModalComponent } from './floorplans/floorplan-modal.component';
import { FloorPlanDetailsComponent } from './floorplans/floorplan-details.component';
import { FloorPlanExampleModalComponent } from './floorplans/example-modal.component';
import { CateringComponent } from './catering/catering.component';
import { CateringMenuComponent } from './catering/catering-menu.component';
import { CateringMenuItemComponent } from './catering/catering-menu-item.component';
import { CateringItemModalComponent } from './catering/catering-item-modal.component';
import { CateringItemOptionModalComponent } from './catering/catering-option-modal.component';

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

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        LandingPageComponent,

        OrganisationComponent,
        BuildingComponent,
        OrganisationBuildingModalComponent,
        OrganisationLevelComponent,
        OrganisationLevelModalComponent,

        InterfacesComponent,
        InterfaceDetailsComponent,

        SpaceModalComponent,
        SpacesComponent,
        SpaceDetailsComponent,

        FloorPlansComponent,
        FloorPlanModalComponent,
        FloorPlanDetailsComponent,
        FloorPlanExampleModalComponent,

        DeskModalComponent,
        DesksComponent,
        DeskDetailsComponent,

        LockerModalComponent,
        LockersComponent,
        LockerDetailsComponent,

        ZoneModalComponent,
        ZonesComponent,
        ZoneDetailsComponent,

        CarSpacesComponent,
        CarSpaceModalComponent,
        CarSpaceDetailsComponent,

        MonitoringComponent,
        MonitoringItemDetailsComponent,
        MonitoringItemModalComponent,

        AssetsComponent,
        AssetDetailsComponent,
        AssetModalComponent,
        AccessControlsComponent,
        AccessControlModalComponent,
        AccessControlDetailsComponent,

        CateringComponent,
        CateringMenuComponent,
        CateringMenuItemComponent,
        CateringItemModalComponent,
        CateringItemOptionModalComponent
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
        MatAutocompleteModule,
        MatTabsModule,
        MatMenuModule,
        ComponentsModule,
        ClipboardModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
