import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { HomeComponent } from './Components/home/home.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to /login if no route specified
  { path: '**', redirectTo: '/login' } // Redirect to /login if route not found
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
