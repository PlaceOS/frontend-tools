import {
    enableProdMode,
    importProvidersFrom,
    provideZonelessChangeDetection,
} from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideRouter, Route, withHashLocation } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { AppComponent } from './app/app.component';
import { BootstrapComponent } from './app/bootstrap.component';
import { EditorComponent } from './app/editor/editor.component';

const routes: Route[] = [
    { path: '', component: BootstrapComponent },
    { path: 'editor', component: EditorComponent },
    { path: 'editor/:src', component: EditorComponent },
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
            FormsModule,
            ServiceWorkerModule.register('ngsw-worker.js', {
                enabled: environment.production,
            }),
            BrowserAnimationsModule,
            MatButtonModule,
            MatFormFieldModule,
            MatInputModule,
            MatRippleModule,
            MatTooltipModule,
            MatMenuModule,
            ClipboardModule
        ),
    ],
}).catch((err) => console.error(err));
