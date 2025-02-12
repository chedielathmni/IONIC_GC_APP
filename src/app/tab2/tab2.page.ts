import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PurchasesService } from '../services/purchases.service'
import { Storage } from '@ionic/storage';
import { ModalController, IonInfiniteScroll } from '@ionic/angular';
import { gasModalPage } from '../modal/purchase/gasModal.page';
import { alertModalPage } from '../modal/alert/alertModal.page';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from '../services/alert.service';
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})


export class Tab2Page implements OnInit {


  @ViewChild(IonInfiniteScroll, { static: false }) infinityScroll: IonInfiniteScroll;


  user = null;
  purchases = [];
  results = 5;
  page = 0;
  pageCount = 0;


  constructor(
    private auth: AuthService,
    private alert: AlertService,
    private purchaseService: PurchasesService,
    private storage: Storage,
    private _snackBar: MatSnackBar,
    public modalController: ModalController,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.getGasPurchases()
    this.getPageCount()
    //this.getUser()
  }

  getUser() {
    console.log("getting user")
    this.storage.get('user').then((user) => {
      this.auth.getUserData(user.id).subscribe((res: any) => {
        this.storage.set('user', res.user).then(() => {
          console.log("user => ", res.user)
        })
      });
    })
  }

  ionViewWillEnter() {
    this.user = this.auth.getUser();
  }

  logout() {
    this.auth.logout();
  }

  reloadData() {
    this.page = 0;
    this.purchases = [];
    this.getGasPurchases();
    this.infinityScroll.disabled = false;
  }



  //* modal form creation and configuration
  async presentModal() {
    const modal = await this.modalController.create({
      component: gasModalPage,
      cssClass: 'modal-form'
    });
    await modal.present();
    modal.onDidDismiss().then(res => {
      this.addPurchase(res.data);
    })
  }

  // * reloads Data from database
  async doRefresh(event) {
    setTimeout(() => {
      this.reloadData();
      event.target.complete();
    }, 2000);
    this._snackBar.open('Données mise à jour', null, { duration: 2000, })
  }

  // *modal form for sending alerts to api
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
          const data = { ...res.data, coords }
          this.alert.sendAlert(data).subscribe(async (res: any) => {
            console.log(res)
            this._snackBar.open('Alerte Envoyée', null, { duration: 2000, })
          })
          console.log(data)
        })
      }
    })
  }



  //* create new purchases
  addPurchase(data) {
    if (data) {
      data.purchaseDate = new Date().toISOString().slice(0, -1) + '-10:00';

      this.storage.get('user').then((user) => {
        data.carId = user.car_id;
        data.driverId = user.id;
      }).then(() => {
        this.purchaseService.addGasPurchase(data).subscribe(async (res: any) => {
          this.purchases = [];
          this.page = 0;
          this.infinityScroll.disabled = false;
          this.getGasPurchases()
          this._snackBar.open('Donnée Envoyée', null, { duration: 2000, })
        })
      })
    }
  }


  // * gets the number of pages of data
  getPageCount() {
    let id: number;

    this.storage.get('user').then((user) => {
      id = user.id
    }).then(() => {

      this.purchaseService.getPurchasesCount(id).subscribe(async (res: any) => {

        this.pageCount = (res.data.count % this.results != 0) ?
          Math.floor(res.data.count / this.results) + 1 : res.data.count / this.results
      })
    })
  }



  // * fetches the purchases of the connected user
  getGasPurchases(event?) {
    let id: number;
    this.storage.get('user').then((user) => {
      id = user.id
    }).then(() => {
      this.purchaseService.getGasPurchases(id, this.results, this.page).subscribe(async (res: any) => {
        this.purchases = this.purchases.concat(res.data);
        if (event) {
          event.target.complete();
        }
      })
    })
  }



  // * Loads more data as you scroll down the page, and stops when there's no more data to show
  loadData(event) {

    this.page++;
    this.getGasPurchases(event);

    if (this.page === this.pageCount - 1) {
      event.target.disabled = true;
      this._snackBar.open('Limite atteinte', null, { duration: 2000, })
    }
  }

}