import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CountriesComponent } from './countries/countries.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: "full"
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'countries',
        component: CountriesComponent
    }
];
