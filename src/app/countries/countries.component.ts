import { Component, Input } from '@angular/core';
import { CountriesService } from '../services/countries.service';
import { Country, Pagination, TableHeader } from '../../types';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [NgFor, FormsModule, MatIconModule],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss',
})
export class CountriesComponent {
  constructor(private countriesService: CountriesService) {}

  countries: Country[] = [];
  tableHeads: TableHeader[] = [];
  sortBy: string = 'id';
  apiResult: Country[] = [];
  searchQuery: string = '';
  filter: boolean = true;
  paginate: Pagination = {
    current: 0,
    next: 1,
    prev: -1,
    pageSize: 15,
    total: this.countries.length,
  };

  ngOnInit() {
    this.countriesService
      .getCountries('https://freetestapi.com/api/v1/countries?limit=199')
      .subscribe((countries: Country[]) => {
        this.countries = countries;
        this.apiResult = countries;
        Object.keys(countries[0]).forEach((element, index) => {
          this.tableHeads[index] = {
            name: element,
            checked: true,
          };
        });
      });
  }

  sortCountries(sortBy: string): Country[] {
    this.sortBy = sortBy;
    console.log(sortBy);
    if (!isNaN(Number(this.countries[0][this.sortBy])))
      return this.countries.sort(
        (a, b) => Number(a[this.sortBy]) - Number(b[this.sortBy])
      );
    else
      return this.countries.sort((a, b) => {
        if (
          a[this.sortBy].toString().toUpperCase() <
          b[this.sortBy].toString().toUpperCase()
        ) {
          return -1;
        } else if (
          a[this.sortBy].toString().toUpperCase() >
          b[this.sortBy].toString().toUpperCase()
        ) {
          return 1;
        } else return 0;
      });
  }

  searchCountries() {
    var regex = RegExp('.*' + this.searchQuery + '.*', 'i');
    console.log(this.searchQuery);
    var result = this.apiResult.filter(
      (country) =>
        regex.test(country.capital) ||
        regex.test(country.name) ||
        regex.test(country.currency)
    );
    if (this.searchQuery == '') {
      this.countries = this.apiResult;
      this.resetPaginate();
    } else {
      this.countries = result ? result : [];
      this.resetPaginate();
    }
  }

  resetSearch(){
    this.searchQuery="";
    this.searchCountries();
  }

  prevPage() {
    this.paginate.current--;
    this.paginate.prev--;
    this.paginate.next--;
  }

  nextPage() {
    this.paginate.current++;
    this.paginate.next++;
    this.paginate.prev++;
  }

  resetPaginate() {
    this.paginate = {
      current: 0,
      next: 1,
      prev: -1,
      pageSize: this.paginate.pageSize,
      total: this.countries.length,
    };
  }
}
