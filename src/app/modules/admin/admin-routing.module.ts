import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from 'app/modules/admin/pages/home/home.component';
import { CreateStudentComponent } from 'app/modules/admin/pages/create-student/create-student.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CreateCourseComponent } from './pages/create-course/create-course.component';
import { CreateSubjectComponent } from './pages/create-subject/create-subject.component';
import { CreateUserLoginComponent } from './pages/create-user-login/create-user-login.component';
import { CreateParentComponent } from './pages/create-parent/create-parent.component';
import { CreateFacultyComponent } from './pages/create-faculty/create-faculty.component';
import { FeeDetailComponent } from './pages/fee-detail/fee-detail.component';


const routes: Routes = [
    // { path: '', component: HomeComponent, pathMatch: 'full' },
    {
        path: '', component: HomeComponent, children:
            [
                { path: 'dashboard', component: DashboardComponent },
                { path: 'create-user-login', component: CreateUserLoginComponent },
                { path: 'create-student', component: CreateStudentComponent },
                { path: 'create-course', component: CreateCourseComponent },
                { path: 'create-subject', component: CreateSubjectComponent },
                { path: 'create-parent', component: CreateParentComponent },
                { path: 'create-faculty', component: CreateFacultyComponent },
                { path: 'fee-detail', component: FeeDetailComponent }

            ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }