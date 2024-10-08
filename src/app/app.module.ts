import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

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
import { MaterialInfoComponent } from './client/material-info/material-info.component';
import { TimeinAlreadyComponent } from './client/timein-already/timein-already.component';
import { BooksComponent } from './super-admin/books/books.component';
import { StudentComponent } from './super-admin/student/student.component';
import { FacultyComponent } from './super-admin/faculty/faculty.component';
import { VisitorComponent } from './super-admin/visitor/visitor.component';
import { SuperSidebarComponent } from './super-admin/super-sidebar/super-sidebar.component';
import { UserRecordComponent } from './super-admin/user-record/user-record.component';
import { AddUserComponent } from './super-admin/add-user/add-user.component';
import { AddStudentComponent } from './super-admin/add-student/add-student.component';
import { AddFacultyComponent } from './super-admin/add-faculty/add-faculty.component';
import { AddVisitorComponent } from './super-admin/add-visitor/add-visitor.component';
import { EditStudentComponent } from './super-admin/edit-student/edit-student.component';
import { EditFacultyComponent } from './super-admin/edit-faculty/edit-faculty.component';
import { EditVisitorComponent } from './super-admin/edit-visitor/edit-visitor.component';
import { DeleteWarningComponent } from './super-admin/delete-warning/delete-warning.component';
import { DeleteSuccessComponent } from './super-admin/delete-success/delete-success.component';
import { EditWarningComponent } from './super-admin/edit-warning/edit-warning.component';
import { EditSuccessComponent } from './super-admin/edit-success/edit-success.component';
import { AddFacultySuccessComponent } from './super-admin/add-faculty-success/add-faculty-success.component';
import { EditFacultySuccessComponent } from './super-admin/edit-faculty-success/edit-faculty-success.component';
import { AddVisitorSuccessComponent } from './super-admin/add-visitor-success/add-visitor-success.component';
import { DeleteVisitorSuccessComponent } from './super-admin/delete-visitor-success/delete-visitor-success.component';
import { SnackbarDeleteComponent } from './super-admin/snackbar-delete/snackbar-delete.component';
import { SnackbarComponent } from './admin/snackbar/snackbar.component';

//Services
import { AnalyticsService } from '../services/analytics.service';
import { RegisterService } from '../services/register.service';
import { MaterialsService } from '../services/materials.service';
import { TimeLogService } from '../services/time-log.service';
import { RecordsService } from '../services/records.service';
import { SnackbarService } from '../services/snackbar.service';
import { ReportsService } from '../services/reports.service';
import { AdminLoginService } from '../services/admin-login.service';
import { AdminService } from '../services/admin.service';
import { AddMaterialService } from '../services/add-material.service';
import { BorrowService } from '../services/borrow.service';
import { ReturnService } from '../services/return.service';
import { PdfReportInventoryService } from '../services/pdf-report-inventory.service';
import { PdfReportFacultyService } from '../services/pdf-report-faculty.service';
import { PdfReportStudentsService } from '../services/pdf-report-students.service';
import { PdfReportVisitorsService } from '../services/pdf-report-visitors.service';
import { ExcelReportInventoryService } from '../services/excel-report-inventory.service';
import { ExcelReportFacultyService } from '../services/excel-report-faculty.service';
import { ExcelReportStudentsService } from '../services/excel-report-students.service';
import { ExcelReportVisitorsService } from '../services/excel-report-visitors.service';
import { CurrentDateYearService } from '../services/current-date-year.service';
import { PdfReportBorrowersService } from '../services/pdf-report-borrowers.service';
import { CoursesComponent } from './super-admin/courses/courses.component';
import { DepartmentsComponent } from './super-admin/departments/departments.component';
import { AddCourseComponent } from './super-admin/add-course/add-course.component';
import { AddDepartmentComponent } from './super-admin/add-department/add-department.component';
import { EditCourseComponent } from './super-admin/edit-course/edit-course.component';
import { EditDepartmentComponent } from './super-admin/edit-department/edit-department.component';
import { AddSuccessfulComponent } from './super-admin/add-successful/add-successful.component';
import { AddDepartmentSuccessComponent } from './super-admin/add-department-success/add-department-success.component';
import { CourseService } from '../services/course.service';
import { ChartsService } from '../services/charts.service';
import { DepartmentService } from '../services/department.service';
import { LibrarianService } from '../services/librarian.service';
import { AnalyticsComponent } from './admin/analytics/analytics.component';
import { MostBorrowedComponent } from './admin/analytics/most-borrowed/most-borrowed.component';
import { TopUsersComponent } from './admin/analytics/top-users/top-users.component';
import { MonthlyUsersComponent } from './admin/analytics/monthly-users/monthly-users.component';
import { MonthlyCategoryDonutComponent } from './admin/analytics/monthly-category-donut/monthly-category-donut.component';
import { TopTenUserTimeinComponent } from './admin/analytics/top-ten-user-timein/top-ten-user-timein.component';
import { EditTypeComponent } from './admin/edit-type/edit-type.component';
import { NavbarClientComponent } from './client/navbar-client/navbar-client.component';
import { NavbarAdminComponent } from './admin/navbar-admin/navbar-admin.component';
import { NavbarSuperAdminComponent } from './super-admin/navbar-super-admin/navbar-super-admin.component';
import { BookRequestService } from '../services/book-request.service';
import { ClientSnackbarComponent } from './client/client-snackbar/client-snackbar.component';
import { RequestComponent } from './admin/request/request.component';


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
    NavbarComponent,
    MaterialInfoComponent,
    TimeinAlreadyComponent,
    BooksComponent,
    StudentComponent,
    FacultyComponent,
    VisitorComponent,
    SuperSidebarComponent,
    UserRecordComponent,
    AddUserComponent,
    AddStudentComponent,
    AddFacultyComponent,
    AddVisitorComponent,
    EditStudentComponent,
    EditFacultyComponent,
    EditVisitorComponent,
    DeleteWarningComponent,
    DeleteSuccessComponent,
    EditWarningComponent,
    EditSuccessComponent,
    AddFacultySuccessComponent,
    EditFacultySuccessComponent,
    AddVisitorSuccessComponent,
    DeleteVisitorSuccessComponent,
    SnackbarDeleteComponent,
    SnackbarComponent,
    CoursesComponent,
    DepartmentsComponent,
    AddCourseComponent,
    AddDepartmentComponent,
    EditCourseComponent,
    EditDepartmentComponent,
    AddSuccessfulComponent,
    AddDepartmentSuccessComponent,
    AnalyticsComponent,
    MostBorrowedComponent,
    TopUsersComponent,
    MonthlyUsersComponent,
    MonthlyCategoryDonutComponent,
    TopTenUserTimeinComponent,
    EditTypeComponent,
    NavbarClientComponent,
    NavbarAdminComponent,
    NavbarSuperAdminComponent,
    ClientSnackbarComponent,
    RequestComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    RegisterService,
    MaterialsService,
    TimeLogService,
    RecordsService,
    AdminLoginService,
    AdminService,
    AddMaterialService,
    SnackbarService,
    ReportsService,
    BorrowService,
    PdfReportInventoryService,
    PdfReportFacultyService,
    ExcelReportInventoryService,
    ReturnService,
    PdfReportStudentsService,
    CurrentDateYearService,
    PdfReportVisitorsService,
    PdfReportBorrowersService,
    ExcelReportFacultyService,
    ExcelReportStudentsService,
    ExcelReportVisitorsService,
    CourseService,
    DepartmentService,
    LibrarianService,
    ChartsService,
    BookRequestService,
    AnalyticsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
