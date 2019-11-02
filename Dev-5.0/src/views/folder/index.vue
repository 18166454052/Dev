<template>
    <div>
         <el-row style="border-bottom:1px solid #dcdfe6;padding:5px 20px">
            
            <el-col :span="24" class="text-right">
                <el-button size="mini"   @click="$router.go(-1)">
                    <svg-icon  icon-class="back" style="font-size:20px"></svg-icon>
                </el-button>
            </el-col>
       </el-row>   
    
        <div class="app-container">
            
            <el-row>
                <el-col :xs="{span:20,offset:2}" :sm="{span:18,offset:3}"
                    :md="{span:16,offset:4}" :lg="{span:16,offset:4}" :xl="{span:16,offset:4}">
                    <el-tabs type="border-card">
                        <el-form  label-position="right"  ref="folder" label-width="120px"   :model="folder" :rules="rules"  class="Form m-t" size="mini">
                            <el-row style="overflow:hidden;">
                                <el-col :span="22" class="setting">
                                    <!-- <p  class="setTitle">基本信息</p> -->
                                    <el-form-item  label="文件夹名称 :"  prop="folderName"  class="required">
                                        <el-input  v-model="folder.folderName"> </el-input>
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
import {folderCreate,folderDelete} from "@/api/folder"
import { getUserId, removeSessionId } from '@/utils/auth'
export default {
    data(){
        return {
          folder:{
              folderName:''
          },
          rules:{
              folderName:[
                  {required:true,message:"请填写文件夹名称",trigger:"change,blur"}
              ]
          },
          loadingSave:false
        }
    },
    methods:{
        submit:function(){
            this.$refs.folder.validate(res=>{
                if(res){
                    this.loadingSave=true;
                    let userId=getUserId();
                    if(userId){
                        folderCreate({folderName:this.folder.folderName,createbyUserId:userId}).then(res=>{
                            this.loadingSave=false;
                            if(res.code==200){
                                
                                this.$refs.folder.resetFields();
                                this.$router.push('/tb/user/folder');
                                this.$message.success('创建文件夹成功');
                            }
                            else{
                                this.$message.error(res.message);
                            }
                                
                        });
                    }else{
                         removeSessionId();
                         this.$router.replace('/login');
                         this.$message.error("用户信息获取失败，请重新登录");
                    }
                  
                }
            })
        }
        
    }
}
</script>

