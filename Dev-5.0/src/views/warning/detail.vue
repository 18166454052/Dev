<template>
    <div>
      <el-row style="border-bottom:1px solid #dcdfe6;padding:5px 20px">
            <el-col :span="10"  style="font-size:20px;">
                &nbsp;
                    <el-button  
                          @click="$store.commit('SET_TASK',true)"
                        type="text" ><i class="el-icon-menu el-icon--left"></i>{{configData.spcTaskName}}<i class="el-icon-caret-bottom el-icon--right"></i>
                    </el-button>
            </el-col>
            <el-col :span="14" class="text-right" v-if="$store.getters.userRole<4?true:false">
               
                <el-tooltip class="item" effect="light" content="配置" placement="top-start">
                    <el-button size="mini" @click="config">
                        <svg-icon  icon-class="setting" style="font-size:20px"></svg-icon>
                    </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="刷新" placement="top-start">
                    <el-button size="mini" @click="getWarningList">
                        <svg-icon  icon-class="refresh" style="font-size:20px"></svg-icon>
                    </el-button>
                </el-tooltip>
                <!-- <el-tooltip class="item" effect="light" content="PDF" placement="top-start">
                    <el-button size="mini">
                        <svg-icon  icon-class="pdf" style="font-size:20px"></svg-icon>
                    </el-button>
                </el-tooltip> -->
               
            </el-col>
        </el-row> 
        <div class="app-container Panel Warning" id="noSelect">
             <el-row :gutter="20">
                <el-col :span="8" class="HOME"> 
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                           <span style="font-size:16px">待处理预警</span><span class="count count-warn">{{warnList.length}}</span>
                        </div>
                        <div class="CardList">
                            <el-card  v-show="warnList.length>0" class="box-card m-t-5"  :body-style="{padding: '6px' }" 
                                v-for="list  in warnList" :key="'warn'+list.spcTaskOnlineAlertingId"
                                s
                                >
                                <el-row style="line-height:28px;padding-left:5px;padding-right:5px;"
                                    
                                >
                                    <el-col :span="24" >
                                        <div class="TaskCollection" @click="toStepDetail(list,'1')">

                                            <div>{{list.warningTitle}}</div>
                                            <div  style="text-align:right;color:#ccc;font-size:12px;line-height:12px">{{list.createTime | unixTime(true) }}</div>
                                        </div>
                                    </el-col>
                                    
                                </el-row>
                            </el-card>
                           
                        </div>
                    </el-card> 
                </el-col>
                 <el-col :span="8" class="HOME"> 
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span style="font-size:16px">处理中预警</span><span class="count count-warning">{{warningList.length}}</span>
                        </div>
                        <div class="CardList">
                            <el-card  v-show="warningList.length>0" class="box-card m-t-5"  :body-style="{padding: '6px' }" 
                                v-for="list  in warningList" :key="'warning'+list.spcTaskOnlineAlertingId"
                                
                                >
                                <el-row style="line-height:28px;padding-left:5px;padding-right:5px;"
                                    
                                >
                                    <el-col :span="24" >
                                        <div class="TaskCollection" @click="toStepDetail(list,'2')">

                                           <div class="warning-title">{{list.warningTitle}}</div>
                                            <div  style="text-align:right;color:#ccc;font-size:12px;line-height:12px">{{list.createTime | unixTime(true) }}</div>
                                            
                                        </div>
                                    </el-col>
                                    
                                </el-row>
                            </el-card>
                            
                        </div>
                    </el-card> 
                </el-col>
                 <el-col :span="8" class="HOME"> 
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span style="font-size:16px">已关闭预警</span><span class="count count-finished">{{warnedList.length}}</span>
                        </div>
                        <div class="CardList">
                             <el-card  v-show="warnedList.length>0" class="box-card m-t-5"  :body-style="{padding: '6px' }" 
                                v-for="list  in warnedList" :key="'warned'+list.spcTaskOnlineAlertingId"
                                
                                >
                                <el-row style="line-height:28px;padding-left:5px;padding-right:5px;"
                                    
                                >
                                    <el-col :span="24" >
                                        <div class="TaskCollection" @click="toStepDetail(list,'3')">

                                            <div >{{list.warningTitle}}</div>
                                            <div  style="text-align:right;color:#ccc;font-size:12px;line-height:12px">{{list.createTime | unixTime(true) }}</div>
                                            
                                        </div>
                                    </el-col>
                                    
                                </el-row>
                            </el-card>
                           
                            
                          
                        </div>
                    </el-card> 
                </el-col>
            </el-row>

        </div>
