const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.wishInserted = functions.database.ref('/wishlists/{gid}/{uid}/wishes/{wid}').onCreate(event => {

    const gid = event.params.gid;
    const uid = event.params.uid;
    let userWhoInserted = uid;

    const wish = event.data.val();

    if(wish.userId != null) {
        userWhoInserted = wish.userId;
    }

    return notifyWishEvent(gid, uid, userWhoInserted, 'insert', wish.name);

    // 'wishlists/-KvJNNzbBagFeATemS4J/jLTIgS9vSwM4c6sZLFs83DRCISj1/wishes/test', {params: {gid: '-KvJNNzbBagFeATemS4J', uid: 'jLTIgS9vSwM4c6sZLFs83DRCISj1', wid: 'test'}}
});

exports.wishChanged = functions.database.ref('/wishlists/{gid}/{uid}/wishes/{wid}').onUpdate(event => {

    const gid = event.params.gid;
    const uid = event.params.uid;
    const wid = event.params.wid;
    let userWhoInserted = uid;

    const wish = event.data.val();
    const wishBefore = event.data.previous.val();

    const d = new Date();

    wishBefore.timestamp = d.toISOString();

    if(wish.userId != null) {
        userWhoInserted = wish.userId;
    }

    return admin.database().ref('/wishlists/' + gid + '/' + uid + '/wishHistory/' + wid)
        .push(wishBefore)
        .then(() => notifyWishEvent(gid, uid, userWhoInserted, 'update', wish.name));

    // 'wishlists/-KvJNNzbBagFeATemS4J/jLTIgS9vSwM4c6sZLFs83DRCISj1/wishes/test', {params: {gid: '-KvJNNzbBagFeATemS4J', uid: 'jLTIgS9vSwM4c6sZLFs83DRCISj1', wid: 'test'}}
});

function notifyWishEvent(groupId, wishlistID, refUserId, action, wishName) {

    let titleMsg = '';
    if (action === 'insert')  {
        titleMsg =  'New wish'
    } else if (action === 'update') {
        titleMsg = 'Wish updated';
    }

    const d = new Date();

    const groupPromise = admin.database().ref('groups/' + groupId).once("value");
    const userPromise = admin.database().ref('users/' + refUserId).once("value");

    return Promise.all([userPromise, groupPromise]).then((snapshots) => {
        const user = snapshots[0].val();
        const group = snapshots[1].val();

        let notification = {
            refUser: refUserId,
            seen: false,
            title: group.name + ' - ' + titleMsg,
            time: d.toISOString()
        };

        const subscribersPromise = admin.database().ref('wishlists/' + groupId + '/' + wishlistID + '/subscriptions').once("value");
        const collaboratorsPromise = admin.database().ref('wishlists/' + groupId + '/' + wishlistID + '/sharedWith').once("value");

        // .then(_subscriptions => {
        return Promise.all([subscribersPromise, collaboratorsPromise]).then((snapshots2) => {
            const subscriptions = snapshots2[0].val();
            const collaborators = snapshots2[1].val();

            // iterate over users who subscribed to this wishlist
            for (let u in subscriptions) {
                if (!subscriptions.hasOwnProperty(u)) continue;
                if (subscriptions[u] === true) {
                    // Write Notification
                    if (action === 'insert')  {
                        notification.msg = user.displayName + ' added a new wish: ' + wishName + '!';
                    } else if (action === 'update') {
                        notification.msg = user.displayName + ' updated a wish: ' + wishName + '!';
                    }
                    admin.database().ref('notifications/' + u).push(notification);
                }
            }

            // iterate over users who collaborate to this wishlist
            for (let u in collaborators) {
                if (!collaborators.hasOwnProperty(u)) continue;
                if (collaborators[u] === true && u !== refUserId) {
                    // Write Notification
                    if (action === 'insert')  {
                        notification.msg = user.displayName + ' added a new wish to your shared wishlist: ' + wishName + '!';
                    } else if (action === 'update') {
                        notification.msg = user.displayName + ' updated a wish in your shared wishlist: ' + wishName + '!';
                    }
                    admin.database().ref('notifications/' + u).push(notification);
                }
            }

            return true;
        }).then(() => {
            //  if the user who inserted the wish is not the owner of the wishlist, send a notification to the owner too
            if (refUserId !== wishlistID) {
                if (action === 'insert')  {
                    notification.msg = user.displayName + ' added a new wish to your shared wishlist: ' + wishName + '!';
                } else if (action === 'update') {
                    notification.msg = user.displayName + ' updated a wish in your shared wishlist: ' + wishName + '!';
                }
                admin.database().ref('notifications/' + wishlistID).push(notification);
            }
            return true;
        });
    });
}

