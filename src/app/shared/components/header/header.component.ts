import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public showDropdown: boolean = false;

  public navItems: {
    label: string;
    path: string;
    routerLinkActiveOptions?: boolean;
  }[] = [
    {
      label: 'All Breeds',
      path: '/all-breeds',
      routerLinkActiveOptions: true
    },
    {
      label: 'Main Breeds',
      path: '/main-breeds'
    },
    {
      label: 'Random Dog',
      path: '/random'
    }
  ];

  openDropdown() {
    this.showDropdown = !this.showDropdown;
  }
}
