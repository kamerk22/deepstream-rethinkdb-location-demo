//server side
const deepstream = require('deepstream.io-client-js');
const ds = deepstream('ws://localhost:6020').login()
const GeoSubscription = require( './geo-subscription' );

ds.on( 'error', function(error) {
    console.log(error);
});

var geoSubscriptions = {};

//here we listen to the list we created upon logging in.
//the match will contain all the information in our list after the "/.*" . We our sending the match to the geoSubscription module, where we will extract its data and perform a RethinkDB query.

ds.record.listen('users_within_radius/.*', (match, isSubscribed, response) => {
    if( isSubscribed ) {
        //start publishing data
        response.accept();
        console.log(isSubscribed);
        if( !geoSubscriptions[ match ] ) {
            geoSubscriptions[ match ] = new GeoSubscription( match, ds );
        }
    } else {
        //stop publishing data
        if( geoSubscriptions[ match ]) {
            geoSubscriptions[ match ].destroy();
            delete geoSubscriptions[ match ];
        }
    }
})