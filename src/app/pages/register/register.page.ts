import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  page = 1;
  registerForm: FormGroup;


  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private storage: Storage,
    private formBuilder: FormBuilder
  ) {

    this.registerForm = this.formBuilder.group({
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
      ],
      confirmPassword: [
        '',
        Validators.compose([
          Validators.maxLength(32),
          Validators.minLength(6)
        ])
      ],
      firstName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(32)
        ])
      ],
      lastName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(32)
        ])
      ]
    }, { validator: RegisterPage.passwordsMatch });
  }

  ngOnInit() {
    this.auth.checkStatus(); 
  }

  static passwordsMatch(cg: FormGroup): { [err: string]: any } {
    let pwd1 = cg.get('password');
    let pwd2 = cg.get('confirmPassword');
    let rv: { [error: string]: any } = {};
    if ((pwd1.touched || pwd2.touched) && pwd1.value !== pwd2.value) {
      rv['passwordMismatch'] = true;
      rv['error'] = 'Mismatching passwords'
    }
    return rv;
  }


  changePage(num) {
    this.page = num;
  }


  register() {
    if (this.page == 1) this.page = 2;
    else {
      this.auth.register(this.registerForm.value).subscribe(async (res: any) => {
        if (res) {
          if (res.success) {
            const loginData = (({ phoneNumber, password }) => ({ phoneNumber, password }))(this.registerForm.value);
            this.auth.login(loginData).subscribe(async (res: any) => {
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
                        buttons: [
                          {
                            text: 'Ok',
                            handler: () => {
                              this.router.navigateByUrl('');
                            }
                          }
                        ]
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
                  message: 'Données erronées',
                  buttons: ['OK']
                });
                await alert.present();
              }
            });
          }
        }
        else {
          console.log("error")
        }
      })
    }
  }

}
