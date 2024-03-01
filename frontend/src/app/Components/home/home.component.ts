import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { SimulationService } from '../../Services/simulation.service';
import { CargoResponse } from '../../Interfaces/cargo-response';
import { Router } from '@angular/router';
import { Orders } from '../../Interfaces/orders';

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
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
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
  ordersList: Orders[] = [];
  acceptedOrdersList: Orders[] = [];
  intervalId: number | null = null;

  constructor(
    private simulationService: SimulationService,
    private router: Router
  ) {
    this.sim = null;
  }

  async ngOnInit(): Promise<void> {
    this.token = localStorage.getItem('token');
    this.isAuthenticated = !!this.token;
    if(this.isAuthenticated){
      await this.simulation();

      this.intervalId = setInterval(() => {
        this.simulation();
      }, 1000) as any; // Explicitly cast to any to avoid TypeScript error
    }
}

ngOnDestroy(): void {
    if (this.intervalId !== null) {
        clearInterval(this.intervalId);
        
    }
}

  @ViewChild('sim', { static: false }) sim: ElementRef | null;

  ngAfterViewInit() {
    
      console.log('sim is rendered');
  }

  async refreshList() {
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
          this.simStarted = true;
        
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getVehicles() {
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
    this.token = localStorage.getItem('token');
    try {
      let response = await this.simulationService.get_coins(this.token);
      return response;
    } catch (err) {
      console.log(err);
    }
  }
  redirectLogin() {
    this.router.navigate(['']);
  }

  async buyCargo() {
    if (this.totalCoins >= 1000) {
      const userInput = '1';
      if (userInput === null || userInput.trim() === '') {
        return;
      }
      const userNumber = parseFloat(userInput);
      if (!isNaN(userNumber)) {
        this.locationId = userNumber;
      } else {
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
        return response;
      } catch (err) {
        console.log(err);
      }
    } else {
      alert('Insuficient funds');
    }
  }

  async getOrders(): Promise<void> {
    this.token = localStorage.getItem('token');
    try {
      this.ordersList = [];
      this.ordersList = await this.simulationService.get_all_available(
        this.token
      );
    } catch (err) {
      console.log(err);
    }
  }

  async createOrders() {
    if (this.ordersList.length <= 50) {
      this.token = localStorage.getItem('token');
      try {
        await this.simulationService.post_create(this.token);
        this.ordersList = [];
        this.getOrders();
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("There's to many orders!");
    }
  }

  async acceptOrder(id: number | undefined) {
    this.token = localStorage.getItem('token');
    try {
        let response = await this.simulationService.post_accept(this.token, id);
        await this.getOrders();
        await this.getAllAccepted();
    } catch (err) {
      console.log(err);
    }
  }

  async getAllAccepted(): Promise<void> {
    this.token = localStorage.getItem('token');
    try {
      this.acceptedOrdersList = [];
      this.acceptedOrdersList = await this.simulationService.get_all_accepted(
        this.token
      );
    } catch (err) {
      console.log(err);
    }
  }

  async moveCargo(id:number, targetNodeId: number){
    this.token = localStorage.getItem('token');
    try{
      if(this.totalCoins - 7 >= 7){
        await this.simulationService.move_cargo_transporter(this.token, id, targetNodeId);
        this.totalCoins = await this.getCoins();
        await this.getAllAccepted();
      }
    }catch(err){
      console.log(err);
      
    }
  }

  toggleOpenOrders() {
    this.openOrders = !this.openOrders;
  }

  async simulation() {
    debugger
    this.token = localStorage.getItem('token');
    if(!this.simStarted) await this.startSim();
    await this.getVehicles();
    await this.getAllAccepted();
    this.totalVehicles = this.cargoVehicles.length;
    this.totalCoins = await this.getCoins();
    await this.getOrders();

    if(this.totalCoins > 1500){
      await this.buyCargo();
    }

    if(this.ordersList.length == 0){
      await this.createOrders();
    }

    if(this.cargoVehicles.length === 0){
      await this.buyCargo();
    }
    await this.getVehicles();

    if(this.acceptedOrdersList.length == 0){
      for(let i = 0; i < this.cargoVehicles.length ; i++){
        await this.acceptOrder(this.ordersList[i].id)
      }
    }
    // await this.getAllAccepted();

    if(this.acceptedOrdersList.length !== 0 && this.cargoVehicles.length !== 0){
      // const loopLength = Math.min(this.cargoVehicles.length, this.acceptedOrdersList.length);
      for(let i = 0; i < this.cargoVehicles.length ; i++){
          if(this.cargoVehicles[i].load === 0 && !this.cargoVehicles[i].inTransit)
          {
              await this.moveCargo(this.cargoVehicles[i].id, this.acceptedOrdersList[i].originNodeId);
              localStorage.setItem('cargo:' + this.cargoVehicles[i].id, this.acceptedOrdersList[i].targetNodeId.toString());
          } 
          else if(this.cargoVehicles[i].load !== 0 && !this.cargoVehicles[i].inTransit)
          {
              if(localStorage.getItem('cargo:' + this.cargoVehicles[i].id))
              {
                  await this.moveCargo(this.cargoVehicles[i].id, this.acceptedOrdersList[i].targetNodeId);
                  localStorage.removeItem('cargo:' + this.cargoVehicles[i].id);
              }
          }
      }
    }

  await this.getVehicles();
  

  }
}
