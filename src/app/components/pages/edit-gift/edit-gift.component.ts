import {Component, OnInit} from '@angular/core';
import {GiftsService} from '../../../services/firebase/gifts.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';

@Component({
    selector: 'app-edit-gift',
    templateUrl: './edit-gift.component.html',
    styleUrls: ['./edit-gift.component.css']
})
export class EditGiftComponent implements OnInit {

    public gift;

    constructor(private gService: GiftsService, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(
            (p: ParamMap) => {
                if (p.get('gid') === 'new') {
                    this.gift = {};
                } else {
                    this.gService.getGift(p.get('gid')).subscribe(g => {
                        this.gift = g;
                    });
                }
            }
        )
    }

    saveGift(gift) {
        this.gService.saveGift(gift);
        this.router.navigate(['my-gifts']);
    }

}
