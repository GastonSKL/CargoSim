import { Component, Input, inject } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { SimulationService } from '../../Services/simulation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(300)),
    ])
  ]
})
export class NavbarComponent {

  @Input() isStarted: boolean = false;
  token: string | null = '';
  constructor(private simulationService :SimulationService, private router:Router) {}

  async logOut(){
    this.token = localStorage.getItem('token');
    try {
      let response = await this.simulationService.stop_simulation(this.token).toPromise();
      console.log('Response Status:', response.status);

      if (response.status == 200) {
        this.isStarted = false;
        setTimeout(() => {
          this.isStarted = false;
          localStorage.clear();
          this.router.navigate(['/login'])
          location.reload();
        }, 1500);
      }
    } catch (err) {
      console.log(err);
    }
  }


}
