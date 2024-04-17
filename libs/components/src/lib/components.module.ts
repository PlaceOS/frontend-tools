import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { IconComponent } from './icon.component';
import { InteractiveMapComponent } from './interactive-map.component';
import { MapPinComponent } from './map-pin.component';
import { MapRadiusComponent } from './map-radius.component';
import { MapPolygonComponent } from './map-polygon.component';
import { MapPointComponent } from './map-point.component';
import { CustomTooltipComponent } from './custom-tooltip.component';
import { PortalModule } from '@angular/cdk/portal';
import { ConfirmModalComponent } from './confirm-modal.component';
import { MapCanvasComponent } from './map-canvas.component';

export * from './icon.component';
export * from './interactive-map.component';
export * from './map-pin.component';
export * from './map-polygon.component';
export * from './map-point.component';
export * from './map-radius.component';

const COMPONENTS: Type<any>[] = [
    IconComponent,
    InteractiveMapComponent,
    MapPinComponent,
    MapCanvasComponent,
    MapRadiusComponent,
    MapPolygonComponent,
    MapPointComponent,
    CustomTooltipComponent,
    ConfirmModalComponent,
];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        PortalModule,
    ],
    exports: [...COMPONENTS],
})
export class ComponentsModule {}
