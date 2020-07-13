import { Storage } from '@ionic/storage';
import { Component, OnInit, OnChanges, AfterViewInit,  } from '@angular/core';
import { CarsService } from '../services/cars.service'
import { alertModalPage } from '../modal/alert/alertModal.page';
import { ModalController } from '@ionic/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit  {

  car = {};

  constructor(
    private carsService: CarsService,
    private storage: Storage,
    private modalController: ModalController,
    private _snackBar: MatSnackBar,
    private alert: AlertService
  ) {}


  ngOnInit() {
    this.getCarInfo();
    console.log('init')
  }


  

  getCarInfo() {
    console.log("getCarInfo")
    let carId : number;

    this.storage.get('user').then((user) => {
      carId = user.car_id
      console.log("carId => ", carId)
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
      if (res.data) {
        this.storage.get('user').then((user) => {
          res.data.carId = user.car_id;
          res.data.driverId = user.id;
        })
        this.storage.get('coords').then((coords) => {
          const data = {...res.data, coords }
          this.alert.sendAlert(data).subscribe(async (res:any) => {
            console.log(res)
            this._snackBar.open('Alerte Envoyée', null, { duration: 2000, })
          })
          console.log(data)
        })
      }
    })
  }
}
