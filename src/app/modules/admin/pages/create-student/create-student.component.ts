import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { StudentService } from 'app/core/services/http/student/student.service';
import { IStudent } from 'app/core/services/http/student/student-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';
import { CourseService } from 'app/core/services/http/course/course.service';
import { ICourse } from 'app/core/services/http/course/course-model';
import { AuthService } from 'app/core/services/http/auth/auth.service';
import { IUserLogin } from 'app/core/services/http/auth/auth-model';
@Component({
  selector: 'app-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.css']
})
export class CreateStudentComponent implements OnInit {

  constructor(private studentService: StudentService,
    private courseService: CourseService,
    private primengConfig: PrimeNGConfig,
    private fb: FormBuilder,
    private messageService: MessageService,
    private _router: Router,
    private confirmationService: ConfirmationService,
    private loginService: AuthService) { }


  studentId: number = null;
  student: IStudent;
  studentlist: IStudent[];
  courselist: ICourse[];
  loginlist: IUserLogin[];
  studentForm: FormGroup;
  pageTitle: string = 'Add Student';
  submitButtonText: string = 'Add Student';
  icon: string = "pi pi-plus";
  isDisplayCancelButton: boolean = false;
  loadingIcon: string = "pi pi-check-circle";
  validationMessages = {
    'admissionYear': {
      'required': 'Admission Year is required',
    },
    'branch': {
      'required': 'Branch is required'
    },
    'currentSemester': {
      'required': 'Current Semester is required'
    },
    'division': {
      'required': 'Division is required'
    },
    'rollNo': {
      'required': 'Roll no is required'
    },
    'name': {
      'required': 'Name is required'
    },
    'dateOfBirth': {
      'required': 'Date of birth is required'
    },
    'gender': {
      'required': 'Gender is required'
    },
    'residentialAddress': {
      'required': 'Residential Address is required'
    },
    'nativeAddress': {
      'required': 'Native Address is required'
    },
    'mobileNo1': {
      'required': 'Mobile no 1 is required'
    },
    'mobileNo2': {
      'required': 'Mobile no 2 is required'
    },
    'email': {
      'required': 'Email is required'
    },
    'nationality': {
      'required': 'Nationality is required'
    },
    'motherTongue': {
      'required': 'Mother Tongue is required'
    },
    'discipline': {
      'required': 'Discipline is required'
    },
    'joiningDate': {
      'required': 'Joining Date is required'
    },
    'physicallyHandicapped': {
      'required': 'Physically Handicapped field is required'
    },
    'mentorName': {
      'required': 'Mentor name is required'
    },
    'loginId': {
      'required': 'Login is required'
    },
    'courseId': {
      'required': 'Course is required'
    }
  }
  formErrors = {
    'admissionYear': '',
    'branch': '',
    'currentSemester': '',
    'division': '',
    'rollNo': '',
    'name': '',
    'dateOfBirth': '',
    'gender': '',
    'residentialAddress': '',
    'nativeAddress': '',
    'mobileNo1': '',
    'mobileNo2': '',
    'email': '',
    'nationality': '',
    'motherTongue': '',
    'discipline': '',
    'joiningDate': '',
    'physicallyHandicapped': '',
    'mentorName': '',
    'loginId': '',
    'courseId': ''
  }

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      admissionYear: ['', [Validators.required]],
      branch: ['', [Validators.required, Validators.maxLength(20)]],
      currentSemester: ['', Validators.required],
      division: ['', [Validators.required, Validators.maxLength(1)]],
      rollNo: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(30)]],
      dateOfBirth: ['', Validators.required],
      gender: ['M', [Validators.required, Validators.maxLength(1)]],
      residentialAddress: ['', [Validators.required, Validators.maxLength(100)]],
      nativeAddress: ['', [Validators.required, Validators.maxLength(100)]],
      mobileNo1: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      mobileNo2: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.maxLength(30)]],
      nationality: ['', [Validators.required, Validators.maxLength(15)]],
      motherTongue: ['', [Validators.required, Validators.maxLength(12)]],
      discipline: ['', [Validators.required, Validators.maxLength(30)]],
      joiningDate: ['', Validators.required],
      physicallyHandicapped: ['N', [Validators.required, Validators.maxLength(3)]],
      mentorName: ['', [Validators.required, Validators.maxLength(30)]],
      loginId: ['', Validators.required],
      courseId: ['', Validators.required],
    });

    this.studentForm.valueChanges.subscribe(data => {
      this.logValidationErrors(this.studentForm);
    });

    this.primengConfig.ripple = true;
    this.getCourse();
    this.getStudent();
    this.getLogin();


    this.student = {
      StudentId: 0,
      AdmissionYear: 0,
      Branch: null,
      CurrentSemester: 0,
      Division: null,
      RollNo: 0,
      Name: null,
      DateOfBirth: null,
      Gender: null,
      ResidentialAddress: null,
      NativeAddress: null,
      MobileNo1: null,
      MobileNo2: null,
      Email: null,
      Nationality: null,
      MotherTongue: null,
      Discipline: null,
      JoiningDate: null,
      PhysicallyHandicapped: null,
      MentorName: null,
      LoginId: null,
      CourseId: null,
      CourseName: null
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

  private getStudent() {
    this.studentService
      .getStudent()
      .subscribe((data) => (this.studentlist = data),
        err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              localStorage.removeItem('token')
              this._router.navigate(['/auth']);
            }
          }
        });
  }

  private getLogin() {
    this.loginService
      .getLogin()
      .subscribe((data) => {
        this.loginlist = data.filter(d => d.UserType === 'S')
      },
        err => {

        });
  }

  onSubmit(): void {
    // console.log(this.subjectForm.value)
    this.loadingIcon = "pi pi-spin pi-spinner";
    this.mapFormValueToCourseModel();

    if (this.student.StudentId !== 0) {  // Update Course

      this.studentService.updateStudent(this.student).subscribe((data) => {
        // console.log('Messsage: ' + data);
        this.showSuccess('Student updated successfully');
        this.studentForm.reset();
        this.pageTitle = 'Add Student';
        this.submitButtonText = 'Add Student';
        this.isDisplayCancelButton = false;
        this.getStudent();
      },
        (error: any) => {
          console.error(error);
          this.showError('Error while updating student');
        });
      this.student.StudentId = 0;
    } else { // Add new course
      // console.log("Post called")
      this.studentService.addStudent(this.student).subscribe((data) => {
        // console.log('Messsage: ' + data);
        this.showSuccess('Student added successfully');
        this.studentForm.reset();
        this.getStudent();

      },
        (error: any) => {
          console.error(error);
          this.showError('Error while adding subject');
        });
      this.student.StudentId = 0;
    }
    this.loadingIcon = "pi pi-check-circle";
    // this.subjectId = null;
  }

  mapFormValueToCourseModel(): void {
    // console.log(this.subjectForm.value);
    this.student.AdmissionYear = this.studentForm.value.admissionYear;
    this.student.Branch = this.studentForm.value.branch;
    this.student.CurrentSemester = this.studentForm.value.currentSemester;
    this.student.Division = this.studentForm.value.division;
    this.student.RollNo = this.studentForm.value.rollNo;
    this.student.Name = this.studentForm.value.name;
    this.student.DateOfBirth = this.studentForm.value.dateOfBirth;
    this.student.Gender = this.studentForm.value.gender;
    this.student.ResidentialAddress = this.studentForm.value.residentialAddress;
    this.student.NativeAddress = this.studentForm.value.nativeAddress;
    this.student.MobileNo1 = this.studentForm.value.mobileNo1;
    this.student.MobileNo2 = this.studentForm.value.mobileNo2;
    this.student.Email = this.studentForm.value.email;
    this.student.Nationality = this.studentForm.value.nationality;
    this.student.MotherTongue = this.studentForm.value.motherTongue;
    this.student.Discipline = this.studentForm.value.discipline;
    this.student.JoiningDate = this.studentForm.value.joiningDate;
    this.student.PhysicallyHandicapped = this.studentForm.value.physicallyHandicapped;
    this.student.MentorName = this.studentForm.value.mentorName;
    this.student.LoginId = this.studentForm.value.loginId;
    this.student.CourseId = this.studentForm.value.courseId;
  }

  logValidationErrors(group: FormGroup = this.studentForm): void {
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
      }
    })
  }

  // editButtonClick(SubjectId: number) {
  //   this.subjectService.getSubjectById(SubjectId).subscribe(
  //     (subjectData: ISubject) => {
  //       this.subject = subjectData;
  //       this.pageTitle = 'Edit Subject';
  //       this.submitButtonText = 'Update Subject';
  //       this.icon = 'pi pi-pencil';
  //       this.isDisplayCancelButton = true;
  //       this.editSubject(subjectData);

  //     },
  //     (error) => console.log(error)
  //   );
  // }

  // editSubject(subjectData: ISubject) {
  //   this.subjectId = subjectData.SubjectId;
  //   this.subjectForm.patchValue({
  //     subjectName: subjectData.SubjectName,
  //     internalMarks: subjectData.InternalMarks,
  //     externalTheoryMarks: subjectData.ExternalTheoryMarks,
  //     externalPracticalMarks: subjectData.ExternalPracticalMarks,
  //     courseId: subjectData.CourseId
  //   });
  //   document.getElementById("courseId").focus();
  // }

  // deleteSubject(SubjectId) {
  //   this.subjectService.deleteSubject(SubjectId).subscribe(
  //     (data) => {
  //       console.log("Message : " + data);
  //       this.showSuccess('Subject deleted successfully');
  //       this.getSubject();
  //     },
  //     (error) => {
  //       console.log(error);
  //       this.showError('Error while deleting subject');
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

  // confirm(SubjectId: number) {
  //   this.confirmationService.confirm({
  //     message: 'Do you want to delete this record?',
  //     accept: () => {
  //       //Actual logic to perform a confirmation
  //       this.deleteSubject(SubjectId);

  //     }
  //   });
  // }

  // onCancelButtonClick() {
  //   this.subjectForm.reset();
  //   this.pageTitle = 'Add Subject';
  //   this.submitButtonText = 'Add Subject';
  //   this.isDisplayCancelButton = false;
  //   this.icon = 'pi pi-plus';
  //   this.subject.SubjectId = 0;
  //   this.subjectId = null;
  // }
}
