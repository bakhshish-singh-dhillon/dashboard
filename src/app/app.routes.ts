import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CountriesComponent } from './countries/countries.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: "full",
        title:'Dashbaord'
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        title:'Dashbaord'
    },
    {
        path: 'countries',
        component: CountriesComponent,
        title:'World Countries'
    },
    {
        path: 'countries/:page/page/:sortHead/:order',
        component: CountriesComponent,
        title:'World Countries'
    },
    {
        path: 'countries/:page/page/:sortHead/:order/:searchQuery',
        component: CountriesComponent,
        title:'World Countries'
    },
    { path: '**', component: PageNotFoundComponent },
];
