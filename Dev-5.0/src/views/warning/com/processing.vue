<template>
    <div>
       <el-card shadow="never" class="m-t text-center">
           <el-button type="primary" :loading="loadingY" @click="alertUpdate('true')">通过</el-button>
           <el-button type="warning" :loading="loadingN" @click="alertUpdate('false')">驳回</el-button>
        </el-card>
    </div>
</template>
<script>
import {onlineAlertUpdate} from "@/api/warning"
export default {
    props:["spcTaskOnlineAlertingId"],
    data(){
        return {
           loadingY:false,
           loadingN:false
        }
    },
    methods:{
          alertUpdate:function(type){
            let data={};
            data.spcTaskOnlineAlertingId=this.spcTaskOnlineAlertingId;  
            if(type=="true"){
                this.loadingY=true;
                data.processingState=2;
            }
            else{
                this.loadingN=true;
                data.processingState=0;
            }
            
          
            
            onlineAlertUpdate(data).then(res=>{
                this.loadingN=false;
                this.loadingY=false;
                if(res.code==200){
                    this.$message.success(res.message);
                }
                else{
                    this.$message.error(res.message);
                }
            });
        }
    }
}
</script>

