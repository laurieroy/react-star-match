import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';

import { App } from 'components/App';

export default async function serverRenderer() {

  return Promise.resolve({
    initialMarkup: ReactDOMServer.renderToString(
      <App />
    ),
  });
}
