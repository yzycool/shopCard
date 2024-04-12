/** @format */

import React, { useState, lazy, Suspense, useEffect } from 'react';
import { Spin } from 'antd';
import { RouteObject } from 'react-router-dom';
import BasicLayout from '@/layouts/BasicLayout';
import NotFoundPage from '@/layouts/NotFound';

// 自定义懒加载函数
export const lazyLoad = (factory: () => Promise<any>) => {
  const Module = lazy(factory);
  return (
    <Suspense fallback={<Spin />}>
      <Module />
    </Suspense>
  );
};

export const routesConfig = [
  {
    path: '/',
    element: <BasicLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/home',
        element: lazyLoad(() => import('@/pages/Home')),
        name: '首页',
      },
      {
        path: '/popular',
        element: lazyLoad(() => import('@/pages/Popular/index.js')),
        name: 'github热门项目',
      },
      {
        path: '/battle',
        element: lazyLoad(() => import('@/pages/Battle/index.js')),
        name: '对战',
      },
      {
        path: '/battleResult',
        element: lazyLoad(() => import('@/pages/Battle/battleResult.js')),
        name: '对战结果',
        hidden: true, // 用于菜单渲染
      },
      {
        path: '/shoppingcart',
        element: lazyLoad(() => import('@/pages/ShoppingCart/index')),
        name: '温州皮革厂',
      },
    ],
  },
];

const useLoadRoutes = () => {
  const [routes, setRoutes] = useState([] as RouteObject[]);

  useEffect(() => {
    setRoutes(routesConfig as RouteObject[]);
  }, []);

  return routes;
};

export default useLoadRoutes;
