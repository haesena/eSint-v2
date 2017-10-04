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
        // this.readOnly = this.saveEvent.observers.length === 0;
        console.log(this.saveEvent.observers);
    }

    save() {
        this.saveEvent.emit(this.wish);
    }

    cancel() {
        this.loc.back();
    }

}
