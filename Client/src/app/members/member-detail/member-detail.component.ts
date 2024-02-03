import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  member!: Member;
  galleyOptions!: NgxGalleryOptions[];
  galleyImages!: NgxGalleryImage[];
  constructor(private memberService: MembersService, private router: ActivatedRoute) {}
  ngOnInit(): void {
    this.loadMember()      

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

  loadMember() {
    this.memberService
      .getMember(
        this.router.snapshot.paramMap.get('username')!
      )
      .subscribe(member => {
        this.member = member;
        this.galleyImages = this.getImages()
      })
  }
}
