/** @format */
import React, {Suspense} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Spin} from 'antd';
import {Provider} from 'react-redux';
import {store} from '@/store/index';
import Router from '@/router/index';

const App = () => (
  <React.StrictMode>
    <Suspense fallback={<Spin />}>
      <Provider store={store}>
        <BrowserRouter basename={(window as any).__POWERED_BY_QIANKUN__ ? '/data-governance' : ''}>
          <Router />
        </BrowserRouter>
      </Provider>
    </Suspense>
  </React.StrictMode>
);

export default App;
