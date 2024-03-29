import { Component } from '@angular/core';
import { Message } from '../_models/message';
import { MessageService } from '../_services/message.service';
import { Pagination } from '../_models/pagination';
import { ConfirmService } from '../_services/confirm.service';

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
  constructor(private messageService: MessageService, private cofirmService: ConfirmService) {}

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
    this.cofirmService.confirm('Confirm delete message', 'This can\'t be undone')
      .subscribe((result) => {
        if (result === true) {
          this.messageService.deleteMessage(id).subscribe(() => {
            this.messages.splice(this.messages.findIndex(item => item.id === id), 1)
          })
        }
      })
  }

  changeContainer() {
    this.pageNumber = 1;
    this.pagination.currentPage = 1;
    this.loadMessages();
  }
}
