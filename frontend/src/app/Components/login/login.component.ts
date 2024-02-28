import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'; // Import Validators
import { UsersService } from '../../Services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  formulario: FormGroup;

  userService = inject(UsersService);
  router = inject(Router);
  isLogged: any = undefined;
  isButtonDisabled: boolean = false;
  submitted: boolean = false;

  constructor() {
    this.formulario = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]), 
      password: new FormControl('', [Validators.required]), 
    });
  }

  async onSubmit() {
    debugger;
    this.submitted = true;
    localStorage.clear();
    try {
      if (this.formulario.valid) { 
        let response = await this.userService.register(this.formulario.value);
        localStorage.setItem('token', response.token);
        if (response.token && response.userName) {
          this.isLogged = true;
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1500);
        } else {
          this.isLogged = false;
          this.isButtonDisabled = true;
          setTimeout(()=>{
            this.isButtonDisabled = false;
          }, 1500);
        }
      } else {
        console.log('Form is invalid');
      }
    } catch (err) {
      console.log(err);
      this.isLogged = false;
      this.isButtonDisabled = true;
        setTimeout(()=>{
          this.isButtonDisabled = false;
        }, 1500);
    }
  }
}