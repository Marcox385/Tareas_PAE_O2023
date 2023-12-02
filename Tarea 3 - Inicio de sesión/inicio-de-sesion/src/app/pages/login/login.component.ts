import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Token } from 'src/app/shared/interfaces/token';
import { TokenService } from 'src/app/shared/services/token.service';
import { UserService } from 'src/app/shared/services/user.service';

import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private _snackBar: MatSnackBar) {
    this.loginForm = formBuilder.group({
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  };

  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK');
  }

  login() {
    const { mail, password } = this.loginForm.getRawValue();
    this.userService.login(mail, password).subscribe({
      next: (response: Token) => {
        console.log(response);
        setTimeout(() => {
          this.tokenService.save(response.accessToken, response.refreshToken);
          this.router.navigate(['home']);
          const data: any = jwtDecode(response.accessToken);
          const { username, mail } = data;
          this.userService.user.next({ username, mail });
        });
      },
      error: (err: Error) => {
        if (err instanceof HttpErrorResponse) {
          this.openSnackBar('Credenciales incorrectas.');
        }
      }
    });
  };

  hasError(controlName: string, errorName: string) {
    return this.loginForm.controls[controlName].errors && this.loginForm.controls[controlName].errors![errorName];
  }

}
