<template>
<div class="taskList" > 
    <el-row style="border-bottom:1px solid #dcdfe6;padding:10px 0;padding-left:20px;z-index:1000">
            <el-col :span="10"  >
                    <div>
                        <el-input
                          size="small"
                            placeholder="使用名称搜索"
                            prefix-icon="el-icon-search"
                            @input="filterFolder"
                            v-model="search">
                        </el-input>
                    </div>
            </el-col>
    </el-row>

    <div class="app-container Folder" :style="{'height':HEIGHT}" style="overflow:auto">
        
        <el-row style="min-height:100%;" @click.native.self="hideFolderTask">
            
            <el-col  :xs="{span:24}" :sm="{span:24}"
                :md="{span:24}" :lg="{span:12,offset:0}" :xl="{span:12,offset:0}"
            
            class='HOME'>
                <div style="min-height:100%" >
                    <el-card>
                        <el-collapse  accordion  style="position:relative"  
                        v-for="(folder,index) in filterFolderList"
                        :key="folder.folderId+'folder'+index" 
                       
                        >   
                            <el-collapse-item   
                              
                            >
                                    <!-- <div class="HOME_SETTING">
                                        <i class="el-icon-setting"></i>
                                    </div> -->
                                <template slot="title" >
                                       {{folder.folderName}} <div v-if="$store.getters.userRole<4?true:false" class="HOME_SETTING" @click.stop="headerSetting(folder.folderId)">
                                                <i class="el-icon-setting"></i>
                                            </div>
                                </template>
                               
                                <div class="m-t CardList">
                                    <el-card  v-show="folder.spc.length>0" class="box-card m-t-5"  :body-style="{padding: '6px' }" 
                                      v-for="spc  in folder.spc" :key="spc.spcTaskId+'spc'"
                                       
                                      >
                                        <el-row style="line-height:28px;padding-left:15px;padding-right:20px;" v-show="spc.analysisMethod<3">
                                            <el-col :span="20" >
                                                <div @click.stop="toDetail('spc',spc)" class="TaskCollection">

                                                   <span>{{spc.spcTaskName}}</span>
                                                   <span style="color:#ddd;padding-left:10px">(spc : {{['抽样','趋势' ,'在线预警'][spc.analysisMethod-1]}})</span>
                                                   
                                                </div>
                                                
                                            </el-col>
                                            <el-col :span="4" v-if="$store.getters.userRole<4?true:false">
                                                <div style="position:relative">
                                                    <span class="IconCollection" @click="collectionAction('spc',spc)" >
                                                      <svg-icon  :icon-class="spc.tbUserCollection && spc.tbUserCollection.userCollectionId?'star':'collection'" ></svg-icon></span>
                                                </div>
                                            </el-col>
                                        </el-row>
                                        <el-row style="line-height:28px;padding-left:15px;padding-right:20px;" v-show="spc.analysisMethod==3">
                                            <el-col :span="10">
                                                 <div @click.stop="toDetail('spc',spc)" class="TaskCollection">

                                                   <span>{{spc.spcTaskName}}</span>
                                                   <span style="color:#ddd;padding-left:10px">(spc : {{['抽样','趋势' ,'在线预警'][spc.analysisMethod-1]}})</span>
                                                    
                                                </div>
                                            </el-col>
                                            <el-col :span="12" class="text-right">
                                               <el-button  v-show="spc.spcTaskOnline && spc.spcTaskOnline.runningState==0"   type="primary" plain size="mini" @click="warningUpdate(spc)">启动</el-button>
                                                <el-button v-show="spc.spcTaskOnline && spc.spcTaskOnline.runningState==1"  type="warning" plain size="mini" @click="warningUpdate(spc)">停止</el-button>
                                                  <el-button v-show="spc.spcTaskOnline && spc.spcTaskOnline.runningState==-1"  type="warning" plain size="mini"  @click="warningUpdate(spc)">重启(运行异常)</el-button>
                                               <el-button type="info" plain size="mini" @click="warningConfig(spc)">配置</el-button>
                                            </el-col>
                                            <el-col :span="2" v-if="$store.getters.userRole<4?true:false">
                                                 <div style="position:relative">
                                                    <span class="IconCollection" @click="collectionAction('spc',spc)" >
                                                        <svg-icon  :icon-class="spc.tbUserCollection && spc.tbUserCollection.userCollectionId?'star':'collection'" ></svg-icon></span>
                                                </div>
                                            </el-col>
                                        </el-row>
                                        <div style="text-align:right;color:#ccc;font-size:12px;line-height:12px;margin-top:5px;">
                                          <span >{{spc.createTime | unixTime(true)}}</span>
                                        </div>
                                    </el-card>
                                    <el-card  v-show="folder.msa.length>0" class="box-card m-t-5"  :body-style="{padding: '6px' }" 
                                         v-for="msa  in folder.msa" :key="msa.msaTaskId+'msa'">
                                        <el-row style="line-height:28px;padding-left:15px;padding-right:20px;">
                                            <el-col :span="20">
                                                <div @click.stop="toDetail('msa',msa)" class="TaskCollection">
                                                    <span>{{msa.msaTaskName}}</span>
                                                    <span style="color:#ddd;padding-left:10px">(msa)</span>
                                                   
                                                </div>
                                            </el-col>
                                            <el-col :span="4" v-if="$store.getters.userRole<4?true:false">
                                                <div style="position:relative">
                                                    <span class="IconCollection" @click="collectionAction('msa',msa)" >
                                                     <svg-icon  :icon-class="msa.tbUserCollection && msa.tbUserCollection.userCollectionId?'star':'collection'" ></svg-icon></span>
                                                </div>
                                            </el-col>
                                        </el-row>
                                        <div style="text-align:right;color:#ccc;font-size:12px;line-height:12px;margin-top:5px;">
                                          <span >{{msa.createTime | unixTime(true)}}</span>
                                        </div>
                                    </el-card>

                                    <el-card  v-show="folder.piping.length>0" class="box-card m-t-5"  :body-style="{padding: '6px' }" 
                                         v-for="piping  in folder.piping" :key="piping.cepProgramId+'piping'">
                                        <el-row style="line-height:28px;padding-left:15px;padding-right:20px;">
                                            <el-col :span="16">
                                                <div @click.stop="toDetail('piping',piping)" class="TaskCollection">
                                                    <span>{{piping.programName}}</span>
                                                    <span style="color:#ddd;padding-left:10px">(piping)</span>
                                                </div>
                                            </el-col>
                                            <el-col :span="4" >
                                                <div class="text-right" v-show="piping.runningStatus==0" 
                                                style="color:#E6A23C">
                                                  <span><i class="el-icon-info" style="margin-right:2px"></i></span>
                                                  <span>已关闭</span>
                                                </div>
                                                <div class="text-right" v-show="piping.runningStatus==1"
                                                style="color:#67C23A"
                                                >
                                                  <span><i class="el-icon-info" style="margin-right:2px"></i></span>
                                                  <span>运行中</span>
                                                </div>
                                               
                                                
                                            </el-col>
                                            <el-col :span="4" v-if="$store.getters.userRole<4?true:false">
                                                <div style="position:relative">
                                                    <span class="IconCollection" @click="collectionAction('piping',piping)" >
                                                      <svg-icon :icon-class="piping.tbUserCollection && piping.tbUserCollection.userCollectionId?'star':'collection'" ></svg-icon></span>
                                                </div>
                                            </el-col>
                                        </el-row>
                                        <div style="text-align:right;color:#ccc;font-size:12px;line-height:12px;margin-top:5px;">
                                          <span >{{piping.createTime | unixTime(true)}}</span>
                                        </div>
                                    </el-card>
    
                                   <div class="Empty text-center" v-show="folder.spc.length==0 && folder.msa.length==0 && folder.piping.length==0">
                                    该文件夹还没有添加数据
                                    </div>
                                </div>
                                

                            </el-collapse-item>
                        </el-collapse>
                        <div class="text-center" style=" font-size:14px;color:#909399;" v-show="filterFolderList.length==0">
                                    没有查询到文件夹相关信息
                        </div>
                    </el-card>
                </div> 
            </el-col>
           
               
        </el-row>
       
    </div>
