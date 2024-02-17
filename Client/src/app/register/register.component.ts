import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../_models/user';
import { AppComponent } from '../app.component';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  
})
export class RegisterComponent implements OnInit {
  @Output()
  cancelRegister = new EventEmitter()

  registerForm!: FormGroup;
  maxDate!: Date;
  validationErrors!: string[];

  constructor(private accountService: AccountService, 
              private toastr: ToastrService,
              private fb: FormBuilder,
              private memberService: MembersService) {
  }

  ngOnInit(): void {
    this.intitializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  intitializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', 
        [
          Validators.required, 
          Validators.minLength(4), 
          Validators.maxLength(8)
        ]
      ],
      confirmPassword: ['', 
        [
          Validators.required,
          this.matchValues('password')
        ]
      ]
    })
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      var ctrls = (control?.parent?.controls as 
        {[key: string]: AbstractControl}    
      )
      return (control?.value === 
        (ctrls ? ctrls[matchTo]?.value : null))
        ? null : { isMatching: true };
    }
  }

  register() {
    this.accountService.register(this.registerForm.value).subscribe(
      response => {
        console.log(response)
        this.toastr.success('Register success.')
        this.cancel()     
      }, error => {
        this.validationErrors = error
      }
    )
  }
  cancel() {
    this.cancelRegister.emit(false)
  }
 }
