import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AppSharedComponent } from './shared/shared.component';
import { AppWorkplaceComponent } from './workplace/workplace.component';
import { AppConciergeComponent } from './concierge/concierge.component';
import { SharedUIComponentsModule } from './components/components.module';

const routes: Route[] = [
    { path: 'shared', component: AppSharedComponent },
    { path: 'workplace', component: AppWorkplaceComponent },
    { path: 'concierge', component: AppConciergeComponent },
    { path: '**', redirectTo: 'shared' },
];

@NgModule({
    declarations: [
        AppComponent,
        AppSharedComponent,
        AppWorkplaceComponent,
        AppConciergeComponent,
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes, {
            initialNavigation: 'enabled',
            useHash: true,
        }),
        BrowserAnimationsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the app is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000',
        }),
        SharedUIComponentsModule,
        MatButtonModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
