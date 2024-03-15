import { Component } from '@angular/core';
import { Message } from '../_models/message';
import { MessageService } from '../_services/message.service';
import { Pagination } from '../_models/pagination';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
  messages!: Message[];
  pagination = {} as Pagination;
  container = "Unread";
  pageNumber = 1;
  pageSize = 5;
  loading = false;
  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.pagination.currentPage = 1;
    this.loadMessages();  
  }

  loadMessages() {
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe(response => {
        this.messages = response.result
        this.pagination = response.pagination
        this.loading = false;
      })
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadMessages();
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe(() => {
      this.loadMessages()
    })
  }
}
