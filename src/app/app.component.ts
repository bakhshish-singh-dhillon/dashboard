import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Dashboard';

  constructor(private router: Router, private titleService: Title) {}

  setHeader() {
    this.router.events.subscribe({
      next: (event) => {
        if (event instanceof NavigationEnd) {
          setTimeout(() => {
            this.title = this.titleService.getTitle();
          }, 50); 
        }
      },
    });
  }
}
