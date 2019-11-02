<template>
   <div>
         <el-row style="border-bottom:1px solid #dcdfe6;padding:5px 20px">
            
            <el-col :span="24" class="text-right">
                <el-button size="mini" type="primary"  @click="$router.go(-1)">
                    <svg-icon  icon-class="back" style="font-size:20px"></svg-icon>
                </el-button>
            </el-col>
       </el-row>   
    
        <div class="app-container">
            
            <el-row>
                <el-col :xs="{span:20,offset:2}" :sm="{span:18,offset:3}"
                    :md="{span:16,offset:4}" :lg="{span:16,offset:4}" :xl="{span:16,offset:4}">
                    <el-tabs type="border-card">
                        <el-form  label-position="right"  ref="cep" label-width="120px"   :model="cep" :rules="rules"  class="Form m-t" size="mini">
                            <el-row style="overflow:hidden;">
                                <el-col :span="22" class="setting">
                                    <!-- <p  class="setTitle">基本信息</p> -->
                                    <el-form-item  label="文件夹名称 :"  prop="folderId">
                                        <el-select v-model="cep.folderId"
                                        placeholder="请选择文件夹"
                                        >
                                            <el-option
                                              v-for="folder in folderList"
                                              :label="folder.folderName"
                                              :value="folder.folderId"
                                              :key="'folder'+folder.folderId"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item  label="网关名称 :"  prop="gatewayId">
                                        <el-select v-model="cep.gatewayId"
                                        placeholder="请选择网关"
                                        >
                                            <el-option
                                              v-for="gateway in gatewayList"
                                              :label="gateway.gatewayName"
                                              :value="gateway.gatewayId"
                                              :key="'gateway'+gateway.gatewayId"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item  label="项目名称 :"  prop="programName">
                                        <el-input v-model="cep.programName"></el-input>
                                    </el-form-item>
                                    <el-form-item  label="描述 :">
                                        <el-input v-model="cep.comment"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <div style="border-top:1px solid #ebeef5;text-align:center;padding-top:20px;margin-bottom:10px">
                                            <!-- <el-button @click="test">test</el-button> -->
                                            <el-button type="primary"  size="mini" :loading="loadingSave" 
                                                @click="submit"
                                            >创建</el-button>
                                            <!-- <el-button @click="folderDelete">删除</el-button> -->
                                        
                                    
                                    </div>
                                </el-col> 
                            </el-row>          
                        </el-form>


                    </el-tabs>
                </el-col>
            </el-row>         
        
        </div>
    </div> 
</template>
<script>
import { folderList } from "@/api/folder"
import { gatewayList } from "@/api/piping/gateway"
import { cepCreate } from "@/api/piping/cep"
import { getUserId, removeSessionId } from '@/utils/auth'
export default {
    data(){
        return {
            loadingSave:false,
            cep:{
               folderId:'',
               gatewayId:'',
               programName:'',
               comment:'',
               createByUserId:''
            },
            rules:{
                folderId:[
                    {required:true,message:"请选择文件夹",trigger:"change,blur"}
                ],
                gatewayId:[
                    {required:true,message:"请选择网关",trigger:"change,blur"}
                ],
                programName:[
                    {required:true,message:"请填写cep项目名称",trigger:"change,blur"}
                ],
            },
            folderList:[],
            gatewayList:[]
        }
    },
    methods:{
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
        getGatewayList:function(){
            gatewayList().then(res=>{
                if(res.code==200){
                    this.gatewayList=res.data.list.slice();
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        submit:function(){
            this.$refs.cep.validate(res=>{
                if(res){
                    this.cep.createByUserId=getUserId();
                    this.loadingSave=true;
                    cepCreate(this.cep).then(res=>{
                        this.loadingSave=false;
                       
                        if(res.code==200){
                            this.$router.push('/piping/gateway/cep/program/'+res.data.cepProgramId);
                            this.$refs.cep.resetFields();
                           
                        
                            this.$message.success(res.message);
                            
                        }
                        else{
                            this.$message.error(res.message); 
                        }
                    });
                }
            });
           
        }
    },
    created:function(){
        this.getFolderList();
        this.getGatewayList();
    }
}
</script>
