import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Orders } from '../../Interfaces/orders';
import { SimulationService } from '../../Services/simulation.service';
import { Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'] 
})
export class OrdersComponent implements OnInit {
  ordersList: Orders[] = [];
  token: string | null = '';

  @Input() openOrders: boolean = false;
  constructor(private simulationService: SimulationService, private router: Router, private parent: HomeComponent) {
  }

  ngOnInit(): void {
    this.getOrders(); 
  }
  
  async getOrders(): Promise<void> {
    this.token = localStorage.getItem('token');
    try {
      this.ordersList = [];
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

  closeOrders() {
    this.parent.toggleOpenOrders();
    console.log(this.parent.openOrders);
    
  }

  async acceptOrder(id: number){
    this.token = localStorage.getItem('token');

    try{
      if(window.confirm('Do you want to accept this order?')){
        let response = await this.simulationService.post_accept(this.token,id);
        this.getOrders();
      }else{
        alert('Order rejected')
      }
    }
    catch(err){
      console.log(err);
    }
  }
}
