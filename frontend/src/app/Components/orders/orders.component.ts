import { Component, OnInit } from '@angular/core';
import { Orders } from '../../Interfaces/orders';
import { SimulationService } from '../../Services/simulation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'] 
})
export class OrdersComponent implements OnInit {
  ordersList: Orders[] = [];
  token: string | null = '';

  constructor(private simulationService: SimulationService, private router: Router) {
  }

  ngOnInit(): void {
    this.getOrders(); 
  }
  
  async getOrders(): Promise<void> {
    this.token = localStorage.getItem('token');
    try {
      this.ordersList = await this.simulationService.get_all_available(this.token);
    debugger

      console.log(this.ordersList);
      
    } catch (err) {
      console.log(err);
    }
  }

  async createOrders(){
    if(this.ordersList.length <= 50){
      this.token = localStorage.getItem('token');
      try{
        let response = await this.simulationService.post_create(this.token);
        this.ordersList = [];
        this.getOrders();
      }catch(err){
        console.log(err);
        
      }
    }else{
      alert("There's to many orders!");
    }
  }
}
