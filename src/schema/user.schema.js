module.exports = {
  actions: [
    { icon: 'plus-circle-o', type: 'primary', title: '新增', action: 'import' },
    { icon: 'edit', title: '修改', action: 'import' },
    { icon: 'delete', title: '删除', action: 'import' },
    { icon: 'import', title: '导入', action: 'import' },
    { icon: 'export', title: '导出', action: 'app/handleMgrTest', popupEditor: true, },
  ],
  fields: [
    {
      key: 'login',
      title: '用户名',
      showType: 'normal',
    },
    {
      key: 'name',
      title: '昵称',
      showType: 'normal',
    },
    {
      key: 'email',
      title: '电子邮件',
      showType: 'normal',
    },
    {
      key: 'activeStatusFlag',
      title: '账号状态',
      showType: 'radio',
      options: [{ key: 'typeA', value: '激活' }, { key: 'typeB', value: '冻结' }],
      defaultValue: 'typeA',
    },
    {
      key: 'phoneNumber',
      title: '电话号码',
      showType: 'normal',
      addonBefore: '+86',
    },
    {
      key: 'dateLogined',
      title: '登录时间',
      showType: 'datetime',
    },
    {
      key: 'type',
      title: '单选类型',
      showType: 'select',
      options: [{ key: '1', value: '类型1' }, { key: '2', value: '类型2' }],
      defaultValue: '1',
    },
    {
      key: 'score',
      title: '整数表单',
      showType: 'input',
    },
    {
      key: 'height',
      title: '身高(cm)',
      placeholder: '可输小数',
      showType: 'number',
    },
    {
      key: 'work',
      title: '工作年限',
      showType: 'number',
      defaultValue: 5
    },
    {
      key: 'duoxuan3',
      title: '多选参数',
      showType: 'select',
      multiple: true,
      options: [{ key: 'K', value: '开' }, { key: 'F', value: '封' }, { key: 'C', value: '菜' }],
      defaultValue: ['K', 'F', 'C'],
    },
    {
      key: 'xxbirthday',
      title: '创建日期',
      showType: 'datetime',
    },
  ]
}