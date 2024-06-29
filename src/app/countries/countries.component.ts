import { Component } from '@angular/core';
import { CountriesService } from '../services/countries.service';
import { Country } from '../../types';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [NgFor],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss'
})
export class CountriesComponent {
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
