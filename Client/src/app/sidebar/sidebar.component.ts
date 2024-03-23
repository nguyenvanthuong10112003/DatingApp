import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Output() 
  logout = new EventEmitter();
  @Input() 
  onSideBar: boolean = false
  constructor(public accountService: AccountService) {}
  ngOnInit(): void {   
  }

  logoutAccount() {
    this.logout.emit()
  }
}
