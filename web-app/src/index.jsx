import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './app';
// import Map from './map';

render( <AppContainer><App/></AppContainer>, document.querySelector("#app"));

if (module && module.hot) {
  module.hot.accept('./app.jsx', () => {
    const App = require('./app.jsx').default;
    // const Map = require('./map.jsx').default;
    render(
      <AppContainer>
        <App/>
        {/* <Map/> */}
      </AppContainer>,
      document.querySelector("#app")
    );
  });
}
