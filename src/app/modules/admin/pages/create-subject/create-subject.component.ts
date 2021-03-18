import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { SubjectService } from 'app/core/services/http/subject/subject.service';
import { ISubject } from 'app/core/services/http/subject/subject-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';
import { CourseService } from 'app/core/services/http/course/course.service';
import { ICourse } from 'app/core/services/http/course/course-model';

@Component({
  selector: 'app-create-subject',
  templateUrl: './create-subject.component.html',
  styleUrls: ['./create-subject.component.css']
})
export class CreateSubjectComponent implements OnInit {

  constructor(private subjectService: SubjectService,
    private courseService: CourseService,
    private primengConfig: PrimeNGConfig,
    private fb: FormBuilder,
    private messageService: MessageService,
    private _router: Router,
    private confirmationService: ConfirmationService) { }


  subjectId: number = null;
  subject: ISubject;
  subjectlist: ISubject[];
  courselist: ICourse[];
  subjectForm: FormGroup;
  pageTitle: string = 'Add Subject';
  submitButtonText: string = 'Add Subject';
  icon: string = "pi pi-plus";
  isDisplayCancelButton: boolean = false;
  loadingIcon: string = "pi pi-check-circle";
  validationMessages = {
    'subjectName': {
      'required': 'Subject Name is required',
      'minlength': 'Subject Name must be greater than 2 characters',
      'maxlength': 'Subject Name must bes less than 20 character'
    },
    'internalMarks': {
      'required': 'Internal Marks is required'
    },
    'externalTheoryMarks': {
      'required': 'External Theory Marks is required'
    },
    'externalPracticalMarks': {
      'required': 'External Practical Marks is required'
    },
    'courseId': {
      'required': 'Course is required'
    }
  }
  formErrors = {
    'subjectName': '',
    'internalMarks': '',
    'externalTheoryMarks': '',
    'externalPracticalMarks': '',
    'courseId': ''
  }

  ngOnInit(): void {
    this.subjectForm = this.fb.group({
      subjectName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      internalMarks: ['', Validators.required],
      externalTheoryMarks: ['', Validators.required],
      externalPracticalMarks: ['', Validators.required],
      courseId: ['', Validators.required]
    });
    this.subjectForm.valueChanges.subscribe(data => {
      this.logValidationErrors(this.subjectForm);
    });

    this.primengConfig.ripple = true;
    this.getCourse();
    this.getSubject();


    this.subject = {
      SubjectId: 0,
      SubjectName: '',
      InternalMarks: null,
      ExternalTheoryMarks: null,
      ExternalPracticalMarks: null,
      CourseId: null,
      CourseName: ''
    }
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

  private getSubject() {
    this.subjectService
      .getSubject()
      .subscribe((data) => (this.subjectlist = data),
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
    // console.log(this.subjectForm.value)
    this.loadingIcon = "pi pi-spin pi-spinner";
    this.mapFormValueToCourseModel();

    if (this.subject.SubjectId !== 0) {  // Update Course

      this.subjectService.updateSubject(this.subject).subscribe((data) => {
        // console.log('Messsage: ' + data);
        this.showSuccess('Subject updated successfully');
        this.subjectForm.reset();
        this.pageTitle = 'Add Subject';
        this.submitButtonText = 'Add Subject';
        this.isDisplayCancelButton = false;
        this.getSubject();
      },
        (error: any) => {
          console.error(error);
          this.showError('Error while updating subject');
        });
      this.subject.SubjectId = 0;
    } else { // Add new course
      // console.log("Post called")
      this.subjectService.addSubject(this.subject).subscribe((data) => {
        // console.log('Messsage: ' + data);
        this.showSuccess('Subject added successfully');
        this.subjectForm.reset();
        this.getSubject();

      },
        (error: any) => {
          console.error(error);
          this.showError('Error while adding subject');

        });
      this.subject.SubjectId = 0;
    }
    this.loadingIcon = "pi pi-check-circle";
    this.subjectId = null;
  }

  mapFormValueToCourseModel(): void {
    // console.log(this.subjectForm.value);
    this.subject.SubjectName = this.subjectForm.value.subjectName;
    this.subject.InternalMarks = this.subjectForm.value.internalMarks;
    this.subject.ExternalTheoryMarks = this.subjectForm.value.externalTheoryMarks;
    this.subject.ExternalPracticalMarks = this.subjectForm.value.externalPracticalMarks;
    this.subject.CourseId = this.subjectForm.value.courseId;
  }

  logValidationErrors(group: FormGroup = this.subjectForm): void {
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

  editButtonClick(SubjectId: number) {
    this.subjectService.getSubjectById(SubjectId).subscribe(
      (subjectData: ISubject) => {
        this.subject = subjectData;
        this.pageTitle = 'Edit Subject';
        this.submitButtonText = 'Update Subject';
        this.icon = 'pi pi-pencil';
        this.isDisplayCancelButton = true;
        this.editSubject(subjectData);

      },
      (error) => console.log(error)
    );
  }

  editSubject(subjectData: ISubject) {
    this.subjectId = subjectData.SubjectId;
    this.subjectForm.patchValue({
      subjectName: subjectData.SubjectName,
      internalMarks: subjectData.InternalMarks,
      externalTheoryMarks: subjectData.ExternalTheoryMarks,
      externalPracticalMarks: subjectData.ExternalPracticalMarks,
      courseId: subjectData.CourseId
    });
    document.getElementById("courseId").focus();
  }

  deleteSubject(SubjectId) {
    this.subjectService.deleteSubject(SubjectId).subscribe(
      (data) => {
        console.log("Message : " + data);
        this.showSuccess('Subject deleted successfully');
        this.getSubject();
      },
      (error) => {
        console.log(error);
        this.showError('Error while deleting subject');
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

  confirm(SubjectId: number) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      accept: () => {
        //Actual logic to perform a confirmation
        this.deleteSubject(SubjectId);

      }
    });
  }

  onCancelButtonClick() {
    this.subjectForm.reset();
    this.pageTitle = 'Add Subject';
    this.submitButtonText = 'Add Subject';
    this.isDisplayCancelButton = false;
    this.icon = 'pi pi-plus';
    this.subject.SubjectId = 0;
    this.subjectId = null;
  }

}
