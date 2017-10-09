import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Location} from '@angular/common';
import {GroupsService} from '../../../services/firebase/groups.service';
import {Configuration} from '../../../configuration';
import {User} from '../../../models/user';

@Component({
    selector: 'app-gift-form',
    templateUrl: './gift-form.component.html',
    styleUrls: ['./gift-form.component.css']
})
export class GiftFormComponent implements OnInit {
    @Input() gift = null;
    @Output() saveEvent: EventEmitter<any> = new EventEmitter();
    public users;

    constructor(private loc: Location, private gService: GroupsService, private config: Configuration) {
        if (this.gift == null) {
            this.gift = {};
        }
    }

    ngOnInit() {
        this.gService.getGroupUsers(this.config.activeGroup).subscribe((uList: User[]) => {
            this.users = uList;
        });
    }

    save() {
        if(this.gift.user == null) {
            return;
        }
        this.saveEvent.emit(this.gift);
    }

    cancel() {
        this.loc.back();
    }
}
