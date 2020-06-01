import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient, HttpHeaders } from '@angular/common/http';



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
export class CarsService {

  constructor( private http: HttpClient) { }


    getCar(id: number) {
      return this.http.get(`${API}/cars/${id}`, httpOptions);
    }
}
