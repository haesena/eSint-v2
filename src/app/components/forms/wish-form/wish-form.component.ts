import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Wish} from '../../../models/wish';
import {Location} from '@angular/common';

@Component({
    selector: 'app-wish-form',
    templateUrl: './wish-form.component.html',
    styleUrls: ['./wish-form.component.css']
})
export class WishFormComponent implements OnInit {
    @Input() wish: Wish = null;
    @Input() readOnly = true;
    @Output() saveEvent: EventEmitter<any> = new EventEmitter();

    constructor(private loc: Location) {
        if (this.wish == null) {
            this.wish = new Wish();
        }
    }

    ngOnInit() {
        this.readOnly = this.saveEvent.observers.length === 0;
    }

    save() {
        if (this.wish.linkURL && this.wish.linkURL.length > 0 && !this.wish.linkURL.startsWith('http')) {
            this.wish.linkURL = 'http://' + this.wish.linkURL;
        }
        this.saveEvent.emit(this.wish);
    }

    cancel() {
        this.loc.back();
    }
}
