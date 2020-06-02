import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { alertModalPage } from '../modal/alert/alertModal.page';
import { ModalController } from '@ionic/angular';
import { changePasswordModalPage } from '../modal/changePassword/changePasswordModal.page';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {


  constructor(
    private auth: AuthService,
    private modalController: ModalController
  ) {

  }


  async presentAlertModal() {
    const alertModal = await this.modalController.create({
      component: alertModalPage,
    });
    await alertModal.present();
    alertModal.onDidDismiss().then(res => {
      console.log(res.data)
    })
  }

  async password() {
    const passwordModal = await this.modalController.create({
      component: changePasswordModalPage,
    });
    await passwordModal.present();
    passwordModal.onDidDismiss().then(res => {
      console.log(res.data)
    })
  }

}


