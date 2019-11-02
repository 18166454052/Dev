<template>
<div>
    <el-row style="border-bottom:1px solid #dcdfe6;padding:5px 20px">
            
            <el-col :span="24" class="text-right">
                <el-button size="mini"   @click="$router.go(-1)">
                    <svg-icon  icon-class="back" style="font-size:20px"></svg-icon>
                </el-button>
            </el-col>
    </el-row>   
    <div class="app-container ">
        <el-row>
          <el-col :xs="{span:20,offset:2}" :sm="{span:18,offset:3}"
                :md="{span:16,offset:4}" :lg="{span:16,offset:4}" :xl="{span:16,offset:4}">
                <el-tabs type="border-card">

                  <div  class="m-t">
                        <el-form  label-position="right"  label-width="120px"  ref="msa" :model="Form" :rules="rules"  class="Form" size="mini">
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
                                    
                                    
                                    <el-form-item  label="任务配置名 :" prop="msaTaskName">
                                        <el-input  v-model="Form.msaTaskName" ></el-input>
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
import { msaCreate } from "@/api/msaDoe/msa"
import { getUserId, removeSessionId } from '@/utils/auth'
export default {
    data(){
        return {
            loadingSave:false,
            Form:{
               folderId:'',
               msaTaskName:'',
              // controlGraph:''
            },
            rules:{
               folderId:[
                   {required:true,message:'请选择文件夹',trigger:"change,blur"}
               ],
               msaTaskName:[
                   {required:true,message:'请填写任务名称',trigger:"change,blur"}
               ],
            },
           
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
          this.$refs.msa.validate(res=>{
               if(res){
                let userId=getUserId();
                if(userId){
                    this.loadingSave=true;
                    msaCreate(Object.assign({},this.Form,{createbyUserId:Number(userId)})).then(res=>{
                        this.loadingSave=false;
                        if(res.code==200){
                            console.log(res);
                            this.$router.push('/msa/detail/'+res.data.msaTaskId);
                            this.$message.success("创建MSA任务成功");
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
        }
    },
    created:function(){
        this.getFolderList();
    }
}
</script>


