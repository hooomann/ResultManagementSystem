import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  students: any;
  editedStudent: any = {};
  showEditModal: boolean = false;
  studentInfo: any = {};
  showAddModal: boolean = false;
  newStudent: any = {};
  addStudentMessage: string = '';
  editStudentMessage: string = '';
  deleteStudentMessage: string = '';
  showAddMessage : boolean = false ;
  showEditMessage : boolean = false ;
  showDeleteMessage : boolean = false ;

  constructor(private http: HttpClient, private router: Router) {}

  // Lifecycle hook
  ngOnInit(): void {
    this.getStudentData();
  }

  // Retrieve student data from API
  getStudentData(): void {
    // Retrieve the bearer token from localStorage
    const token = localStorage.getItem('token');

    // Make API call with the bearer token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any>('http://localhost:3000/teacher', { headers }).subscribe(
      (response) => {
        this.students = response.data;
      },
      (error) => {
        console.error('API call failed', error);
      }
    );
  }

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





  // Open the add student modal
  openAddModal(): void {
    this.showAddModal = true;
  }

  // Close the add student modal and clear form data
  closeAddModal(): void {
    this.showAddModal = false;
    this.clearNewStudentForm();
  }

  // Add a new student
  addStudent(): void {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    if (!this.validateDateFormat(this.newStudent.dateofbirth)) {
      this.addStudentMessage = 'Invalid date format. Please enter a date in dd-mm-yyyy format.';
      this.showAddMessage = true;
      this.closeAddModal();
      return;
    }



    this.http
      .post<any>('http://localhost:3000/teacher/add', this.newStudent, { headers })
      .subscribe(
        (response) => {
          this.addStudentMessage = response.message;
          this.showAddMessage = true;
          this.getStudentData();
          setTimeout(() => {
            this.showAddMessage = false;
          }, 5000); // Message will disappear after 5 seconds 
        },
        (error) => {
          console.error('API call failed', error);
          this.addStudentMessage  = error.error.message;
          this.showAddMessage = true;
          setTimeout(() => {
            this.showAddMessage = false;
          }, 5000); // Message will disappear after 5 seconds 
        }
      );

    this.closeAddModal();
  }

  // Clear the new student form
  clearNewStudentForm(): void {
    this.newStudent = {
      rollno: '',
      name: '',
      dateofbirth: '',
      score: ''
    };
  }

  // Open the edit student modal
  openEditModal(student: any): void {
    console.log(11111);
    this.editedStudent = { ...student };
    this.showEditModal = true;
  }

  // Close the edit student modal
  closeEditModal(): void {
    this.editedStudent = {};
    this.showEditModal = false;
  }

  // Save the edited student
  saveEditedStudent(): void {
    const token = localStorage.getItem('token');

    this.studentInfo = {
      name: this.editedStudent.name,
      score: this.editedStudent.score,
      dateofbirth: this.editedStudent.dateofbirth
    };
    if (!this.validateDateFormat(this.studentInfo.dateofbirth)) {
      this.editStudentMessage = 'Invalid date format. Please enter a date in dd-mm-yyyy format.';
      this.showEditMessage = true;
      this.closeEditModal();
      return;
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http
      .put<any>('http://localhost:3000/teacher/edit/' + this.editedStudent.rollno, this.studentInfo, { headers })
      .subscribe(
        (response) => {
          this.editStudentMessage = response.message;
          this.showEditMessage = true;
          this.getStudentData();
          setTimeout(() => {
            this.showEditMessage = false;
          }, 5000); // Message will disappear after 5 seconds (adjust the duration as needed)
        },
        (error) => {
          console.error('API call failed', error);
        }
      );

    this.closeEditModal();
  }

  // Delete a student
  deleteStudent(student: any): void {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.editedStudent = { ...student };
    this.http
      .delete<any>('http://localhost:3000/teacher/delete/' + this.editedStudent.rollno, { headers })
      .subscribe(
        (response) => {
          this.deleteStudentMessage = response.message;
          this.showDeleteMessage = true;
          this.getStudentData();
          setTimeout(() => {
            this.showDeleteMessage = false;
          }, 5000); // Message will disappear after 5 seconds
        },
        (error) => {
          console.error('API call failed', error);
        }
      );
  }

  // Logout the teacher
  logout(): void {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post('http://localhost:3000/logout', {}, { headers }).subscribe(
      (response) => {
        console.log('teacher logged out', response);
        this.router.navigate(['']);
      },
      (error) => {
        console.error('logout API Failed', error);
      }
    );
  }
}






// Author: @Mann Chitransh
