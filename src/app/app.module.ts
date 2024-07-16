import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientComponent } from './client/client.component';
import { AdminComponent } from './admin/admin.component';
import { SideBarComponent } from './client/side-bar/side-bar.component';
import { LandingComponent } from './client/landing/landing.component';
import { RegisterComponent } from './client/register/register.component';
import { TimeInComponent } from './client/time-in/time-in.component';
import { TimeOutComponent } from './client/time-out/time-out.component';
import { SearchBookComponent } from './client/search-book/search-book.component';
import { ServicesComponent } from './client/services/services.component';
import { TimeComponent } from './time/time.component';
import { SidebarAdminComponent } from './admin/sidebar-admin/sidebar-admin.component';
import { BorrowComponent } from './admin/borrow/borrow.component';
import { ReturnComponent } from './admin/return/return.component';
import { MaterialsComponent } from './admin/materials/materials.component';
import { RecordsComponent } from './admin/records/records.component';
import { ReportsComponent } from './admin/reports/reports.component';

@NgModule({
  declarations: [
    AppComponent,
    ClientComponent,
    AdminComponent,
    SideBarComponent,
    LandingComponent,
    RegisterComponent,
    TimeInComponent,
    TimeOutComponent,
    SearchBookComponent,
    ServicesComponent,
    TimeComponent,
    SidebarAdminComponent,
    BorrowComponent,
    ReturnComponent,
    MaterialsComponent,
    RecordsComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
