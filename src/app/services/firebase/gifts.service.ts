import {Injectable} from '@angular/core';
import {Configuration} from '../../configuration';
import {AngularFireDatabase} from 'angularfire2/database';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class GiftsService {

    constructor(private db: AngularFireDatabase, private config: Configuration) {
    }

    getMyGiftIds() {
        return this.db.list('gifts/' + this.config.activeGroup + '/' + this.config.userId);
    }

    getMyGifts() {
        const gifts$ = new ReplaySubject();
        this.db.list('gifts/' + this.config.activeGroup + '/' + this.config.userId).subscribe(gList => {
            const gifts = [];
            gList.forEach(g => {
                this.db.object('users/' + g.user).subscribe(u => {
                    g['user'] = u;
                });
                if (g.wish) {
                    this.db.object('wishlists/' + this.config.activeGroup + '/' + g.user + '/wishes/' + g.wish).subscribe(w => {
                        g['name'] = w.name;
                    });
                }
                gifts.push(g);
            });
            gifts$.next(gifts);
        });
        return gifts$;
    }

}
