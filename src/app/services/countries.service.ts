import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Country } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  constructor(private apiService: ApiService) { }

  getCountries = (url:string):Observable<Country> => {
    return this.apiService.get(url)
  }
}
