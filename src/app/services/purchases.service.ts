import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


const helper = new JwtHelperService();
const TOKEN_KEY = 'token';
const API = 'http://192.168.1.5:4000/api'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}


@Injectable({
  providedIn: 'root'
})
export class PurchasesService {

  constructor(private storage: Storage, private http: HttpClient, private plt: Platform, private router: Router
  ) { }




  addGasPurchase(data: { carId: number, purchaseDate: Date, price: string, gasType: string, driverId, number}) {
    return this.http.post(API + '/purchases', JSON.stringify(data), httpOptions);
  }


  getGasPurchases(id: number, results?: number, page?: number) {
    if (results) {
    return this.http.get(`${API}/purchases/${id}?results=${results}&page=${page}` , httpOptions);
    }
    else {
      return this.http.get(`${API}/purchases/${id}`, httpOptions)
    }
  }

  getPurchasesCount(id: number) {
    return this.http.get(`${API}/purchases/count/${id}`, httpOptions);
  }

}
