import { NgModule } from '@angular/core';
import { SharedModule } from 'app/core/modules/shared.module';
import { PagenotfoundRoutingModule } from './pagenotfound-routing.module';
import { PageNotFoundComponent } from './page-not-found.component';


@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [
    SharedModule,
    PagenotfoundRoutingModule
  ]
})
export class PagenotfoundModule { }
