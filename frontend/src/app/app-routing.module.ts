import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AllBooksComponent} from './components/all-books/all-books.component';
import {TechComponent} from './components/tech/tech.component';


const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: AllBooksComponent },
    { path: 'tech', component: TechComponent },
    { path: '**', redirectTo: '/home'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
