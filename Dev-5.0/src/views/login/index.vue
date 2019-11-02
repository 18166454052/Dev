<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm"  ref="loginForm" label-position="left">
      <div class="title-container">
        <h3 class="title">{{TITLE}}</h3>
        <!--<lang-select class="set-language"></lang-select>-->
      </div>
      <el-form-item >
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名" />
      </el-form-item>
      <el-form-item >
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="密码" />
        <!--<span class="show-pwd" @click="showPwd">-->
          <!--<svg-icon icon-class="eye" />-->
        <!--</span>-->
      </el-form-item>

      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">{{$t('login.logIn')}}</el-button>

      <!--<div class="tips text-center">-->
        <!--<span>没有用户名？ <el-button type="text"><router-link to="/regist">点击注册</router-link></el-button></span>-->
      <!--</div>-->
      <!--<div class="tips">-->
        <!--<span style="margin-right:18px;">{{$t('login.username')}} : editor</span>-->
        <!--<span>{{$t('login.password')}} : {{$t('login.any')}}</span>-->
      <!--</div>-->

      <!--<el-button class="thirdparty-button" type="primary" @click="showDialog=true">{{$t('login.thirdparty')}}</el-button>-->

    </el-form>

    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog" append-to-body>
      {{$t('login.thirdpartyTips')}}
      <br/>
      <br/>
      <br/>
      <social-sign />
    </el-dialog>

  </div>
</template>

<script>
let CONFIG = require('../../../config/dev.env');
import LangSelect from '@/components/LangSelect'
import SocialSign from './socialsignin'
import {setActive} from "@/utils/auth";
import { userInfo } from "@/api/config/user"
export default {
  components: { LangSelect, SocialSign },
  name: 'login',
  data() {
   
//    const validateUsername = (rule, value, callback) => {
//      if (!isvalidUsername(value)) {
//        callback(new Error('Please enter the correct user name'))
//      } else {
//        callback()
//      }
//    }
//    const validatePassword = (rule, value, callback) => {
//      if (value.length < 6) {
//        callback(new Error('The password can not be less than 6 digits'))
//      } else {
//        callback()
//      }
//    }
    return {
       TITLE:CONFIG.TITLE,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        login_name: [{ required: true, trigger: 'blur', message: 'username is required' }],
        password: [{ required: true, trigger: 'blur', validator: 'password is required' }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false
    }
  },
  methods: {
    handleLogin() {
      let self = this;
       self.loading = true;
      console.log(self.loginForm);
       self.$store.dispatch('LoginByUsername', self.loginForm).then((res)=>{
         if(res.code==200){
           //setActive('1-1'); 
            self.$store.commit('SET_ACTIVEINDEX','2-1'); 
            self.$router.replace('/')
         }
         else{
           self.loading = false ;
            self.$message.error(res.message);
         }
           
       }).catch(function(error){
         //本地代码报错  服务器报错
         console.log(error);
         let err='';
         if(error.message){
            err=error.message;
         }
         else{
             err='请求发生错误,请稍后重新登录';
             //err=error.ReferenceError;
         }
            self.loading = false ;
            self.$message.error(err);
       });
      // self.$refs.loginForm.validate(valid => {
      //   if (valid) {
      //     self.loading = true ;
      //     // console.log(self.loginForm);
      //     self.$store.dispatch('LoginByUsername', self.loginForm).then(() => {
      //       // this.loading = fals
      //       console.log('******');
      //       self.$router.push({ path: '/' })
      //     }).catch(function(error){
      //       // console.log(error);
      //       self.loading = false ;
      //       self.$message({
      //         message: error.msg,
      //         type: 'error'
      //       });
      //     })
      //   } else {
      //     return false
      //   }
      // })
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin:180px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
