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

const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'administrator', component: AdministratorComponent },
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

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
