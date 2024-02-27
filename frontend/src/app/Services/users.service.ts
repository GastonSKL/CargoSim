import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private httpClient = inject(HttpClient);
  private baseUrl:string;

  constructor() { 
    this.baseUrl = 'http://localhost:44338';
  }

  register(formValue: any){
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/User/Login`, formValue)
    )
  }
}
