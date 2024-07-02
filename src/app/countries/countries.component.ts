import { Component, Input } from '@angular/core';
import { CountriesService } from '../services/countries.service';
import { Country, Pagination, TableHeader } from '../../types';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { saveAs } from 'file-saver';

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
            sort: 1,
          };
        });
      });
  }

  sortCountries(sortBy: string, index: number): Country[] {
    this.sortBy = sortBy;
    this.tableHeads[index].sort = -1 * this.tableHeads[index].sort;
    if (!isNaN(Number(this.countries[0][this.sortBy]))) {
      return this.countries.sort(
        (a, b) =>
          (Number(a[this.sortBy]) - Number(b[this.sortBy])) *
          this.tableHeads[index].sort
      );
    } else
      return this.countries.sort((a, b) => {
        if (
          a[this.sortBy].toString().toUpperCase() <
          b[this.sortBy].toString().toUpperCase()
        ) {
          return -1 * this.tableHeads[index].sort;
        } else if (
          a[this.sortBy].toString().toUpperCase() >
          b[this.sortBy].toString().toUpperCase()
        ) {
          return 1 * this.tableHeads[index].sort;
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

  downloadFile() {
    const replacer = (key: any, value: any) => (value === null ? '' : value); // specify how you want to handle null values here
    const header = this.tableHeads.map((head) => head.name);
    const csv = this.countries.map((row: any) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    );
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');

    const a = document.createElement('a');
    const blob = new Blob([csvArray], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = 'Countries.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  resetSearch() {
    this.searchQuery = '';
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

  lastPage() {
    this.paginate.current = Math.round(
      this.countries.length / this.paginate.pageSize
    );
    this.paginate.next =
      Math.round(this.countries.length / this.paginate.pageSize) + 1;
    this.paginate.prev =
      Math.round(this.countries.length / this.paginate.pageSize) - 1;
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

  roundOff(num: any) {
    return Math.round(num);
  }

  resetFilters() {
    this.resetSearch();
    this.tableHeads.forEach((head) => {
      head.checked = true;
      head.sort = 1;
    });
    this.tableHeads[0].sort = -1;
    this.sortCountries('id', 0);
  }
}
