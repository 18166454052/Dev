<template>
   <el-form label-position="right" label-width="150px" class="Form " size="mini">
       <el-form-item  label="Alert Name :">
           <el-col :span="22">
               <el-input v-model="alert.cep_alert_name" @input="changeName"></el-input>
           </el-col>
       </el-form-item>
      <el-form-item  label="Comment :">
           <el-col :span="22">
               <el-input v-model="alert.comment"></el-input>
           </el-col>
       </el-form-item>
       <el-form-item label="Alert Config :">
           <el-row v-for="(config,index) in alert_config" :key="config.cep_alert_config_id">
                <el-col :span="11">
                    <!-- <el-input  v-model="config.stream_column_name" placeholder="stream_column"
                     :disabled="config.cep_alert_config_id>0" v-if="config.cep_alert_config_id"/> -->

                      <el-select v-model="config.cep_stream_column_id" 
                      :disabled="config.cep_alert_config_id>0"
                      placeholder="stream_column"
                      >
                        <el-option v-for="col in stream_column" 
                            :key="col.cep_stream_column_id"
                            :value="col.cep_stream_column_id" 
                            :label="col.stream_column_name"
                        ></el-option>
                    </el-select>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-select   v-model="config.arithmetic_symbol" placeholder="arithmetic_symbol">
                        <el-option label="<" value="1"></el-option>
                        <el-option label="<=" value="2"></el-option>
                        <el-option label=">" value="3"></el-option>
                        <el-option label=">=" value="4"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="11">
                    <el-input  v-model="config.value" type="number" placeholder="value"/>
                </el-col>
                <el-col :span="10" :offset="1">
                     <el-select   v-model="config.alert_level" placeholder="alert_level">
                        <el-option label="warning" value="1"></el-option>
                        <el-option label="error" value="2"></el-option>
                        <el-option label="fatal" value="3"></el-option>
                    </el-select>   
                </el-col>
                <el-col :span="22" style="text-align:right">
                    <el-button class="el-icon-delete" size="mini" @click="deleteConfig(config,index)"></el-button>
                    <el-button class="el-icon-plus" size="mini" @click="addConfig" 
                       v-show="index==alert_config.length-1"
                    ></el-button>
                </el-col>
           </el-row>
       </el-form-item>
       <el-form-item lable="">
           <el-col :span="22">
                <el-button type="primary" size="large" @click="submit" :loading='loading'>提交</el-button>
           </el-col>
       </el-form-item>
   </el-form>
</template>

<script>
import {cepAlertDetail, cepAlertUpdate, cepAlertConfigDestroy } from "@/api/piping/alert";
import { cepStreamColumnDetail } from  "@/api/piping/stream";
export default{
    data(){
        return {
          cep_program_id:'',
          loading:false, 
          idObj:{},  // {alertId:'',streamId:''}
          alert:{
          },
          alert_config:[],//
          stream_column:[],
          addAlertConfig:{
              cep_stream_column_id:'',
              arithmetic_symbol:'',
              value:'',
              alert_level:''
          }
            
        }
    },
    methods:{
        changeName:function(val){
            this.$emit('changeName',val);
        },
        submit:function(){
            let self=this;
            self.loading=true;
            cepAlertUpdate({cepAlert:self.alert,cepAlertConfig:self.alert_config}).then(function(res){
                  console.log(res);
                if(res.resCode==0){
                    self.$message(
                        {
                            message:res.msg,
                            type:'success'
                        }
                    );
                    self.alert_config=res.data.cepAlertConfig;
                    self.alert=res.data.cepAlert;
                     if(self.alert_config.length>0){
                          for(let config of self.alert_config){
                                config.alert_level=''+config.alert_level;
                                config.arithmetic_symbol=''+config.arithmetic_symbol;
                          }
                      }
                }
                else{
                    self.$message(
                        {
                            message:res.msg,
                            type:'error'
                        }
                    );
                }
                self.loading=false;
            });
            self.$emit('cepUpdate');
        },
        alertDetail:function(obj){
            let self=this;
            cepAlertDetail({cep_alert_id:obj.alertId,cep_stream_id:obj.streamId}).then(function(res){
                  if(res.resCode==0){
                      console.log(res);
                      self.alert=res.data.cepAlert;
                      self.alert.comment=res.data.cepAlert.comment?res.data.cepAlert.comment:'';
                      self.alert_config=res.data.cepAlertConfig;
                      if(self.alert_config.length>0){
                          for(let config of self.alert_config){
                                config.alert_level=''+config.alert_level;
                                config.arithmetic_symbol=''+config.arithmetic_symbol;
                          }
                      }
                      else{
                         self.alert_config.push(Object.assign({},self.addAlertConfig));
                      }
                     
                  }
                  else{
                      self.$message({
                          message:res.mag,
                          type:'error'
                      });
                  }
            });

            cepStreamColumnDetail({cep_stream_id:self.idObj.streamId}).then(function(res){
                if(res.resCode==0){
                 
                    self.stream_column=res.data;  
                    console.log( 'self.stream_column------');
                     console.log( self.stream_column);
                }
                else{
                    self.$message({
                        message:res.msg,
                        type:'error'
                    });
                }
            });
        },
        addConfig:function(){
            let self=this;
            self.alert_config.push(Object.assign({},self.addAlertConfig));
        },
        deleteConfig:function(config,index){
            let self=this;
            console.log('config**********');
            console.log(config);
            if(config.cep_alert_config_id){
                cepAlertConfigDestroy({cep_alert_config_id:config.cep_alert_config_id}).then(function(res){
                    if(res.resCode==0){
                        self.alert_config.splice(index,1);  
                        if( self.alert_config.length==0){
                            self.alert_config.push(Object.assign({},self.addAlertConfig));
                        }
                    }
                    else{
                        self.$message({
                            message:res.msg,
                            type:'error'
                        });
                    }
                });
            }
            else{
                if(self.alert_config.length>1){
                    self.alert_config.splice(index,1);
                }
                
            }
           
           
        }

    },
    computed:{
    
    },
    mounted(){
        this.cep_program_id=this.$route.params.cep_id;
        let self=this;
        self.$on('alert',function(obj){  
            console.log('alert------dbclick');
             self.idObj=obj; 
             self.alertDetail(obj);
        });
    }
   
    
}
</script>
<style scope>
</style>
