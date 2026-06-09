import {
    enableProdMode,
    importProvidersFrom,
    provideZonelessChangeDetection,
} from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation, Route } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { AppComponent } from './app/app.component';
import { EditorComponent } from './app/editor/editor.component';
import { HomeComponent } from './app/home.component';

const routes: Route[] = [
    { path: '', component: HomeComponent },
    { path: 'editor/:id', component: EditorComponent },
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
            ServiceWorkerModule.register('ngsw-worker.js', {
                enabled: environment.production,
            }),
            BrowserAnimationsModule,
            MatButtonModule
        ),
    ],
}).catch((err) => console.error(err));
