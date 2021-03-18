import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { AuthGuard } from 'app/core/gaurds/auth.guard';

const routes: Routes = [
  //{ path: 'home', component: HomeComponent },
  { path: 'auth', loadChildren: () => import('app/modules/auth/auth.module').then(m => m.AuthModule) },
  {
    path: 'admin', loadChildren: () => import('app/modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard]
  },
  { path: 'faculty', loadChildren: () => import('app/modules/faculty/faculty.module').then(m => m.FacultyModule) },
  { path: 'student', loadChildren: () => import('app/modules/student/student.module').then(m => m.StudentModule) },
  { path: 'parent', loadChildren: () => import('app/modules/parent/parent.module').then(m => m.ParentModule) },
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: '**', loadChildren: () => import('app/core/modules/page-not-found/pagenotfound.module').then(m => m.PagenotfoundModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
