import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { IAuth } from 'app/core/services/http/auth/auth-model';
import { AuthService } from 'app/core/services/http/auth/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { HttpErrorResponse } from '@angular/common/http';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router,
    private primengConfig: PrimeNGConfig,
    private auth: AuthService,
    private fb: FormBuilder) { }

  loginData: IAuth;
  authForm: FormGroup;
  errorMessage: string;
  loginIcon = "pi pi-check";
  validationMessages = {
    'username': {
      'required': 'Username is required',
      'minlength': 'Username must be greater than 2 characters',
      'maxlength': 'Username must bes less than 20 character'
    },
    'password': {
      'required': 'Password is required',
      'maxlength': 'Password must be less than 20 character'
    }
  }
  formErrors = {
    'username': '',
    'password': ''
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.authForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.maxLength(30)]],
      type: ['A', Validators.required]
    });

    this.authForm.valueChanges.subscribe(data => {
      this.logValidationErrors(this.authForm);
    });


    this.loginData = {
      username: "",
      password: "",
      type: ""
    }

  }

  // onAdmin() {
  //   this.router.navigate(['/admin']);
  // }
  // onFaculty() {
  //   this.router.navigate(['/faculty/dashboard']);
  // }
  // onStudent() {
  //   this.router.navigate(['/student/dashboard']);
  // }
  // onParent() {
  //   this.router.navigate(['/parent/dashboard']);
  // }


  loginUser() {
    this.loginIcon = "pi pi-spin pi-spinner";
    this.mapFormValueToCourseModel();
    // console.log(this.loginData);
    this.auth.loginUser(this.loginData).subscribe(
      res => {
        // console.log(res);
        // console.log(typeof res);

        localStorage.setItem("token", res);
        if (this.authForm.value.type === "A") {
          this.router.navigate(['/admin']);
        } else if (this.authForm.value.type === "F") {
          this.router.navigate(['/faculty']);
        } else if (this.authForm.value.type === "S") {
          this.router.navigate(['/student']);
        } else if (this.authForm.value.type === "P") {
          this.router.navigate(['/parent']);
        }
      },
      err => {
        this.loginIcon = "pi pi-check";
        // console.log(err);
        // console.log(typeof err);

        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.errorMessage = 'Incorrect username or password.';
          }
        }
      }
    )
  }

  mapFormValueToCourseModel(): void {
    this.loginData.username = this.authForm.value.username;
    this.loginData.password = this.authForm.value.password;
    this.loginData.type = this.authForm.value.type;
  }

  // show() {
  //   this.msgs.push({ severity: 'info', summary: 'Info Message', detail: 'PrimeNG rocks' });
  // }

  logValidationErrors(group: FormGroup = this.authForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } else {
        this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
          const messages = this.validationMessages[key];
          for (const errrorKey in abstractControl.errors) {
            if (errrorKey) {
              this.formErrors[key] += messages[errrorKey] + ' ';
            }
          }
        }
        // console.log('Key = ' + key + ' values = ' + abstractControl.value);
        // abstractControl.reset();
      }
    })
  }

}
