import React from 'react';
import { Icon } from 'antd';

// 定义某个表的dataSchema, 结构跟querySchema很相似, 见下面的例子
// 注意: 所有的key不能重复

// 这个配置不只决定了table的schema, 也包括用于新增/删除的表单的schema

module.exports = [
  {
    key: 'id',  // 传递给后端的key
    title: 'ID',  // 前端显示的名字
    // 其实dataType对前端的意义不大, 更重要的是生成后端接口时要用到, 所以要和DB中的类型一致
    // 对java而言, int/float/varchar/datetime会映射为Long/Double/String/Date
    dataType: 'int',  // 数据类型, 目前可用的: int/float/varchar/datetime
    primary: true,
    // 可用的showType: normal/radio/select/checkbox/multiSelect/textarea/image/file/cascader
    showType: 'normal',  // 默认是normal, 就是最普通的输入框
    showInTable: true,  // 这一列是否要在table中展示, 默认true
    disabled: false, // 表单中这一列是否禁止编辑, 默认false
    render: (text, record) => text,// 扩展接口, 决定了这一列渲染成什么样子
  },
  {
    key: 'login',
    title: '用户名',
    dataType: 'varchar',  // 对于普通的input框, 可以设置addonBefore/addonAfter
    placeholder: '请输入用户名',
    sorter: true,
  },
  {
    key: 'name',
    title: '昵称',
    dataType: 'varchar',  // 对于普通的input框, 可以设置addonBefore/addonAfter
    placeholder: '请输入昵称',
  },
  {
    key: 'gender',
    title: '性别',
    dataType: 'int',
    showType: 'radio',
    options: [{ key: '1', value: '男' }, { key: '2', value: '女' }],
    defaultValue: '1',
  },
  {
    key: 'email',
    title: '电子邮件',
    dataType: 'varchar',
    placeholder: '请输入电子邮件',
  },
  {
    key: 'phoneNumber',
    title: '电话号码',
    dataType: 'varchar',
    placeholder: '请输入电话号码',
  },
  {
    key: 'activeStatusFlag',
    title: '状态',
    dataType: 'int',
    showType: 'radio',
    options: [{ key: '1', value: '激活' }, { key: '0', value: '冻结' }],
    defaultValue: '1',
  },
  {
    // 这个key是我预先定义好的, 注意不要冲突
    key: 'singleRecordActions',
    title: '操作',  // 列名
    width: 160,  // 宽度
    actions: [
      {
        name: '更新昵称',
        type: 'update',  // 更新单条记录
        keys: ['name'],  // 允许更新哪些字段, 如果不设置keys, 就允许更所有字段
      },
    ]
  }
];