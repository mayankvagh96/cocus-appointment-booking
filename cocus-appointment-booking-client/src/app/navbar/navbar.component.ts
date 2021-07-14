import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { NotificationService } from "../notification.service";

/**
 * Navigation bar component
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  // isLoggedIn: boolean = this.cookieService.get('authToken') ? true : false;

  constructor(private cookieService: CookieService, private router: Router, private notificationService: NotificationService) { }

  ngOnInit(): void {
  }

  /**
   * To logout
   */
  logout() {
    this.cookieService.delete('authToken', '/');
    this.notificationService.showSuccess("Logged out Successfully ... ", "Logout")
    this.router.navigate([`./`]);
  }

}
