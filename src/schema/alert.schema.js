module.exports = {
  actions: [
    { icon: 'export', title: '导出', action: 'app/handleMgrTest', popupEditor: true, },
  ],
  fields: [
    {
      key: 'level',
      title: '告警级别',
      showType: 'select',
      options: [{ key: '1', value: '普通告警' }, { key: '2', value: '严重告警' }],
      defaultValue: '1',
    },
    {
      key: 'host',
      title: '主机名称',
      showType: 'input',
    },
    {
      key: 'time',
      title: '发生时间',
      showType: 'datetime',
      notAsFilter: true,
    },
    {
      key: 'durtion',
      title: '持续时间',
      showType: 'input',
      notAsFilter: true,
    },
    {
      key: 'event',
      title: '事件',
      showType: 'input',
      notAsFilter: true,
    }
  ]
}