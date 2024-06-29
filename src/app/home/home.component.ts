import { Component, Input } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { Country } from '../../types';
import { NgFor } from '@angular/common';
import { CountriesService } from '../services/countries.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(
    private countriesService:CountriesService
  ){}

  countries: Array<Country> = [];

  ngOnInit(){
    this.countriesService.getCountries('https://freetestapi.com/api/v1/countries?limit=199').subscribe((countries:Country[])=>{
      this.countries = countries;
    })
  }

}
