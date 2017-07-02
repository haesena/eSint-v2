import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/firebase/user.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    constructor(public userS: UserService) {
    }

    ngOnInit() {
    }

}
