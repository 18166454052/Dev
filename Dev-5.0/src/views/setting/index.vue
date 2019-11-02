<template>
  <div class="app-container">

         <el-row>
              <el-col :xs="{span:20,offset:2}" :sm="{span:18,offset:3}"
                 :md="{span:16,offset:4}" :lg="{span:16,offset:4}" :xl="{span:16,offset:4}">
                 <el-tabs v-model="activeName" type="border-card">
                    <el-tab-pane  name="Dashboard">
                        <span slot="label"><i class="el-icon-menu m-r-5" ></i>Dashboard</span>
                        <div>
                            <el-row>
                                <el-col :span="12">
                                    <el-input
                                        prefix-icon="el-icon-search"
                                        @input="filterTasks"
                                        v-model="searchDashboard">
                                    </el-input>
                                </el-col>
                                <el-col :span="12" class="text-right">
                                    <el-button type="success" size="small">
                                         <i class="el-icon-plus m-r-5"></i>仪表盘
                                    </el-button>
                                </el-col>
                            </el-row>
                            <div class="m-t">
                                <el-row>
                                    <el-col  :span="12" style="line-height:32px;padding-left:11px;">
                                        <el-checkbox  v-model="checkedAll" @change="checkAll"></el-checkbox>
                                    </el-col>
                                    <el-col  :span="12"  class="text-right">
                                         <el-button v-show="checkedDashboard.length>0" type="primary" size="small" @click="showMovelist=true"><i class=" m-r-5"></i>移动到</el-button>
                                         <el-button v-show="checkedDashboard.length>0" type="warning" size="small" @click="deleteList" :loading="deleteListLoading"><i class="el-icon-delete m-r-5" ></i>删除</el-button>
                                    </el-col>
                                </el-row>
                                <div class="m-t SETTING CardList">
                                    <el-card class="box-card m-t-5"  :body-style="{padding: '10px' }" 
                                        v-show="filterFolderTasks.msa.length>0"
                                        v-for="msa in filterFolderTasks.msa"  :key="msa.msaTaskId+'msa'">
                                        <el-row>
                                            <el-col :span="20">
                                            <el-checkbox  :label="msa.msaTaskId" v-model="checkedDashboard" @change="checked"/>
                                            <i class="el-icon-menu" style="margin:0 8px;font-size:16px;color:#999;position:relative;top:2px"></i>
                                             
                                            <span>{{msa.msaTaskName}}</span>
                                            </el-col>
                                            <el-col :span="4" class="text-right" style="padding-right:15px;color:#bbb">
                                                MSA
                                            </el-col>
                                        </el-row>
                                    </el-card>
                                    <el-card class="box-card m-t-5"  :body-style="{padding: '10px' }" 
                                        v-show="filterFolderTasks.spc.length>0"
                                        v-for="spc in filterFolderTasks.spc"  :key="spc.spcTaskId+'spc'">
                                        <el-row>
                                            <el-col :span="20">
                                            <el-checkbox  :label="spc.spcTaskId" v-model="checkedDashboard" @change="checked"/>
                                            <i class="el-icon-menu" style="margin:0 8px;font-size:16px;color:#999;position:relative;top:2px"></i>
                                            <span>{{spc.spcTaskName}}</span>
                                            </el-col>
                                            <el-col :span="4" class="text-right" style="padding-right:15px;color:#bbb">
                                                SPC
                                            </el-col>
                                        </el-row>
                                    </el-card>
                                    <el-card class="box-card m-t-5"  :body-style="{padding: '10px' }" 
                                        v-show="filterFolderTasks.piping.length>0"
                                        v-for="piping in filterFolderTasks.piping"  :key="piping.cepProgramId+'piping'">
                                        <el-row>
                                            <el-col :span="20">
                                            <el-checkbox  :label="piping.cepProgramId" v-model="checkedDashboard" @change="checked"/>
                                            <i class="el-icon-menu" style="margin:0 8px;font-size:16px;color:#999;position:relative;top:2px"></i>
                                            <span>{{piping.programName}}</span>
                                            </el-col>
                                            <el-col :span="4" class="text-right" style="padding-right:15px;color:#bbb">
                                                Piping
                                            </el-col>
                                        </el-row>
                                    </el-card>

                                    <div class="Empty text-center" v-show="folderTasks.piping && folderTasks.msa && folderTasks.spc &&  folderTasks.piping.length==0 && folderTasks.msa.length==0 && folderTasks.spc.length==0">
                                        该文件夹还没有绑定任何数据
                                    </div>
                                </div>
                               
                            </div>       
                        </div>
                    </el-tab-pane>
                    <el-tab-pane  name="permission">
                        <span slot="label"><i class="el-icon-goods m-r-5" ></i>权限</span>
                        <div>
                            <el-row>
                               <el-col :span="24" class="text-right">
                                   <el-button type="success" size="small" @click="showAddPermission=true">
                                       <i class="el-icon-plus m-r-5"></i>添加权限
                                   </el-button>
                               </el-col>
                               <el-col :span="24" class="addPermission m-t " v-show="showAddPermission">
                                   <el-card class="box-card">
                                        <div slot="header" >
                                            <el-button style="float: right; padding: 3px 0" type="text"
                                            @click="showAddPermission=false"
                                            >
                                                <i class="el-icon-close"></i></el-button>
                                        </div>
                                        <div>
                                            <el-form :inline="true" :model="Form"  ref="Form" class="Form"  :rules="rules">
                                                <el-form-item  prop="type">
                                                    <el-select v-model="Form.type" size="mini" @change="Form.userId='';Form.role='';Form.permission=''">
                                                            <el-option
                                                            label="用户"
                                                            value="1"
                                                            >
                                                            </el-option>
                                                            <el-option
                                                            label="角色"
                                                            value="2"
                                                            >
                                                            </el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item  label="用户"  prop="userId" v-show="Form.type==1">
                                                    <el-select v-model="Form.userId" size="mini" >
                                                        <el-option v-for="user in userList"
                                                        :label="user.username"
                                                        :value="user.userId"
                                                        :key="user.username"
                                                        >
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item prop="role"  label="角色"  v-show="Form.type==2">
                                                     <el-select v-model="Form.role"  size="mini">
                                                        <el-option v-for="p in permission" v-show="!(p.id==3)"
                                                        :label="p.name"
                                                        :value="p.id"
                                                        :key="'@'+p.id"
                                                        >

                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item  prop="permission"  label="权限">
                                                    <el-select v-model="Form.permission" size="mini">
                                                        <el-option v-for="p in permission"
                                                        :label="p.name"
                                                        :value="p.id"
                                                        :key="p.id"
                                                        >

                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item>
                                                    <el-button type="success" size="mini"  :loading="loading" @click="folderPermission">保存</el-button>
                                                </el-form-item>
                                            </el-form>
                                           
                                            
                                            
                                            
                                        </div>
                                        
                                        </el-card>
                               </el-col>
    
                               
                            </el-row>
                            <div class="m-t CardList">
                                <el-card class="box-card m-t-5"  style="position:relative" v-show="permissionList.role.permissionAdmin>0" :body-style="{padding: '6px' }" 
                                >
                                    <el-row   >
                                        <el-col :span="12" style="line-height:28px">
                                           <i class="el-icon-menu" style="margin:0 8px;font-size:16px;color:#999;position:relative;top:2px"></i>
                                           <span>{{permission[2].name}}(role)</span>
                                        </el-col>
                                        <el-col :span="12" class="text-right">
                                            <el-select    v-model="permissionList.role.permissionAdmin" size="mini"
                                                @change="updateFolderRole()"
                                            >
                                                <el-option v-for="p in permission"
                                                :label="p.name"
                                                :value="p.id"
                                                :key="p.id"
                                                >
                                                </el-option>
                                            </el-select>
                                            <el-button  size="mini"><i class="el-icon-goods"></i></el-button>
                                        </el-col>
                                     
                                    </el-row>
                                     <div
                                           style="z-index:10;position:absolute;top:0;left:0;height:100%;width:100%;background:#ddd;cursor:not-allowed;opacity:0.3">
                                        </div>
                                </el-card>
                                <el-card class="box-card m-t-5" v-show="permissionList.role.permissionEdit>0"  :body-style="{padding: '6px' }" 
                                 >
                                    <el-row  style="position:relative">
                                        <el-row >
                                        <el-col :span="12" style="line-height:28px">
                                           <i class="el-icon-menu" style="margin:0 8px;font-size:16px;color:#999;position:relative;top:2px"></i>
                                           <span>{{permission[1].name}}(role)</span>
                                        </el-col>
                                        <el-col :span="12" class="text-right">
                                           
                                            <el-select  v-model="permissionList.role.permissionEdit" size="mini"
                                              @change="updateFolder"
                                            >
                                                <el-option v-for="p in permission"
                                                :label="p.name"
                                                :value="p.id"
                                                :key="p.id"
                                                >
                                                </el-option>
                                            </el-select>
                                            
                                            <el-button type="warning" size="mini" @click="updateFolder('edit')"><i class="el-icon-close" ></i></el-button>
                                        </el-col>
                                    </el-row>
                                        

                                    </el-row>
                                  
                                  
                                </el-card>
                                <el-card class="box-card m-t-5" v-show="permissionList.role.permissionView>0" :body-style="{padding: '6px' }" 
                                >
                                  
                                    <el-row  v-show="permissionList.role.permissionView>0">
                                        <el-col :span="12" style="line-height:28px">
                                           <i class="el-icon-menu" style="margin:0 8px;font-size:16px;color:#999;position:relative;top:2px"></i>
                                           <span>{{permission[0]['name']}}(role)</span>
                                        </el-col>
                                        <el-col :span="12" class="text-right">
                                            <el-select    v-model="permissionList.role.permissionView" size="mini"
                                            @change="updateFolder">
                                                <el-option v-for="p in permission"
                                                :label="p.name"
                                                :value="p.id"
                                                :key="p.id"
                                                >
                                                </el-option>
                                            </el-select>
                                            <el-button type="warning" size="mini" @click="updateFolder('view')"><i class="el-icon-close"></i></el-button>
                                        </el-col>
                                    </el-row>
                                  
                                </el-card>

                                <el-card class="box-card m-t-5"  :body-style="{padding: '6px' }" 
                                  v-for=" user in permissionList.user" :key="'user'+ user.userId">
                                   <el-row>
                                        <el-col :span="12" style="line-height:28px">
                                           <i class="el-icon-menu" style="margin:0 8px;font-size:16px;color:#999;position:relative;top:2px"></i>
                                           <span>{{getUsernameByUserId(user.userId).username}}(user)</span>
                                        </el-col>
                                        <el-col :span="12" class="text-right">
                                            <el-select v-model="user.permissionType" size="mini"
                                            @change="updateFolderUser(user)"
                                            >
                                                <el-option v-for="p in permission"
                                                :label="p.name"
                                                :value="p.id"
                                                :key="p.id"
                                                >
                                                </el-option>
                                            </el-select>
                                            <el-button type="warning" size="mini" @click="deleteFolderUser(user)"><i class="el-icon-close"></i></el-button>
                                        </el-col>
                                   </el-row>
                                   
                                  
                                </el-card> 

                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane  name="setting">
                         <span slot="label"><i class="el-icon-setting m-r-5"></i>配置</span>
                         <div>
                             <el-form  label-position="right" label-width="120px"     class="Form m-t" size="mini">
            
              
                
                    <!-- <p  class="setTitle">基本信息</p> -->
                    <el-form-item  label="文件夹名称 :" >
                        <el-input  v-model="permissionList.role.folderName"> </el-input>
                    </el-form-item>
                    <el-form-item>
                         <el-button type="primary" size="mini"  :loading="updateFolderLoading"  @click="updateFolder">保存</el-button>
                          <el-button type="warning" size="mini"  :loading="deleteFolderLoading"  @click="deleteFolder"><i class="el-icon-delete m-r-5"></i>删除</el-button>
                    </el-form-item>
            <el-row>
        </el-row>          
        </el-form>
                        </div>
                        
                        </el-tab-pane>
                </el-tabs>
             </el-col>    
         </el-row>
          <el-dialog
            :close-on-click-modal='false'
            :visible.sync="showMovelist"
            :show-close='false'
            class="dialog setting-form"
            width="500px"
            >
             <el-form  :model="selctedFolder" label-width="80px" ref="move" class="Form"  size="mini" :rules="folderRules">
                <el-form-item label="文件夹 :" >
                    <el-select v-model="selctedFolder.folderId">
                        <el-option
                                v-for="folder in folderList"
                                v-show="!(folder.folderId==folderId)"
                                :key="folder.folderId" 
                                :label="folder.folderName"
                                :value="folder.folderId"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div style="border-top:1px solid #ebeef5;margin-top:20px;text-align:center;padding-top:20px;margin-bottom:-10px">
                <span slot="footer" class="dialog-footer" >
                    <el-button type="primary"  size="mini" @click="moveList" :loading="updateFolderLoading">修改</el-button>
                    <el-button size="mini" @click="showMovelist=false;updateFolderLoading=false" >取消</el-button>
                </span>
            </div>
    </el-dialog>
  </div>
