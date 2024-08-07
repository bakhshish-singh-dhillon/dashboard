import { Component } from '@angular/core';
import { CountriesService } from '../services/countries.service';
import { Country } from '../../types';
import { NgFor } from '@angular/common';
import { Chart, registerables, scales } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  constructor(private countriesService: CountriesService) {}

  countries: Country[] = [];
  population: any[] = [];
  landArea: any[] = [];

  ngOnInit() {
    this.countriesService
      .getCountries('https://freetestapi.com/api/v1/countries?limit=199')
      .subscribe((countries: Country[]) => {
        this.countries = countries;
        this.generatePopulationChart();
        this.generateLandAreaChart();
      });
  }

  drawChart(
    chartType: any,
    labels: string[],
    data: string[],
    datalabel: string,
    canvasID: string,
    aspectRatio: number
  ) {
    const chart = new Chart(canvasID, {
      type: chartType,
      data: {
        labels: labels,
        datasets: [
          {
            label: datalabel,
            data: data,
          },
        ],
      },
      options: {
        aspectRatio: aspectRatio,
      },
    });
  }

  generatePopulationChart() {
    this.population = this.countries
      .sort((a, b) => Number(b.population) - Number(a.population))
      .slice(0, 10);
    this.drawChart(
      'pie',
      this.population.map((c) => c.name),
      this.population.map((c) => c.population),
      'Population',
      'piechart',
      2
    );
  }

  generateLandAreaChart() {
    this.landArea = this.countries
      .sort((a, b) => Number(b.population) - Number(a.population))
      .slice(0, 10);
    this.drawChart(
      'bar',
      this.landArea.map((c) => c.name),
      this.landArea.map((c) => c.land_area),
      'Land Area',
      'barchart',
      1.5
    );
  }
}
