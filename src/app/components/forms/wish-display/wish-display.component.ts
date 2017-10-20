import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Wish} from '../../../models/wish';
import {EditHistoryComponent} from '../../partials/edit-history/edit-history.component';
import {MatDialog} from '@angular/material';

@Component({
    selector: 'app-wish-display',
    templateUrl: './wish-display.component.html',
    styleUrls: ['./wish-display.component.css']
})
export class WishDisplayComponent implements OnInit {

    @Input() wish: Wish = null;
    @Input() myWish = false;
    @Input() canDelete = false;
    @Input() history = null;
    @Output() deleteEvent: EventEmitter<any> = new EventEmitter();
    @Output() takeEvent: EventEmitter<any> = new EventEmitter();

    constructor(public dialog: MatDialog) {
        if (this.wish == null) {
            this.wish = new Wish();
        }
    }

    ngOnInit() {
    }

    deleteWish() {
        this.deleteEvent.emit(this.wish);
    }

    takeWish() {
        this.takeEvent.emit(this.wish);
    }

    showHistory(history) {
        history.push()
        const dialogRef = this.dialog.open(EditHistoryComponent, {
            data: {
                editHistory: history,
                currentWish: this.wish
            },
            width: '80vw'
        });
    }
}
