import React, { PropTypes } from 'react';
import { Icon, Switch } from 'antd';
import styles from './sider.less';
import config from '../../config';
import Menus from './menus';

class Sider extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { siderFold, darkTheme, location, changeTheme, navOpenKeys, changeOpenKeys } = this.props;
    const menusProps = {
      siderFold,
      darkTheme,
      location,
      navOpenKeys,
      changeOpenKeys,
    };
    return (
      <div>
        <div className={styles.logo}>
          {siderFold ? '' : <img alt={'logo'} src={config.logoSrc} />}
        </div>
        <Menus {...menusProps} />
        {!siderFold ? <div className={styles.switchtheme}>
          <span><Icon type="bulb" />切换主题&nbsp;</span>
          <Switch onChange={changeTheme} defaultChecked={darkTheme} checkedChildren="黑" unCheckedChildren="白" />
        </div> : ''}
      </div>
    );
  }
}

Sider.propTypes = {
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  location: PropTypes.object,
  changeTheme: PropTypes.func,
  isNavbar: PropTypes.bool,
  handleClickNavMenu: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Sider;