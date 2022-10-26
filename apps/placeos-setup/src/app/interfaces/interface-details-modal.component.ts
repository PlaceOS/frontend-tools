import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Interface } from './interfaces.service';

@Component({
    selector: 'interface-details-modal',
    template: ``,
    styles: [``],
})
export class InterfaceDetailsModalComponent {
    constructor(@Inject(MAT_DIALOG_DATA) private _data: Interface) {}
}
