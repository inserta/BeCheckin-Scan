import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FiltrosPage } from './filtros.page';

const routes: Routes = [
  {
    path: '',
    component: FiltrosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FiltrosPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FiltrosPageModule {}
