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
      inputValue: ''
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
  cb(e) {
    console.log(e);
  }
  onBtnClick() {
   
    // console.log(this.state.inputValue);
    this.login(this.state.inputValue,this.cb)
    
  }
  updateInputValue = (evt) => {
    this.setState({
      inputValue: evt.target.value
    });
  }

  render() {
    // const { movements, agents, prices } = this.state;

    return (
      <div>
        <input type="text" value={ this.state.inputValue } onChange={this.updateInputValue}/>
        <button onClick={ this.onBtnClick.bind(this) }>
          Activate Lasers
        </button>
        <h1>  hi</h1>
      </div>
    );
  }
}