<v-folder v-show="$store.getters.showFolderTask"></v-folder>

 </div>
</template>
<script>
import Line from "./line";
import folderTask from '@/views/home/folderList'
import {onlineAlertAdd,onlineAlertUpdate,
onlineAlertDetail,onlineAlertDelete,onlineAlertList} from "@/api/warning"
import {spcDetail} from "@/api/spc/config";
import Pdf from '@/views/spc/com/pdf'
import PdfInfo from '@/views/spc/com/pdfInfo'
export default {
  components: {
    "v-line": Line,
    'v-folder':folderTask,
    'v-pdf':Pdf,
    'v-pdf-info':PdfInfo
  },
  data() {
    return {
      dialogAttachVisible:false,
      showPdf:false,
      pdfInfo:{
                
      },
      spcTaskOnlineId: "",
      spcTaskId:'',
      configData: {
        spcTaskName: ""
      },
      fullLoading: null,
      LOADING: {
        lock: true,
        text: '需要几秒钟,加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.6)'
      },
      warnList:[ //待处理
       
      ],
      warningList:[  //处理中
        
      ],
      warnedList:[  //已关闭
         
      ],
     
     
    };
  },
  methods: {
    config: function() {
      this.$router.push("/spc/warning/config/" + this.spcTaskId+'_'+this.spcTaskOnlineId);
    },
    getWarningList:function(){
        this.fullLoading=this.$loading(this.LOADING);
        onlineAlertList({spcTaskOnlineId:Number(this.spcTaskOnlineId)}).then(res=>{
           this.fullLoading.close(); 
             console.log('------warningList---------');
           console.log(res);
            if(res.code==200){
                if(res.data.length>0){
                    this. warnList=[],
                    this.warningList=[],
                    this.warnedList=[];
                   
                    res.data.forEach(item=>{
                        if(item.processingState==0){//待处理
                            this.warnList.push(item);
                        }
                        else if(item.processingState==1){//处理中
                            this.warningList.push(item);
                        }
                        else if(item.processingState==2){//已关闭
                            this.warnedList.push(item);
                        }
                    });
                }
            }
            else{
                this.$message.error(res.message);
            }
        });
    },
    getSpcDatail:function(){
        spcDetail({spcTaskId:this.spcTaskId}).then(res=>{
            if(res.code==200){
                this.configData=res.data;
            }
            else{
                this.$mesage.error(res.message);
            }
        });
    },
    toStepDetail:function(info,index){
        this.$router.push("/spc/warning/step/"+ info.spcTaskOnlineAlertingId+'_'+index+'_'+info.spcTaskOnlineId);
    }
 
   
  },
  created: function() {
    this.spcTaskOnlineId = this.$route.params.spc_id.split("_")[1];
    this.spcTaskId = this.$route.params.spc_id.split("_")[0];
    this.getWarningList();
    this.getSpcDatail();
   
   
  },
  beforeDestroy:function(){
      if(this.fullLoading){
          this.fullLoading.close();
      }
  }
};
</script>
<style scoped>
.count{
    display:inline-block;
    color:#fff;
    border-radius: 5px;
    padding:2px 4px;
    font-size:10px;
    margin-left:10px;
}
.count-warn{
    background:#F56C6C;
   
}
.count-warning{
     background:#409EFF;
}
.count-finished{
   background:#67C23A;
}
.warning-title{

}
.warning-time{
   text-align:'center';
   color:'#ccc';
   font-size:12px
}
</style>


