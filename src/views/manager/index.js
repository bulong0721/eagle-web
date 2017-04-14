import React, { PropTypes } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Row, Col, Input, Button, Upload, Icon, Spin, Table, Modal, notification } from 'antd';
import Logger from '../../utils/logger';
import Filters from './util/filters';
import Editors from './util/editors';
import Renders from './util/renders';
import Schemas from './util/schemas';
import Ajax from '../../utils/ajax';

const logger = Logger.getLogger('InnerForm');

const Manager = ({ dispatch, manager, loading, route }) => {
  let formQuery = null;
  let formEditor = null;

  const handleQuery = (e) => {
    const filter = formQuery.getFieldsValue();
    dispatch({ type: 'manager/query', payload: filter });
  };

  const handleReset = (e) => {
    formQuery.resetFields();
  };

  const hideModal = () => {
    dispatch({ type: 'manager/hideModal' });
  };

  const handleModalOk = () => {
  };

  const handleInsert = (e) => {
    dispatch({ type: 'manager/handleInsert' });
  };

  const handleImport = (info) => {
  };

  const handleExport = (e) => {
  };

  const handleUpdate = (e) => {
    const { selectedRowKeys, dataSource } = manager;
    const newData = {};
    const selectedKey = selectedRowKeys[0];
    for (const record of dataSource) {
      Object.assign(newData, record);
      break;
    }
    dispatch({ type: 'manager/handleInsert' });
    if (formEditor) {
      console.log(newData);
      formEditor.setFieldsValue(newData);
    }
  };

  const handleDelete = (e) => {
  };

  const handleToggle = (e) => {
    dispatch({ type: 'manager/handleToggle' });
  };

  const onTableSelectChange = (selectedRowKeys) => {
    dispatch({ type: 'manager/selectChange', payload: selectedRowKeys });
  };

  const fetchSchema = (tableName) => {
    const tableConfig = Schemas.getTableConfig(tableName);
    let schema = Schemas.getLocalSchema(tableName);
    return { ...schema, tableName, tableConfig };
  };

  const buildQueryForm = (schema, expand) => {
    return Form.create()(
      props => {
        const { getFieldDecorator } = props.form;
        const children = Filters.parse(schema)(getFieldDecorator);
        const count = expand ? 100 : 8;
        return (
          <Form className="ant-advanced-search-form">
            {children.slice(0, count)}
          </Form>
        );
      }
    );
  };

  const onSingleRecordUpdate = (record, keysToUpdate) => {
  };

  const onSingleRecordDelete = (record) => {
  };

  const onSingleRecordComponent = (record, component, name) => {
  };

  const onClickImage = (text) => {
  };

  const { tableName } = route;
  const { expand, dataSource, tableLoading, selectedRowKeys, modalTitle, modalVisible } = manager;
  const { querySchema, tableConfig, dataSchema } = fetchSchema(tableName);
  const { tableSchema, fieldMap, primaryKey } = Editors.getTableSchema(tableName, dataSchema);
  const component = { onClickImage, onSingleRecordUpdate, onSingleRecordDelete, onSingleRecordComponent, fieldMap, primaryKey };
  Renders.bindRender(tableSchema, tableName, component);
  const FormEditor = Editors.getForm(tableName, dataSchema);
  const FormQuery = buildQueryForm(querySchema, expand);
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: onTableSelectChange,
  };

  const tableProps = {
    rowKey: primaryKey,
    rowSelection,
    columns: tableSchema,
    dataSource
  };
  const editorProps = {
    title: modalTitle,
    visible: modalVisible,
    onOk: handleModalOk,
    onCancel: hideModal,
    maskClosable: false,
    width: 550
  };
  const hasSelected = selectedRowKeys.length > 0;
  const multiSelected = selectedRowKeys.length > 1;

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
          <Button type="primary" onClick={handleInsert}><Icon type="plus-circle-o" />新增</Button>
          <Button disabled={!hasSelected} onClick={handleUpdate}><Icon type="edit" />修改</Button>
          <Button disabled={!hasSelected}><Icon type="delete" />删除</Button>
          <Button><Icon type="upload" />导入</Button>
          <Button><Icon type="export" />导出</Button>
        </Button.Group>
        <Modal {...editorProps}>
          <FormEditor ref={(input) => { formEditor = input; }} />
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