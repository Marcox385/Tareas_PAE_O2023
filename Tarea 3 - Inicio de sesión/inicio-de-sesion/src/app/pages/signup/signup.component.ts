import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  signupForm: FormGroup;
  showSpinner: boolean = false;

  constructor(
    formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private _snackBar: MatSnackBar) {
    this.signupForm = formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm: ['', [Validators.required, Validators.minLength(8)]],
      terms: [false, Validators.requiredTrue]
    }, {
      validators: [() => this.comparePasswords()]
    });
  };

  comparePasswords() {
    if (!this.signupForm) return null;

    const { password, confirm } = this.signupForm.getRawValue();
    return (password === confirm) ? null : { match: true };
  }

  hasError(controlName: string, errorName: string) {
    return this.signupForm.controls[controlName].errors && this.signupForm.controls[controlName].errors![errorName];
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK');
  }

  signup() {
    this.showSpinner = true;
    const { username, mail, password } = this.signupForm.getRawValue();
    this.userService.register(username, mail, password).subscribe(
      (response) => {
        this.openSnackBar('Usuario registrado exitósamente.');

        setTimeout(() => {
          this.router.navigate(['login']);
        }, 2333);
      },
      (err: Error) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 409) {
            this.openSnackBar('El usuario ya existe.');
            this.showSpinner = false;
          }
        }
      }
    );
  }

}
