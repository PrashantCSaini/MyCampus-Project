import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from 'app/core/gaurds/token-interceptor.service';

import { CreateStudentComponent } from 'app/modules/admin/pages/create-student/create-student.component';

import { SharedModule } from 'app/core/modules/shared.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { CreateCourseComponent } from './pages/create-course/create-course.component';

import { CourseService } from 'app/core/services/http/course/course.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { CreateSubjectComponent } from './pages/create-subject/create-subject.component';
import { CreateUserLoginComponent } from './pages/create-user-login/create-user-login.component';
import { CreateParentComponent } from './pages/create-parent/create-parent.component';
import { CreateFacultyComponent } from './pages/create-faculty/create-faculty.component';
import { FeeDetailComponent } from './pages/fee-detail/fee-detail.component';

@NgModule({
  declarations: [CreateStudentComponent, DashboardComponent, HomeComponent, CreateCourseComponent, CreateSubjectComponent, CreateUserLoginComponent, CreateParentComponent, CreateFacultyComponent, FeeDetailComponent],
  imports: [
    SharedModule,
    AdminRoutingModule,
  ],
  providers: [CourseService, MessageService, ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }]
})
export class AdminModule { }