exports.userJoinedGroup = functions.database.ref('/groups/{gid}/users/{uid}').onCreate(event => {

    const gid = event.params.gid;
    const uid = event.params.uid;

    const d = new Date();

    const groupPromise = admin.database().ref('groups/' + gid).once("value");
    const userPromise = admin.database().ref('users/' + uid).once("value");

    return Promise.all([userPromise, groupPromise]).then((snapshots) => {
        const user = snapshots[0].val();
        const group = snapshots[1].val();

        // iterate over users of this group
        return admin.database().ref('groups/' + gid + '/users').once("value").then(_groupUsers => {
            const groupUsers = _groupUsers.val();

            for (let u in groupUsers) {
                if (!groupUsers.hasOwnProperty(u) || u === uid) continue;

                admin.database().ref('notifications/' + u).push({
                    msg: user.displayName + ' joined the group ' + group.name + '!',
                    refUser: uid,
                    seen: false,
                    title: group.name + ' - New user',
                    time: d.toISOString()
                });
            }
        });
    });

    return Promise.all([userPromise, groupPromise]).then((snapshots) => {
        const user = snapshots[0].val();
        const group = snapshots[1].val();

        return admin.database().ref('wishlists/' + gid + '/' + uid + '/subscriptions').once("value").then(_subscriptions => {
            const subscriptions = _subscriptions.val();

            // iterate over users who subscribed to this wishlist
            for (let u in subscriptions) {
                if (!subscriptions.hasOwnProperty(u)) continue;
                if (subscriptions[u] === true) {
                    // Write Notification
                    admin.database().ref('notifications/' + u).push({
                        msg: user.displayName + ' added a new wish: ' + wish.name + '!',
                        refUser: uid,
                        seen: false,
                        title: group.name + ' - New wish',
                        time: d.toISOString()
                    });
                }
            }

            return true;
        });
    });

    // 'wishlists/-KvJNNzbBagFeATemS4J/jLTIgS9vSwM4c6sZLFs83DRCISj1/wishes/test', {params: {gid: '-KvJNNzbBagFeATemS4J', uid: 'jLTIgS9vSwM4c6sZLFs83DRCISj1', wid: 'test'}}
});


exports.wishDeleted = functions.database.ref('/wishlists/{groupId}/{userId}/wishes/{wishId}').onDelete(event => processWishDeleted(event));

function processWishDeleted(event) {

    const groupId = event.params.groupId;
    const userId = event.params.userId;
    const wishId = event.params.wishId;

    const wish = event.data.previous.val();

    return admin.database().ref('takenFlag/' + groupId + '/' + userId + '/' + wishId).once("value").then(function (t) {
        if (t.val() !== null) {
            return getUserWhoTookWish(groupId, wishId).then(function (userAndGift) {
                if (userAndGift === null) {
                    return false;
                }

                const userWhoTookIt = userAndGift[0];
                const giftId = userAndGift[1];

                return createNotificationForWishDeletion(userId, groupId, wish.name).then(notification => {

                    // update the gift, it no longer contains the reference to the wish, but the fields directly (as with manually added wishes)
                    const newGiftFields = {
                        user: userId,
                        name: wish.name,
                        deletedByUser: true
                    };

                    return admin.database().ref('gifts/' + groupId + '/' + userWhoTookIt + '/' + giftId).set(newGiftFields)
                        .then(() => {
                            // delete the taken-flag
                            admin.database().ref('takenFlag/' + groupId + '/' + userId + '/' + wishId).remove();

                            // insert notification
                            admin.database().ref('notifications/' + userWhoTookIt).push(notification);

                            return true;
                        });
                });
            });
        } else {
            return true;
        }
    });

    // 'wishlists/-KvJNNzbBagFeATemS4J/jLTIgS9vSwM4c6sZLFs83DRCISj1/wishes/-KwR2g-3_RVWA1SRZznH', {params: {groupId: '-KvJNNzbBagFeATemS4J', userId: 'jLTIgS9vSwM4c6sZLFs83DRCISj1', wishId: '-KwR2g-3_RVWA1SRZznH'}}

}

