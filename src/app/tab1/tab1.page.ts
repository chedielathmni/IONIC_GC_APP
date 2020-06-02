import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { CarsService } from '../services/cars.service'
import { alertModalPage } from '../modal/alert/alertModal.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  car = {};

  constructor(
    private carsService: CarsService,
    private storage: Storage,
    private modalController: ModalController
  ) {}


  ngOnInit() {
    this.getCarInfo();
  }

  getCarInfo() {
    let carId : number;

    this.storage.get('user').then((user) => {
      carId = user.car_id
    }).then(() => {
      this.carsService.getCar(carId).subscribe(async (res:any) => {
        this.car = res.data;
        console.log('result => ', this.car);
      })
    })
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
