import { Component, OnInit } from '@angular/core';
import { CalendarView, CalendarEvent } from 'angular-calendar';
import { AppointmentsService } from '../appointments.service';
import { NotificationService } from "../notification.service";
import { Appointment } from '../Appointment';

/**
 * To display calender view 
 */
@Component({
  selector: 'app-appointment-calendar',
  templateUrl: './appointment-calendar.component.html',
  styleUrls: ['./appointment-calendar.component.css']
})
export class AppointmentCalendarComponent implements OnInit {


  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  events: any[] = [];

  constructor(private appointmentService: AppointmentsService, private notificationService: NotificationService) {
    this.getAppointments('')
  }

  ngOnInit(): void {
  }

  /**
   * To set view
   * @param view
   */
  setView(view: CalendarView) {
    this.view = view;
  }

  /**
   * To get selected date event
   * @param param
   */
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log(date + " " + events);
  }

  /**
   * To get all appointment by date
   * @param changedDate 
   */
  getAppointments(changedDate: string) {
    this.appointmentService.getAppointmentsByDate(changedDate)
      .subscribe((appointments: Appointment[]) => {
        if (appointments.length === 0) {
          this.notificationService.showWarning("No appointments found ... Create New ...", "Appointments");
        }
        for (let appointment of appointments) {
          this.events = [
            ...this.events,
            {
              start: new Date(appointment["appointmentDate"]),
              title: "Title: " + appointment["subject"] + "<br />" +
                "Description: " + appointment["description"] + "<br />" +
                "Participants: " + appointment["participants"] + "<br />" +
                "Place" + appointment["appointmentPlace"]
            }
          ]
        }
      }, (error: ErrorEvent) => {
        if (error.error.errorCode === 401) {
          this.notificationService.showError(error.error.errorMessage, error.error.statusDescription);
          this.notificationService.showError("Please sign in again ...", "Sign In");
        } else {
          this.notificationService.showError(error.error.errorMessage, error.error.statusDescription);
        }
      });
  }

}