function createNotificationForWishDeletion(userId, groupId, wishName) {

    const d = new Date();

    const userPromise = admin.database().ref('users/' + userId).once("value");
    const groupPromise = admin.database().ref('groups/' + groupId).once("value");

    return Promise.all([userPromise, groupPromise]).then((snapshots) => {
        const user = snapshots[0].val();
        const group = snapshots[1].val();

        return {
            title: group.name + ' - Wish deleted',
            msg: user.displayName + ' deleted the wish "' + wishName + '". Hopefully you did not already buy the gift...',
            refUser: userId,
            seen: false,
            time: d.toISOString()
        };
    });
}

function getUserWhoTookWish(groupId, wishId) {
    return admin.database().ref('gifts/' + groupId).once("value").then(function (_data) {
        const data = _data.val();

        // go through all users
        for (let u in data) {
            if (!data.hasOwnProperty(u)) continue;

            // go through all gifts from this user
            for (let g in data[u]) {
                if (!data[u].hasOwnProperty(g)) continue;

                if (data[u][g]['wish'] === wishId) {
                    return [u, g];
                }
            }
        }

        return null;
    });
}

exports.fcmSend = functions.database.ref('/notifications/{uid}/{nid}').onCreate(function (event) {

    const notification = event.data.val();
    const userId = event.params.uid;
    const notificationId = event.params.nid;
    let payload = {
        notification: {
            title: notification.title,
            body: notification.msg,
            click_action: 'https://esint-v2.firebaseapp.com/notifications/'
        }
    };

    return incrementUserNotificationCount(userId).then((count) => {
        payload.notification.badge = count.toString();
        return admin.database().ref('users/' + notification.refUser).once('value').then(_user => {
            const user = _user.val();
            payload.notification.icon = user.photoUrl;

            return admin.database().ref('/fcmTokens/' + userId).once('value').then(function (_tokens) {
                const tokens = _tokens.val();
                for (let fcmDeviceKey in tokens) {
                    if (!tokens.hasOwnProperty(fcmDeviceKey)) continue;

                    admin.messaging().sendToDevice(tokens[fcmDeviceKey], payload)
                        .then(res => {
                            const messageId = res['results'][0]['messageId'];
                            admin.database().ref('notifications/' + userId + '/' + notificationId + '/messageId').set(messageId);
                        })
                        .catch(err => console.log(err));
                }

                return true;
            });
        });
    });

    // 'notifications/c0JaF3fKKMaHp3YO4wkrfecKQyl1/test', {params: {uid: 'c0JaF3fKKMaHp3YO4wkrfecKQyl1', nid: 'test'}}
});

function incrementUserNotificationCount(userId) {
    return admin.database().ref('users/' + userId).once('value').then(_user => {
        const user = _user.val();
        const count = user.notificationCount ? user.notificationCount + 1 : 1;
        admin.database().ref('users/' + userId + '/notificationCount').set(count);

        return count;
    });
}



exports.userLeftGroup = functions.database.ref('/groups/{groupId}/users/{userId}').onDelete(event => {

    const groupId = event.params.groupId;
    const userId = event.params.userId;

    // when a user leaves a group:
    // - all his gifts have to be deleted
    // - all corresponding takenFlags have to be removed
    // - all his wishes have to be deleted
    // - all gifts for his wishes have to be deleted

    return deleteUserGisfts(groupId, userId)
        .then(() => deleteWishes(groupId, userId));

});

function deleteUserGisfts(groupId, userId) {
    return admin.database().ref('gifts/' + groupId + '/' + userId).once('value').then(_gifts => {
        const gifts = _gifts.val();
        for (let giftId in gifts) {
            if (!gifts.hasOwnProperty(giftId)) continue;
            const gift = gifts[giftId];
            if (gift.wish != null) {
                admin.database().ref('takenFlag/' + groupId + '/' + gift.user + '/' + gift.wish).remove();
            }
        }
        return true;
    }).then(() => {
        return admin.database().ref('gifts/' + groupId + '/' + userId).remove();
    });
}

function deleteWishes(groupId, userId) {
    return admin.database().ref('wishlists/' + groupId + '/' + userId).once('value').then(_wishlist => {
        const wishlist = _wishlist.val();

        if (wishlist.referenceId != null) {
            return admin.database().ref('wishlists/' + groupId + '/' + wishlist.referenceId + '/sharedWith/' + userId).remove();
        } else {
            return true;
        }
    }).then(() => {
        return admin.database().ref('wishlists/' + groupId + '/' + userId).remove();
    });
}

