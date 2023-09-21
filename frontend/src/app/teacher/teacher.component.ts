import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent {
  id: string = '';
  password: string = '';
  loginError: string = '';

  constructor(private http: HttpClient, private router: Router) {} // Inject the Router service

  login(): void {
    const loginData = {
      id: this.id,
      password: this.password
    };

    // Send the login request to the backend API
    this.http.post<any>('http://localhost:3000/login', loginData) // Define response type as 'any'
      .subscribe(
        (response) => {
          // Handle the response from the API
          console.log('Login successful:', response);
          
          // Save the bearer token to localStorage
          localStorage.setItem('token', response.token);
          
          // Redirect to the new page
          this.router.navigate(['teacher/home']);
          // Redirect to teacher dashboard or perform other actions
        },
        (error) => {
          // Handle errors if any
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
