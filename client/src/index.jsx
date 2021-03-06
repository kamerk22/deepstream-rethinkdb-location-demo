import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './location';

render( <AppContainer><App/></AppContainer>, document.querySelector("#app"));

if (module && module.hot) {
  module.hot.accept('./location.jsx', () => {
    const App = require('./location.jsx').default;
    render(
      <AppContainer>
        <App/>
      </AppContainer>,
      document.querySelector("#app")
    );
  });
}
