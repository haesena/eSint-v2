const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.wishMarkedAsDeleted = functions.database.ref('/deleteFlag/{gid}/{uid}/{wid}').onCreate(function(event) {

    const gid = event.params.gid;
    const uid = event.params.uid;
    const wid = event.params.wid;

    admin.database().ref('takenFlag/' + gid + '/' + uid + '/' + wid).once("value").then(function(t) {
        if(t.val() !== null) {
            admin.database().ref('/wishlists/' + gid + '/' + uid + '/wishes/' + wid + '/deleted').set('yes');
        }
    });
    // https://esint-v2.firebaseio.com/deleteFlag/-KvJNNzbBagFeATemS4J/c0JaF3fKKMaHp3YO4wkrfecKQyl1/-KviEeDPPUaK_r28QsuQ
    return true;
});