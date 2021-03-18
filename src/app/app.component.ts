import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MyCampus';

  items: MenuItem[];

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-power-off',
        routerLink: ['/home']
      },
      {
        label: 'Admin Module',
        icon: 'pi pi-fw pi-power-off',
        routerLink: ['admin/create-student']
      },
      {
        label: 'Faculty Module',
        icon: 'pi pi-fw pi-power-off',
        routerLink: ['faculty/create-student']
      },
      {
        label: 'Student Module',
        icon: 'pi pi-fw pi-power-off',
        routerLink: ['student/create-student']
      },
      {
        label: 'Parent Module',
        icon: 'pi pi-fw pi-power-off',
        routerLink: ['parent/create-student']
      },
      {
        label: 'Auth Module',
        icon: 'pi pi-fw pi-power-off',
        routerLink: ['auth/create-student']
      }
    ];
  }

}
