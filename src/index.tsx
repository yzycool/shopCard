/** @format */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import { store } from '@/store/index';

let root: any = null;

const renderApp = (props: any) => {
  const { container } = props;
  root = ReactDOM.createRoot(
    container ? container.querySelector('#root') : document.getElementById('root'),
  );
  root.render(<App />);
};

// 在非微前端的情况下渲染本身
if (!(window as any).__POWERED_BY_QIANKUN__) {
  renderApp({});
}

export async function bootstrap() {
  console.log('react app bootstraped');
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props: any) {
  const { setLoading } = props;
  setLoading?.(false);
  renderApp(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  root.unmount();
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props: any) {
  store.dispatch({
    type: 'app/setAppState',
    payload: props,
  });
}
