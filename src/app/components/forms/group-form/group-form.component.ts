import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Group} from '../../../models/group';
import {Location} from '@angular/common';

@Component({
    selector: 'app-group-form',
    templateUrl: './group-form.component.html',
    styleUrls: ['./group-form.component.css']
})
export class GroupFormComponent implements OnInit {
    @Input() group: Group = null;
    @Output() saveEvent: EventEmitter<any> = new EventEmitter();

    constructor(private loc: Location) {
    }

    ngOnInit() {
        if (this.group == null) {
            this.group = new Group();
        }
    }

    save() {
        this.saveEvent.emit(this.group);
    }

    cancel() {
        this.loc.back();
    }
}
