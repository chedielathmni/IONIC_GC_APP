import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { MaterialModule } from '../material.module';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { gasModalPage } from '../modal/purchase/gasModal.page'
import { alertModalPage } from '../modal/alert/alertModal.page';
import { changePasswordModalPage } from '../modal/changePassword/changePasswordModal.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    RouterModule,
    MaterialModule
  ],
  declarations: [Tab2Page, gasModalPage, alertModalPage, changePasswordModalPage]
})
export class Tab2PageModule {}
