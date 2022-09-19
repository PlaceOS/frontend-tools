import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WayfindingEditorComponent } from './editor/editor.component';
import { BootstrapComponent } from './bootstrap.component';
import { WayfindingPlaygroundComponent } from './playground/playground.component';

const routes: Routes = [
    {
        path: '',
        component: BootstrapComponent,
    },
    {
        path: 'editor/:src',
        component: WayfindingEditorComponent,
    },
    {
        path: 'playground/:src',
        component: WayfindingPlaygroundComponent,
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
