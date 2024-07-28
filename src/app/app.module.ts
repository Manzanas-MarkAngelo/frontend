import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';

//Components
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
import { AdministratorComponent } from './client/administrator/administrator.component';
import { FormsModule } from '@angular/forms';
import { RegSuccessComponent } from './client/reg-success/reg-success.component';
import { TimeoutSuccessComponent } from './client/timeout-success/timeout-success.component';
import { TimeinSuccessComponent } from './client/timein-success/timein-success.component';
import { UnregisteredComponent } from './client/unregistered/unregistered.component';
import { NoTimeinComponent } from './client/no-timein/no-timein.component';
import { LandingAdminComponent } from './admin/landing-admin/landing-admin.component';
import { BorrowSuccessComponent } from './admin/borrow-success/borrow-success.component';
import { BorrowInfoComponent } from './admin/borrow-info/borrow-info.component';
import { ReturnSuccessComponent } from './admin/return-success/return-success.component';
import { ReturnWarningComponent } from './admin/return-warning/return-warning.component';
import { MaterialsEditComponent } from './admin/materials-edit/materials-edit.component';
import { MaterialsWarningComponent } from './admin/materials-warning/materials-warning.component';
import { MaterialsSuccessComponent } from './admin/materials-success/materials-success.component';
import { MaterialsAddComponent } from './admin/materials-add/materials-add.component';
import { AddWarningComponent } from './admin/add-warning/add-warning.component';
import { AddSuccessComponent } from './admin/add-success/add-success.component';
import { MaterialsTypeComponent } from './admin/materials-type/materials-type.component';
import { AddTypeComponent } from './admin/add-type/add-type.component';
import { AddTypeWarningComponent } from './admin/add-type-warning/add-type-warning.component';
import { AddTypeSuccessComponent } from './admin/add-type-success/add-type-success.component';
import { ProfileComponent } from './admin/profile/profile.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { NavbarComponent } from './super-admin/navbar/navbar.component';

//Services
import { RegisterService } from '../services/register.service';
import { MaterialsService } from '../services/materials.service';
import { TimeLogService } from '../services/time-log.service';
import { RecordsService } from '../services/records.service';


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
    ReportsComponent,
    AdministratorComponent,
    RegSuccessComponent,
    TimeoutSuccessComponent,
    TimeinSuccessComponent,
    UnregisteredComponent,
    NoTimeinComponent,
    LandingAdminComponent,
    BorrowSuccessComponent,
    BorrowInfoComponent,
    ReturnSuccessComponent,
    ReturnWarningComponent,
    MaterialsEditComponent,
    MaterialsWarningComponent,
    MaterialsSuccessComponent,
    MaterialsAddComponent,
    AddWarningComponent,
    AddSuccessComponent,
    MaterialsTypeComponent,
    AddTypeComponent,
    AddTypeWarningComponent,
    AddTypeSuccessComponent,
    ProfileComponent,
    SuperAdminComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    RegisterService,
    MaterialsService,
    TimeLogService,
    RecordsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
