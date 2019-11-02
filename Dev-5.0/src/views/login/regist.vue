<template>
  <div class="login-regist-box clearfix">
    <el-card class="log-regist-card">

      <!--<a href="../workspace.html"><el-button type="text"><i class="el-icon-back"></i>&nbsp;&nbsp;返回首页</el-button></a>-->
      <!--<el-col :span="10" :offset="1" class="text-center log-reg" :class="{choice:showRegist}">-->
      <!--<div><el-button type="text" @click="toggle">注册</el-button></div>-->
      <!--</el-col>-->
      <!--<el-col :span="10" :offset="1"  class="text-center log-reg" :class="{choice:!showRegist}">-->
      <!--<div  @click="toggle"><el-button type="text">登录</el-button></div>-->
      <!--</el-col>-->

      <!--------注册---------->
      <el-form :model="registForm" :rules="registRules"  ref="registForm"  label-width="80px">
        <!--<el-form-item>-->
        <!--<a href="../cep/index.html"><el-button type="text"><i class="el-icon-back"></i>&nbsp;&nbsp;返回首页</el-button></a>-->

        <!--</el-form-item>-->
        <el-collapse v-model="activeCollapse">
          <el-collapse-item title="公司信息：" name="1">
            <el-form-item  prop="tenantname" label="公司名称" class="is-required">
              <el-input v-model="registForm.tenantname" placeholder="公司名称" ></el-input>
            </el-form-item>
            <el-form-item  prop="mobile" label="手机号">
              <el-input v-model="registForm.mobile" placeholder="手机号" ></el-input>
            </el-form-item>
            <el-form-item  prop="landline_number" label="座机号">
              <el-input v-model="registForm.landline_number" placeholder="座机号" ></el-input>
            </el-form-item>
            <el-form-item  prop="email" label="电子邮箱">
              <el-input v-model="registForm.email" placeholder="电子邮箱" ></el-input>
            </el-form-item>
            <el-form-item  prop="province_id" label="省-市-区">
              <el-select v-model="registForm.province_id" placeholder="请选择省" @change="getCity">
                <el-option
                  v-for="item in provinces"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select v-model="registForm.city_id" placeholder="请选择市" v-show='showCity' @change="getDistrict" style="margin:0 17px">
                <el-option
                  v-for="item in citys"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select v-model="registForm.district_id" placeholder="请选择区" v-show='showDistrict'>
                <el-option
                  v-for="item in districts"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>

            </el-form-item>
            <el-form-item  prop="address" label="详细地址">
              <el-input v-model="registForm.address" placeholder="详细地址" ></el-input>
            </el-form-item>

          </el-collapse-item>


          <el-collapse-item title="管理员信息：" name="2">
            <el-form-item  prop="username" label="用户姓名" class="is-required">
              <el-input v-model="registForm.username" placeholder="用户姓名" @input="checkUserName" ></el-input>
              <!--<input class="el-input__inner"  v-model="registForm.username" placeholder="用户姓名" @change="checkUserName">-->
            </el-form-item>
            <el-form-item  prop="login_name" label="登录账号" class="is-required">
              <el-input v-model="registForm.login_name" placeholder="登录账号" ></el-input>
            </el-form-item>
            <el-form-item  prop="password" label="密码" class="is-required">
              <el-input v-model="registForm.password"  placeholder="密码"  type="password"></el-input>
            </el-form-item>
            <el-form-item  prop="user_mobile" label="手机号">
              <el-input v-model="registForm.user_mobile" placeholder="用户手机号" ></el-input>
            </el-form-item>
            <el-form-item  prop="user_email" label="电子邮箱">
              <el-input v-model="registForm.user_email" placeholder="用户电子邮箱" ></el-input>
            </el-form-item>
          </el-collapse-item>

        </el-collapse>

        <!--<el-form-item  prop="verification">-->
        <!--<el-col :span="19">-->
        <!--<el-input v-model="registForm.verification" placeholder="验证码" >-->
        <!--</el-input>-->
        <!--</el-col>-->
        <!--<el-col :span="5" class="text-center verification">-->
        <!--<img :src="logo"  @click="getVerification" style="height:38px;width:82px;border:1px solid #ccc;position:relative;top:0px;left:5px;border-radius:5px">-->
        <!--</el-col>-->

        <!--</el-form-item>-->
        <!--<el-form-item  prop="sms">-->
        <!--<el-col :span="19">-->
        <!--<el-input v-model="registForm.sms" placeholder="短信验证码" >-->
        <!--</el-input>-->
        <!--</el-col>-->
        <!--<el-col :span="5" class="text-center">-->
        <!--<el-button type="text" @click="getCms" :disabled="registSubmitDisabled">获取验证码</el-button>-->
        <!--</el-col>-->
        <!--</el-form-item>-->
        <!--<el-form-item  prop="pass">-->
        <!--<el-input v-model="registForm.pass" placeholder="密码"  type="password"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item class="text-center" style="margin-top:20px">
          <el-button type="primary" @click="submitForm('registForm')" :loading="registSubmitDisabled">{{registSubmitCon}}</el-button>
          <el-button @click="resetForm('registForm')">Reset</el-button>
        </el-form-item>
        <el-form-item class="text-center">
          已有账号？<el-button type="text"><router-link to="/login">立即登录</router-link></el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>

