import { Component, Input } from '@angular/core';
import { CountriesService } from '../services/countries.service';
import { Country, Pagination, SortBy, TableHeader } from '../../types';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [NgFor, FormsModule, MatIconModule, RouterLink],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss',
})
export class CountriesComponent {
  constructor(
    private countriesService: CountriesService,
    private router:Router,
    private route: ActivatedRoute
  ) {}

  countries: Country[] = [];
  tableHeads: TableHeader[] = [];
  sortBy: SortBy = {
    name: 'id',
    order: -1,
  };
  apiResult: Country[] = [];
  @Input() searchQuery: string = '';
  @Input() page: number = 1;
  @Input() sortHead: string = 'id';
  @Input() order: string = 'asc';
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
        this.setQueryParams();
      });
  }

  sortCountries(sortBy: string, index: number): Country[] {
    this.sortBy.name = sortBy;
    this.tableHeads[index].sort = -1 * this.tableHeads[index].sort;
    this.sortBy.order = this.tableHeads[index].sort;
    if (!isNaN(Number(this.countries[0][this.sortBy.name]))) {
      return this.countries.sort(
        (a, b) =>
          (Number(a[this.sortBy.name]) - Number(b[this.sortBy.name])) *
          this.tableHeads[index].sort
      );
    } else
      return this.countries.sort((a, b) => {
        if (
          a[this.sortBy.name].toString().toUpperCase() <
          b[this.sortBy.name].toString().toUpperCase()
        ) {
          return -1 * this.tableHeads[index].sort;
        } else if (
          a[this.sortBy.name].toString().toUpperCase() >
          b[this.sortBy.name].toString().toUpperCase()
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

  firstPage() {
    return [
      '/countries',
      1,
      'page',
      this.sortBy.name,
      this.sortByNumToStringOrder(),
      this.searchQuery,
    ];
  }

  prevPage() {
    return [
      '/countries',
      this.paginate.current,
      'page',
      this.sortBy.name,
      this.sortByNumToStringOrder(),
      this.searchQuery,
    ];
  }

  nextPage() {
    return [
      '/countries',
      this.paginate.current + 2,
      'page',
      this.sortBy.name,
      this.sortByNumToStringOrder(),
      this.searchQuery,
    ];
  }

  lastPage() {
    return [
      '/countries',
      Math.round(this.countries.length / this.paginate.pageSize) + 1,
      'page',
      this.sortBy.name,
      this.sortByNumToStringOrder(),
      this.searchQuery,
    ];
  }

  setPage(page: any) {
    if (
      page != '' &&
      page - 1 <= Math.round(this.countries.length / this.paginate.pageSize) &&
      page - 1 > -1
    ) {
      this.paginate.current = page - 1;
      this.paginate.next = this.paginate.current + 1;
      this.paginate.prev = this.paginate.current - 1;
    }
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
    this.router.navigate(['countries']);
  }

  sortByNumToStringOrder() {
    return this.sortBy.order == 1 ? 'asc' : 'desc';
  }

  sortByStringToNumOrder(order: string) {
    return order == 'asc' ? 1 : -1;
  }

  setQueryParams() {
    this.page = this.page ? this.page - 1 : 1;
    this.searchQuery = this.searchQuery ? this.searchQuery : '';
    this.sortBy.name = this.sortHead ? this.sortHead : 'id';
    this.sortBy.order = this.order
      ? this.sortByStringToNumOrder(this.order)
      : -1;
    this.setPage(this.page);
    this.searchCountries();
    const headId = this.getHeadId(this.sortBy.name);
    this.tableHeads[headId].sort = this.sortBy.order;
    // this.sortCountries(this.sortBy.name, headId);

    this.route.params.subscribe((data: Params) => {
      this.setPage(data['page']);
      this.searchQuery = data['searchQuery'] ? data['searchQuery'] : '';
      // this.searchCountries();
      const headId = this.getHeadId(this.sortBy.name);
      this.tableHeads[headId].sort = this.sortBy.order;
      // this.sortCountries(this.sortBy.name, headId);
    });
  }

  getHeadId(name: string) {
    return this.tableHeads.findIndex((head) => head.name == name);
  }
}
