import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Storage } from '@ionic/storage';
import { ModalController, IonInfiniteScroll } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})


export class Tab2Page implements OnInit {


  @ViewChild(IonInfiniteScroll, { static: false}) infinityScroll: IonInfiniteScroll;


  user = null;
  purchases = [];
  results = 5;
  page = 0;
  pageCount = 0;


  constructor(
    private auth: AuthService,
    private storage: Storage,
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



//* modal form creation and configuration
  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'modal-form'
    });
    await modal.present();
    modal.onDidDismiss().then(res => {
      this.addPurchase(res.data);
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
        this.auth.addGasPurchase(data).subscribe(async (res: any) => {
          this.purchases = [];
          this.page = 0;
          this.infinityScroll.disabled = false;
          this.getGasPurchases()
        })
      })
    }
  }


  // * gets the number of pages of data
  // todo this needs to be changed so it gets the number directly from a rout on the api or something else that doesn't fetch all the data
  getPageCount() {
    let id: number;

    this.storage.get('user').then((user) => {
      id = user.id
    }).then(() => {

      this.auth.getGasPurchases(id).subscribe(async (res: any) => {
        this.pageCount = Math.floor(res.data.length / this.results) + 1;
      })
    })
  }



  // * fetches the purchases of the connected user
  getGasPurchases(event?) {
    let id: number;
    this.storage.get('user').then((user) => {
      id = user.id
    }).then(() => {
      this.auth.getGasPurchases(id, this.results, this.page).subscribe(async (res: any) => {
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