import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { SignaturePadModule } from 'angular2-signaturepad';
import { IonicModule } from '@ionic/angular';

import { NuevoHuespedPage } from './nuevo-huesped.page';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  {
    path: '',
    component: NuevoHuespedPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    HttpClientModule,
    SignaturePadModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NuevoHuespedPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NuevoHuespedPageModule {}