<script>
  import { getProvince , getCity , getDistrict, regist } from  '@/api/user/regist'
  export default {
    data() {
      var regName = (rule, value, callback) => {
        if(value==''){
          callback(new Error('请输入名称'));
        }
        else if( value.length>20){
          callback(new Error('名称应该小于20个字符'));
        }
        else{
          callback();
        }
      };
      var regPhone = (rule, value, callback) => {
        var reg1 = /\d{3}-\d{8}|\d{4}-\d{7}/;
        var reg2 = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if(value==''){
          callback(new Error('请输入手机号码'));
        }
        else if(!(reg1.test(value) || reg2.test(value))){
          callback(new Error('手机号码的格式错误'));
        }
        else{
          callback();
        }
      };
      var regLandlineNumber = (rule, value, callback) => {
        var reg = /\d{3}-\d{8}|\d{4}-\d{7}/;
        if(value==''){
          callback(new Error('请输入座机号'));
        }
        else if(!(reg.test(value))){
          callback(new Error('座机号的格式错误'));
        }
        else{
          callback();
        }
      };
      var regEmail= (rule, value, callback) => {
        var reg =  /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if(value==''){
          callback(new Error('请输入电子邮箱'));
        }
        else if(!(reg.test(value))){
          callback(new Error('电子邮箱的格式错误'));
        }
        else{
          callback();
        }
      };
      var regProvince= (rule, value, callback) => {

        if(value==""){
          callback(new Error('请选择省'));
        }
        else{
          callback();
        }
      };
      var regCity= (rule, value, callback) => {

        if(value==""){
          callback(new Error('请选择市'));
        }
        else{
          callback();
        }
      };
      var regAddress= (rule, value, callback) => {

        if(value==""){
          callback(new Error('请输入详细地址'));
        }
        else if (value.length>30){
          callback(new Error('输入详细地址应小于30个字符'));
        }
        else{
          callback();
        }
      };
      var regPass= (rule, value, callback) => {

        if(value==""){
          callback(new Error('请输入登录密码'));
        }
        else if (value.length<6 || value.length>20){
          callback(new Error('登陆密码的长度应为6-20'));
        }
        else{
          callback();
        }
      };
      var checkSms= (rule, value, callback) => {
        if(value==''){
          callback(new Error('请输入短信验证码'));
        }
        else if(value.length!==6){
          callback(new Error('短信验证码为6位'));
        }
        else{
          callback();
        }
      };
      var verification= (rule, value, callback) => {
        if(value==''){
          callback(new Error('请输入验证码'));
        }
        else if(value.length!==6){
          callback(new Error('验证码为6位'));
        }
        else if(value!==this.verification){
          callback(new Error('验证码错误'));
        }
        else{
          callback();
        }
      };
      return {
       // logo:logo,
        registSubmitDisabled:false,
        registSubmitCon: 'Regist',
        verification:'123456',//从服务器获取的图片验证码
        activeCollapse:['1'],
        registForm: {
          tenantname:'',
          mobile:'',
          landline_number:'',
          email:'',
          province_id:'',
          city_id:'',
          district_id:'',
          address:'',
          username:'',
          login_name:'',
          password:'',
          user_mobile:'',
          user_email:''


        },
        registRules: {
          tenantname: [
            { validator: regName, trigger: 'change,blur' }
          ],
          mobile: [
            { validator: regPhone, trigger: 'change,blur' }
          ],
          landline_number: [
            { validator: regLandlineNumber, trigger: 'change,blur' }
          ],
          email: [
            { validator: regEmail, trigger: 'change,blur' }
          ],
          province_id: [
            { validator: regProvince,trigger: 'change,visible-change' }
          ],
          city_id: [
            { validator: regCity,trigger: 'change,visible-change' }
          ],
          district_id: [
            { required:true,message:'请选择区域',trigger: 'change,visible-change' }
          ],
          address:[
            { validator: regAddress, trigger: 'change,blur' }
          ],
          username: [
            { validator: regName, trigger: 'change,blur' }
          ],
          login_name: [
            { validator: regName, trigger: 'change,blur' }

          ],
          password: [
            { validator: regPass, trigger: 'change,blur' }
          ],
          user_mobile: [
            { validator: regPhone, trigger: 'change,blur' }
          ],
          user_email: [
            { validator: regEmail, trigger: 'change,blur' }
          ],
        },
        provinces:[],
        citys:[ ],
        districts:[]

      }
    },
    methods: {
      getCms:function(){//在获取验证码之前先验证手机是否正确
        var self=this;
        self.$refs.registForm.validateField('phone',function(val){
          if(!val){//true
            //ajax获取验证码
            self.registForm.sms=(Math.random()).toString().substr(2,6);
          }});
      },
      getCity:function(val){
        let self=this;
        self.registForm.city_id="";
        self.registForm.district_id="";
        self.citys=[];
        self.districts=[];
        getCity(val).then(response=>{
          if(response.resCode==0){
            self.citys=response.data;
          }
        });
      },
      getDistrict:function(val){
        let self=this;
        getDistrict(val).then(response=>{
          console.log(response);
          if(response.resCode==0){
            self.districts=response.data;
          }
        });
      },
      checkUserName:function(){
        if(this.registForm.username!=='123456'){

        }
      },
      submitForm:function(formName) {
        var self=this;
        self.$refs[formName].validate((valid) => {
          if (valid) {
            self.registSubmitDisabled=true;
            console.log(self.registForm);
            regist(self.registForm).then(function(response){
              console.log(response);
              if(response.resCode==0){
                self.registSubmitDisabled=false;
                self.$message({
                  message: response.msg,
                  type: 'success'
                });
                setTimeout(function(){ self.$router.push('/login') },1000);
              }
              else{
                self.registSubmitDisabled=false;
                self.$message({
                  message: response.msg,
                  type: 'error'
                });
              }

            }).catch((err)=>{

            });

          } else {

          }
        });
      },
      resetForm:function(formName) {
        this.registSubmitDisabled=false;
        this.registSubmitCon='注册';
        this.$refs[formName].resetFields();
        console.log(this.registForm);

      }

    },
    computed:{
      showCity:function(){
        return  this.registForm.province_id==""?false:true;
      },
      showDistrict:function(){
        if(this.registForm.city_id==""|| this.registForm.province_id==""){
          return false;
        }
        else if(this.registForm.city_id!==""){
          return true;
        }

      }
    },
    mounted (){
      let self=this;
      getProvince().then(response=>{
        console.log(response);
        if(response.resCode==0){
          self.provinces=response.data;
        }
      });
    }
  }
</script>

<style scoped>
  .login-regist-box{
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background-color:#f3f3f4;
    overflow:scroll;
  }
  .verification{
    line-height:0;
  }
  .el-form-item.is-required .el-form-item__label:before{
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
</style>
