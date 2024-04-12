/** @format */

import { RouteObject, useRoutes } from 'react-router-dom';
import useLoadRoutes from '@/router/config';

const Router: React.FC = () => {
  const routes = useLoadRoutes();
  return useRoutes(routes as RouteObject[]);
};
export default Router;
