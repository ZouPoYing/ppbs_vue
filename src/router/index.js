import Vue from 'vue'
import Router from 'vue-router'
import Login from "../views/LoginAndRegist/Login";
import Regist from "../views/LoginAndRegist/Regist";
import ForgetPassword from "../views/LoginAndRegist/ForgetPassword";
import Setting from "../views/LoginAndRegist/Setting";
import Home from "../views/home";
import QualiAuditApply from "../views/Router/QualiAuditApply";
import QualiAuditSetting from "../views/Router/QualiAuditSetting";
import QualiAudit from "../views/Router/QualiAudit";
import ApplyBuySetting from "../views/Router/ApplyBuySetting";
import ApplyBuyAudit from "../views/Router/ApplyBuyAudit";
import BiddingRoom from "../views/Router/BiddingRoom";
import BiddingDetail from "../views/Router/BiddingDetail";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/regist',
      name: 'Regist',
      component: Regist
    },
    {
      path: '/forgetPassword',
      name: 'ForgetPassword',
      component: ForgetPassword
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/qualiAuditApply',
      name: 'QualiAuditApply',
      component: QualiAuditApply
    },
    {
      path: '/qualiAuditSetting',
      name: 'QualiAuditSetting',
      component: QualiAuditSetting
    },
    {
      path: '/qualiAudit',
      name: 'QualiAudit',
      component: QualiAudit
    },
    {
      path: '/applyBuySetting',
      name: 'ApplyBuySetting',
      component: ApplyBuySetting
    },
    {
      path: '/applyBuyAudit',
      name: 'ApplyBuyAudit',
      component: ApplyBuyAudit
    },
    {
      path: '/biddingRoom',
      name: 'BiddingRoom',
      component: BiddingRoom
    },
    {
      path: '/biddingDetail',
      name: 'BiddingDetail',
      component: BiddingDetail
    }
  ]
})
