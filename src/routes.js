import routesCreator from 'Utils/routes';

export default routesCreator([
  {
    name: '首页',
    path: '/index/default',
    component: import('./routes/IndexPage/IndexPage'),
  },
  {
    name: '分类',
    path: '/classification/default',
    component: import('./routes/IndexPage'),
  },
  {
    name: '提问',
    path: '/ask/default',
    component: import('./routes/Ask/Ask'),
  },
  {
    name: '问题详情',
    path: '/question/default',
    component: import('./routes/QuestionDetail/QuestionDetail'),
  },
  {
    name: '用户信息',
    path: '/user/default',
    component: import('./routes/UserPage/UserPage'),
  },
]);
