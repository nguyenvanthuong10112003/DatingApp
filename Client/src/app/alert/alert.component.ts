import { Component, Input, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit {
  @Input()
  model: any 

  constructor() {}

  ngOnInit(): void {
  }

  hide() {
    this.model.isShow = false;
  }

  whenAccept() {
    if (this.model.accept && typeof(this.model.accept) == typeof(function () {})) {
      this.model.accept()
      this.model.accept = () => {}
    }
    this.hide()
  }
}
