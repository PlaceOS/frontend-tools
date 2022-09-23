import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { ComponentsModule } from '@placeos-tools/components';

import { AppComponent } from './app.component';
import { BootstrapComponent } from './bootstrap.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WayfindingEditorComponent } from './editor/editor.component';
import { WayfindingPlaygroundComponent } from './playground/playground.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MapWaypointDisplayComponent } from './editor/map-waypoint-display.component';
import { MapNavPathDisplayComponent } from './editor/map-navpath-display.component';

@NgModule({
    declarations: [
        AppComponent,
        BootstrapComponent,
        WayfindingEditorComponent,
        WayfindingPlaygroundComponent,
        MapWaypointDisplayComponent,
        MapNavPathDisplayComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        ComponentsModule,
        ClipboardModule,
        MatTooltipModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000',
        }),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
