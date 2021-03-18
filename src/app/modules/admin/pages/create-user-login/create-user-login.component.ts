import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from 'app/core/services/http/auth/auth.service';
import { IUserLogin } from 'app/core/services/http/auth/auth-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-create-user-login',
  templateUrl: './create-user-login.component.html',
  styleUrls: ['./create-user-login.component.css']
})
export class CreateUserLoginComponent implements OnInit {

  constructor(private loginService: AuthService,
    private primengConfig: PrimeNGConfig,
    private fb: FormBuilder,
    private messageService: MessageService,
    private _router: Router,
    private confirmationService: ConfirmationService) { }


  login: IUserLogin;
  loginlist: IUserLogin[];
  loginForm: FormGroup;
  pageTitle: string = 'Add User Login';
  submitButtonText: string = 'Add User';
  icon: string = "pi pi-plus";
  isDisplayCancelButton: boolean = false;
  loadingIcon: string = "pi pi-check-circle";
  validationMessages = {
    'username': {
      'required': 'UserName is required',
      'maxlength': 'UserName must bes less than 20 character'
    },
    'password': {
      'required': 'Password is required',
      'minlength': 'Password must be greater than 8 characters',
      'maxlength': 'Password must bes less than 30 character'
    },
    'usertype': {
      'required': 'UserType is required',
    }
  }
  formErrors = {
    'username': '',
    'password': '',
    'usertype': ''
  }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
      usertype: ['A', Validators.required]
    });

    this.loginForm.valueChanges.subscribe(data => {
      this.logValidationErrors(this.loginForm);
    });


    this.primengConfig.ripple = true;
    this.getLogin();

    this.login = {
      LoginId: 0,
      LoginUsername: null,
      LoginPassword: null,
      UserType: null
    }
  }

  logValidationErrors(group: FormGroup = this.loginForm): void {
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

  private getLogin() {
    this.loginService
      .getLogin()
      .subscribe((data) => (this.loginlist = data),
        err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              localStorage.removeItem('token')
              this._router.navigate(['/auth']);
            }
          }
        });
  }

  onSubmit(): void {
    // this.loadingIcon = "pi pi-spin pi-spinner";
    this.mapFormValueToCourseModel();

    // if (this.login.LoginId !== 0) {  // Update Course

    //   this.loginService.updateCourse(this.course).subscribe((data) => {
    //     this.showSuccess('Course updated successfully');
    //     this.courseForm.reset();
    //     this.pageTitle = 'Add Course';
    //     this.submitButtonText = 'Add Course';
    //     this.isDisplayCancelButton = false;
    //     this.getCourse();
    //   },
    //     (error: any) => {
    //       console.error(error);
    //       this.showError('Error while updating course');
    //     });
    //   this.course.CourseId = 0;
    // } else { // Add new course
    this.loginService.addLogin(this.login).subscribe((data) => {
      // console.log('Messsage: ' + data);
      this.showSuccess(data);
      this.loginForm.reset();
      this.getLogin();

    },
      (error: any) => {
        // console.error(error);
        this.showError('Error while adding login');

      });
    // this.login.LoginId = 0;
    // }
    // this.loadingIcon = "pi pi-check-circle";
  }

  // editButtonClick(courseId) {
  //   this.courseService.getCourseById(courseId).subscribe(
  //     (courseData: ICourse) => {
  //       this.course = courseData;
  //       this.pageTitle = 'Edit Course';
  //       this.submitButtonText = 'Update Course';
  //       this.icon = 'pi pi-pencil';
  //       this.isDisplayCancelButton = true;
  //       this.editCourse(courseData);

  //     },
  //     (error) => console.log(error)
  //   );
  // }

  // editCourse(courseData: ICourse) {

  //   this.courseForm.patchValue({
  //     courseName: courseData.CourseName,
  //     courseFee: courseData.CourseFee
  //   });
  // }

  mapFormValueToCourseModel(): void {
    // console.log(this.courseForm.value);
    //this.course.CourseId = 0;
    this.login.LoginUsername = this.loginForm.value.username;
    this.login.LoginPassword = this.loginForm.value.password;
    this.login.UserType = this.loginForm.value.usertype;
  }

  // deleteCourse(CourseId: number): void {

  //   this.loginService.deleteCourse(CourseId).subscribe(
  //     (data) => {
  //       console.log("Message : " + data);
  //       this.showSuccess('Course deleted successfully');
  //       this.getCourse();
  //     },
  //     (error) => {
  //       console.log(error);
  //       this.showError('Error while deleting course');
  //     }
  //   );
  // }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }
  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  clear() {
    this.messageService.clear();
  }

  // confirm(CourseId: number) {
  //   this.confirmationService.confirm({
  //     message: 'Do you want to delete this record?',
  //     accept: () => {
  //       //Actual logic to perform a confirmation
  //       this.deleteCourse(CourseId);
  //     }
  //   });
  // }

  // onCancelButtonClick() {
  //   this.courseForm.reset();
  //   this.pageTitle = 'Add Course';
  //   this.submitButtonText = 'Add Course';
  //   this.isDisplayCancelButton = false;
  //   this.icon = 'pi pi-plus';
  //   this.course.CourseId = 0;
  // }

}
