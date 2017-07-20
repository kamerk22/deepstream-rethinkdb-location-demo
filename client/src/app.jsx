import '../styles/index.scss';
import React from 'react';
import { render } from 'react-dom';
import deepstream from 'deepstream.io-client-js';

export default class MapComponent extends React.Component {

  constructor(props) {
    super(props);

    this.ds = deepstream('ws://localhost:6020');
    // handle error here, in case of error
    this.ds.on('error', (err) => {
      console.log(err)
    });
    this.state = {
      inputValue: '',
      position: {
        lat: 12,
        lng: 124
      }
    };

  }

  login(username, callback) {

    this.username = username;
    this.callback = callback;
    this.ds.login({ username: username }, this._onLoginResult.bind(this));
  }

  _onLoginResult(success) {
    if (success) {
      this._initialize();
      console.log("inside success");
    } else {
      this.callback(false);
      console.log("inside success");
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

  _onGetEntries(users) {
    let recordNames = this.list.getEntries();
    this._updateMarkers(recordNames);
  }

  _updateMarkers(userRecordNames) {
    for (var i = 0; i < userRecordNames.length; i++) {
      if (!this.markers[userRecordNames[i]]) {
        //for each list entry, we create a new marker instance,
        //where we can subscribe to the record corresponding with the list entry
        this.markers[userRecordNames[i]] = new Marker(userRecordNames[i], this.map, this.username);
      }
    }

    for (var userRecordName in this.markers) {
      if (userRecordNames.indexOf(userRecordName) === -1) {
        this.markers[userRecordName].destroy();
        delete this.markers[userRecordName];
      }
    }
  }

  onPositionUpdate(position) {
    this.pos = {
      lat: position.lat,
      lng: position.lng
    };
    console.log(this.ds.record)
    this.record.set('position', this.pos);
    //creates the list that contains our latitude and longitude
    this.list = ds.record.getList('users_within_radius/' + this.pos.lat + '/' + this.pos.lng + '/' + 1 + '/' + this.username)
    this.list.subscribe(this._onGetEntries.bind(this));
    //setCenter is a method called to find the center for the map,
    //that was created with google maps api
    this.map.setCenter(this.pos);
    this.circle.setCenter(this.pos);

  }
  cb(e) {
    console.log(e);
  }
  onBtnClick() {

    // console.log(this.state.inputValue);
    this.login(this.state.inputValue, this.cb)

  }
  updateInputValue = (evt) => {
    this.setState({
      inputValue: evt.target.value
    });
  }

  fake() {
    this.onPositionUpdate(this.state.position)
    console.log(this.state.position)
  }
  render() {
    // const { movements, agents, prices } = this.state;

    return (
      <div>
        <input type="text" value={this.state.inputValue} onChange={this.updateInputValue} />
        <button onClick={this.onBtnClick.bind(this)}>
          Activate Lasers
        </button>
        <button onClick={ this.fake.bind(this) }>fake</button>
        <h1>  hi</h1>
      </div>
    );
  }
}