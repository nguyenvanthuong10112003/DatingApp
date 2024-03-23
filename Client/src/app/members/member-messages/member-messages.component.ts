import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { take } from 'rxjs';
import { Message } from 'src/app/_models/message';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent {
  @ViewChild('scrollMe')
  scroll!: ElementRef
  @ViewChild('messageForm') 
  messageForm!: NgForm;
  @Input()
  username!: string;
  messageContent!: string;
  @Input()
  photoOtherUrl!: string;
  onOtherInput: boolean = false;
  alertNewMessage: boolean = false;

  constructor(public messageService: MessageService) {
    this.scrollToBottom()
  }

  ngOnInit(): void {
  }

  scrollToBottom() {
    try {
      this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
      if (this.alertNewMessage)
        this.alertNewMessage = false
    } catch {
    }
  }

  sendMessage() {
    this.messageService
      .sendMessage(this.username, this.messageContent)
      .then(() => {
        this.messageForm.reset()
      })
  }

  onHasNewMessage() {
    if (this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight) 
      return;

    this.alertNewMessage = true;
  }

  subTime() {
    return new Date(Date()).getTime() - this.messageService.otherTimeSending.getTime();
  }
}
