import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'app/core/services/http/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private auth: AuthService) { }

  items: MenuItem[];
  visibleSidebar1;

  ngOnInit() {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-chart-bar',
        routerLink: ['dashboard']
      },
      {
        label: 'Add User',
        icon: 'pi pi-fw pi-plus',
        items: [
          {
            label: 'Login',
            icon: 'pi pi-fw pi-user-plus',
            routerLink: ['create-user-login']
          },
          {
            label: 'Faculty',
            icon: 'pi pi-fw pi-users',
            routerLink: ['create-faculty']
          },
          {
            label: 'Student',
            icon: 'pi pi-fw pi-users',
            routerLink: ['create-student']
          },
          {
            label: 'Parent',
            icon: 'pi pi-fw pi-users',
            routerLink: ['create-parent']
          },

        ]
      },
      {
        label: 'Add Courses',
        icon: 'pi pi-fw pi-plus',
        items: [
          {
            label: 'Course',
            icon: 'pi pi-fw pi-book',
            routerLink: ['create-course']
          },
          {
            label: 'Subject',
            icon: 'pi pi-fw pi-book',
            routerLink: ['create-subject']
          }
        ]
      },
      {
        label: 'Fee Details',
        icon: 'pi pi-fw pi-money-bill',
        routerLink: ['fee-detail']
      }
    ];

  }


  logout() {
    this.auth.logoutUser();
  }

}
