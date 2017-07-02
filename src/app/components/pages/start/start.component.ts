import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/firebase/user.service';

@Component({
    selector: 'app-start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

    constructor(public userService: UserService) {
    }

    ngOnInit() {
    }

}
