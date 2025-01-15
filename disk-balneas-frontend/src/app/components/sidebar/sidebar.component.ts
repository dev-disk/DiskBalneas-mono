import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { filter } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ICONS } from '../../../assets/icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    MatInputModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  opened: boolean = true;
  pageTitle = '';
  pageSubTitle = '';
  isProductsRoute = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const { title, subTitle } = this.extractRouteData(
          this.router.routerState,
          this.router.routerState.root
        );
        this.pageTitle = title || '';
        this.pageSubTitle = subTitle || '';

        this.isProductsRoute = this.router.url === '/products';
      });
  }

  get hasSubtitle(): boolean {
    return !!this.pageSubTitle;
  }

  private extractRouteData(
    state: any,
    parent: ActivatedRoute
  ): { title: string; subTitle: string } {
    let title = '';
    let subTitle = '';

    if (parent && parent.snapshot.data) {
      title = parent.snapshot.data['title'] || title;
      subTitle = parent.snapshot.data['subTitle'] || subTitle;
    }

    if (state && parent) {
      const childData = this.extractRouteData(state, state.firstChild(parent));
      title = childData.title || title;
      subTitle = childData.subTitle || subTitle;
    }

    return { title, subTitle };
  }
}
