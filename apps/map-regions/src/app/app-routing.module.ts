import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorComponent } from './editor/editor.component';

import { BootstrapComponent } from './bootstrap.component';

const routes: Routes = [
    {
        path: '',
        component: BootstrapComponent,
    },
    {
        path: 'editor/:id',
        component: EditorComponent,
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
