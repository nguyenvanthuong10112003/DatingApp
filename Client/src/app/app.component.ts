import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppResponsive } from '../assets/AppResponsive';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  urlAPI = 'https://localhost:7091/';
  title = 'Client';
  res: any;
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.getUsers();
  }
  getUsers() {
    this.http.get(this.urlAPI + 'api/user/all').subscribe(
      response =>
      {
        this.res = response
      }, error => console.log(error)
      )
  }
}
