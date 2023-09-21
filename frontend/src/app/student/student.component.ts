import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent {
  rollno: string = '';
  dateofbirth: string = '';
  studentData: any;
  loginError: string ='';

  constructor(private http: HttpClient, private router: Router) {}

//check date format
validateDateFormat(dateString: string): boolean {
  const pattern = /^\d{2}-\d{2}-\d{4}$/; // Regular expression for dd-mm-yyyy format
  if (!pattern.test(dateString)) {
    return false; // Invalid date format
  }
  
  const parts = dateString.split('-');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  // Check if the month is valid
  if (month < 1 || month > 12) {
    return false; // Invalid month
  }
  
  // Check if the day is valid
  if (day < 1 || day > new Date(year, month, 0).getDate()) {
    return false; // Invalid day
  }
  
  // Check if the date is a valid date
  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) {
    return false; // Invalid date
  }
  
  // Check if the parsed date matches the original string
  const formattedDate = `${day}-${month}-${year}`;
  return dateString === formattedDate;
}





  login(): void {
    const loginData = {
      rollno: this.rollno,
      dateofbirth: this.dateofbirth
    };
    if (!this.validateDateFormat(this.dateofbirth)) {
      this.loginError = 'Invalid date format. Please enter a date in dd-mm-yyyy format.';
      return;
    }
    // Sending the login request to the backend API
    this.http.post('http://localhost:3000/student', loginData)
      .subscribe(
        (response) => {
          
          console.log('Login successful:', response);
          this.studentData = response;
        },
        (error) => {
          
          console.error('Login error:', error);
          this.loginError = error.error.message;
        }
      );
  }

  goBack(): void {
    // Navigate back to the first page
    this.router.navigate(['']);
  }

}
