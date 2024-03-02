import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', {static: true}) 
  memberTabs!: TabsetComponent;
  member!: Member;
  galleyOptions!: NgxGalleryOptions[];
  galleyImages!: NgxGalleryImage[];
  activeTab!: TabDirective;
  messages: Message[] = [];
  constructor(private memberService: MembersService, private router: ActivatedRoute, private messageService: MessageService) {}
  
  ngOnInit(): void {
    this.router.data.subscribe(data => {        
      this.member = data["member"];
    })
    this.router.queryParamMap.subscribe(params => {
      try {
        this.selectTab(parseInt(params.get("tab") || "0"));      
      } catch {
        this.selectTab(0);
      }
    })
    this.galleyOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ]

    this.galleyImages = this.getImages()
  }

  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    if (this.member.photos && this.member.photos.length > 0)
      for (const photo of this.member.photos) {
        imageUrls.push({
          small: photo?.url,
          medium: photo?.url,
          big: photo?.url
        })
      }
    return imageUrls;
  }

  onTabActived(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === "Messages" && this.messages.length === 0) {
      this.loadMessages();      
    }
  }

  loadMessages() {
    this.messageService.getMessageThread(this.member.userName).subscribe(messages => {
      this.messages = messages;
    })
  }

  selectTab(tabId: number) {
    this.memberTabs!.tabs![tabId].active = true;
  }
}
