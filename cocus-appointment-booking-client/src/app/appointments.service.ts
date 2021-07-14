import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Appointment } from './Appointment';
import { CookieService } from 'ngx-cookie-service';

/**
 * Appointment related services
 */
@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  private BASE_URL = environment.API_URL;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  /**
   * To get appointments by date
   * @param date 
   * @returns 
   */
  getAppointmentsByDate(date: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.BASE_URL}/appointment/?startDate=${date}`, this.getRequestOptions());
  }

  /**
   * To get appointments by id
   * @param id 
   * @returns 
   */
  getAppointmentById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.BASE_URL}/appointment/${id}`, this.getRequestOptions());
  }

  /**
   * To createg appointment
   * @param subject 
   * @param description 
   * @param participants 
   * @param appointmentDate 
   * @param appointmentPlace 
   * @returns 
   */
  createAppointment(subject: string, description: string, participants: string, appointmentDate: string, appointmentPlace: string): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.BASE_URL}/appointment`, {
      "subject": subject,
      "description": description,
      "participants": participants,
      "appointmentDate": appointmentDate,
      "appointmentPlace": appointmentPlace
    }, this.getRequestOptions());
  }

  /**
   * To update appointment
   * @param id 
   * @param subject 
   * @param description 
   * @param participants 
   * @param appointmentDate 
   * @param appointmentPlace 
   * @returns 
   */
  updateAppointment(id: string | null, subject: string, description: string, participants: string, appointmentDate: string, appointmentPlace: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.BASE_URL}/appointment/${id}`, {
      "subject": subject,
      "description": description,
      "participants": participants,
      "appointmentDate": appointmentDate,
      "appointmentPlace": appointmentPlace
    }, this.getRequestOptions());
  }

  /**
   * To cancel appointment
   * @param id 
   * @returns 
   */
  cancelAppointment(id: string): Observable<Appointment> {
    return this.http.delete<Appointment>(`${this.BASE_URL}/appointment/${id}`, this.getRequestOptions());
  }

  /**
   * To set token and return headers
   * @returns 
   */
  getRequestOptions(): object {
    let headerDict = {
      "x-auth-token": this.cookieService.get('authToken')
    }
    let requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    return requestOptions;
  }

}
