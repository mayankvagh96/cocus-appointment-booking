import { Component, OnInit } from '@angular/core';
import { Appointment } from '../Appointment';
import { AppointmentsService } from '../appointments.service';
import { NotificationService } from "../notification.service";
import { mergeMap } from "rxjs/operators";
import { Router } from '@angular/router';

/**
 * To list appointment in table
 */
@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {

  public loading: boolean = true;
  public appointments: Appointment[] | undefined;
  public columns = ["appointmentDate", "subject", "description", "participants", "appointmentPlace", "action"];
  public appointmentDate: string = '';

  constructor(private appointmentService: AppointmentsService, private notificationService: NotificationService, private router: Router) { }

  ngOnInit(): void {
    this.getAppointments(this.appointmentDate);
  }

  /**
   * To cancel appointment
   * @param id 
   */
  cancelAppointment(id: string) {
    this.appointmentService.cancelAppointment(id)
      .pipe(
        mergeMap(() => this.appointmentService.getAppointmentsByDate(this.appointmentDate))
      )
      .subscribe((appointments: Appointment[]) => {
        this.appointments = appointments;
        this.notificationService.showSuccess("Successfully cancelled appointment", "Cancel Appointment");
      }, (error: ErrorEvent) => {
        if (error.error.errorCode === 401) {
          this.loading = false;
          this.notificationService.showError(error.error.errorMessage, error.error.statusDescription);
          this.notificationService.showError("Please sign in again ...", "Sign In");
          this.router.navigate([`./`]);
        } else {
          this.loading = false;
          this.notificationService.showError(error.error.errorMessage, error.error.statusDescription);
        }
      });
  }

  /**
   * To get appointments 
   * @param changedDate 
   */
  getAppointments(changedDate: string) {
    this.appointmentService.getAppointmentsByDate(changedDate)
      .subscribe((appointments: Appointment[]) => {
        if (appointments.length === 0) {
          this.notificationService.showWarning("No appointments found ... Create New ...", "Appointments");
        }
        this.appointments = appointments;
        this.loading = false;
      }, (error: ErrorEvent) => {
        if (error.error.errorCode === 401) {
          this.loading = false;
          this.notificationService.showError(error.error.errorMessage, error.error.statusDescription);
          this.notificationService.showError("Please sign in again ...", "Sign In");
          this.router.navigate([`./`]);
        } else {
          this.loading = false;
          this.notificationService.showError(error.error.errorMessage, error.error.statusDescription);
        }
      });
  }

}
