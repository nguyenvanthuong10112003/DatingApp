import { Component, Input } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Photo } from 'src/app/_models/Photo';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { enviroment } from 'src/environments/environtment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent {
  @Input() member!: Member;

  uploader!: FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = enviroment.apiUrl;
  user!: User;

  constructor(private accountService: AccountService, private memberService: MembersService) {
    this.accountService.currentUser$.pipe()
      .subscribe(user =>
        this.user = user
      );
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropzoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 2024 * 2024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response)
        if (photo.isMain) {
          this.configWhenChangeMainPhoto(photo)
        }
        this.member.photos.push(photo)
      }
    }
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe(
      () => {
        this.member.photos = this.member.photos.filter(item => item.id !== photoId);
      }
    )
  }

  setMainPhoto(photo: Photo) {{
    this.memberService.setMainPhoto(photo.id).subscribe(
      () => {
        this.configWhenChangeMainPhoto(photo)
        this.member.photos.forEach(p => {
          if (p.isMain) p.isMain = false;
          if (p.id === photo.id) p.isMain = true;
        })
      }
    )
  }}

  configWhenChangeMainPhoto(photo: Photo) {
    this.user.photoUrl = photo.url;
    this.accountService.setCurrentUser(this.user);
    this.member.photoUrl = photo.url;
  }
}
