import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-notification-display',
    templateUrl: './notification-display.component.html',
    styleUrls: ['./notification-display.component.css']
})
export class NotificationDisplayComponent implements OnInit {

    @Input() notification = null;
    @Input() canDelete = false;
    @Output() markAsReadEvent: EventEmitter<any> = new EventEmitter();
    @Output() deleteEvent: EventEmitter<any> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    markAsRead() {
        this.markAsReadEvent.emit(this.notification);
    }

    delete() {
        this.deleteEvent.emit(this.notification);
    }

}
