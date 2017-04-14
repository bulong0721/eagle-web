import React, { PropTypes } from 'react';
import { Breadcrumb, Icon } from 'antd';
import { Link } from 'dva/router';
import styles from './bread.less';
import { connect } from 'react-redux'

class Bread extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { location } = this.props;
    return (
      <div className={styles.bread}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Icon type="home" />
            <span>首页</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span>管理</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span>订单查询</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
    );
  }
}

Bread.propTypes = {
  location: PropTypes.object,
}

export default Bread;