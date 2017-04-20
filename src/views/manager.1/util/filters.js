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

  parse(schema) {
    let columns = [];
    let filterFields = [];
    let editorFields = [];
    schema.fields.forEach((field) => {
      
    });

    return getFieldDecorator => {
      return columns.map(column => column(getFieldDecorator));
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

  
};

export default Filters;