</template>
<script>
import { folderTasks,folderDetail, folderUpdate,folderDelete,
         folderUserCreate, folderUserUpdate, folderUserList, folderUserDelete,
       
    } from "@/api/folder";
import { getUserId } from '@/utils/auth'

import { userList }  from "@/api/config/user.js"
import { folderList } from "@/api/folder";
import {  spcUpdate, spcDelete } from "@/api/spc/config"   
import {  msaUpdate, msaDelete } from "@/api/msaDoe/msa"  
import {  cepUpdate, cepDelete } from "@/api/piping/cep";  
export default {
    data(){
        return {
            showMovelist:false,
            updateFolderLoading:false,
            deleteFolderLoading:false,
            deleteListLoading:false,
            loading:false,
            selctedFolder:{// 移动文件夹
                folderId:''
            }, 
            folderRules:{
                folderId:[
                    { required:true,message:'请选择文件夹',trigger:'change,blur'}
                ]
            },
            folderId:'',
            showAddPermission:false,
            checkedAll:false,
            empty:[],
            activeName:'Dashboard',
            searchDashboard:'',
            checkedDashboard:[],
            permission:[
                { id:1,name:'View'},
                { id:2,name:'Edit'},
                { id:3,name:'Admin'}
            ],
            Form:{
                type:'',
                folderId:'',
                userId:'',
                permissionType:'',// 用户权限
                role:'',  // 角色
                permission:''  // 角色权限

            },
            rules:{ // 表单验证
                type:[
                    { required:true,message:'请选择分类',trigger:'change,blur'}
                ],
                userId:[
                    { required:true,message:'请选择用户',trigger:'changeblur'}
                ],
                role:[
                    { required:true,message:'请选择角色',trigger:'change,blur'}
                ],
                permission:[
                    { required:true,message:'请选择权限',trigger:'change,blur'}
                ]

            },
            userList:[
               
            ],
            roleList:[
                {
                    id:5,
                    name:'角色1'
                },
                {
                    id:6,
                    name:'角色2'
                }
            ],
            permissionList:{//已经配置的权限列表 用户--权限   角色----权限
               user:[],
               role:{},
            },
            folderTasks:{
                msa:[],
                spc:[]
            },
            filterFolderTasks:{
                msa:[],
                spc:[]
            },
            updatePermissionId:'',
            newFolderName:'11111',
            oldFolderName:'',
            folderList:[],
            LOADING: {
                lock: true,
                text: "数据处理中...",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.6)"
            },
            fullLoading: null,
        }
    },
    methods:{
        checked:function(){
            if(Number(this.filterFolderTasks.piping.length)+Number(this.filterFolderTasks.msa.length)+Number(this.filterFolderTasks.spc.length)==this.checkedDashboard.length){
                this.checkedAll=true;
            }
            else{
                this.checkedAll=false;
            }
        },
        checkAll:function(){
            console.log(this.checkedAll);
              this.checkedDashboard=[];
             if(this.checkedAll){
                // this.checkedAll=false;
                // this.checkedDashboard=[1,2];
                if(this.filterFolderTasks.msa.length>0){
                    this.filterFolderTasks.msa.forEach(msa=>{
                        this.checkedDashboard.push(msa.msaTaskId);
                    });
                }
                if(this.filterFolderTasks.spc.length>0){
                    this.filterFolderTasks.spc.forEach(spc=>{
                        this.checkedDashboard.push(spc.spcTaskId);
                    });
                }
                 if(this.filterFolderTasks.piping.length>0){
                    this.filterFolderTasks.piping.forEach(piping=>{
                        this.checkedDashboard.push(piping.cepProgramId);
                    });
                }
             }
             else{
                 //this.checkedAll=true;
                 this.checkedDashboard=[];
             }
        },
        getUserList:function(){

        },
        getFolderTasks:function(){
             
                  folderTasks({folderId:this.folderId}).then(res=>{
                     
                    if(res.code==200){
                       this.folderTasks.msa=res.data.msa;
                       this.folderTasks.spc=res.data.spc;
                       this.folderTasks.piping=res.data.piping;
                       this.filterFolderTasks.msa=res.data.msa.slice();
                       this.filterFolderTasks.spc=res.data.spc.slice();
                       this.filterFolderTasks.piping=res.data.piping.slice();
                    }
                    else{
                        this.$message.error(res.message);
                    }
                  });
           
          
        },
        getUserList:function(){
            userList().then(res=>{
               if(res.code==200){
                   this.userList=res.data.list;
               }
               else{
                   this.$message.error(res.message);
               }
            });
        },
        folderPermission:function(){
             this.$refs.Form.validate(res=>{
                 if(res){
                    if(this.Form.type==1){  //user
                            let data={
                                folderId:this.folderId,
                                userId:this.Form.userId,
                                permissionType:this.Form.permission
                            }
                            this.fullLoading=this.$loading(this.LOADING);
                            folderUserCreate(data).then(res=>{
                                  this.fullLoading.close();
                                  if(res.code==200){
                                      this.$message.success(res.message);
                                      this.getFolderUserList();

                                  }
                                  else{
                                       this.$message.error(res.message);
                                  }
                            });
                    }
                    if(this.Form.type==2){
                        let data={
                                folderId:this.folderId,
                                createbyUserId:getUserId()
                            }
                        if(this.Form.role==1){
                            data.permissionView=this.Form.permission;
                        }
                        if(this.Form.role==2){
                            data.permissionEdit=this.Form.permission;
                        }
                        if(this.Form.role==3){
                            data.permissionAdmin=this.Form.permission;
                        }
                        this.fullLoading=this.$loading(this.LOADING);
                        folderUpdate(data).then(res=>{
                                this.fullLoading.close();
                                if(res.code==200){
                                    this.$message.success(res.message);
                                    this.getFolderRoleList();
                                }
                                else{
                                    this.$message.error(res.message);
                                }
                        });
                    }
                 }
             });
        },
        getFolderUserList:function(){
            folderUserList({folderId:this.folderId}).then(res=>{
    
                 if(res.code==200){
                     this.permissionList.user=res.data;
                 }
                 else{
                      this.$message.error(res.message);
                 }
            });
        },
        getFolderRoleList:function(){
            folderDetail({folderId:this.folderId}).then(res=>{
                if(res.code==200){
                     this.permissionList.role=res.data;
                }
                else{
                      this.$message.error(res.message);
                }
            });
        },
        getUsernameByUserId:function(userId){
            if(this.userList.length>0){
                let user=this.userList.filter(user=> user.userId==userId);
                if(user.length>0){
                    return user[0];
                }
                else{
                    return {};
                }

            }
            else{
                return {};
            }
        },
        updateFolder:function(val){
            console.log(val);
            if(val=='edit'){//删除
                let folder=Object.assign({},this.permissionList.role); 
                folder.permissionEdit=-1;
                  this.$confirm('确定删除Edit角色?', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'warning'
                    }).then(()=>{
                        this.fullLoading=this.$loading(this.LOADING);
                         folderUpdate(folder).then(res=>{
                            this.fullLoading.close();
                            if(res.code==200){
                                this.$message.success(res.message);
                                this.permissionList.role.permissionEdit=-1;
                            }
                            else{
                                this.$message.error(res.message);
                            }
                 });
                    }).catch(()=>{})
                
            }
            else if (val=='view'){//删除
                 let folder=Object.assign({},this.permissionList.role); 
                folder.permissionView=-1;
                 this.$confirm('确定删除View角色?', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'warning'
                    }).then(()=>{
                        this.fullLoading=this.$loading(this.LOADING);
                        folderUpdate(folder).then(res=>{
                            this.fullLoading.close();
                            if(res.code==200){
                                this.$message.success(res.message);
                                this.permissionList.role.permissionView=-1;
                            }
                            else{
                                this.$message.error(res.message);
                            }
                 });
                    }).catch(()=>{});
                 
            }
            else{// 修改权限/文件名
               this.fullLoading=this.$loading(this.LOADING);
                folderUpdate(this.permissionList.role).then(res=>{
                    this.fullLoading.close();
                    if(res.code==200){
                        this.$message.success(res.message);
                        
                    }
                    else{
                         this.$message.error(res.message);
                    }
                    this.getFolderRoleList();
                });
            }

        },
        updateFolderUser:function(user){
                this.fullLoading=this.$loading(this.LOADING);
                folderUserUpdate(user).then(res=>{
                    this.fullLoading.close();
                    if(res.code==200){
                        this.$message.success(res.message);
                    }
                    else{
                        this.$message.error(res.message);
                    }
                });
        },
        deleteFolderUser:function(user){
                this.$confirm('确定删除用户?', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'warning'
                    }).then(()=>{
                        this.fullLoading=this.$loading(this.LOADING);
                        folderUserDelete({tbPermissionUserFolderId:user.tbPermissionUserFolderId}).then(res=>{
                                this.fullLoading.close();
                                if(res.code==200){
                                    this.$message.success(res.message);
                                    this.getFolderUserList();
                                }
                                else{
                                    this.$message.error(res.message);
                                }
                            });
                    }).catch(()=>{});
                
        },
        deleteFolder:function(){
              this.$confirm('确定删除文件夹'+this.permissionList.role.folderName+'?', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'warning'
                    }).then(()=>{
                       this.fullLoading=this.$loading(this.LOADING);
                        folderDelete({folderId:this.folderId}).then(res=>{
                            this.fullLoading.close();
                            if(res.code==200){
                                this.$router.push('/tb/user/folder');
                                this.$message.success(res.message);
                            }
                            else{
                                this.$message.error(res.message);
                            }
                         });
                    }).catch((
                       
                    )=>{});
        },
        deleteList:function(){ // 删除文件下的列表
            this.$confirm('确定删除选中的数据?', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
            }).then(()=>{ 
                let info=this.moveDel();
               //
               console.log(info);
               let msaReq=[],spcReq=[],pipingReq=[];
                if(info.msa.length>0){
                    info.msa.forEach(msa=>{
                        msaReq.push(msaDelete(msa));
                    });
                }
                if(info.spc.length>0){
                   info.spc.forEach(spc=>{  //spcTaskId::''  folderId:''
                   
                       spcReq.push(spcDelete(spc));
                   });
                }
                if(info.piping.length>0){
                   info.piping.forEach(piping=>{  //
                       pipingReq.push(cepDelete(piping));
                   });
                }
               
                this.fullLoading=this.$loading(this.LOADING);
                Promise.all([...spcReq,...msaReq,...pipingReq]).then(res=>{
                    this.checkedDashboard=[];
                    this.fullLoading.close();
                    this.getFolderTasks();
                    res.forEach(res=>{
                        if(res.code==200){
                            this.$message.success(res.message);
                        }
                        else{
                            this.$message.error(res.message);
                        }
                    });
                });



            }).catch(()=>{});
        },
        getFolderList:function(){
            folderList().then(res=>{
                if(res.code==200){
                     this.folderList=res.data.list;
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        moveList:function(){ // 移动文件夹下的列表
            if(!this.selctedFolder.folderId){
                this.$message.warning("请先选择文件夹");
            }
            else{
               // checkedDashboard[id]===msa:[]   spc:[]
               //  folderTasks:{ msa:[] spc:[] }
               let info=this.moveDel();
               //
               let msaReq=[],spcReq=[],pipingReq=[];
                if(info.msa.length>0){
                   info.msa.forEach(msa=>{
                       msaReq.push(msaUpdate(Msa));
                   });
                }
                if(info.spc.length>0){
                   info.spc.forEach(spc=>{  //spcTaskId::''  folderId:''
                       spcReq.push(spcUpdate(spc));
                   });
                }
                if(info.piping.length>0){
                   info.piping.forEach(piping=>{  //
                       pipingReq.push(cepUpdate(piping));
                   });
                }
               //
               //if(spcReq.length>0){
                   this.fullLoading=this.$loading(this.LOADING);
                   Promise.all([...spcReq,...msaReq,...pipingReq]).then(res=>{
                        this.checkedDashboard=[];
                        this.fullLoading.close();
                        this.showMovelist=false;
                        this.getFolderTasks();
                   });
              // }

            }
           

        },
        moveDel:function(){
            let Msa=[],Spc=[],Piping=[];
               this.checkedDashboard.forEach(id=>{
                    if(this.folderTasks.msa.length>0){
                       this.folderTasks.msa.forEach(msa=>{
                           if(msa.msaTaskId==id){
                               Msa.push({msaTaskId:id,folderId:this.selctedFolder.folderId});
                           }
                       })
                    }
                    if(this.folderTasks.spc.length>0){
                       this.folderTasks.spc.forEach(spc=>{
                           if(spc.spcTaskId==id){
                               Spc.push({spcTaskId:id,folderId:this.selctedFolder.folderId});
                           }
                       })
                    }

                    if(this.folderTasks.piping.length>0){
                       this.folderTasks.piping.forEach(piping=>{
                           if(piping.cepProgramId==id){
                               Piping.push({cepProgramId:id,folderId:this.selctedFolder.folderId});
                           }
                       })
                    }

               })
           return { msa:Msa,spc:Spc,piping:Piping}     
        },
        filterTasks:function(){ // 搜索
            this.checkedDashboard=[];
            this.checkedAll=false;
            if(this.searchDashboard){
                let reg=new RegExp("^" + this.searchDashboard ,"gi");
                if(this.folderTasks.spc.length>0){
                    this.filterFolderTasks.spc=this.folderTasks.spc.filter(spc=>reg.test(spc.spcTaskName));
                }
                else{
                     this.filterFolderTasks.spc=this.folderTasks.spc.slice(); 
                }

                if(this.folderTasks.msa.length>0){
                    this.filterFolderTasks.msa=this.folderTasks.msa.filter(msa=>reg.test(msa.msaTaskName));
                }
                else{
                     this.filterFolderTasks.msa=this.folderTasks.msa.slice(); 
                }

                if(this.folderTasks.piping.length>0){
                    this.filterFolderTasks.piping=this.folderTasks.piping.filter(piping=>reg.test(piping.programName));
                }
                else{
                     this.filterFolderTasks.piping=this.folderTasks.piping.slice(); 
                }
            }
            else{
               this.filterFolderTasks.spc=this.folderTasks.spc.slice(); 
               this.filterFolderTasks.msa=this.folderTasks.msa.slice();   
               this.filterFolderTasks.piping=this.folderTasks.piping.slice();   
            }
        },
    },
    computed:{
        chooseList:function(){
            if(this.userRolePermission.type==1){//user
                 return  this.userList;
            }
            else if(this.userRolePermission.type==2){//role
                return this.roleList
            }
            else{
                return [];
            }
        }
    },
    watch:{
        'Form.type':function(){
            if(this.Form.type==1){
                   this.rules.role=[];
                    this.rules.userId=[
                        { required:true,message:'请选择用户',trigger:'change,blur'}
                    ]

               
            }
            else if(this.Form.type==2){
                
        
                   this.rules.role=[
                        { required:true,message:'请选择角色',trigger:'change,blur'}
                    ],
                   this.rules.userId=[]
               
            }
        }
    },
    created:function(){
        this.folderId=this.$route.params.id;
        this.getFolderTasks();
        this.getUserList();
        this.getFolderUserList();
        this.getFolderRoleList();
        this.getFolderList();
    }
}
</script>
<style scope>
 .m-t-10{
     margin-top:10px;
 }
  .m-t-5{
     margin-top:5px;
 }
 .m-r-5{
     margin-right:5px;
 }
</style>
