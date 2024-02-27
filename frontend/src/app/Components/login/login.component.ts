import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UsersService } from '../../Services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formulario: FormGroup;

  userService = inject(UsersService);

  constructor() {
    this.formulario = new FormGroup({
      username: new FormControl(),
      password: new FormControl()
    })
  }

  async onSubmit(){
    debugger;
    localStorage.clear();
    const response = await this.userService.register(this.formulario.value);
    localStorage.setItem("token",response.token);
  }
}
