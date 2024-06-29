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

  ngOnInit(){
    this.countriesService.getCountries('https://freetestapi.com/api/v1/countries?limit=199').subscribe((countries:Country)=>{
      console.log(countries)
    })
  }

  @Input() countries:Country[] = [
    {
      "id":11,"name":"Azerbaijan","population":10139175,"land_area":86600,"density":117.1,"capital":"Baku","currency":"Azerbaijani manat","flag":"https://fakeimg.pl/500x300/00ccff"
    },
    {"id":11,"name":"Azerbaijan","population":10139175,"land_area":86600,"density":117.1,"capital":"Baku","currency":"Azerbaijani manat","flag":"https://fakeimg.pl/500x300/00ccff"}
  ];
}
