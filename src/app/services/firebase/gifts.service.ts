import {Injectable} from '@angular/core';
import {Configuration} from '../../configuration';
import {AngularFireDatabase} from 'angularfire2/database';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class GiftsService {

    constructor(private db: AngularFireDatabase, private config: Configuration) {
    }

    getMyGifts() {
        const gifts$ = new ReplaySubject();
        this.db.list('gifts/' + this.config.activeGroup + '/' + this.config.userId).subscribe(gList => {
            const gifts = [];
            gList.forEach(g => {
                const gift = {};
                this.db.object('users/' + g.user).subscribe(u => {
                    gift['user'] = u;
                });
                this.db.object('wishlists/' + this.config.activeGroup + '/' + g.user + '/wishes/' + g.wish).subscribe(w => {
                    gift['wish'] = w;
                });
                gifts.push(gift);
            });
            gifts$.next(gifts);
        });
        return gifts$;
    }

}
