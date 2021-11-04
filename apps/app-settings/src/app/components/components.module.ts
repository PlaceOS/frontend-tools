import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { PairListFieldComponent } from "./pair-list-field.component";
import { ColorListFieldComponent } from "./color-list-field.component";

const COMPONENTS = [
    PairListFieldComponent,
    ColorListFieldComponent
]

@NgModule({
    declarations: [...COMPONENTS],
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule
    ],
    exports: [...COMPONENTS]
})
export class SharedUIComponentsModule {}
