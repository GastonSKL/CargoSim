import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
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
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition('void <=> *', animate(300)),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  simStarted: boolean = false;
  simStarting: boolean = false;
  token: string | null = '';
  cargoVehicles: CargoResponse[] = [];
  isAuthenticated: boolean = false;
  totalVehicles: number = 0;
  totalCoins: number = 0;
  openOrders: boolean = false;
  cargosIds: number[] = [];
  locationId: number = 1;

  constructor(
    private simulationService: SimulationService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.token = localStorage.getItem('token');
    this.isAuthenticated = !!this.token;
    await this.getVehicles();
    this.totalVehicles = this.cargoVehicles.length;
    this.totalCoins = await this.getCoins();
  }

  async refreshList(){
    await this.getVehicles();
    this.totalCoins = await this.getCoins();
  }

  async startSim() {
    this.token = localStorage.getItem('token');
    try {
      let response = await this.simulationService
        .start_simulation(this.token)
        .toPromise();
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

  async getVehicles() {
    debugger;
    this.token = localStorage.getItem('token');
    this.cargoVehicles = [];
    this.cargosIds = [];
    const cargosIdsString = localStorage.getItem('cargosIds');
    if (cargosIdsString !== null) {
      this.cargosIds = JSON.parse(cargosIdsString);
    }

    try {
      for (let i = 0; i < this.cargosIds.length; i++) {
        let response = await this.simulationService.get_cargo_transporter(
          this.token,
          this.cargosIds[i]
        );
        if (response != null) {
          this.cargoVehicles.push(response);
        } else {
          break;
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async viewDetails(id: number) {
    this.token = localStorage.getItem('token');
    try {
      // let response = await this.simulationService.
    } catch (err) {
      console.log(err);
    }
  }

  async getCoins() {
    debugger
    this.token = localStorage.getItem('token');
    try {
      let response = await this.simulationService.get_coins(this.token);
      return response;
    } catch (err) {
      console.log(err);
    }
  }
  redirectLogin() {
    this.router.navigate(['/login']);
  }

  async buyCargo() {
    debugger;
    if (this.totalCoins >= 1000) {
      const userInput = prompt('Please enter a location id:');
      if (userInput === null || userInput.trim() === '') {
        console.log('User cancelled or did not enter a location id.');
        return;
      }
      const userNumber = parseFloat(userInput);
      if (!isNaN(userNumber)) {
        console.log('User entered number:', userNumber);
        this.locationId = userNumber;
      } else {
        console.log('Invalid input. Please enter a valid location id.');
      }

      this.token = localStorage.getItem('token');
      try {
        let response = await this.simulationService.buy_cargo_transporter(
          this.token,
          this.locationId
        );

        this.cargosIds.push(response);
        localStorage.removeItem('cargosIds');
        localStorage.setItem('cargosIds', JSON.stringify(this.cargosIds));
        this.totalCoins = await this.getCoins();
        setTimeout(() => {
          alert('Cargo buyed');
          this.getVehicles();
        }, 1500);
        return response;
      } catch (err) {
        console.log(err);
      }
    } else {
      alert('Insuficient funds');
    }
  }

  toggleOpenOrders() {
    this.openOrders = !this.openOrders;
  }
}
