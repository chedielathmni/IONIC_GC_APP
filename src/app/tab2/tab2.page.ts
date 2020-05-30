import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})


export class Tab2Page implements OnInit {



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




  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'modal-form'
    });
    await modal.present();
    modal.onDidDismiss().then(res => {
      this.send(res.data);
    })
  }

  send(data) {

    if (data) {
      data.purchaseDate = new Date().toISOString().slice(0, -1) + '-10:00';

      this.storage.get('user').then((user) => {
        data.carId = user.car_id;
        data.driverId = user.id;
      }).then(() => {
        this.auth.addGasPurchase(data).subscribe(async (res: any) => {
          console.log(res)
          this.purchases = [];
          this.page = 0;
          this.getGasPurchases()
        })
      })
    }
  }



  getPageCount() {
    let id: number;

    this.storage.get('user').then((user) => {
      id = user.id
    }).then(() => {

      this.auth.getGasPurchases(id).subscribe(async (res: any) => {
        console.log('count of all data => ', res.data.length)
        this.pageCount = Math.floor(res.data.length / this.results) + 1;
      })
    })
  }




  getGasPurchases(event?) {
    let id: number;

    this.storage.get('user').then((user) => {
      id = user.id
    }).then(() => {



      this.auth.getGasPurchases(id, this.results, this.page).subscribe(async (res: any) => {
        console.log('start => ',this.results * this.page)
        console.log('end => ', this.results * (this.page +1))
        console.log('request => ', `api/purchases/${id}?results=${this.results}&page=${this.page}`)
        this.purchases = this.purchases.concat(res.data);
        console.log('current list => ', this.purchases)
        console.log('current list length => ', this.purchases.length)

        if (event) {
          event.target.complete();
        }
      })
    })
  }


  loadData(event) {

    console.log(event)
    this.page++;
    console.log('page number => ', this.page)
    console.log('max pages => ', this.pageCount - 1)
    this.getGasPurchases(event);


    // todo fix this part // stops loading when disabled = true, can't be changed to false since the component is disabled and we can't get the event
    /* if (this.page === this.pageCount - 1) {
      event.target.disabled = true;
    } */



    //idea 1 doesn't work property 

    /* if (! (this.page === this.pageCount)) {
      this.getGasPurchases(event);
      //event.target.innerText = 'Loading more Data';
    }
    else {
      //event.target.innerText = '';
    } */
    console.log(event.target.disabled)


  }

}