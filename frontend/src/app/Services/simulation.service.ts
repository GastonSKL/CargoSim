import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse  } from '@angular/common/http';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  private httpClient = inject(HttpClient);
  private baseUrl:string;

  constructor() {
      this.baseUrl = 'http://localhost:44338';
   }

   start_simulation(token: string | null): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.httpClient.post<any>(`${this.baseUrl}/Sim/Start`, '', { headers, observe: 'response' })
      .pipe(
        catchError((error: any) => {
          let errorMessage: string;
          if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
          } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }
          return errorMessage;
        })
      );
  }

  stop_simulation(token: string | null){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/Sim/Stop`, '', { headers })
    );
  }

  get_coins(token: string | null){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/User/CoinAmount`,{ headers })
    );
  }

  get_grid(token: string | null){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/Grid/Get`,{ headers })
    );
  }

  get_all_available(token: string | null){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/Order/GetAllAvailable`,{ headers })
    );
  }

  get_all_accepted(token: string | null){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/Order/GetAllAccepted`,{ headers })
    );
  }

  post_accept(token: string | null, id: number){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/Order/Accept?orderId=${id}`,'',{ headers })
    );
  }

  post_create(token: string | null){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/Order/Create`,'',{ headers })
    );
  }

  get_cargo_transporter(token: string | null, id: number){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return firstValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/CargoTransporter/Get?transporterId=${id}`,{ headers })
    );
  }

  buy_cargo_transporter(token: string | null, id: number){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/CargoTransporter/Buy?positionNodeId=${id}`,'',{ headers })
    );
  }

  move_cargo_transporter(token: string | null, id: number, targetNodeId: number){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return firstValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}/CargoTransporter/Move?transporterId=${id}&targetNodeId=${targetNodeId}}`,'',{ headers })
    );
  }

  


}
