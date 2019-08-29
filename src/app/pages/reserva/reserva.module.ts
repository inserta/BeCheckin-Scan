import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReservaPage } from './reserva.page';
import { TranslateModule } from '@ngx-translate/core';
import { DateFormatPipe } from '../../pipes/dateFormat/dateFormatPipe';

const routes: Routes = [
  {
    path: '',
    component: ReservaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ReservaPage, DateFormatPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReservaPageModule {}
