import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Wish} from '../../../models/wish';

@Component({
    selector: 'app-wish-display',
    templateUrl: './wish-display.component.html',
    styleUrls: ['./wish-display.component.css']
})
export class WishDisplayComponent implements OnInit {

    @Input() wish: Wish = null;
    @Input() myWish = false;
    @Output() deleteEvent: EventEmitter<any> = new EventEmitter();

    constructor() {
        if (this.wish == null) {
            this.wish = new Wish();
        }
    }

    ngOnInit() {
    }

    deleteWish() {
        if (this.myWish) {
            this.deleteEvent.emit(this.wish);
        }
    }

}
