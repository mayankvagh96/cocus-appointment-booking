import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { NotificationService } from "../notification.service";
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

/**
 * Component for login
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loading: boolean = false;
  public userName: string = '';
  public password: string = '';

  constructor(private authenticationService: AuthenticationService, private router: Router, private notificationService: NotificationService, private cookieService: CookieService) { }

  ngOnInit(): void {
  }

  /**
   * To authenticate
   */
  login() {
    this.loading = true;
    this.authenticationService.authenticate(this.userName, this.password)
      .subscribe((response: any) => {
        this.loading = false;
        this.userName = '';
        this.password = '';
        this.cookieService.set('authToken', response.token);
        this.notificationService.showSuccess("Authenticated Successfully ... ", "Sign In")
        this.router.navigate([`./appointment-list`]);
      }, (error: ErrorEvent) => {
        this.loading = false;
        this.notificationService.showError(error.error.errorMessage, "Sign In")
      });
  }

}
