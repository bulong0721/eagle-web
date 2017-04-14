module.exports = [
  {
    key: 'dashboard',
    name: '我的主页',
    icon: 'laptop',
  },
  {
    key: 'users',
    name: '用户管理',
    icon: 'user',
  },
  {
    key: 'manager',
    name: '综合管理',
    icon: 'api',
  },
  {
    key: 'chart',
    name: '图表控件',
    icon: 'code-o',
    child: [
      {
        key: 'lineChart',
        name: 'LineChart',
        icon: 'line-chart',
      },
      {
        key: 'barChart',
        name: 'BarChart',
        icon: 'bar-chart',
      },
      {
        key: 'areaChart',
        name: 'AreaChart',
        icon: 'area-chart',
      },
    ],
  },
  {
    key: 'navigation',
    name: '一级菜单',
    icon: 'solution',
    child: [
      {
        key: 'navigation1',
        name: '二级菜单',
      },
      {
        key: 'navigation2',
        name: '二级菜单',
        child: [
          {
            key: 'navigation21',
            name: '三级菜单1',
          },
          {
            key: 'navigation22',
            name: '三级菜单2',
          },
        ],
      },
    ],
  },
]
