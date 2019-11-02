import Vue from 'vue'
import Router from 'vue-router'
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)
let CONFIG = require('../../config/dev.env');
/* Layout */
import Layout from '../views/layout/Layout'
/* configure */
import  Configuration from '../views/configure/index'
/* spc */
import SpcCreate from '../views/spc/create'
import SpcConfig from '../views/spc/config'
import SpcDetail from '../views/spc/detail'
import SpcProcessDetail from '../views/spc/process/detail'
import SpcProcessConfig from '../views/spc/process/config'
/* MSA && DOE*/
import MsaCreate from '../views/msaDoe/create'
import MsaConfig from '../views/msaDoe/config'
import MsaDetail from '../views/msaDoe/detail'

/* 文件夹 */
import Folder from '../views/folder'
import Setting from '../views/setting'
/* 文件夹 */
import TbUserFolder from '../views/home'
import Dashboard from '../views/home/dashboard'
/* 3D */
import Bpy from '../views/bpy'
import Cnc from '../views/bpy/cnc'
import CncReal from '../views/bpy/cncReal'
import CncHis from '../views/bpy/cncHistory'
import CncList from '../views/bpy/cncList'
import CncConfig from '../views/bpy/config'
/* AI管道 */
import Cep from '../views/piping/cep'
import CepDetail from '../views/piping/cepDetail'
/* 监控 */
import Monitor from '../views/monitor'
import Job from '../views/monitor/job'
/* 预警  */
import Warning from '../views/warning/detail'
import WarningConfig from '../views/warning/config'
import Step from '../views/warning/step'

/* 日志 */
import Log from '../views/logger'

/*    email   */
import Email from '../views/email'

import Login from '../views/login/index.vue'
import Update from '../views/login/update.vue'
import ERROR from '../views/errorPage/404.vue'
/* other */
/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
**/

export const constantRouterMap = [
  {
    path: '/',
    component: Layout,
    redirect: 'tb/user/folder',
    children: [
      {
        path: 'tb/user/folder',
        component: TbUserFolder,
        name: 'TbUserFolder',
        meta: { title: '用户文件夹' }
      },
      {
        path: 'dashboard',
        component: Dashboard,
        name: 'Dashboard',
        meta: { title: 'Dashboard' }
      },
      {
        path: 'bpy/daoju',
        component: Bpy,
        name: 'Bpy',
        meta: { title: 'Bpy' }
      },
      {
        path: 'cnc',
        component: Cnc,
        name: 'Cnc',
        meta: { title: '历史查看' }
      },
      {
        path: 'cncReal',
        component: CncReal,
        name: 'CncReal',
        meta: { title: '实时感知分析' }
      },
      {
        path: 'cncHistory',
        component: CncHis,
        name: 'CncHis',
        meta: { title: '实时控制分析' }
      },
      {
        path: 'cncList',
        component: CncList,
        name: 'CncList',
        meta: { title: 'CncList' }
      },
      {
        path: 'cncConfig/:type',
        component: CncConfig,
        name: 'CncConfig',
        meta: { title: 'cnc配置' }
      },
      {
        path: 'config/:type',
        component: Configuration,
        name: 'Configuration',
        meta: { title: '配置' }
      },
      {
        path: 'tb/folder',
        component: Folder,
        name: 'Folder',
        meta: { title: '创建文件夹' }
      },
      {
        path: 'spc/task',
        component: SpcCreate,
        name: 'SpcCreate',
        meta: { title: 'SPC任务配置' }
      },
      {
        path: 'spc/task/:spc_id(\\d+)',
        component: SpcConfig,
        name: 'SpcConfig',
        meta: { title: 'SPC任务配置' }
      },
      {
        path: 'spc/detail/:spc_id(\\d+)',
        component: SpcDetail,
        name: 'SpcDetail',
        meta: { title: 'SPC详情' }
      },
      {
        path: 'spc/process/detail/:spc_id(\\d+)',
        component: SpcProcessDetail,
        name: 'SpcProcessDetail',
        meta: { title: 'SPC制程能力' }
      },
      {
        path: 'spc/process/config/:spc_id(\\d+)',
        component: SpcProcessConfig,
        name: 'SpcProcessConfig',
        meta: { title: 'SPC制程能力配置' }
      },
      {
        path: 'msa/task',
        component: MsaCreate,
        name: 'MsaCreate',
        meta: { title: 'MSA任务配置' }
      },
      {
        path: 'msa/task/:msa_id(\\d+)',
        component: MsaConfig,
        name: 'MsaConfig',
        meta: { title: 'MSA任务配置' }
      },
      {
        path: 'msa/detail/:msa_id(\\d+)',
        component: MsaDetail,
        name: 'MsaDetail',
        meta: { title: 'MSA详情' }
      },
      {
        path: 'piping/gateway/cep/program',
        component: Cep,
        name: 'Cep',
        meta: { title: 'cep项目' }
      },
      {
        path: 'piping/gateway/cep/program/:cep_id(\\d+)',
        component: CepDetail,
        name: 'CepDetail',
        meta: { title: 'cep项目详情' }
      },
      {
        path: 'setting/:id(\\d+)', // dashboard
        component: Setting,
        name: 'Setting',
        meta: { title: '配置' }
      },
      {
        path: 'overview', // 
        component: Monitor,
        name: 'Monitor',
        meta: { title: '监控' }
      },
      {
        path: 'jobs/:id',
        component: Job,
        name: 'Job',
        meta: { title: 'job详情' }
      },
      {
        path: 'spc/warning/:spc_id',
        component: Warning,
        name: 'Warning',
        meta: { title: '预警' }
      },
      {
        path: 'spc/warning/config/:spc_id',
        component: WarningConfig,
        name: 'WarningConfig',
        meta: { title: '预警配置' }
      },
      {
        path: 'spc/warning/step/:step', // 1待处理 2处理中 3 已处理
        component: Step,
        name: 'Step',
        meta: { title: '预警进度详情' }
      },
      {
        path: 'log',
        component: Log,
        name: 'Log',
        meta: { title: '日志' }
      },
      {
        path: 'email',
        component: Email,
        name: 'Email',
        meta: { title: '邮件' }
      }
    ]
  },
  { path: '/regist/:key', component: Update, meta: { title: '用户激活' }, hidden: true },
  { path: '/login', component: Login, meta: { title: CONFIG.TITLE}, hidden: true },
  { path: '/404', component: ERROR, meta: { title: '404' }, hidden: true },
  { path: '*', redirect: '/404', meta: { title: '404' }, hidden: true }
]

export default new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
export const asyncRouterMap = [

]

