import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { CourseService } from 'app/core/services/http/course/course.service';
import { ICourse } from 'app/core/services/http/course/course-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css']
})
export class CreateCourseComponent implements OnInit {

  constructor(private courseService: CourseService,
    private primengConfig: PrimeNGConfig,
    private fb: FormBuilder,
    private messageService: MessageService,
    private _router: Router,
    private confirmationService: ConfirmationService) { }


  course: ICourse;
  courselist: ICourse[];
  courseForm: FormGroup;
  pageTitle: string = 'Add Course';
  submitButtonText: string = 'Add Course';
  icon: string = "pi pi-plus";
  isDisplayCancelButton: boolean = false;
  loadingIcon: string = "pi pi-check-circle";
  validationMessages = {
    'courseName': {
      'required': 'Course Name is required',
      'minlength': 'Course Name must be greater than 2 characters',
      'maxlength': 'Course Name must bes less than 20 character'
    },
    'courseFee': {
      'required': 'Course Fee is required'
    }
  }
  formErrors = {
    'courseName': '',
    'courseFee': ''
  }

  ngOnInit(): void {

    this.courseForm = this.fb.group({
      courseName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      courseFee: ['', Validators.required]
    });

    this.courseForm.valueChanges.subscribe(data => {
      this.logValidationErrors(this.courseForm);
    });


    this.primengConfig.ripple = true;
    this.getCourse();

    this.course = {
      CourseId: 0,
      CourseName: "",
      CourseFee: null
    }
  }

  logValidationErrors(group: FormGroup = this.courseForm): void {
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

  private getCourse() {
    this.courseService
      .getCourse()
      .subscribe((data) => (this.courselist = data),
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
    this.loadingIcon = "pi pi-spin pi-spinner";
    this.mapFormValueToCourseModel();

    if (this.course.CourseId !== 0) {  // Update Course

      this.courseService.updateCourse(this.course).subscribe((data) => {
        // console.log('Messsage: ' + data);
        this.showSuccess('Course updated successfully');
        this.courseForm.reset();
        this.pageTitle = 'Add Course';
        this.submitButtonText = 'Add Course';
        this.isDisplayCancelButton = false;
        this.getCourse();
      },
        (error: any) => {
          console.error(error);
          this.showError('Error while updating course');
        });
      this.course.CourseId = 0;
    } else { // Add new course
      this.courseService.addCourse(this.course).subscribe((data) => {
        // console.log('Messsage: ' + data);
        this.showSuccess('Course added successfully');
        this.courseForm.reset();
        this.getCourse();

      },
        (error: any) => {
          // console.error(error);
          this.showError('Error while adding course');

        });
      this.course.CourseId = 0;
    }
    this.loadingIcon = "pi pi-check-circle";
  }

  editButtonClick(courseId) {
    this.courseService.getCourseById(courseId).subscribe(
      (courseData: ICourse) => {
        this.course = courseData;
        this.pageTitle = 'Edit Course';
        this.submitButtonText = 'Update Course';
        this.icon = 'pi pi-pencil';
        this.isDisplayCancelButton = true;
        this.editCourse(courseData);

      },
      (error) => console.log(error)
    );
  }

  editCourse(courseData: ICourse) {

    this.courseForm.patchValue({
      courseName: courseData.CourseName,
      courseFee: courseData.CourseFee
    });
  }

  mapFormValueToCourseModel(): void {
    // console.log(this.courseForm.value);
    //this.course.CourseId = 0;
    this.course.CourseName = this.courseForm.value.courseName;
    this.course.CourseFee = this.courseForm.value.courseFee;
  }

  deleteCourse(CourseId: number): void {

    this.courseService.deleteCourse(CourseId).subscribe(
      (data) => {
        console.log("Message : " + data);
        this.showSuccess('Course deleted successfully');
        this.getCourse();
      },
      (error) => {
        console.log(error);
        this.showError('Error while deleting course');
      }
    );
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }
  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  clear() {
    this.messageService.clear();
  }

  confirm(CourseId: number) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      accept: () => {
        //Actual logic to perform a confirmation
        this.deleteCourse(CourseId);
      }
    });
  }

  onCancelButtonClick() {
    this.courseForm.reset();
    this.pageTitle = 'Add Course';
    this.submitButtonText = 'Add Course';
    this.isDisplayCancelButton = false;
    this.icon = 'pi pi-plus';
    this.course.CourseId = 0;
  }

}
