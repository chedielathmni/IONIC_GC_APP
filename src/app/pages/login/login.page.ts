import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private storage: Storage,
    private formBuilder: FormBuilder
  ) {

    this.loginForm = this.formBuilder.group({
      phoneNumber: [
        '',
        Validators.compose([
          Validators.maxLength(8),
          Validators.minLength(8)
        ])
      ],
      password: [
        '',
        Validators.compose([
          Validators.maxLength(32),
          Validators.minLength(6)
        ])
      ]
    });
  }

  ngOnInit() {

    this.auth.checkStatus(); 
  }



  login() {
    this.auth.login(this.loginForm.value).subscribe(async (res: any) => {
      if (res) {
        if (res.success) {
          this.storage.set('user', res.user).then(async (user) => {
            if (user.valid)
            this.storage.set('token', res.token).then(() => {
              this.router.navigateByUrl('/home/tab2');
            });
            else {
              const alert = await this.alertCtrl.create({
                header: 'Compte non Valide',
                message: 'Votre Compte doit être Validé par un administrateur',
                buttons: ['OK']
              });
              await alert.present();
            }
          })
        }
        else {
          const alert = await this.alertCtrl.create({
            header: 'Login Failed',
            message: 'Mot de passe ou numero erroné',
            buttons: ['OK']
          });
          await alert.present();
        }
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Login Failed',
          message: 'Mot de passe ou numero erroné',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

}