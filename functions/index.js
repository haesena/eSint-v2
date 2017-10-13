const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.wishInserted = functions.database.ref('/wishlists/{gid}/{uid}/wishes/{wid}').onCreate(function(event) {

    const gid = event.params.gid;
    const uid = event.params.uid;
    const wid = event.params.wid;

    const wish = event.data.val();

    var d = new Date();

    admin.database().ref('wishlists/' + gid + '/' + uid + '/subscriptions').once("value").then(function(_subscriptions) {
        subscriptions = _subscriptions.val();

        admin.database().ref('groups/' + gid).once("value").then(function(_group) {
            var group = _group.val();
            admin.database().ref('users/' + uid).once("value").then(function(_user) {
                var user = _user.val();

                // iterate over users who subscribed to this wishlist
                for(var u in subscriptions) {
                    if (!subscriptions.hasOwnProperty(u)) continue;
                    if (subscriptions[u] === true) {
                        // Write Notification
                        admin.database().ref('notifications/' + u).push({
                            msg: user.displayName + ' added a new wish: ' + wish.name + '!',
                            refUser: uid,
                            seen: false,
                            title: 'Group ' + group.name + ' - New wish',
                            time: d.toISOString()
                        });
                    }
                }
            });
        });
    });

    return true;
    // 'wishlists/-KvJNNzbBagFeATemS4J/jLTIgS9vSwM4c6sZLFs83DRCISj1/wishes/test', {params: {gid: '-KvJNNzbBagFeATemS4J', uid: 'jLTIgS9vSwM4c6sZLFs83DRCISj1', wid: 'test'}}
});

exports.wishMarkedAsDeleted = functions.database.ref('/deleteFlag/{gid}/{uid}/{wid}').onCreate(function(event) {

    const gid = event.params.gid;
    const uid = event.params.uid;
    const wid = event.params.wid;

    var d = new Date();

    admin.database().ref('takenFlag/' + gid + '/' + uid + '/' + wid).once("value").then(function(t) {
        // check if the wish to delete has already been taken by someone
        if(t.val() !== null) {

            admin.database().ref('groups/' + gid).once("value").then(function(_group) {
                var group = _group.val();
                // if the wish is marked as teken, iterate through all gifts to find the user who took it
                admin.database().ref('gifts/' + gid).once("value").then(function(gList) {
                    var gifts = gList.val();

                    // go through all users
                    for(var u in gifts) {
                        if (!gifts.hasOwnProperty(u)) continue;

                        // go through all gifts from this user
                        for(var g in gifts[u]) {
                            if(!gifts[u].hasOwnProperty(g)) continue;

                            if(gifts[u][g]['wish'] === wid && gifts[u][g]['user'] === uid) {
                                // if this gift ist intenden for the wish wich is deleted
                                admin.database().ref('users/' + uid).once("value").then(function(_user) {
                                    // get user
                                    var user = _user.val();
                                    admin.database().ref('wishlists/' + gid + '/' + uid + '/wishes/' + wid).once("value").then(function(_wish) {
                                        // get Wish
                                        var wish = _wish.val();
                                        wish.user = gifts[u][g]['user'];
                                        wish.deletedByUser = true;
                                        wish.manualAdd = true;

                                        // update the gift, no more reference to wish
                                        admin.database().ref('gifts/' + gid + '/' + u + '/' + g).set(wish);

                                        // Delete the wish and the deleteFlag
                                        admin.database().ref('wishlists/' + gid + '/' + uid + '/wishes/' + wid).remove();
                                        admin.database().ref('deleteFlag/' + gid + '/' + uid + '/' + wid).remove();

                                        // Write Notification
                                        admin.database().ref('notifications/' + gifts[u][g]['user']).push({
                                            msg: user.displayName + ' deleted the wish "' + wish.name + '". Hopefully you did not already buy the gift...',
                                            refUser: uid,
                                            title: 'Group ' + group.name + ' - Wish deleted',
                                            seen: false,
                                            time: d.toISOString()
                                        });
                                    });
                                });
                            }
                        }
                    }
                });
            });
        } else {
            admin.database().ref('deleteFlag/' + gid + '/' + uid + '/' + wid).remove();
            admin.database().ref('wishlists/' + gid + '/' + uid + '/wishes/' + wid).remove();
        }
    });
    // 'deleteFlag/-KvJNNzbBagFeATemS4J/c0JaF3fKKMaHp3YO4wkrfecKQyl1/-Kvw9tZl_ExqXiLadsvQ', {params: {gid: '-KvJNNzbBagFeATemS4J', uid: 'c0JaF3fKKMaHp3YO4wkrfecKQyl1', wid: '-Kvw9tZl_ExqXiLadsvQ'}}
    return true;
});