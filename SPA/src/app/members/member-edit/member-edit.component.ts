import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {
  @ViewChild("editForm") editForm: NgForm | undefined;
  @HostListener("window:beforeunload", ["$event"]) unloadNotification($event: any){
    if(this.editForm?.dirty){
      $event.returnValue = true;
    }
  }
  member: Member | undefined
  user: User | null = null;
  images: GalleryItem[] = [];

  constructor(private accountService: AccountService,private membersService: MembersService,
    private toastr: ToastrService){
      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next: user => this.user = user
      })
    }
  ngOnInit(): void {
    this.loadMember();
  }
  updateMember() {
    this.membersService.updateMember(this.editForm?.value).subscribe({
      next: () =>{
        this.toastr.success("Se ha actualizado tu perfil");
        this.editForm?.reset(this.member);
      }
    });
  }

  loadMember(){
    if(!this.user) return;
    this.membersService.getMember(this.user.username).subscribe({
      next: member => this.member = member
    })

  }
  getImages() {
    if(!this.member) return;
    for (const photo of this.member?.photos){
      this.images.push(new ImageItem({src: photo.url, thumb:photo.url}))
    }
  }
}