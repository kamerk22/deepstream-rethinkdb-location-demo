class GeoSubscription {
    constructor() {
        this.list = this.ds.record.getList(match);
        this.list.whenReady(this._queryDb.bind(this));
    }


    _queryDb() {
        // *match* is returned as a string, and needs to be broken into an array, and extracted as follows
        var lat = + this.match.split('/')[1];
        var lng = + this.match.split('/')[2];
        var radius = + this.match.split('/')[3];

        r.db('realtime').table('user').filter(function (user) {
            //performs a geospatial query based on two object points in RethinkDB
            return r.distance(
                r.point(user('position')('lng'), user('position')('lat')), //users who are logged in
                r.point(lng, lat), //this user's coordinates from the match
                { unit: 'km' }
            ).lt(radius) // only populates users who are within the radius provided
            //here, .changes() allows us to subscribe to position locations of users returned in the query
        })('ds_id').changes({ includeInitial: true }).run(db.conn, this._onDbResult.bind(this)); //this callback passes the names of all the users that are logged in, and within the radius of the query.
    }

    _onDbResult(err, cursor) {
        if (err) {
            throw err
        }
        this.cursor = cursor;
        this.cursor.each(this._updateList.bind(this))
    }

    _updateList(err, result) {
        if (err) {
            throw err;
        }

        if (result.new_val && this.list.getEntries().indexOf(result.new_val) === -1) {
            //adds the users within the radius to a new list
            this.list.addEntry(result.new_val);
        } else {
            this.list.removeEntry(result.old_val);
        }
    }
}