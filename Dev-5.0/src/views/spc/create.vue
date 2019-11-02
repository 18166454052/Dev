<template>
<div>
    <el-row style="border-bottom:1px solid #dcdfe6;padding:5px 20px">
            
            <el-col :span="24" class="text-right">
                <el-button size="mini" type="primary"  @click="$router.go(-1)">
                    <svg-icon  icon-class="back" style="font-size:20px"></svg-icon>
                </el-button>
            </el-col>
    </el-row>   
    <div class="app-container ">
        <el-row>
            <el-col :xs="{span:20,offset:2}" :sm="{span:18,offset:3}"
                    :md="{span:16,offset:4}" :lg="{span:16,offset:4}" :xl="{span:16,offset:4}">
                    <el-tabs type="border-card"  v-model="Form.analysisMethod"
                         @tab-click="tabClick"
                    >
                        <el-tab-pane label="抽样分析" name="1">
                        </el-tab-pane>
                        <el-tab-pane label="趋势分析" name="2">
                        </el-tab-pane>
                        <el-tab-pane label="在线预警" name="3">
                        </el-tab-pane>    
                        <div  class="m-t">
                            <el-form  label-position="right"  label-width="120px"  ref="spc" :model="Form" :rules="rules"  class="Form" size="mini">
                                <el-row style="overflow:hidden;">
                                <div>
                                    <el-col :span="22" class="setting">
                                        <!-- <p  class="setTitle">基本信息</p> -->
                                        <el-form-item  label="文件夹名称 :"  prop="folderId"  >
                                            <el-select v-model="Form.folderId" >
                                                <el-option v-for="folder in folderList"
                                                :label="folder.folderName"
                                                :value="folder.folderId"
                                                :key="folder.folderId+'_'+folder.folderName"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                        
                                        
                                        <el-form-item  label="任务名称 :" prop="spcTaskName">
                                            <el-input  v-model="Form.spcTaskName" ></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-radio v-model="Form.calculationType" label="1" @change="Form.controlGraph=''">计量型</el-radio>
                                            <el-radio v-model="Form.calculationType" label="2" @change="Form.controlGraph=''">计数型</el-radio>
                                        </el-form-item>
                                        <el-form-item  label="管制图形 :"  prop="controlGraph" >
                                            <el-select v-model="Form.controlGraph" >
                                                <el-option v-for="graph in filterGraphType"
                                                :label="graph.label"
                                                :value="graph.value"
                                                :key="graph.label+'_'+graph.value"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item> 
                                    </el-col>
                                </div>
                                </el-row>        
                            </el-form>

                            <el-row>
                            <el-col :span="24">
                                <div style="border-top:1px solid #ebeef5;margin-top:20px;text-align:center;padding-top:20px;margin-bottom:10px">
                                        <!-- <el-button @click="test">test</el-button> -->
                                        <el-button type="primary"  size="mini" :loading="loadingSave" 
                                            @click="submit"
                                        >保存</el-button>
                                    
                                
                                </div>
                            </el-col> 
                            </el-row>   
                        </div>
                    </el-tabs>
            </el-col>
        </el-row>
            
    </div>
  </div>  
</template>
<script>
import { folderList } from "@/api/folder"
import { spcCreate,spcDetail } from "@/api/spc/config"
import { getUserId, removeSessionId } from '@/utils/auth'
export default {
    data(){
        return {
           
            activeName:'1',
            loadingSave:false,
            Form:{
               folderId:'',
               spcTaskName:'',
               controlGraph:'',
               analysisMethod:"1",
               calculationType:'1',
            },
            rules:{
               folderId:[
                   {required:true,message:'请选择文件夹',trigger:"change,blur"}
               ],
               spcTaskName:[
                   {required:true,message:'请填写任务名称',trigger:"change,blur"}
               ],
               controlGraph:[
                   {required:true,message:'请选择管制图形',trigger:"change,blur"}
               ],
            },
            graphType:[
                { label: "X-R", value:1},
                { label: "X-S", value:2},
                { label: "me-R", value:3},
                { label: "X-MR", value:4},
                { label: "P", value:5},
                { label: "np", value:6},
                { label: "c", value:7},
                { label: "u", value:8},
            ],
            folderList:[]
        }
    },
    methods:{
        getFolderList:function(){
            folderList().then(res=>{
                if(res.code==200){
                    console.log(res)
                    this.folderList=res.data.list;
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        submit:function(){
          this.$refs.spc.validate(res=>{
               if(res){
                let userId=getUserId();
                if(userId){
                    this.loadingSave=true;
                    spcCreate(Object.assign({},this.Form,{createbyUserId:Number(userId)})).then(res=>{
                        this.loadingSave=false;
                        if(res.code==200){
                            if(res.data.analysisMethod==1){//计量  计数
                                this.$router.push('/spc/detail/'+res.data.spcTaskId);
                               
                            }
                            else if(res.data.analysisMethod==2){//制程能力
                                this.$router.push('/spc/process/detail/'+res.data.spcTaskId);
                            }
                            else{ // 在线预警
                            //spcTaskId  spcTaskOnlineId
                              //   this.$router.push('/spc/warning/'+res.data.spcTaskId);
                              this.getSpcDetail(res.data.spcTaskId);
                            }
                            
                            this.$message.success("创建SPC任务成功");
                        }
                        else{
                            this.$message.error(res.message);
                        }
                    });
                }
                else{
                    removeSessionId();
                    this.$router.replace('/login');
                    this.$message.error("用户信息获取失败，请重新登录");
                }
                  

              }
          });
        },
        tabClick:function(tab,event){
            this.$refs.spc.resetFields();
        },
        getSpcDetail:function(spcTaskId){
            spcDetail({spcTaskId:spcTaskId}).then(res=>{
                if(res.code==200){
                    if( res.data.spcTaskId 
                        && res.data.spcTaskOnline 
                        && res.data.spcTaskOnline.spcTaskOnlineId ){
                            this.$router.push('/spc/warning/'+res.data.spcTaskId+"_"+res.data.spcTaskOnline.spcTaskOnlineId);
                    }
                    else{
                        this.$router.push('/tb/user/folder');
                    }
                     
                }
                else{
                    this.$router.push('/tb/user/folder');
                }
            });
        }
    },
    computed:{
        filterGraphType:function(){
            if(this.Form.calculationType==1){ // 计量
                return this.graphType.slice(0,4);
            }
            else if(this.Form.calculationType==2){
                return this.graphType.slice(4);
            }
            else{
                return [];
            }
        }
    },
    created:function(){
        this.getFolderList();
    }
}
</script>


