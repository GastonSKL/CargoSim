import { trigger, state, style, animate, transition } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { SimulationService } from '../../Services/simulation.service';
import { CargoResponse } from '../../Interfaces/cargo-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(300)),
    ])
  ]
})
export class HomeComponent implements OnInit {
  simStarted: boolean = false;
  simStarting: boolean = false;
  token: string | null = '';
  cargoVehicles: CargoResponse[] = [];
  isAuthenticated: boolean = false;
  totalVehicles :number = 0;
  totalCoins :number = 0;

  constructor(private simulationService: SimulationService, private router: Router) { }

   async ngOnInit(): Promise<void> {
    this.token = localStorage.getItem('token');
    this.isAuthenticated = !!this.token;
    await this.getVehicles();
    debugger
    this.totalVehicles = this.cargoVehicles.length;
    this.totalCoins =  await this.getCoins();
  }

  async startSim() {
    this.token = localStorage.getItem('token');
    try {
      let response = await this.simulationService.start_simulation(this.token).toPromise();
      console.log('Response Status:', response.status);

      if (response.status == 200) {
        this.simStarting = true;
        setTimeout(() => {
          this.simStarted = true;
        }, 1500);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getVehicles(){
    this.token = localStorage.getItem('token');
    try{
      for(let i = 1; i < 100; i++){
        let response = await this.simulationService.get_cargo_transporter(this.token, i);
        console.log(response);
        if(response != null){
            this.cargoVehicles.push(response);
        }else{
          break;
        }
        
      }
      
    }
    catch(err){
      console.log(err);
      
    }
  }

  async viewDetails(id: number){
    this.token = localStorage.getItem('token');
    try{
      // let response = await this.simulationService.
    }catch(err){
      console.log(err);
      
    }
  }

  async getCoins(){
    this.token = localStorage.getItem('token');
    try{
      let response = await this.simulationService.get_coins(this.token);
      console.log(response);
      return response;
    }catch(err){
      console.log(err);
      
    }
  }
  redirectLogin(){
    this.router.navigate(['/login']);
  }

   getNextId(arr: CargoResponse[]): number {
    if (arr.length === 0) {
        return 1; 
    }

    const maxId = arr.reduce((max, cargo) => {
        return cargo.id > max ? cargo.id : max;
    }, arr[0].id);

    return maxId + 1;
}

  async buyCargo(){
    debugger
    if(this.totalCoins > 1000){
      let id: number = this.getNextId(this.cargoVehicles);
      this.token = localStorage.getItem('token');
    try{
      let response = await this.simulationService.buy_cargo_transporter(this.token,id);
      console.log(response);
      setTimeout(()=>{
        alert("Cargo buyed");
      },1500)
      return response;
    }catch(err){
      console.log(err);
      
    }
    }else{
      alert("Insuficient funds")
    }
  }
}
