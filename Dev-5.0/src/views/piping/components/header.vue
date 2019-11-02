<template>
   <!-- <div style="font-size:30px">
      <div class="text-center inlineBlock" id="back">
        <el-button type="text" @click="$router.go(-1)"><i class="el-icon-arrow-left"></i></el-button>
      </div>
      
       <div class="inlineBlock addDevice">
          <el-button type="primary"><a href="http://120.78.71.179:3000" target="_blank">可视化</a></el-button>
      </div>
      <el-dialog 
        title="设备列表"
        :visible.sync="dialog"
        width="70%"
        class="dialog Dialog"
      >
        <div class="Table pointer">
            <el-table
            :data="deviceData"
            >
            <el-table-column
                prop="device_name"
                label="设备名称"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="device_key"
                label="设备key"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="comment"
                label="描述"
                align="center"
            >
            </el-table-column>
           
            <el-table-column
                prop="deploy_status"
                label="Deploy Status"
                align="center"
            >
            <template slot-scope="scope">
                {{scope.row.deploy_status|deploy}}
            </template>
            </el-table-column>
            <el-table-column
                label="Action"
                align="center"
            >
                <template slot-scope="scope">
                <el-button :class="{'button-link':scope.row.deploy_status==1}"  type="text" :disabled="scope.row.deploy_status!==1" @click="arduinoCreate(scope)">添加</el-button>
                </template>
            </el-table-column>
            </el-table>
        </div>
      </el-dialog>
   </div> -->
<div>
    <el-row style="border-bottom:1px solid #dcdfe6;padding:5px 20px">
            <el-col :span="4" style="font-size:16px;font-weight:bold;margin-top:12px">
               <div style="display:inline-block">状态 : </div>
               <div class="text-left" 
                    style="color:#E6A23C;display:inline-block"
                    v-show="cepDetail.runningStatus==0"
                    >
                      <span><i class="el-icon-info" style="margin-right:2px"></i></span>
                      <span>已关闭</span>
                    </div>
                    <div class="text-right" v-show="cepDetail.runningStatus==1"
                    style="color:#67C23A;display:inline-block"
                    >
                      <span><i class="el-icon-info" style="margin-right:2px"></i></span>
                      <span>运行中</span>
                    </div>
            </el-col> 
            <el-col :span="20" class="text-right">
              <el-button size="medium" type="primary" :loading="deployLoading"  @click="deploy">{{cepDetail.deployStatus==0?'部署':'重新部署'}}</el-button>
              <el-button size="medium" type="primary"  :loading="startLoading" @click="startOrStop">{{cepDetail.runningStatus==0?'启动服务':'关闭服务'}}</el-button>
              <el-button size="medium" type="primary"  :loading="uninstallLoading" @click="uninstall">卸载</el-button>
                <el-button size="mini"  type="primary" @click="$router.go(-1)" style="position:relative;top:2px;">
                    <svg-icon  icon-class="back" style="font-size:20px"></svg-icon>
                </el-button>
            </el-col>
       </el-row>   
    </div> 

</template>

<script>
// import {geDeviceList} from "@/api/management/device"
import { cepStart, cepStop , cepUninstall , cepDeploy }  from "@/api/piping/cep"
export default {
  props:["cepDetail"],
  data() {
    return {
      cep_program_id: "",
      dialog: false,
      disabled: false,
      gatewayId: "",
      deviceData: [],
      deployLoading:false,
      startLoading:false,
      uninstallLoading:false
    };
  },
  methods: {
    getDevice: function() {
      let self = this;
      self.disabled = true;
      geDeviceList({ gateway_id: self.gatewayId }).then(function(res) {
        if (res.resCode == 0) {
          console.log(res);
          self.dialog = true;
          self.deviceData = res.data;
        } else {
          self.$message({
            message: res.msg,
            type: "error"
          });
        }
        self.disabled = false;
      });
    },
    arduinoCreate: function(scope) {
      //let self=this;
      /*
         cepArduinoCreate({cep_program_id:self.cep_program_id,device_id:scope.row.device_id}).then(function(res){
             console.log('arduinoCreate');
             console.log(res);
             if(res.resCode==0){
                 self.$message({
                     message:res.msg,
                     type:'success'
                 });      
             self.$emit('arduinoCreate',res.data);
             }
             else{
                self.$message({
                     message:res.msg,
                     type:'error'
                 });
             }
         });*/
      //  let data={};
      //  data.stream={"category":"Stream","text":"Stream","id":125,"key":6,"NAME":'ADD1'};
      //  data.source={"category":"Source","text":"Source","id":222,"key":8,"NAME":'ADD2'};
      this.$emit("arduinoCreate", scope);
    },
    startOrStop:function(){
      if(this.cepDetail.runningStatus==0){// 关闭状态
          this.start();
      }
      else{
         this.stop()
      }
    },
    start:function(){
         this.$confirm('确定启动cep程序?', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
            }).then(()=>{ 
              this.startLoading=true;
                cepStart({cepProgramId:this.cepDetail.cepProgramId}).then(res=>{
                  this.startLoading=false;
                    if(res.code==200){
                      this.cepDetail.runningStatus=1;
                      this.$message.success(res.message);
                    }
                    else{
                      this.$message.error(res.message);
                    }
                });

            }).catch(()=>{})
    },
    stop:function(){
        this.$confirm('确定关闭cep程序?', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
            }).then(()=>{ 
              this.startLoading=true;
                cepStop({cepProgramId:this.cepDetail.cepProgramId}).then(res=>{
                  this.startLoading=false;
                    if(res.code==200){
                        this.cepDetail.runningStatus=0;
                        this.$message.success(res.message);
                    }
                    else{
                      this.$message.error(res.message);
                    }
                });

            }).catch(()=>{})
    },
    uninstall:function(){
        this.$confirm('确定卸载cep程序?', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
            }).then(()=>{ 
              this.uninstallLoading=true;
                cepUninstall({cepProgramId:this.cepDetail.cepProgramId}).then(res=>{
                  this.uninstallLoading=false;
                    if(res.code==200){
                        this.cepDetail.deployStatus=0;
                        this.$message.success(res.message);
                    }
                    else{
                      this.$message.error(res.message);
                    }
                });

            }).catch(()=>{})
    },
    deploy:function(){
         this.$confirm('确定'+this.cepDetail.deployStatus==0?'':'重新'+'部署cep程序?', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
            }).then(()=>{ 
              this.deployLoading=true;
                cepDeploy({cepProgramId:this.cepDetail.cepProgramId}).then(res=>{
                  this.deployLoading=false;
                    if(res.code==200){
                        this.cepDetail.deployStatus==0?this.cepDetail.deployStatus=1:this.cepDetail.deployStatus=0;
                        this.$message.success(res.message);
                    }
                    else{
                      this.$message.error(res.message);
                    }
                });

            }).catch(()=>{})
    }
  },
  mounted() {
    this.gatewayId = this.$route.params.id;
    this.cep_program_id = this.$route.params.cep_id;
    let self = this;
    this.$on("showDeviceList", function() {
      self.dialog = false;
    });
  }
};
</script>
<style scoped>
.Dialog .el-dialog_body {
  padding-top: 0;
}
/**/
#back {
  line-height: 70px;
  height: 70px;
  background: #d9dee4;
  position: relative;
  top: 0px;
  left: 0px;

  font-weight: bold;
  width: 195px;
}
#back .el-icon-arrow-left {
  font-weight: bold;
  font-size: 30px;
  padding: 10px 30px;
  position: relative;
  top: -2px;
}
.addDevice {
  margin-left: 50px;
  position: relative;
  top: -6px;
}
</style>

