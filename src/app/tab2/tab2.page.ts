import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PurchasesService } from '../services/purchases.service'
import { Storage } from '@ionic/storage';
import { ModalController, IonInfiniteScroll } from '@ionic/angular';
import { gasModalPage } from '../modal/purchase/gasModal.page';
import { alertModalPage } from '../modal/alert/alertModal.page';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private purchaseService: PurchasesService,
    private storage: Storage,
    private _snackBar: MatSnackBar,
    public modalController: ModalController
  ) {
  }

  ngOnInit() {
    this.getGasPurchases()
    this.getPageCount()
  }

  ionViewWillEnter() {
    this.user = this.auth.getUser();
  }

  logout() {
    this.auth.logout();
  }

  reloadDate() {
    this.page = 0;
    this.purchases = [];
    this.getGasPurchases();
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

  async doRefresh(event) {
    setTimeout(() => {
      this.reloadDate();
      event.target.complete();
    }, 2000);
    this._snackBar.open('Données mise à jour', null, { duration: 2000, })
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
    }
  }

}