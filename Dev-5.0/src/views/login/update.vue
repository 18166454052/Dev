<template>
     <el-row >
        <el-col :xs="{span:20,offset:2}" :sm="{span:18,offset:3}"
            :md="{span:16,offset:4}" :lg="{span:16,offset:4}" :xl="{span:16,offset:4}">
            <el-card  class="box-card" style="margin-top:50px">
            <el-form  class=" Form m-t"  ref="userForm" size="medium" :model="tempUser" :rules="userRules" label-position="right" label-width="100px"
                    >
                <el-col :span="22">
                <el-form-item label="用户名 :"    prop="username">
                <el-input type="text" v-model="tempUser.username"> </el-input>
                </el-form-item>
                <el-form-item label="密码 :"   prop="password">
                <el-input type="password" v-model="tempUser.password"
               
                >
                </el-input>
                </el-form-item>
                <el-form-item label="邮箱 :">
                <el-input type="text" v-model="tempUser.emailAddress">
                </el-input>
                </el-form-item>
                <el-form-item label="昵称 :">
                <el-input type="text" v-model="tempUser.nickname">
                </el-input>
                </el-form-item>

                <el-form-item class="text-center">
                    <el-button  type="primary" size="mini" :laoding="createLoading"
                    @click="submit"
                    >注册</el-button>
                </el-form-item>
                </el-col>
            </el-form>
            </el-card>
        </el-col>
     </el-row>  
</template>
<script>
require("clipboard")
import { update,detail } from "@/api/user/login";
export default {
  data() {
    return {
      createLoading: false,

      tempUser: {
        username: "",
        password: "",
        nickname: "",
        emailAddress: "",
        enabled: 1,
        userKey: ""
      },
      userRules: {
        username: [
          { required: true, message: "请填写用户名", trigger: "change,blur" }
        ],
        password: [
          { required: true, message: "请填写密码", trigger: "change,blur" },
          { min: 5, message: "密码的最小长度为5", trigger: "change,blur" }
        ]
      }
    };
  },
  methods: {
    submit: function() {
      this.$refs.userForm.validate(res => {
        if (res) {
          this.createLoading = true;
          update(
              {
                userId:this.tempUser.userId,
                username:this.tempUser.username,
                password:this.tempUser.password,
                userKey:this.tempUser.userKey,
                emailAddress:this.tempUser.emailAddress,
                enabled:2,
                userKeyOvertime:this.tempUser.userKeyOvertime,
                nickname:this.tempUser.nickname

              }
          ).then(res => {
            this.createLoading = false;
            if (res.code == 200) {
              this.$message.success(res.message);
            } else {
              this.$message.error(res.message);
            }
          });
        }
      });
    },
    getUserDetail:function(){
        detail({userId:'',userKey:this.tempUser.userKey}).then(res=>{
            if(res.code==200){
                Object.assign(this.tempUser,res.data);
                if(res.data.password){//如果有密码  不显示   不判断
                     this.userRules.password=[
                         { min: 5, message: "密码的最小长度为5", trigger: "change,blur" }
                     ];
                     this.tempUser.password="";
                }
            }
            else{
                this.$message.error(res.message);
            }
        });
    }
  },
  mounted: function() {
    
    this.tempUser.userKey = this.$route.params.key;
    this.getUserDetail();
  }
};
</script>
