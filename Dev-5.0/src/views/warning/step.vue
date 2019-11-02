<template>
<div>
 <el-row 
    
    style="border-bottom:1px solid #dcdfe6;padding:5px 20px;background:#fff">
            
            <el-col :span="24" class="text-right">
                <el-button size="mini" type="primary"   @click="$router.go(-1)">
                    <svg-icon  icon-class="back" style="font-size:20px"></svg-icon>
                </el-button>
            </el-col>
    </el-row>
    <div class="app-container">
         <el-row >
            <el-col :span="20" :offset="2"  style="position:relative" >
                <el-card class="bord-card">
                     <el-steps :active="active" align-center>
                        <el-step title="未处理" ></el-step>
                        <el-step title="处理中"></el-step>
                        <el-step title="处理结束"></el-step>
                    </el-steps>
                    <div>
                        <v-unprocessed  
                        :detail="detail"
                        :cpkList="cpkList"
                        :step="active"
                        :processList="alertProcessList"
                        @uploadfiles="detail.processUploadFiles=$event"
                        ></v-unprocessed>
                    </div>
                </el-card>
            </el-col>
         </el-row>
  
    </div>
    </div>
</template>
<script>
import Unprocessed from "./com/unprocessed"
import Processing from "./com/processing"
import Processed from "./com/processed"
import {onlineAlertDetail,onlineAlertCpkList,processList} from "@/api/warning"
export default {
    components:{
        'v-unprocessed':Unprocessed,
        'v-processing':Processing,
        'v-processed':Processed
    },
    data(){
        return {
            active:2, // 1 2 3
            spcTaskOnlineAlertingId:'',
            spcTaskOnlineId:'',
            detail:{

            },
            cpkList:[],
            fullLoading: null,
            LOADING: {
                lock: true,
                text: '数据加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.6)'
            },
            alertProcessList:[]
        }
    },
    methods:{
        getDetail:function(){
            this.fullLoading=this.$loading(this.LOADING);
            onlineAlertDetail({spcTaskOnlineAlertingId:this.spcTaskOnlineAlertingId}).then(res=>{
                this.fullLoading.close();
                if(res.code==200){
                    //warningCondition 
                  
                    let obj={};
                   // let condition=res.data.warningCondition.replace("；",";").replace(";",":").replace("：",":").trim("").slice(0,-1).split(":");
                    let condition=res.data.warningCondition.split("；");
                   
                    // if(condition.length>0){
                    //     condition.forEach((item,index)=>{
                    //         if(index%2==0){ // key
                    //             obj[item]="";
                    //         }
                    //         else{
                    //             obj[condition[index-1]]=item;
                    //         }
                    //     });
                    // }
                    res.data.warningCondition=condition;
                    this.detail=res.data;
                }
                else{
                    this.$message.error(res.message);
                }

            });
        },
        getCpkList:function(){
            onlineAlertCpkList({spcTaskOnlineId:this.spcTaskOnlineId}).then(res=>{
                if(res.code==200){
                    this.cpkList=res.data;
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        getProcessList:function(){
            processList({spcTaskOnlineId:this.spcTaskOnlineId}).then(res=>{
                if(res.code==200){
                    this.alertProcessList=res.data;
                }
                else{
                    this.$message.error(res.message);
                }
            });
        }
    },
    created:function(){
        let step=this.$route.params.step;
        let active=step.split("_")[1];
        this.spcTaskOnlineAlertingId=step.split("_")[0];
        this.spcTaskOnlineId=step.split("_")[2];
        if(active>=1 && active<=3){
            this.active=active-1;
           // if(active!=2){// 驳回
                this.getDetail();
                this.getCpkList();
                this.getProcessList();
           // }
            
        }
        else{
            this.$router.replace("/404");
        }
        
        
    },
    beforeDrestroy:function(){
        if(this.fullLoading){
            this.fullLoading.close();
        }
    }
   
}
</script>

