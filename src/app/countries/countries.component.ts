import { Component, Input } from '@angular/core';
import { CountriesService } from '../services/countries.service';
import { Country, TableHeader } from '../../types';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss',
})
export class CountriesComponent {
  constructor(private countriesService: CountriesService) {}

  countries: Country[] = [];
  tableHeads: TableHeader[] = [];

  ngOnInit() {
    this.countriesService
      .getCountries('https://freetestapi.com/api/v1/countries?limit=199')
      .subscribe((countries: Country[]) => {
        this.countries = countries;
        Object.keys(countries[0]).forEach((element, index) => {
          console.log(element);
          this.tableHeads[index] = {
            name: element,
            checked: true,
          };
        });
        console.log(this.tableHeads);
      });
  }
}
