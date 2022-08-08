import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabDetailPageRoutingModule } from './tab-detail-routing.module';

import { TabDetailPage } from './tab-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabDetailPageRoutingModule
  ],
  declarations: [TabDetailPage]
})
export class TabDetailPageModule {}
