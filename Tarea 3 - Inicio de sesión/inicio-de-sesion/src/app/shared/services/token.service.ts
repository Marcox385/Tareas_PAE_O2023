import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  loginStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    this.loginStatus.next(this.isLoggedIn());
  }

  save(authToken: string, refreshToken: string) : void {
    localStorage.setItem('accessToken', authToken);
    localStorage.setItem('refreshToken', refreshToken);
    this.loginStatus.next(true);
  }

  get() : string {
    return localStorage.getItem('accessToken') || '';
  }

  getRefresh() : string {
    return localStorage.getItem('refreshToken') || '';
  }

  isLoggedIn() : boolean {
    return !!this.get();
  }

  remove() : void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.loginStatus.next(false);
  }

}
