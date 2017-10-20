import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {DOCUMENT} from '@angular/common';

@Component({
    selector: 'app-edit-history',
    templateUrl: './edit-history.component.html',
    styleUrls: ['./edit-history.component.css']
})
export class EditHistoryComponent implements OnInit {

    public editHistory = [];
    public currentWish = null;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, @Inject(DOCUMENT) private document: any) {
    }

    ngOnInit() {
        this.editHistory = this.data.editHistory.sort((a, b) => (a.timestamp < b.timestamp) ? 1 : -1);
        this.currentWish = this.data.currentWish;
    }

}
