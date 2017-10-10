import {Component, OnInit} from '@angular/core';
import {GiftsService} from '../../../services/firebase/gifts.service';

@Component({
    selector: 'app-my-gifts',
    templateUrl: './my-gifts.component.html',
    styleUrls: ['./my-gifts.component.css']
})
export class MyGiftsComponent implements OnInit {

    public gifts;

    constructor(private gService: GiftsService) {
    }

    ngOnInit() {
        this.gService.getMyGifts().subscribe(gList => {
            this.gifts = gList;
        });
    }

    deleteGift(gift) {
        this.gService.deleteGift(gift);
    }

}
