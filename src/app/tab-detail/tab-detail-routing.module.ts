import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabDetailPage } from './tab-detail.page';

const routes: Routes = [
  {
    path: '',
    component: TabDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabDetailPageRoutingModule {}
