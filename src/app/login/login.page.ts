import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  credentials = {
    phoneNumber: '',
    password: ''
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private storage: Storage
  ) { }

  ngOnInit() { }

  login() {
    this.auth.login(this.credentials).subscribe(async (res:any) => {
      if (res) {
        console.log(res)
        this.storage.set('token', res.token).then(() => {
          this.router.navigateByUrl('/home');
        });
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Login Failed',
          message: 'Wrong credentials.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

}