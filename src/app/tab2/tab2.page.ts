import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  user = null;

  form: FormGroup;

  constructor(
    private auth: AuthService,
    private storage: Storage,
    private formBuilder: FormBuilder,
    private http: HttpClientModule
  ) {
    this.form = this.formBuilder.group({
      price: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/^\d*.?\d+$/)
      ])],
      gasType: ['', Validators.required]
    })
  }


  ngOnInit() {
  }

  send() {
    let data = this.form.value;
    data.purchaseDate = new Date().toISOString().slice(0, -1) + '-10:00';

    this.storage.get('user').then((user) => {
      data.carId = user.car_id;
      data.driverId = user.id;
    }).then(() => {
      this.auth.gas(data).subscribe(async (res: any) => {
        console.log(res)
      })
    })
  }

  ionViewWillEnter() {
    this.user = this.auth.getUser();
  }

  logout() {
    this.auth.logout();
  }



  private getData(obj,field) {
    this.storage.get(obj).then((elem) => {
      console.log('test => ',  elem[field])
      return elem[field];
    })
  }
}