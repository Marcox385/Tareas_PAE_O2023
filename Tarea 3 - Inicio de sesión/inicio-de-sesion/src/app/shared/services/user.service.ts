import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { User } from './../interfaces/user';
import { Token } from './../interfaces/token';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: BehaviorSubject<User> = new BehaviorSubject<User>({ username: '', mail: '' });

  constructor(private httpClient: HttpClient) { }

  getUser(data: User) {
    this.user.next(data);
  }

  setUserData() {
    const url = environment.apiUrl + 'users';
    return this.httpClient.get<User>(url);
  }

  register(username: string, mail: string, password: string) {
    const url: string = environment.apiUrl + 'api/users/signup';
    return this.httpClient.post(url, { username, mail, password }, { responseType: 'text' });
  }

  login(mail: string, password: string): Observable<Token> {
    const url: string = environment.apiUrl + 'auth/login';
    return this.httpClient.post<Token>(url, { mail, password });
  }

  logout(refreshToken: string) {
    const url: string = environment.apiUrl + 'auth/logout';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: { refreshToken }
    };

    return this.httpClient.delete(url, options);
  }

}
