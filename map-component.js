import React from 'react';
import deepstream from 'deepstream.io-client-js';

export default class MapComponent extends React.Component {

    constructor(props) {
        super(props);

        this.ds = deepstream('ws://localhost:6020');
        // handle error here, in case of error
        this.ds.on('error', this._onError.bind(this));

    }

    login(username, callback) {
        this.username = username;
        this.callback = callback;
        this.ds.login({ username: username }, this._onLoginResult.bind(this));
    }

    _onLoginResult(success) {
        if (success) {
            this._initialize();
        } else {
            this.callback(false);
        }
    }

    _initialize() {
        // here we create the record if it doesn't exist, or get the record if it
        //exists.
        this.record = this.ds.record.getRecord('user/' + this.username);
        // the whenReady() method, ensures the record is fully loaded before
        // continuing, and takes a callback.
        this.record.whenReady(this._onRecordCheckComplete.bind(this));
    }

    _onRecordCheckComplete(record) {
        // the set() method allows us to now set data.
        this.record.set('username', this.username);
        this.callback(true);
    }

    

    onPositionUpdate(position) {
        this.pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        this.record.set('position', this.pos);
        //creates the list that contains our latitude and longitude
        this.list = ds.record.getList('users_within_radius/' + this.pos.lat + '/' + this.pos.lng + '/' + 1 + '/' + this.username)
        this.list.subscribe(this._onGetEntries.bind(this));
        //setCenter is a method called to find the center for the map,
        //that was created with google maps api
        this.map.setCenter(this.pos);
        this.circle.setCenter(this.pos);

    }

    render() {
        const { movements, agents, prices } = this.state;

        return (
            <div>
                <div>Prices: {prices.map(p => <span>{p}, </span>)}</div>
                <div>Movements: {movements}</div>
                <h2>Agents</h2>
                <div>
                    {agents.sort((a, b) => (b.stocks * prices[prices.length - 1] + b.money) - (a.stocks * prices[prices.length - 1] + a.money)).map(a => (
                        <div>
                            <span><b>buy: </b>{a.buyRule}</span>
                            <span> <b>sell: </b>{a.sellRule}</span>
                            <span> <b>stocks: </b>{a.stocks}</span>
                            <span> <b>money: </b>{a.money.toFixed(2)}</span>
                            <span> <b>PROFIT: </b>{(a.stocks * prices[prices.length - 1] + a.money).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

            </div>
        );
    }
}