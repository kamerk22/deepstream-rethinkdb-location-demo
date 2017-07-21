import '../styles/index.scss';
import React from 'react';
import { render } from 'react-dom';
import deepstream from 'deepstream.io-client-js';

export default class LocationComponent extends React.Component {
    constructor(props) {
        super(props);

        this.ds = deepstream('ws://localhost:6020');
        this.ds.on('error', (err) => {
            console.log(err)
        });
        this.state = {
            inputValue: '',
            position: {
                lat: 122,
                lng: 124
            }
        };
    }

    _login(userData, callback) {

        this.userData = userData;
        this.callback = callback;
        this.ds.login(userData, this._onLoginResult.bind(this));
    }

    _onLoginResult(success) {
        if (success) {
            this._initialize();
        } else {
            this.callback(false);
        }
    }

    _initialize() {
        this.record = this.ds.record.getRecord('user/' + this.userData.username);
        this.record.whenReady(this._onRecordCheckComplete.bind(this));
    }

    _onRecordCheckComplete(record) {
        this.record.set('username', this.userData.username);
        this.record.set('id', this.userData.id);
        this.callback(true);
    }
    _onBtnClick() {
        let userData = {
            "username": this.state.inputValue,
            "id": this.ds.getUid()
        };
        this._login(userData, this.cb);

    }
    cb(e) {
        console.log(e);
    }
    _updateInputValue = (evt) => {
        this.setState({
            inputValue: evt.target.value
        });
    }

    _fake() {
        var users = this.ds.record.getList('user');
        if (!(users.getEntries()).includes(this.state.inputValue)) {
            users.addEntry(this.state.inputValue);
        }
        console.log(users.getEntries());
    }
    render() {

        return (
            <div>
                <input type="text" value={this.state.inputValue} onChange={this._updateInputValue} />
                <button onClick={this._onBtnClick.bind(this)}>
                    Activate Lasers
                </button>
                <button onClick={this._fake.bind(this)}>fake</button>
                <h1>hi {this.state.inputValue}</h1>
            </div>
        );
    }
}