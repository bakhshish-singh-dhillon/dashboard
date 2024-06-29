import { Component, Input } from '@angular/core';
import { Country } from '../../types';
import { CountriesService } from '../services/countries.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(
    private countriesService:CountriesService
  ){}

  countries: Country[] = [];

  ngOnInit(){
    this.countriesService.getCountries('https://freetestapi.com/api/v1/countries?limit=199').subscribe((countries:Country[])=>{
      this.countries = countries;
    })
  }

}
