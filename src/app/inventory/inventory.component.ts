import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { CountriesService } from '../services/countries.service';
import { Country } from '../../types';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [NgFor],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
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
