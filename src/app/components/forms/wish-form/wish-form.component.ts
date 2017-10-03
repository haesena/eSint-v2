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
    @Output() saveEvent: EventEmitter<any> = new EventEmitter();
    public readOnly: boolean;

    constructor(private loc: Location) {
        if (this.wish == null) {
            this.wish = new Wish();
        }

        this.readOnly = this.saveEvent.observers.length === 0;
        console.log(this.readOnly);
    }

    ngOnInit() {
    }

    save() {
        this.saveEvent.emit(this.wish);
    }

    cancel() {
        this.loc.back();
    }

}
