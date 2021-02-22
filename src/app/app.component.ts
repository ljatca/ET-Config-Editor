import { Component } from '@angular/core';
import uiconfig from '../assets/UIConfig.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'UIConfigPOC';
  public data: any;
  constructor() { 
    this.data = uiconfig;
  }
}

