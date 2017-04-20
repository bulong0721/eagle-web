import React, { PropTypes } from 'react';
import { Form, Row, Col, Input, Button, Upload, Icon, Spin, Table, Modal, Collapse, notification } from 'antd';
import { connect } from 'dva';

const OrderAdd = ({ dispatch }) => {

  return (
    <Spin spinning={false}>
      <Collapse activeKey={['1', '2']}>
        <Collapse.Panel header="订单基础信息" key="1">
          ...
        </Collapse.Panel>
        <Collapse.Panel header="发货人信息" key="2">
          ...
        </Collapse.Panel>
      </Collapse>
    </Spin>
  );
};

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(OrderAdd);