import '../styles/index.scss';
import React from 'react';
import { render } from 'react-dom';
import deepstream from 'deepstream.io-client-js';

export default class MapComponent extends React.Component {
  constructor(props) {
    super(props);
    this.ds = deepstream('wss://localhost:6220').login({});
    this.ds.on('error', (err) => {
      console.log(err)
    });
    this.state = {
      value: '',
      eventsReceived: []
    };
    this.event = this.props.event;

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.ds.event.subscribe('event-data', data => {
      this.setState({ eventsReceived: [...this.state.eventsReceived, data] })
      this.setState({ value: '' });
    });
  }

  handleClick(e) {
    this.ds.event.emit('event-data', this.state.value);
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  render() {
    return (
      <div className="group pubsub">
        <div className="half left">
          <h2>Publish</h2>
          <button className="half left" onClick={this.handleClick} >Send test-event with</button>
          <input type="text" value={this.state.value} onChange={this.handleChange} className="half" />
        </div>
        <div className="half">
          <h2>Subscribe</h2>
          <ul>
            {
              this.state.eventsReceived
                .map((data, val) => {
                
                  return (
                    <li key={val} >Received event data: <em>{data}</em></li>
                  );
                })
            }
          </ul>
        </div>
      </div>
    );
  }

}