<template>
    <div>
       <!--user  列表-->
        <el-row v-show="!showUserAdd" >
            <el-col :span="12">
                <el-input
                    placeholder="使用用户名搜索"
                    prefix-icon="el-icon-search"
                    @input="filterUser"
                    v-model="searchUser">
                </el-input>
            </el-col>
            <el-col :span="12" class="text-right">
                <el-button type="primary" size="small"  @click="showUserAdd=true;type='create'">
                        <i class="el-icon-plus m-r-5"></i>创建
                </el-button>
            </el-col>
            <el-col :span="24">
                <div class="m-t-10  CardList">
                    <el-row class="m-t ConfigListTitle">
                        <el-col :span="6" style="padding-left:26px">用户</el-col>
                        
                        <el-col :span="3">是否激活</el-col>
                        <el-col :span="3">创建时间</el-col>
                        <el-col :span="4">角色</el-col>
                        <el-col :span="3"></el-col>
                        <el-col :span="3"></el-col>
                    </el-row>
                    <el-card v-show="filterUserlist.length>0"   class="box-card m-t-5"  :body-style="{padding: '6px' }" 
                        v-for="(per,index) in filterUserlist" :key="per.userId+'_user_'" >
                        <el-row>
                            <el-col :span="6" style="line-height:28px;padding-left:20px">
                                &nbsp;<span>{{per.username}}</span>
                            </el-col>
                            
                            <el-col :span="3" style="line-height:28px">
                                &nbsp;
                                 <span>{{per.password?"已激活":"未激活"}}</span> 
                            </el-col>
                            <el-col :span="3" style="line-height:28px">
                                &nbsp;<span>{{per.createTime | unixTime}}</span>
                            </el-col>
                            <el-col :span="4">
                                  <el-select v-model="per.userRole" 
                                @change="userUpdate(per,index)"  
                                size="mini">
                                <el-option v-for="p in permission"
                                :label="p.name"
                                :value="p.id"
                                :key="'@'+p.id"
                                >

                                </el-option>
                            </el-select>
                            
                            </el-col>
                             <el-col :span="3" class="text-center">
                                 &nbsp; <el-button  type="primary" size="mini" plain  class="copy"
                                 :data-clipboard-text="'http://localhost:9527/regist/'+ per.userKey"
                                 @click="copy()"
                                 >复制链接</el-button>
                             </el-col>
                             <el-col :span="3" class="text-center">
                                &nbsp;
                                <el-button size="mini" type="info" plain  @click="refreshUserKey(per)">刷新</el-button>
                            </el-col>
                            <el-col :span="2" class="text-right">
                                 <!-- <el-button @click="showUpdate(per,index)" type="primary" size="mini"><i class="el-icon-edit"></i></el-button> -->
                                <el-button @click="deleteUser(per,index)" type="warning" size="mini"><i class="el-icon-close"></i></el-button>
                            </el-col>
                        </el-row>
                        
                        
                    </el-card>
                    <div class="Empty text-center" v-show="filterUserlist.length==0">
                            没有查询到用户数据
                    </div>
                    

                </div>

            </el-col>
         </el-row>
       <!--创建user-->
      <el-form v-show="showUserAdd"  class=" Form "  ref="userForm" size="medium" :model="tempUser" :rules="userRules" label-position="right" label-width="100px"
              >
        <el-col :span="22">
        <el-form-item label="用户名 :"    prop="username">
         <el-input type="text" v-model="tempUser.username"> </el-input>
        </el-form-item>
        <!-- <el-form-item label="密码 :"   prop="password">
          <el-input type="password" v-model="tempUser.password">
          </el-input>
        </el-form-item> -->
        <el-form-item label="角色 :" required   prop="userRole">
          <el-select v-model="tempUser.userRole"  placeholder="请选择角色">
            <el-option
              v-for="item in permission"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="部门 :">
          <el-select v-model="tempUser.tbDepartmentId"  placeholder="请选择所属部门">
             <el-option v-for="child in tree"
                    :key="child.id"
                    :label="child.name"
                    :value="child.id"
                 >
                  <span>{{"----".repeat(child.index) + child.name }}</span>
                 </el-option>
          </el-select>
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
            <el-button  type="primary" @click="createUser" size="mini" :laoding="createLoading">保存</el-button>
             <el-button  @click="back" size="mini">返回</el-button>
        </el-form-item>
        </el-col>
      </el-form>
      <el-input
         v-show="false"
        id="input"
        v-model="textarea">
        </el-input>
    </div>
