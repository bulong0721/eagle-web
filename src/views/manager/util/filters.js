import React from 'react';
import { Form, Input, Row, Col, DatePicker, Select, Icon, Radio, InputNumber, Checkbox, Cascader } from 'antd';
import Schemas from './schemas';
import moment from 'moment';
import Logger from '../../../utils/logger';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

const logger = Logger.getLogger('FilterBuilder');

const schemaMap = new Map();
const formMap = new Map();

const Filters = {
  getForm(tableName, schema) {
    const ignoreCache = Schemas.shouldIgnoreSchemaCache(tableName);
    if (formMap.has(tableName)) {
      return formMap.get(tableName);
    } else {
      const newForm = this.createForm(tableName, schema);
      if (!ignoreCache) {
        formMap.set(tableName, newForm);
      }
      return newForm;
    }
  },

  createForm(tableName, schema) {
    const ignoreCache = Schemas.shouldIgnoreSchemaCache(tableName);
    const that = this;
    const tmpComponent = React.createClass({
      componentWillMount() {
        if (schemaMap.has(tableName)) {
          this.schemaCallback = schemaMap.get(tableName);
          return;
        }
        const schemaCallback = that.parse(schema);
        if (!ignoreCache) {
          schemaMap.set(tableName, schemaCallback);
        }
        this.schemaCallback = schemaCallback;
      },
      render() {
        const children = this.schemaCallback(this.props.form.getFieldDecorator);
        return (
          <Form className="ant-advanced-search-form">
            <Row>{children}</Row>
          </Form>);
      }
    });
    return Form.create()(tmpComponent);
  },

  parse(schema) {
    let columns = [];
    schema.forEach((field) => {
      switch (field.showType) {
        case 'select':
          columns.push(this.transformSelect(field));
          break;
        case 'radio':
          columns.push(this.transformRadio(field));
          break;
        case 'checkbox':
          columns.push(this.transformCheckbox(field));
          break;
        case 'multiSelect':
          columns.push(this.transformMultiSelect(field));
          break;
        case 'between':
          columns.push(this.transformBetween(field));
          break;
        case 'cascader':
          columns.push(this.transformCascader(field));
          break;
        default:
          columns.push(this.transformNormal(field));
      }
    });

    return getFieldDecorator => {
      const children = [];
      for (const column of columns) {
        children.push(column(getFieldDecorator));
      }
      return children;
    };
  },

  colWrapper(formItem, field) {
    return getFieldDecorator => (
      <Col key={field.key} span={6}>
        <FormItem key={field.key} label={field.title} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {formItem(getFieldDecorator)}
        </FormItem>
      </Col>
    );
  },

  transformSelect(field) {
    logger.debug('transform field %o to Select component', field);
    const options = [];
    field.options.forEach((option) => {
      options.push(<Option key={option.key} value={option.key}>{option.value}</Option>);
    });

    return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, { initialValue: field.defaultValue })(
      <Select placeholder={field.placeholder || '请选择'} size="default">
        {options}
      </Select>
    ), field);
  },

  transformRadio(field) {
    logger.debug('transform field %o to Radio component', field);
    const options = [];
    field.options.forEach((option) => {
      options.push(<Radio key={option.key} value={option.key}>{option.value}</Radio>);
    });

    return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, { initialValue: field.defaultValue })(
      <RadioGroup>
        {options}
      </RadioGroup>
    ), field);
  },

  transformCheckbox(field) {
    logger.debug('transform field %o to Checkbox component', field);
    const options = [];
    field.options.forEach((option) => {
      options.push({ label: option.value, value: option.key });
    });

    return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, { initialValue: field.defaultValue })(
      <CheckboxGroup options={options} />
    ), field);
  },

  transformMultiSelect(field) {
    logger.debug('transform field %o to MultipleSelect component', field);
    const options = [];
    field.options.forEach((option) => {
      options.push(<Option key={option.key} value={option.key}>{option.value}</Option>);
    });

    return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, { initialValue: field.defaultValue })(
      <Select multiple placeholder={field.placeholder || '请选择'} size="default">
        {options}
      </Select>
    ), field);
  },

  transformCascader(field) {
    logger.debug('transform field %o to Cascader component', field);
    return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, { initialValue: field.defaultValue })(
      <Cascader options={field.options} expandTrigger="hover" placeholder={field.placeholder || '请选择'} size="default" />
    ), field);
  },

  transformNormal(field) {
    switch (field.dataType) {
      case 'int':
        logger.debug('transform field %o to integer input component', field);
        return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, { initialValue: field.defaultValue })(
          <InputNumber max={field.max} min={field.min} placeholder={field.placeholder} />
        ), field);
      case 'float':
        logger.debug('transform field %o to float input component', field);
        return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, { initialValue: field.defaultValue })(
          <InputNumber step={0.01} max={field.max} min={field.min} placeholder={field.placeholder} />
        ), field);
      case 'datetime':
        logger.debug('transform field %o to datetime input component', field);
        return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, { initialValue: field.defaultValue ? moment(field.defaultValue) : null })(
          <DatePicker showTime format={field.dateFormat || "YYYY-MM-DD"} placeholder={field.placeholder} />
        ), field);
      default:
        logger.debug('transform field %o to varchar input component', field);
        return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, { initialValue: field.defaultValue })(
          <Input placeholder={field.placeholder} size="default" addonBefore={field.addonBefore}
            addonAfter={field.addonAfter} />
        ), field);
    }
  },

  betweenColWrapper(beginFormItem, endFormItem, field) {
    return getFieldDecorator => (
      <Col key={`${field.key}Begin`} span={6}>
        <Row>
          <Col span={24}>
            <FormItem key={`${field.key}Begin`} label={field.title} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {beginFormItem(getFieldDecorator)}
            </FormItem>
          </Col>
        </Row>
      </Col>
    );
  },

  transformBetween(field) {
    let beginFormItem;
    let endFormItem;
    const { MonthPicker, RangePicker } = DatePicker;
    switch (field.dataType) {
      case 'int':
        logger.debug('transform field %o to integer BETWEEN component', field);
        beginFormItem = getFieldDecorator => getFieldDecorator(`${field.key}Begin`, { initialValue: field.defaultValueBegin })
          (<InputNumber placeholder={field.placeholderBegin || '最小值'} />);
        endFormItem = getFieldDecorator => getFieldDecorator(`${field.key}End`, { initialValue: field.defaultValueEnd })
          (<InputNumber placeholder={field.placeholderEnd || '最大值'} />);
        return this.betweenColWrapper(beginFormItem, endFormItem, field);
      case 'float':
        logger.debug('transform field %o to float BETWEEN component', field);
        beginFormItem = getFieldDecorator => getFieldDecorator(`${field.key}Begin`, { initialValue: field.defaultValueBegin })
          (<InputNumber step={0.01} size="default" placeholder={field.placeholderBegin || '最小值'} />);
        endFormItem = getFieldDecorator => getFieldDecorator(`${field.key}End`, { initialValue: field.defaultValueEnd })
          (<InputNumber step={0.01} size="default" placeholder={field.placeholderEnd || '最大值'} />);
        return this.betweenColWrapper(beginFormItem, endFormItem, field);
      case 'datetime':
        logger.debug('transform field %o to datetime BETWEEN component', field);
        return getFieldDecorator => (
          <div key={'datetimeBetweenDiv'}>
            <Col key={`${field.key}Begin`} span={6}>
              <FormItem key={`${field.key}Begin`} label={field.title} labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}>
                {getFieldDecorator(`${field.key}Begin`, { initialValue: field.defaultValueBegin ? moment(field.defaultValueBegin) : null })
                  (<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={field.placeholderBegin || '开始日期'} />)}
              </FormItem>
            </Col>
            <Col key={`${field.key}End`} span={6}>
              <FormItem key={`${field.key}End`} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator(`${field.key}End`, { initialValue: field.defaultValueEnd ? moment(field.defaultValueEnd) : null })
                  (<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={field.placeholderEnd || '结束日期'} />)}
              </FormItem>
            </Col>
          </div>
        );
      default:
        logger.error('unknown dataType: %s', field.dataType);
    }
    return null;
  },
};

export default Filters;
