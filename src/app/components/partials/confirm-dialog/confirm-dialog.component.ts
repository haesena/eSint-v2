import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {DOCUMENT} from '@angular/common';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

    public confirmMessage: string[];

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, @Inject(DOCUMENT) private document: any) {
    }

    ngOnInit() {
        this.confirmMessage = this.data.confirmMessage;
    }

}
