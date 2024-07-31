import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './client/register/register.component';
import { AdministratorComponent} from './client/administrator/administrator.component';
import { TimeInComponent } from './client/time-in/time-in.component';
import { TimeOutComponent } from './client/time-out/time-out.component';
import { SearchBookComponent } from './client/search-book/search-book.component';
import { ServicesComponent } from './client/services/services.component';
import { ClientComponent } from './client/client.component';
import { LandingComponent } from './client/landing/landing.component';
import { RegSuccessComponent } from './client/reg-success/reg-success.component';
import { TimeoutSuccessComponent } from './client/timeout-success/timeout-success.component';
import { TimeinSuccessComponent } from './client/timein-success/timein-success.component';
import { UnregisteredComponent } from './client/unregistered/unregistered.component';
import { NoTimeinComponent } from './client/no-timein/no-timein.component';
import { BorrowComponent } from './admin/borrow/borrow.component';
import { BorrowSuccessComponent } from './admin/borrow-success/borrow-success.component';
import { BorrowInfoComponent } from './admin/borrow-info/borrow-info.component';
import { ReturnComponent } from './admin/return/return.component';
import { ReturnSuccessComponent } from './admin/return-success/return-success.component';
import { ReturnWarningComponent } from './admin/return-warning/return-warning.component';
import { MaterialsComponent } from './admin/materials/materials.component';
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
import { RecordsComponent } from './admin/records/records.component';
import { ReportsComponent } from './admin/reports/reports.component';
import { ProfileComponent } from './admin/profile/profile.component';
import { SidebarAdminComponent } from './admin/sidebar-admin/sidebar-admin.component';
import { MaterialInfoComponent } from './client/material-info/material-info.component';
import { TimeinAlreadyComponent } from './client/timein-already/timein-already.component';
import { BooksComponent } from './super-admin/books/books.component';
import { FacultyComponent } from './super-admin/faculty/faculty.component';
import { StudentComponent } from './super-admin/student/student.component';
import { VisitorComponent } from './super-admin/visitor/visitor.component';
import { SuperSidebarComponent } from './super-admin/super-sidebar/super-sidebar.component';
import { profile } from 'console';


const routes: Routes = [
  // { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'administrator', component: AdministratorComponent },
  { path: 'borrow-info/:accnum', component: BorrowInfoComponent },
  { path: 'material-info/:accnum', component: MaterialInfoComponent },
  { path: 'time-in', component: TimeInComponent },
  { path: 'time-out', component: TimeOutComponent },  
  { path: 'search', component: SearchBookComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'client', component: ClientComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'register-success', component: RegSuccessComponent },
  { path: 'timeout-success', component: TimeoutSuccessComponent },
  { path: 'timein-success', component: TimeinSuccessComponent },
  { path: 'unregistered', component: UnregisteredComponent },
  { path: 'no-timein', component: NoTimeinComponent },
  { path: 'borrow', component: BorrowComponent },
  { path: 'borrow-success', component: BorrowSuccessComponent },
  { path: 'borrow-info', component: BorrowInfoComponent },
  { path: 'return', component: ReturnComponent },
  { path: 'return-success', component: ReturnSuccessComponent },
  { path: 'return-warning', component: ReturnWarningComponent },
  { path: 'materials', component: MaterialsComponent },
  { path: 'materials-edit', component: MaterialsEditComponent },
  { path: 'materials-warning', component: MaterialsWarningComponent },
  { path: 'materials-success', component: MaterialsSuccessComponent },
  { path: 'materials-add', component: MaterialsAddComponent },
  { path: 'add-warning', component: AddWarningComponent },
  { path: 'add-success', component: AddSuccessComponent },
  { path: 'materials-type', component: MaterialsTypeComponent },
  { path: 'add-type', component: AddTypeComponent },
  { path: 'add-type-warning', component: AddTypeWarningComponent },
  { path: 'add-type-success', component: AddTypeSuccessComponent },
  { path: 'records', component: RecordsComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'sidebar-admin', component: SidebarAdminComponent },
  { path: 'material-info', component: MaterialInfoComponent },
  { path: 'timein-already', component: TimeinAlreadyComponent },
  { path: 'books', component: BooksComponent },
  { path: 'student', component: StudentComponent },
  { path: 'faculty', component: FacultyComponent },
  { path: 'visitor', component: VisitorComponent },
  { path: 'super-sidebar', component: SuperSidebarComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
