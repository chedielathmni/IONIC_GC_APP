import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment as ENV } from '../../environments/environment'
import { JwtHelperService } from '@auth0/angular-jwt';

const API = ENV.API_URL;
const TOKEN_KEY = ENV.TOKEN_KEY;
const helper = new JwtHelperService();

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}


@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private http: HttpClient) { }

  sendAlert(data: { carId: number, driverId: number, info: string, type: string, createdAt: Date, coords: object}) {
    console.log("service => ", JSON.stringify(data))
      return this.http.post(`${API}/alerts`, JSON.stringify(data), httpOptions);
  } 
}
