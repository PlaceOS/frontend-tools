import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'placeos-tools-root',
    template: ` <router-outlet></router-outlet> `,
    styles: [],
    imports: [RouterOutlet],
})
export class AppComponent {}
