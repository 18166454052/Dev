<template>
   <div>
    <el-row style="border-bottom:1px solid #dcdfe6;padding:10px 0;padding-left:20px">
            <el-col :span="10"  >
                   <el-button  @click="showTask"   type="text" ><i class="el-icon-menu el-icon--left"></i>HOME<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
            </el-col>
             <el-col :span="14"  >
                   <div  class="text-right" style="margin-right:50px;line-height:36px">
                       <span>欢迎登录 !</span>
                       <span style="margin:0 10px;font-size:16px;font-weight:600">{{username}}</span>
                       <span>{{logintime}}</span>
                   </div>
            </el-col>
    </el-row>
        <div class="app-container ">
            <el-row :gutter="20">
                <el-col :span="12" class="HOME"> 
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span style="font-size:16px">浏览记录</span>
                        </div>
                        <div class="CardList">
                            <el-card  v-show="viewList.length>0" class="box-card m-t-5"  :body-style="{padding: '6px' }" 
                                v-for="(view,index)  in viewList" :key="'view'+view.userViewId+view.viewResourcesId"
                                
                                >
                                <el-row style="line-height:28px;padding-left:15px;padding-right:20px;"
                                    
                                >
                                    <el-col :span="20" >
                                        <div @click.stop="toDetail('v',view)" class="TaskCollection">

                                            <span>{{view.viewResourcesName}}</span>
                                            <span style="color:#ddd;padding-left:10px">({{['spc','msa','piping'][view.viewResourcesType-1]}})</span>
                                            <span style="float:right;color:#ccc">{{view.createTime| unixTime(true)}}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="4" v-if="$store.getters.userRole<4?true:false">
                                        <div style="position:relative" class="text-right">
                                            <el-button size="mini" type="info" plain @click="viewDelete(view,index)"><i class="el-icon-delete"></i></el-button>  
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-card>
                            <div class="Empty text-center" v-show="viewList.length==0 ">
                            暂时没有浏览记录
                            </div>
                        </div>
                    </el-card> 
                </el-col>
                 <el-col :span="12" class="HOME"> 
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span style="font-size:16px">我的收藏</span>
                        </div>
                        <div class="CardList">
                            <el-card  v-show="collectionList.length>0" class="box-card m-t-5"  :body-style="{padding: '6px' }" 
                                v-for="collection  in collectionList" :key="'collection'+collection.userCollectionId+collection.collectionResourcesId"
                                
                                >
                                <el-row style="line-height:28px;padding-left:15px;padding-right:20px;"
                                    
                                >
                                    <el-col :span="20" >
                                        <div @click.stop="toDetail('c',collection)" class="TaskCollection">

                                            <span>{{collection.collectionTitle}}</span>
                                            <span style="color:#ddd;padding-left:10px">( {{['spc','msa','piping'][collection.collectionResourcesType]}} )</span>
                                             <span style="float:right;color:#ccc">{{collection.createTime| unixTime(true)}}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="4" v-if="$store.getters.userRole<4?true:false">
                                        <div style="position:relative">
                                            <span class="IconCollection" @click="collectionAction(collection)" >
                                                <svg-icon  :icon-class="collection.userCollectionId?'star':'collection'" ></svg-icon></span>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-card>
                            <div class="Empty text-center" v-show="collectionList.length==0 ">
                            暂时没有收藏
                            </div>
                        </div>
                    </el-card> 
                </el-col>
                 <el-col :span="12" class="HOME m-t"> 
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span style="font-size:16px">预警信息</span>
                        </div>
                        <div class="CardList">
                            <el-row class=" ConfigListTitle">
                                <el-col :span="16" style="padding-left:26px">预警标题</el-col>
                                <el-col :span="4">预警时间</el-col>
                                <el-col :span="4">处理状态</el-col>
                            </el-row>
                             <el-card v-show="warning.length>0"   class="box-card m-t-5"  :body-style="{padding: '6px' }" 
                                v-for="(warn,index) in warning" :key="index+'warning'" 
                               
                                >
                                <div @click="toAlertingStep(warn)">
                                      <el-row>
                                    <el-col :span="16" style="line-height:28px;padding-left:20px">
                                        
                                        &nbsp;<span>{{warn.warningTitle}}</span>
                                    </el-col>
                                    <el-col :span="4" style="line-height:28px">
                                        
                                        &nbsp;<span>{{warn.createTime | unixTime(true)}}</span>
                                    </el-col>
                                    <el-col :span="4" style="line-height:28px">
                                        
                                        &nbsp;<span>待处理</span>
                                    </el-col>
                                </el-row>
                                </div>
                              
                        
                        
                    </el-card>
                            <!-- <el-card  class="box-card m-t-5"  :body-style="{padding: '6px' }" 
                              
                                
                                >
                               
                            </el-card> -->
                            <!-- <div class="Empty text-center" v-show="collectionList.length==0 ">
                            暂时没有预警信息
                            </div> -->
                        </div>
                    </el-card> 
                </el-col>
            </el-row>
        
        </div>
    <v-folder v-show="$store.getters.showFolderTask"></v-folder>
    </div>
