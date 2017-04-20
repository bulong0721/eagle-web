module.exports = {
  actions: [],
  fields: [
    {
      key: 'login',
      title: '用户名',
      dataType: 'varchar',
      showType: 'normal',
    },
    {
      key: 'name',
      title: '昵称',
      dataType: 'varchar',
      showType: 'normal',
    },
    {
      key: 'email',
      title: '电子邮件',
      dataType: 'varchar',
      showType: 'normal',
    },
    {
      key: 'activeStatusFlag',
      title: '账号状态',
      dataType: 'varchar',
      showType: 'radio',
      options: [{ key: 'typeA', value: '激活' }, { key: 'typeB', value: '冻结' }],
      defaultValue: 'typeA',
    },
    {
      key: 'phoneNumber',
      title: '电话号码',
      dataType: 'varchar',
      showType: 'normal',
      addonBefore: '+86',
    },
    {
      key: 'dateLogined',
      title: '登录时间',
      dataType: 'datetime',
    },
    {
      key: 'type',
      title: '单选类型',
      dataType: 'int',
      showType: 'select',
      options: [{ key: '1', value: '类型1' }, { key: '2', value: '类型2' }],
      defaultValue: '1',
    },
    {
      key: 'score',
      title: '整数表单',
      dataType: 'int',
      showType: 'between',  // 整数范围查询, 对于范围查询, 会自动生成xxBegin/xxEnd两个key传递给后端
      defaultValueBegin: 9,  // 对于between类型不搞max/min了, 太繁琐
      defaultValueEnd: 99,
    },
    {
      key: 'height',
      title: '身高(cm)',
      placeholder: '可输小数',
      dataType: 'float',  // 小数等值查询
    },
    {
      key: 'work',
      title: '工作年限',
      dataType: 'int',
      min: 3,
      defaultValue: 5
    },
    {
      key: 'duoxuan3',
      title: '多选参数',
      dataType: 'varchar',
      showType: 'multiSelect',
      options: [{ key: 'K', value: '开' }, { key: 'F', value: '封' }, { key: 'C', value: '菜' }],
      defaultValue: ['K', 'F', 'C'],
    },
    {
      key: 'xxbirthday',
      title: '创建日期',
      dataType: 'datetime',
    },
  ]
}