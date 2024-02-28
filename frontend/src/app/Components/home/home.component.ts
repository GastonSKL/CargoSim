import { trigger, state, style, animate, transition } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { SimulationService } from '../../Services/simulation.service';
import { HttpResponse } from '@angular/common/http';
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

  constructor(private simulationService: SimulationService, private router: Router) { }

  ngOnInit(): void {
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
}
