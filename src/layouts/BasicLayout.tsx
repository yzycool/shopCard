/** @format */

import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Menu } from 'antd';
import { OpenAIOutlined } from '@ant-design/icons';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { routesConfig } from '@/router/config';
import '@/styles/layouts/BasicLayout.less';

const { Header, Content } = Layout;

const BasicLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [activeKey, setActiveKey] = useState<string[]>([]);
  // 简单的菜单设计，后续可进行重构
  const menuItems = useMemo(() => {
    if (!routesConfig) return [];
    return routesConfig[0].children
      .filter(item => !item.hidden)
      .map(item => ({
        key: item.path,
        label: <Link to={item.path}>{item.name}</Link>,
      }));
  }, [routesConfig]);

  useEffect(() => {
    if (pathname === '/') {
      navigate('/home');
    }
    setActiveKey([pathname]);
  }, [pathname]);

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center', padding: 0 }}>
        <div style={{ width: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <OpenAIOutlined style={{ color: '#fff', fontSize: 28 }} />
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={activeKey}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: '0 16px' }}>
        <div style={{ height: 'calc(100vh - 64px)' }}>
          <Outlet></Outlet>
        </div>
      </Content>
    </Layout>
  );
};

export default BasicLayout;
