import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Authentication service
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private BASE_URL = environment.API_URL;

  constructor(private http: HttpClient) { }

  /**
   * To authenticate user login
   * @param userName 
   * @param password 
   * @returns 
   */
  authenticate(userName: string, password: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/authenticate`, {
      "username": userName,
      "password": password
    });
  }
}
