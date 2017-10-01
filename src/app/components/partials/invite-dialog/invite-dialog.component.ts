import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA} from '@angular/material';
import {DOCUMENT} from '@angular/common';

@Component({
    selector: 'app-invite-dialog',
    templateUrl: './invite-dialog.component.html',
    styleUrls: ['./invite-dialog.component.css']
})
export class InviteDialogComponent implements OnInit {

    public link: string;

    constructor(@Inject(MD_DIALOG_DATA) public data: any, @Inject(DOCUMENT) private document: any) {
    }

    ngOnInit() {
        this.link = this.document.location.origin + '/invite/' + this.data.invite;
    }

}