</template>
<script>
import { addUser, userList, updateUser, deleteUser
}  from "@/api/config/user.js"
import { list } from "@/api/config/department"
import { refresh }  from "@/api/user/login"
import Clipboard from 'clipboard';
export default {
    data(){
        return {
            clipboard:'',
            url:'http://localhost:9527/regist/',
            textarea:'',
            type:'',
            showUserAdd:false,
            createLoading:false,
            searchUser:'',
            updateUserPermission:'',
            permission:[
                { id:2,name:'Admin'},
                { id:3,name:'Edit'},
                { id:4,name:'View'},
            ],
            tempUser: {
                username: "",
                password: "",
                nickname: "",
                userRole: "",
                emailAddress:"",
                enabled: 2,
                tbDepartmentId:""
            },
            userRules:{
                username:[
                {required:true,message:'请填写用户名',trigger:'change,blur'}
                ],
                // password: [
                // {required:true,message:'请填写密码',trigger:'change,blur'},
                //  { min: 5, message: '密码的最小长度为5', trigger: 'change,blur' }
                // ],
                userRole:[
                {required:true,message:'请选择角色',trigger:'change,blur'}
                ]
            },
            filterUserlist:[],
            userList:[
                // {
                //     username:'name',
                //     userId:123456,
                //     userRole:1,
                //     userId:'123',
                //     emailAddress:'111@qq.com',
                //     createTime:'11111'
                // }
            ],
            tree:[],
        }
    },
    methods:{
        createUser:function(){
             this.$refs.userForm.validate(res=>{
                 this.createLoading=true;
                addUser(this.tempUser).then(res=>{
                   
                    if(res.code==200){
                       // this.userList.unshift(res.data);
                        this.$message.success(res.message);
                        this.back();
                        this.getUserlist();
                    }
                    else{
                        this.$message.error(res.message);
                    }
                });
             });
        },
        back:function(){
            this.tempUser={
                username: "",
                password: "",
                nickname: "",
                userRole: "",
                emailAddress:"",
                tbDepartmentId:'',
                enabled: 2     // 默认无效   激活
            }
            this.$refs.userForm.resetFields();
            this.createLoading=false;
            this.showUserAdd=false;

        },
        deleteUser:function(user,index){
            this.$confirm('确定删除用户'+ user.username+'?', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
            }).then(()=>{ 
                  deleteUser({userId:user.userId}).then(res=>{
                 if(res.code==200){
                     this.$message.success('删除用户成功');
                     this.userList.splice(index,1);
                     this.filterUserlist.splice(index,1);
                 }
                 else{
                      this.$message.error(res.message);
                 }
                  });
            }).catch(()=>{}) 
        },
        userUpdate:function(user,index){
            updateUser(user).then(res=>{
                console.log(res);
                 if(res.code==200){
                     this.$message.success('修改用户角色成功');
                     this.userList.splice(index,1,res.data);
                 }
                 else{
                      this.$message.error(res.message);
                 }
            });
        },
        getUserlist:function(){
            userList({}).then(res=>{
                if(res.code==200){
                    this.userList=res.data.list.slice();
                    this.filterUserlist=res.data.list.slice();
                }
                else{
                    this.$message.error(res.message);
                }
                
            });
        },
        filterUser:function(){
            
            if(this.searchUser){
                if(this.userList.length>0){
                    let reg=new RegExp('.*'+this.searchUser+'.*','i');
                    this.filterUserlist=this.userList.filter(user=>{
                       
                        if(reg.test(user.username)){
                           //console.log(user.username);
                            return user;
                        }
                    });
                }
                else{
                     this.filterUserlist=this.userList.slice(); 
                }
            }
            else{
                console.log('no searh');
                console.log()
               this.filterUserlist=this.userList.slice();  
            }
           
          
        },
        showUpdate:function(user,index){
             this.tempUser=Object.assign(user);
             this.showUserAdd=true;
        },
        copy(){
            this.clipboard.on('success',() => {
                this.$message.success('复制成功')
                this.clipboard=null;
                this.clipboard = new Clipboard('.copy');
            })
            this.clipboard.on('error', () => {
                this.$message.error('复制失败')
            })
        },
        refreshUserKey:function(user){
            refresh({userId:user.userId}).then(res=>{
               if(res.code==200){
                   this.$message.success(res.message);
               }
               else{
                   this.$message.error(res.message);
               }
           });
        },
        getDepartmentList:function(){
            list().then(res=>{  
                if(res.code==200){
               
                   this.getTreeArr()(res.data.tree);
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        getTreeArr:function (){
           let treeArr=this.tree,index=0;

          return function getTree (arr){
                if(arr.length>0){
                  arr.forEach(item=>{
                    item.index=index; 
                    treeArr.push(item);
                    if(!item.childrenList){
                        index=0;
                    }
                    if(item.childrenList){
                        index++;
                        getTree(item.childrenList);
                    }
                 });
            }
          }
           
        }
        
    },
    computed:{
        
    },
    created:function(){
       
       this.clipboard = new Clipboard('.copy');
        this.getUserlist();
        this.getDepartmentList();
        this.$on('init',()=>{
           this.showUserAdd=false;
           this.searchUser="";
           this.filterUser();
       })
    },
    mounted:function(){

    },
    beforeDestroy:function(){
        this.clipboard=null;
    }
}
</script>
<style>
.copy .el-button:hover{
    color:#fff;
}
</style>