</template>
<script>
import folderTask from './folderList'
import collection from "@/img/collection.svg"
import { folderList } from "@/api/folder";
import {
  
   viewDelete, viewList,collectionList,collectionDelete,collectionCreate
 } from "@/api/home";
  import { getUserId } from '@/utils/auth'
  import {onlineAlertList} from "@/api/warning"
  import { getUsername, getLoginTime} from '@/utils/auth'
export default {
    components:{
        'v-folder':folderTask
    },
    data(){
        return {
            activeNames:'',
            collection:collection,
            folderList:[
           
           ],
           viewList:[],
           collectionList:[],
           
           warning:[], // 待处理预警信息
           //folerTaskList:{}
           username:'',
           logintime:''
        }
    },
    methods:{
        rowClick:function(row, event, column){
            console.log(row);

        },
        headerSetting:function(folderId){
          this.$router.push('/setting/'+folderId);
        },
        getFolderList:function(){
            folderList().then(res=>{
                if(res.code==200){
                    if(res.data.list.length>0){
                         this.folderList=res.data.list.map(item=>{
                             item.spc=[];
                             item.msa=[];
                             return item;
                         });
                         this.filterFolderList=this.folderList.slice();
                    }
                   
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
       
        showTask:function(){
            this.$store.commit('SET_TASK',true);
        },
        getViewList:function(){
            viewList({userId:getUserId()}).then(res=>{
                console.log(res);
                if(res.code==200){
                    this.viewList=res.data;
                }
                else{
                    this.$message.error(res.message);
                }
            })
        },
        viewDelete:function(view,index){
             this.$confirm('确定删除浏览记录'+ view.viewResourcesName+'?', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
            }).then(()=>{ 
                   viewDelete({userViewId:view.userViewId}).then(res=>{
                       if(res.code==200){
                            this.viewList.splice(index,1);
                           this.$message.success(res.message);
                       }
                       else{
                            this.$message.error(res.message);
                       }
                   });
            }).catch(()=>{})
        },
        toDetail:function(type,info){
            if(type=='v'){  // view
                if (info.viewResourcesType==1) {
                    this.$router.push("/spc/detail/" + info.viewResourcesId);
                } else if (info.viewResourcesType==2) {
                        this.$router.push("/msa/detail/" + info.viewResourcesId);
                } else if (info.viewResourcesType==3) {
                        this.$router.push("/piping/gateway/cep/program/" + info.viewResourcesId);
                }
            }
            else if(type=='c'){  // collection
                if (info.collectionResourcesType==1) {
                    this.$router.push("/spc/detail/" + info.collectionResourcesId);
                } else if (info.collectionResourcesType==2) {
                    this.$router.push("/msa/detail/" + info.collectionResourcesId);
                } else if (info.collectionResourcesType==3) {
                    this.$router.push("/piping/gateway/cep/program/" + info.collectionResourcesId);
                }
            }
            
            this.$store.commit("SET_TASK", false);

        },
        getCollectionList:function(){
            collectionList({userId:getUserId()}).then(res=>{
                   console.log(res);
                  if(res.code==200){
                      this.collectionList=res.data;
                  }
                  else{
                      this.$message.error(res.message);
                  }
            });
        },
        collectionAction:function(info){
            if (info.userCollectionId) {
                // 删除收藏
                collectionDelete({ userCollectionId: info.userCollectionId }).then(res => {
                    if (res.code == 200) {
                    this.$set(info, "userCollectionId", "");
                    this.$message.success(res.message);
                    } else {
                    this.$message.error(res.message);
                    }
                }
                );
            } else {
                let data = {
                    userId: getUserId(),
                    collectionResourcesId:info.collectionResourcesId,
                    collectionResourcesType: info.collectionResourcesType,
                    collectionTitle: info.collectionTitle
                };
                console.log(data);
                collectionCreate(data).then(res => {
                    if (res.code == 200) {
                        this.$set(info, "userCollectionId", res.data.userCollectionId);
                        this.$message.success(res.message);
                    } else {
                        this.$message.error(res.message);
                    }
                });
            }

        },
        getWarningList:function(){
       
            onlineAlertList({processingState:0}).then(res=>{
                if(res.code==200){
                    console.log(res);
                    if(res.data.length>0){
                        this.warning=res.data;
                    }
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        toAlertingStep:function(info){
             this.$router.push("/spc/warning/step/"+ info.spcTaskOnlineAlertingId+'_1_'+info.spcTaskOnlineId);

        }

      
    },
    created:function(){
       // this.getFolderList();
       this.username=getUsername();
       this.logintime=getLoginTime();
       this.getViewList();
       this.getCollectionList();
       this.getWarningList();
    }
}
</script>
