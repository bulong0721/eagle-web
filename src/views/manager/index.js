import React, { PropTypes } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Row, Col, Input, Button, Upload, Icon, Spin, Table, Modal, notification } from 'antd';
import Builder from './util/builder';
import Renders from './util/renders';
import Ajax from '../../utils/ajax';

const Manager = ({ dispatch, manager, loading, route, routes }) => {
  const { tableName } = route;
  let formQuery = null;
  let formEditor = null;
  let formComponent = null;
  let currentAction = null;

  const handleQuery = (e) => {
    const filter = formQuery.getFieldsValue();
    dispatch({ type: 'manager/query', tableName, payload: filter });
  };

  const handleReset = (e) => {
    formQuery.resetFields();
  };

  const handleToggle = (e) => {
    dispatch({ type: 'manager/handleToggle' });
  };

  const onTableSelectChange = (selectedRowKeys) => {
    dispatch({ type: 'manager/selectChange', payload: selectedRowKeys });
  };

  const handleRowAction = ({ action, popupEditor, component, title }) => {
    return (text, record, index) => {
      dispatch({ type: action, payload: { text, record, index } });
    };
  };

  const handlePageAction = ({ action, popupEditor, component, title }) => {
    const { selectedRowKeys, dataSource } = manager;
    return (e) => {
      if (component) {
        formComponent = component;
        dispatch({ type: 'manager/showComponent', title, action });
      } else if (popupEditor) {
        dispatch({ type: 'manager/showEditor', title, action });
      } else {
        const filter = formQuery.getFieldsValue();
        dispatch({ type: action, payload: { tableName, selectedRowKeys, dataSource, filter } });
      }
    };
  };

  const handleModalOk = () => {
    const { popupEditor, modalAction } = manager;
    const formPopup = popupEditor ? formEditor : formComponent;
    formPopup.validateFields(errors => {
      if (errors)
        return;
    });
    const data = formPopup.getFieldsValue();
    dispatch({ type: modalAction, tableName, payload: data });
  };

  const hideModal = () => {
    dispatch({ type: 'manager/hideModal' });
  };

  const { expand, dataSource, tableLoading, selectedRowKeys, modalTitle, modalVisible, componentVisible, modalFormData } = manager;
  const { primary, columns, filters, editors, actions } = Builder.parseByTable(tableName, { handlePageAction, selectedRowKeys });
  // const component = { handleRowAction, columns, primary };
  // Renders.bindRender(tableSchema, tableName, component);
  const FormQuery = Builder.buildQueryForm(filters, expand);
  const FormEditor = Builder.buildEditorForm(editors);

  const rowSelection = { selectedRowKeys: selectedRowKeys, onChange: onTableSelectChange, };
  const tableProps = { rowKey: primary, rowSelection, columns, dataSource };
  const editorProps = { title: modalTitle, visible: modalVisible, onOk: handleModalOk, onCancel: hideModal, maskClosable: false, width: 600 };
  const componentProps = { title: modalTitle, visible: componentVisible, onOk: handleModalOk, onCancel: hideModal, maskClosable: false, width: 600 };
  return (
    <Spin spinning={false}>
      <Row>
        <FormQuery ref={(input) => { formQuery = input; }} />
      </Row>
      <Row>
        <Col span={12} offset={12} style={{ textAlign: 'right' }}>
          <Button.Group>
            <Button type="primary" onClick={handleQuery}><Icon type="search" />查询</Button>
            <Button onClick={handleReset}><Icon type="cross" />清除</Button>
            <Button onClick={handleToggle}>{expand ? '精简' : '更多'}<Icon type={expand ? 'up' : 'down'} /></Button>
          </Button.Group>
        </Col>
      </Row>
      <Row>
        <Button.Group style={{ marginBottom: '8px' }}>
          {actions}
        </Button.Group>
        <Modal {...editorProps}>
          <FormEditor ref={(input) => {
            formEditor = input;
            if (input && modalFormData) {
              input.setFieldsValue(modalFormData);
            }
          }} />
        </Modal>
        <Modal {...componentProps}>
          <formComponent ref={(input) => {
            if (input && modalFormData) {
              // input.setFieldsValue(modalFormData);
            }
          }} />
        </Modal>
      </Row>
      <Row>
        <Table bordered {...tableProps} />
      </Row>
    </Spin>
  );
}

function mapStateToProps(state) {
  const { manager, loading } = state;
  return {
    manager,
    loading: loading.models.manager
  };
}
export default connect(mapStateToProps)(Manager);