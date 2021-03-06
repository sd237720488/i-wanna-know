import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import HeaderSearch from 'ant-design-pro/lib/HeaderSearch';
import { Layout, BackTop } from 'antd';
import icon from 'Assets/icon-front.png';
import MENUS, { HIDDEN_MOBILE_MENUS, MOBILE_MENUS } from 'Assets/menus';
import Info from 'Components/Info/Info';
import Logo from 'Components/Logo/Logo';
import MenuList from 'Components/Menu/MenuList';
import MenuItem from 'Components/Menu/MobileMenuItem';
import User from 'Components/User/User';
import { Redirect, Route, Switch } from 'dva/router';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Content from '../Content/FrontContent';
import styles from './Layout.less';
import UserMenu from './UserMenu';

const { Header, Footer } = Layout;
const initRoute =
  MENUS[0].links && MENUS[0].links.length
    ? `${MENUS[0].link}/${MENUS[0].links[0]}${location.search}`
    : `${MENUS[0].link}/default${location.search}`;
const ResponsiveMenu = function (props) {
  const { subMenus } = props;
  const { menu, subMenu } = props.match.params;
  const sub = subMenus.filter(subMenu => subMenu.link === menu)[0];
  const title = sub
    ? sub.menus && sub.menus.length
      ? `${sub.titles[sub.links.indexOf(subMenu)]}`
      : sub.name
    : '首页';

  return (
    <React.Fragment>
      <MenuList
        className="hidden-mb"
        mode="horizontal"
        theme="light"
        {...props}
      />
      {/* <Dropdown 
      overlay={
        MenuCreator(subMenus, {
          mode: 'vertical',
          theme: 'light',
        })
      }>
        <a className={styles['nav-phone']} href="#">
          {title}<Icon type="down" className="margin-left-sm" />
        </a>
      </Dropdown> */}
    </React.Fragment>
  );
};

export default class FrontLayout extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    logoIcon: PropTypes.string.isRequired,
    logoName: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
  };

  static defaultProps = {
    logoIcon: icon,
    logoName: 'Windlike',
  };

  render() {
    const { location } = this.props.history;
    const { logoName, logoIcon, user } = this.props;

    return (
      <Layout className={styles.layout} id="front-layout">
        {/* 头部 */}
        <Header className={`${styles['header-light']} ${styles['header-ant']} ${styles['front-header']}`}>
          <div className={`flex-between  ${styles.header}`}>
            {/* 导航左侧 */}
            <div className={'flex'}>
              {/* logo */}
              <Logo logoName={logoName} logoIcon={logoIcon} isFront />
              {/* Menu */}
              <Switch>
                <Route
                  path="/:menu/:subMenu"
                  render={props => (
                    <ResponsiveMenu
                      subMenus={MENUS}
                      {...this.props}
                      {...props}
                    />
                  )}
                />
                <Route render={() => <Redirect to={initRoute} />} />
              </Switch>
            </div>
            {/* 导航右侧 */}
            <div className="flex">
              {/* search */}
              <HeaderSearch
                className={`${styles.search} vertical-center`}
                placeholder="你在寻找什么呢"
                onSearch={value => {
                  console.log('input', value); // eslint-disable-line
                }}
                onPressEnter={value => {
                  console.log('enter', value); // eslint-disable-line
                  this.props.history.replace(`/search/${value}`);
                }}
              />
              {/* info */}
              <Info />
              <User
                userId={user.id}
                menu={UserMenu({
                  userId: user.id,
                  history: this.props.history,
                })}
              />
            </div>
          </div>
        </Header>
        {/* 内容 */}
        <Content />
        {/* 页脚 */}
        <Footer style={{ textAlign: 'center' }} className="visible-block-desktop">
          Ant Design ©2016 Created by Ant UED
        </Footer>
        <FooterToolbar
          style={{
            height: HIDDEN_MOBILE_MENUS.includes(location.pathname)
              ? '0'
              : '3.5rem',
          }}
          className={`hidden-desktop hidden-tablet ${styles['mobile-toolbar']}`}
          extra={(
            <div className={styles['toolbar']}>
              {
                MOBILE_MENUS.map(menu => (
                  <MenuItem
                    dot={Boolean(menu.name === '我的' && user.informationNum)}
                    key={menu.name}
                    menu={menu}
                    isActive={location.pathname === menu.link}
                  />
                ))
              }
            </div>
          )}
        />
        <BackTop />
      </Layout >
    );
  }
}
