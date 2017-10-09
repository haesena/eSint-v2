import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-gift-display',
    templateUrl: './gift-display.component.html',
    styleUrls: ['./gift-display.component.css']
})
export class GiftDisplayComponent implements OnInit {

    @Input() gift = null;
    @Output() deleteEvent: EventEmitter<any> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    deleteGift() {
        this.deleteEvent.emit(this.gift);
    }
}
