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
import { LogoutWarningComponent } from './admin/logout-warning/logout-warning.component';
import { StudentComponent } from './super-admin/student/student.component';
import { FacultyComponent } from './super-admin/faculty/faculty.component';
import { VisitorComponent } from './super-admin/visitor/visitor.component';
import { BooksComponent } from './super-admin/books/books.component';
import { UserRecordComponent } from './super-admin/user-record/user-record.component';
import { AddStudentComponent } from './super-admin/add-student/add-student.component';
import { AddFacultyComponent } from './super-admin/add-faculty/add-faculty.component';
import { AddVisitorComponent } from './super-admin/add-visitor/add-visitor.component';
import { EditStudentComponent } from './super-admin/edit-student/edit-student.component';
import { EditFacultyComponent } from './super-admin/edit-faculty/edit-faculty.component';
import { EditVisitorComponent } from './super-admin/edit-visitor/edit-visitor.component';
import { EditWarningComponent } from './super-admin/edit-warning/edit-warning.component';
import { EditSuccessComponent } from './super-admin/edit-success/edit-success.component';
import { DeleteWarningComponent } from './super-admin/delete-warning/delete-warning.component';
import { DeleteSuccessComponent } from './super-admin/delete-success/delete-success.component';
import { AddFacultySuccessComponent } from './super-admin/add-faculty-success/add-faculty-success.component';
import { profile } from 'console';
import { EditFacultySuccessComponent } from './super-admin/edit-faculty-success/edit-faculty-success.component';
import { AddVisitorSuccessComponent } from './super-admin/add-visitor-success/add-visitor-success.component';
import { DeleteVisitorSuccessComponent } from './super-admin/delete-visitor-success/delete-visitor-success.component';
import { CoursesComponent } from './super-admin/courses/courses.component';
import { DepartmentsComponent } from './super-admin/departments/departments.component';
import { AddCourseComponent } from './super-admin/add-course/add-course.component';
import { AddDepartmentComponent } from './super-admin/add-department/add-department.component';
import { EditCourseComponent } from './super-admin/edit-course/edit-course.component';
import { EditDepartmentComponent } from './super-admin/edit-department/edit-department.component';
import { AddSuccessfulComponent } from './super-admin/add-successful/add-successful.component';
import { AddDepartmentSuccessComponent } from './super-admin/add-department-success/add-department-success.component';
import { AnalyticsComponent } from './admin/analytics/analytics.component';
import { MonthlyUsersComponent } from './admin/analytics/monthly-users/monthly-users.component';
import { MonthlyCategoryDonutComponent } from './admin/analytics/monthly-category-donut/monthly-category-donut.component';
import { TopTenUserTimeinComponent } from './admin/analytics/top-ten-user-timein/top-ten-user-timein.component';
import { EditTypeComponent } from './admin/edit-type/edit-type.component';
import { NavbarClientComponent } from './client/navbar-client/navbar-client.component';
import { NavbarAdminComponent } from './admin/navbar-admin/navbar-admin.component';
import { NavbarSuperAdminComponent } from './super-admin/navbar-super-admin/navbar-super-admin.component';
import { RequestComponent } from './admin/request/request.component';
import { FeedbackComponent } from './client/feedback/feedback.component';
import { LoginLispuptComponent } from './client/login-lispupt/login-lispupt.component';
import { EmployeesComponent } from './super-admin/employees/employees.component';
import { AddEmployeeComponent } from './super-admin/add-employee/add-employee.component';
import { EditEmployeeComponent } from './super-admin/edit-employee/edit-employee.component';
import { CoursesTimedInComponent } from './admin/analytics/courses-timed-in/courses-timed-in.component';

const routes: Routes = [
  { path: '', redirectTo: '/time-in', pathMatch: 'full' },
  { path: 'administrator', component: AdministratorComponent },
  { path: 'borrow-info/:accnum', component: BorrowInfoComponent },
  { path: 'material-info/:accnum', component: MaterialInfoComponent },
  { path: 'time-in', component: TimeInComponent },
  { path: 'time-out', component: TimeOutComponent },  
  { path: 'search-book', component: SearchBookComponent },
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
  { path: 'return-warning/:material_id', component: ReturnWarningComponent },
  { path: 'materials', component: MaterialsComponent },
  { path: 'materials-edit/:accnum', component: MaterialsEditComponent },
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
  { path: 'logout-warning', component: LogoutWarningComponent },
  { path: 'books', component: BooksComponent },
  { path: 'student', component: StudentComponent },
  { path: 'faculty', component: FacultyComponent },
  { path: 'visitor', component: VisitorComponent },
  { path: 'user-record', component: UserRecordComponent },
  { path: 'add-student', component: AddStudentComponent },
  { path: 'add-faculty', component: AddFacultyComponent },
  { path: 'add-visitor', component: AddVisitorComponent },
  { path: 'edit-student/:user_id', component: EditStudentComponent },
  { path: 'edit-faculty/:user_id', component: EditFacultyComponent },
  { path: 'edit-visitor/:user_id', component: EditVisitorComponent },
  { path: 'edit-warning', component: EditWarningComponent },
  { path: 'edit-success', component: EditSuccessComponent },
  { path: 'edit-faculty-success', component: EditFacultySuccessComponent},
  { path: 'delete-warning', component: DeleteWarningComponent },
  { path: 'delete-success', component: DeleteSuccessComponent },
  { path: 'add-faculty-success', component: AddFacultySuccessComponent },
  { path: 'add-visitor-success', component: AddVisitorSuccessComponent },
  { path: 'delete-visitor-success', component: DeleteVisitorSuccessComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'departments', component: DepartmentsComponent },
  { path: 'add-course', component: AddCourseComponent },
  { path: 'add-department', component: AddDepartmentComponent },
  { path: 'edit-course/:id', component: EditCourseComponent },
  { path: 'edit-department/:id', component: EditDepartmentComponent },
  { path: 'add-successful', component: AddSuccessfulComponent },
  { path: 'add-department-success', component: AddDepartmentSuccessComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'monthly-users', component: MonthlyUsersComponent},
  { path: 'category-donut',component: MonthlyCategoryDonutComponent},
  { path: 'top-users', component: TopTenUserTimeinComponent},
  { path: 'edit-type/:cat_id', component: EditTypeComponent },
  { path: 'navbar-client', component: NavbarClientComponent },
  { path: 'navbar-admin', component: NavbarAdminComponent },
  { path: 'navbar-superadmin', component: NavbarSuperAdminComponent },
  { path: 'request', component: RequestComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'login-lispupt', component: LoginLispuptComponent },
  { path: 'employee', component: EmployeesComponent },
  { path: 'add-employee', component: AddEmployeeComponent },
  { path: 'edit-employee', component: EditEmployeeComponent },
  { path: 'courses-pie-chart', component: CoursesTimedInComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }