import { Component } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavigationEnd, Router, RouterOutlet, Event } from '@angular/router';
import { CommonModule } from '@angular/common';
import { publicRoutes } from './app.routes';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    RouterOutlet
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  shouldShowSidebar = true;

  constructor(private router: Router) {

    document.body.classList.add('mat-app-background');
    document.body.classList.add('dark-theme');

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.shouldShowSidebar = !publicRoutes.some(route => 
          event.urlAfterRedirects.startsWith(route)
        );
      }
    });
  }


}
