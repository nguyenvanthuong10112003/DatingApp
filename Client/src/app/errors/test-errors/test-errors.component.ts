import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { enviroment } from 'src/environments/environtment';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css']
})
export class TestErrorsComponent implements OnInit {
  validationErrors: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
  }

  get400Error() {
    this.http.get(enviroment.apiUrl + 'buggy/bad-request').subscribe(
      response => {
        console.log(response)
      }, error => {
        console.log(error)
      }
    )    
  }

  get400ValidationError() {
    this.http.post(enviroment.apiUrl + 'account/register', {}).subscribe(
      response => {
        console.log(response)
      }, error => {
        console.log(error)
        this.validationErrors = error
      }
    )   
  }

  get401Error() {
    this.http.get(enviroment.apiUrl + 'buggy/auth').subscribe(
      response => {
        console.log(response)
      }, error => {
        console.log(error)
      }
    )   
  }

  get404Error() {
    this.http.get(enviroment.apiUrl + 'buggy/not-found').subscribe(
      response => {
        console.log(response)
      }, error => {
        console.log(error)
      }
    )   
  }

  get500Error() {
    this.http.get(enviroment.apiUrl + 'buggy/server-error').subscribe(
      response => {
        console.log(response)
      }, error => {
        console.log(error)
      }
    )   
  }
}
