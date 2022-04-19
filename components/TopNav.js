import React, { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import classes from '../public/css/styles.module.css';
import { Menu } from 'antd';
import {
  AppstoreAddOutlined,
  LoginOutlined,
  UserAddOutlined,
  LogoutOutlined,
  CoffeeOutlined,
  CarryOutOutlined,
  TeamOutlined,
} from '@ant-design/icons/lib/icons';
import { Context } from '../context/index';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const { Item, SubMenu, ItemGroup } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState('');

  // state
  const { state, dispatch } = useContext(Context);
  const { user } = state;

  // router
  const router = useRouter();

  const currentPageHandler = (event) => {
    setCurrent(event.key);
  };

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = async () => {
    dispatch({ type: 'LOGOUT' });
    window.localStorage.removeItem('user');
    try {
      const logoutApi = '/api/logout';
      const { data } = await axios.get(logoutApi);
      toast.success(data.message);
      router.push('/login');
    } catch (err) {}
  };

  const becomeIntructorInput =
    user && user.role && user.role.includes('Instructor')
      ? {
          icon: <CarryOutOutlined />,
          key: '/instructor/course/create',
          title: 'Create Course',
          onClick: currentPageHandler,
          loginState: true,
        }
      : {
          icon: <TeamOutlined />,
          key: '/user/become-instructor',
          title: 'Become Instructor',
          onClick: currentPageHandler,
          loginState: true,
        };

  const topNavElements = [
    {
      icon: <AppstoreAddOutlined />,
      key: '/',
      title: 'EDEMY',
      onClick: currentPageHandler,
      appState: true,
    },
    becomeIntructorInput,
    {
      icon: <LoginOutlined />,
      key: '/login',
      title: 'Login',
      onClick: currentPageHandler,
      loginState: false,
    },
    {
      icon: <UserAddOutlined />,
      key: '/register',
      title: 'Register',
      onClick: currentPageHandler,
      loginState: false,
    },
    // {
    //   icon: <UserAddOutlined />,
    //   key: '/instructor',
    //   title: 'Instructor',
    //   onClick: currentPageHandler,
    //   loginState: true,
    // },
    // {
    //   icon: <LogoutOutlined />,
    //   key: '/logout',
    //   title: 'Logout',
    //   onClick: logout,
    //   rightPosition: true,
    //   className: 'ms-auto',
    //   loginState: true,
    // },
  ];

  const showTopNavElements = () =>
    topNavElements
      .filter((element) => {
        const condition = user
          ? element.loginState || element.appState
          : !element.loginState || element.appState;
        return condition;
      })
      .map((element) => (
        <Item
          icon={element.icon}
          key={element.key}
          onClick={element.onClick}
          className={element.rightPosition && element.className}
        >
          {element.title !== 'Logout' ? (
            <NextLink href={element.key} passHref>
              <a>{element.title}</a>
            </NextLink>
          ) : (
            element.title
          )}
        </Item>
      ));

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[current]}
      className="mb-2"
    >
      {showTopNavElements()}

      {user && (
        <SubMenu
          key="/submenu"
          icon={<CoffeeOutlined />}
          title={user && user.name}
          className="ms-auto"
        >
          <ItemGroup>
            <Item key="/user" className="ms-auto">
              <NextLink href={'/user'} passHref>
                <a>Dashboard</a>
              </NextLink>
            </Item>
            <Item
              key="/logout"
              icon={<LogoutOutlined />}
              onClick={logout}
              className="ms-auto"
            >
              Logout
            </Item>
          </ItemGroup>
        </SubMenu>
      )}
      {user && user.role && user.role.includes('Instructor') && (
        <Item icon={<TeamOutlined />} key="/instructor" className="ml-auto">
          <NextLink href={'/instructor'} passHref>
            <a>Instructor</a>
          </NextLink>
        </Item>
      )}
    </Menu>
  );
};

export default TopNav;
