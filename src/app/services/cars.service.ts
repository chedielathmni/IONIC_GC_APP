import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as ENV } from '../../environments/environment'

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
export class CarsService {

  constructor( private http: HttpClient) { }


    getCar(id: number) {
      return this.http.get(`${API}/cars/${id}`, httpOptions);
    }
}
