import {Component, OnInit} from '@angular/core';
import {NotificationsService} from '../../../services/firebase/notifications.service';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

    public notifications = [];

    constructor(private nService: NotificationsService) {
    }

    ngOnInit() {
        this.nService.getMyNotifications().subscribe(nList => {
            this.notifications = nList;
        });
    }

    markAsread(notification) {
        this.nService.markAsRead(notification.$key);
    }

}