</div>
</template>
<script>
import collection from "@/img/collection.svg";
import { folderList, folderTasks } from "@/api/folder";
import {
  collectionCreate,
  collectionUpdate,
  collectionDelete,
  viewAdd,
  viewUpdate,
  viewCancel,
  viewList
} from "@/api/home";
import { onlineUpdate } from "@/api/warning"
import { getUserId } from "@/utils/auth";
import {warningStart,warningStop} from "@/api/spc/config"
export default {
  data() {
    return {
      HEIGHT: "",
      search: "",
      showCollection: true,
      activeName: "recent",
      filterFolderList: [],
      folderList:[],
      LOADING: {
                lock: true,
                text: "数据处理中...",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.6)"
            },
          fullLoading: null,
    };
  },
  methods: {
    rowClick: function(row, event, column) {
      console.log(row);
    },
    headerSetting: function(folderId) {
      this.$router.push("/setting/" + folderId);
    },
    getFolderList: function() {
      folderList().then(res => {
        if (res.code == 200) {
          if (res.data.list.length > 0) {
            this.folderList = res.data.list.map(item => {
              item.spc = [];
              item.msa = [];
              item.piping = [];
              return item;
            }); 
            this.filterFolderList = this.folderList.slice();
            // 获取task
            if(this.folderList.length>0){
                this.folderList.forEach((folder,index)=>{
                    this.getFolderTasks(folder.folderId,index);
                });
            }
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getFolderTasks: function(folderId, index) {
      folderTasks({ folderId: folderId }).then(res => {
        console.log("folderid------------" + folderId)
          console.log(res);
        if (res.code == 200) {
          this.folderList[index].msa = res.data.msa;
          this.folderList[index].spc = res.data.spc;
          this.folderList[index].piping = res.data.piping;
          // this.folderList[index].warning = [{
          //   name:'预警',
          //   cepWarningId:123456
          // }];
        }
      });
    },
    filterFolder: function() {
      if (this.search) {
        if (this.folderList.length > 0) {
          let reg = new RegExp(this.search, "i");
          // this.filterFolderList = this.folderList.filter(folder =>
          //   reg.test(folder.folderName)
          // );
          this.filterFolderList=[];
           this.folderList.forEach(folder =>{
              let obj=Object.assign({},folder,{spc:[],msa:[],piping:[]});
              obj.msa=folder.msa.filter(msa=>reg.test(msa.msaTaskName));
              obj.spc=folder.spc.filter(spc=>reg.test(spc.spcTaskName));
              obj.piping=folder.piping.filter(piping=>reg.test(piping.programName));
             
              if(obj.msa.length > 0 || obj.spc.length>0 || obj.piping.length>0){
                  console.log(obj);
                  this.filterFolderList.push(obj); 
              } 
             

          });
        } else {
          this.filterFolderList = this.folderList.slice();
        }
      } else {
        this.filterFolderList = this.folderList.slice();
      }
    },
    toDetail: function(type, info) {
      //spc/msa  {}
      console.log(info);
      if (type == "spc") {// analysisMethod  1 抽样  2  趋势  3 预警
        if(info.analysisMethod==2){ //制程能力
           this.$router.push("/spc/process/detail/" + info.spcTaskId);
        }
        else if(info.analysisMethod==1){ // 
           this.$router.push("/spc/detail/" + info.spcTaskId);
        }
        else if(info.analysisMethod==3){ // 预警
            this.$router.push("/spc/warning/"+ info.spcTaskId+'_'+info.spcTaskOnline.spcTaskOnlineId );
        }
         
         
      } else if (type == "msa") {
        this.$router.push("/msa/detail/" + info.msaTaskId);
      } else if (type == "piping") {
        this.$router.push("/piping/gateway/cep/program/" + info.cepProgramId);
      }
      this.$store.commit("SET_TASK", false);
    },
    collectionAction: function(type, info) {
      console.log(info);
      if (info.tbUserCollection && info.tbUserCollection.userCollectionId>0) {
        // 删除收藏
        collectionDelete({ userCollectionId: info.tbUserCollection.userCollectionId}).then(
          res => {
            if (res.code == 200) {
              this.$set(info.tbUserCollection,'userCollectionId', "");
              this.$message.success(res.message);
            } else {
              this.$message.error(res.message);
            }
          }
        );
      } else {
        //收藏

        let data = {
          userId: getUserId(),
          collectionResourcesId: "",
          collectionResourcesType: 0,
          collectionTitle: ""
        };
        if (type == "spc") {
          data.collectionResourcesId = info.spcTaskId;
          data.collectionResourcesType = 1;
          data.collectionTitle = info.spcTaskName;
        }
        if (type == "msa") {
          data.collectionResourcesId = info.msaTaskId;
          data.collectionResourcesType = 2;
          data.collectionTitle = info.msaTaskName;
        }
        if (type == "piping") {
          data.collectionResourcesId = info.cepProgramId;
          data.collectionResourcesType = 3;
          data.collectionTitle = info.programName;
        }
        collectionCreate(data).then(res => {
          if (res.code == 200) {
             this.$set(info,'tbUserCollection',{});
            this.$set(info.tbUserCollection,'userCollectionId', res.data.userCollectionId);
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        });
      }


      // 刷新列表

    },
    getHeight: function() {
      let winHeight;
      if (window.innerHeight) winHeight = window.innerHeight;
      else if (document.body && document.body.clientHeight) {
        winHeight = document.body.clientHeight;
      }
      this.HEIGHT = winHeight - 57 + "px";
    },
    hideFolderTask: function() {
      this.search="";
      this.$store.commit("SET_TASK", false);
    },
    warningConfig:function(spc){
      console.log(spc);
        this.$router.push("/spc/warning/config/"+ spc.spcTaskId+'_'+spc.spcTaskOnline.spcTaskOnlineId);
    },
    warningUpdate:function(spc){
       
      let obj=Object.assign({},spc.spcTaskOnline);
      this.fullLoading=this.$loading(this.LOADING);
      if(spc.spcTaskOnline && (spc.spcTaskOnline.runningState==0 || spc.spcTaskOnline.runningState==-1)) { //未启动状态/启动报错
         // obj.runningState=1;
         warningStart({spcTaskId:spc.spcTaskId}).then(res=>{
            this.fullLoading.close();
             if(res.code==200){
               spc.spcTaskOnline.runningState=1;
               this.$message.success(res.message);
               
             }
             else{
               this.$message.error(res.message);
             }
         });
      }
      else if(spc.spcTaskOnline && spc.spcTaskOnline.runningState==1){ //已经启动
           //obj.runningState=0;
            warningStop({spcTaskId:spc.spcTaskId}).then(res=>{
              this.fullLoading.close();
             if(res.code==200){
               spc.spcTaskOnline.runningState=0;
               this.$message.success(res.message);
             }
             else{
               this.$message.error(res.message);
             }
         });
      }
      // onlineUpdate(obj).then(res=>{
      //     if(res.code==200){
      //       if(spc.spcTaskOnline && spc.spcTaskOnline.runningState==1){
      //         spc.spcTaskOnline.runningState=0;
      //       }
      //       else if(spc.spcTaskOnline && spc.spcTaskOnline.runningState==0){
      //         spc.spcTaskOnline.runningState=1;
      //       } 
      //       this.$message.success(res.message);
      //     }
      //     else{
      //       spc.spcTaskOnline.runningState=-1;//运行异常
      //       this.$message.error(res.message);
      //     }
      // });
    }

  },
  created: function() {
    this.getHeight();
    this.getFolderList();
  },
  beforeDestroy:function(){
    if(this.fullLoading){
      this.fullLoading.close();
    }
  }
};
</script>
<style>
.m-t-5 {
  margin-top: 5px;
}
.TaskCollection {
  position: relative;
}
.IconCollection {
  position: absolute;
  right: 10px;
  font-size: 16px;
}
.IconCollection:hover {
  font-size: 20px;
}
.taskList {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 66px;
  background: #fff;
  z-index: 99;
}
 /*滚动条样式*/
  .Folder::-webkit-scrollbar {/*滚动条整体样式*/
      width: 0px;     /*高宽分别对应横竖滚动条的尺寸*/
      height: 4px;
  }
  .Folder::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      background: rgba(0,0,0,0.2);
  }
  .Folder::-webkit-scrollbar-track {/*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      border-radius: 0;
      background: rgba(0,0,0,0.1);
  }
</style>
