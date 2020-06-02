import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { alertModalPage } from '../modal/alert/alertModal.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {


  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) {


    this.firstFormGroup = this.formBuilder.group({
      password: [
        '',
        Validators.compose([
          Validators.maxLength(32),
          Validators.minLength(6)
        ])
      ],
    });
    this.secondFormGroup = this.formBuilder.group({
      newPassword: [
        '',
        Validators.compose([
          Validators.maxLength(32),
          Validators.minLength(6)
        ])
      ],
      confirmNewPassword: [
        '',
        Validators.compose([
          Validators.maxLength(32),
          Validators.minLength(6)
        ])
      ],
    }, { validator: Tab3Page.passwordsMatch });
  }


  static passwordsMatch(cg: FormGroup): { [err: string]: any } {
    let pwd1 = cg.get('newPassword');
    let pwd2 = cg.get('confirmNewPassword');
    let rv: { [error: string]: any } = {};
    if ((pwd1.touched || pwd2.touched) && pwd1.value !== pwd2.value) {
      rv['passwordMismatch'] = true;
      rv['error'] = 'Mismatching passwords'
    }
    return rv;
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

}


