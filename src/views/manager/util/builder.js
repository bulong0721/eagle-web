import React from 'react';
import { Form, Input, Row, Col, DatePicker, Switch, Select, Icon, Radio, Collapse, InputNumber, Checkbox, Cascader, Button } from 'antd';
import moment from 'moment';

const schemaMap = new Map();
const formMap = new Map();

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const Builder = {

  getLocalSchema(tableName) {
    const ignoreCache = this.shouldIgnoreSchemaCache(tableName);
    let schema;
    try {
      schema = require(`../../../schema/${tableName}.schema.js`);
    } catch (e) {
      console.error('load query schema error: %o', e);
    }
    if (!ignoreCache) {
      schemaMap.set(tableName, schema);
    }
    return schema;
  },

  shouldIgnoreSchemaCache(tableName) {
    return true;
  },

  buildQueryForm(filterFields, expand) {
    return Form.create()(
      props => {
        const { getFieldDecorator } = props.form;
        const children = filterFields.map(field => field(getFieldDecorator));
        const count = expand ? 100 : 8;
        return (
          <Form className="ant-advanced-search-form">
            {children.slice(0, count)}
          </Form>
        );
      }
    );
  },

  buildEditorForm(editorFields) {
    return Form.create()(
      props => {
        const { getFieldDecorator } = props.form;
        const children = editorFields.map(field => field(getFieldDecorator));
        return (
          <Form layout="horizontal" className="ant-advanced-search-form">
            {children}
          </Form>
        );
      }
    );
  },

  parseByTable(tableName, component) {
    const schema = this.getLocalSchema(tableName);
    return this.parseBySchema(schema, component);
  },

  parseBySchema(schema, { handlePageAction }) {
    let columns = [];
    let filters = [];
    let editors = [];
    let actions = [];
    let primary = null;
    schema.fields.forEach((field) => {
      this.generateElement(field, columns, filters, editors);
      if (field.primary) {
        primary = field;
      }
    });
    actions = schema.actions.map((action, index) => {
      const { icon, title, type } = action;
      return <Button type={type} onClick={handlePageAction(action)} key={index}><Icon type={icon} />{title}</Button>
    });
    return {
      primary,
      columns,
      filters,
      editors,
      actions,
    };
  },

  generateElement(field, columns, filters, editors) {
    let filterField, editorField;
    switch (field.showType) {
      case 'radio':
        filterField = this.buildRadio(field, 'filter');
        editorField = this.buildRadio(field, 'editor');
        break;
      case 'number':
        filterField = this.buildNumber(field, 'filter');
        editorField = this.buildNumber(field, 'editor');
        break;
      case 'datetime':
        filterField = this.buildDatetime(field, 'filter');
        editorField = this.buildDatetime(field, 'editor');
        break;
      case 'switch':
        filterField = this.buildSwitch(field, 'filter');
        editorField = this.buildSwitch(field, 'editor');
        break;
      case 'select':
        filterField = this.buildSelect(field, 'filter');
        editorField = this.buildSelect(field, 'editor');
        break;
      case 'cascader':
        filterField = this.buildCascader(field, 'filter');
        editorField = this.buildCascader(field, 'editor');
        break;
      case 'collapse':
        editorField = this.buildCollapse(field);
        break;
      default:
        filterField = this.buildInput(field, 'filter');
        editorField = this.buildInput(field, 'editor');
        break;
    }
    if (!field.notAsFilter && field.showType != 'collapse') {
      filters.push(filterField);
    }
    if (!field.notAsEditor) {
      editors.push(editorField);
    }
    if (!field.notAsColumn) {
      const column = {};
      column.key = field.key;
      column.dataIndex = field.key;
      column.title = field.title;
      column.width = field.width;
      column.sorter = field.sorter;
      columns.push(column);
    }
  },

  colWrapper(formItem, field, useFor) {
    const forFilter = useFor === 'filter';
    return getFieldDecorator => (
      <Col key={field.key} span={forFilter ? 6 : 24}>
        <FormItem key={field.key} label={field.title} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {formItem(getFieldDecorator)}
        </FormItem>
      </Col>
    );
  },

  getOptions(useFor, field) {
    const forFilter = useFor === 'filter';
    const options = this.cloneFieldDef(field);
    return {
      initialValue: field.defaultValue,
      disabled: forFilter ? undefined : field.disabled,
      rules: forFilter ? undefined : field.validator,
      options
    };
  },

  cloneFieldDef(field) {
    const options = Object.assign({}, field);
    delete options.key;
    delete options.title;
    delete options.showType;
    delete options.defaultValue;
    delete options.notAsFilter;
    delete options.notAsColumn;
    delete options.notAsEditor;
    return options;
  },

  buildCollapse(field) {

  },

  buildRadio(field, useFor) {
    const fieldOpts = this.getOptions(useFor, field);
    const options = field.options.map((option) =>
      <Radio disabled={fieldOpts.disabled} key={option.key} value={option.key}>{option.value}</Radio>
    );

    return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, { ...fieldOpts })(
      <RadioGroup>{options}</RadioGroup>
    ), field, useFor);
  },

  buildNumber(field, useFor) {
    const fieldOpts = this.getOptions(useFor, field);
    return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, { ...fieldOpts })(
      <InputNumber disabled={fieldOpts.disabled} {...fieldOpts.options} />
    ), field, useFor);
  },

  buildDatetime(field, useFor) {
    const fieldOpts = this.getOptions(useFor, field);
    return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, { ...fieldOpts ? moment(field.defaultValue) : null })(
      <DatePicker disabled={fieldOpts.disabled} {...fieldOpts.options} />
    ), field, useFor);
  },

  buildSwitch(field, useFor) {
    const fieldOpts = this.getOptions(useFor, field);
    return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, { ...fieldOpts })(
      <Switch disabled={fieldOpts.disabled} {...fieldOpts.options} />
    ), field, useFor);
  },

  buildSelect(field, useFor) {
    const fieldOpts = this.getOptions(useFor, field);
    const options = field.options.map((option) =>
      <Option disabled={fieldOpts.disabled} key={option.key} value={option.key}>{option.value}</Option>
    );
    return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, { ...fieldOpts })(
      <Select disabled={fieldOpts.disabled} {...fieldOpts.options}>
        {options}
      </Select>
    ), field, useFor);
  },

  buildCascader(field, useFor) {
    const fieldOpts = this.getOptions(useFor, field);
    return this.olWrapper(getFieldDecorator => getFieldDecorator(field.key, { ...fieldOpts })(
      <Cascader disabled={fieldOpts.disabled} {...fieldOpts.options} />
    ), field, useFor);
  },

  buildInput(field, useFor) {
    const fieldOpts = this.getOptions(useFor, field);
    return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, { ...fieldOpts })(
      <Input disabled={fieldOpts.disabled} {...fieldOpts.options} />
    ), field, useFor);
  }
};

export default Builder;
