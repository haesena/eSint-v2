import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-gift-display',
    templateUrl: './gift-display.component.html',
    styleUrls: ['./gift-display.component.css']
})
export class GiftDisplayComponent implements OnInit {

    @Input() gift = null;

    constructor() {
    }

    ngOnInit() {
    }

}
