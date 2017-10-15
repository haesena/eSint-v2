import {Component, OnInit} from '@angular/core';
import {GiftsService} from '../../../services/firebase/gifts.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Configuration} from '../../../configuration';

@Component({
    selector: 'app-edit-gift',
    templateUrl: './edit-gift.component.html',
    styleUrls: ['./edit-gift.component.css']
})
export class EditGiftComponent implements OnInit {

    public gift;

    constructor(private gService: GiftsService, private route: ActivatedRoute, private router: Router, private config: Configuration) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(
            (p: ParamMap) => {
                if (p.get('gid') === 'new') {
                    this.gift = {};
                    this.config.pageTitle = 'New Gift';
                } else {
                    this.gService.getGift(p.get('gid')).subscribe(g => {
                        this.gift = g;
                    });
                    this.config.pageTitle = 'Edit Gift';
                }
            }
        )
    }

    saveGift(gift) {
        this.gService.saveGift(gift);
        this.router.navigate(['my-gifts']);
    }

}
