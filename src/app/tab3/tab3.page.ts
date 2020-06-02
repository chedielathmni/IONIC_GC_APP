import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { alertModalPage } from '../modal/alert/alertModal.page';
import { ModalController } from '@ionic/angular';
import { changePasswordModalPage } from '../modal/changePassword/changePasswordModal.page';
import { Storage } from '@ionic/storage';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {


  constructor(
    private auth: AuthService,
    private modalController: ModalController,
    private storage: Storage,
    private _snackBar: MatSnackBar
  ) {

  }


  async presentAlertModal() {
    const alertModal = await this.modalController.create({
      component: alertModalPage,
    });
    await alertModal.present();
    alertModal.onDidDismiss().then(res => {
      if (res.data) {
        this.storage.get('coords').then((coords) => {
          const data = {...res.data, coords}
          console.log(data)
        })
      }
    })

  }

  async password() {
    const passwordModal = await this.modalController.create({
      component: changePasswordModalPage,
    });
    await passwordModal.present();
    passwordModal.onDidDismiss().then(res => {
      if (res.data) {
        delete res.data.confirmNewPassword;
        this.updatePassword(res.data)
      }
    })
  }

  updatePassword(data) {
    let id;
    this.storage.get('user').then(user => {
      id = user.id;
    }).then(() => {
      this.auth.updatePassword(id, data).subscribe(async (res: any) => {
        if (res.success) this._snackBar.open('Mot de passe modifié', null, { duration: 2000, })
        else {
          this._snackBar.open('Mot de passe erroné', null, { duration: 2000, })
          this.password();
        }
      })
    })
  }

}


