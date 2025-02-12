import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
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
export class AuthService {


  public user: Observable<any>;
  private userData = new BehaviorSubject(null);

  constructor(private storage: Storage, private http: HttpClient, private plt: Platform, private router: Router) {
    this.loadStoredToken();
  }

  loadStoredToken() {
    let platformObs = from(this.plt.ready());

    this.user = platformObs.pipe(
      switchMap(() => {
        return from(this.storage.get(TOKEN_KEY));
      }),
      map(token => {
        if (token) {
          let decoded = helper.decodeToken(token);
          this.userData.next(decoded);
          return true;
        } else {
          return null;
        }
      })
    );
  }


  checkStatus() {
    this.storage.get(TOKEN_KEY).then((token => {
      if (token) this.router.navigateByUrl('/home/tab2');
    }))
  }

  login(credentials: { phoneNumber: string, password: string }) {

    return this.http.post(API + '/users/login', JSON.stringify(credentials), httpOptions);

  }

  register(credentials: { phoneNumber: string, password: string, firstName: string, lastName: string }) {

    return this.http.post(API + "/users", JSON.stringify(credentials), httpOptions);

  }


  getUserData(id: number) {
    console.log('getUserDataService')
    return this.http.get(API + "/users/" + id, httpOptions);
  }


  getUser() {
    return this.userData;
  }

  logout() {
    this.storage.remove('user').then(() => {
      this.storage.remove(TOKEN_KEY).then(() => {
        this.router.navigateByUrl('/');
        this.userData.next(null);
      });
    })
  }

  updatePassword(id: number, credentials: {password: string, newPassword: string }) {
    return this.http.put(`${API}/users/${id}`, JSON.stringify(credentials), httpOptions);
  }

}