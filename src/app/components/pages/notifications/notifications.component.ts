import {Component, OnInit} from '@angular/core';
import {NotificationsService} from '../../../services/firebase/notifications.service';
import {UserService} from '../../../services/firebase/user.service';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

    public notifications = [];
    public deleting = false;

    constructor(private nService: NotificationsService, private uService: UserService) {
    }

    ngOnInit() {
        this.nService.getMyNotifications().subscribe(nList => {
            this.notifications = nList.sort((a, b) => (a.time < b.time) ? 1 : -1);
        });

        this.uService.user$.update({notificationCount: 0});
    }

    markAsread(notification) {
        this.nService.markAsRead(notification.$key);
    }

    deleteAll() {
        this.nService.deleteAllNotifications();
        this.deleting = false;
    }

    delete(notification) {
        this.nService.deleteNotification(notification.$key);
    }
}
