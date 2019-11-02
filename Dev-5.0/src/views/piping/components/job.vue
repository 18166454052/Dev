<template>
   <el-form label-position="right" :model="job" :rules="rules" ref="job" label-width="100px" class="Form" size="mini">
       <el-form-item  label="Job Name :" prop="cepJobName">
           <el-col :span="22">
               <el-input v-model="job.cepJobName"  @input="changeName"></el-input>
           </el-col>
       </el-form-item>
        <el-form-item label="使用模板 : ">
           <el-col :span="22">
               <el-radio-group v-model="useTemplate" @change="templateIndex=''">
                    <el-radio label='2'>系统模板</el-radio>
                    <el-radio label='1'>自定义模板</el-radio>
                    <el-radio label='0'>否</el-radio>
            </el-radio-group>
               
           </el-col>
       </el-form-item>
       <el-form-item label="模板 : " v-show="useTemplate>0">
           <el-col :span="22">
               <el-select v-model="templateIndex"
               @change="setTemplate"
               >
                    <el-option 
                    v-for="(column,index) in jobTemplateList "
                    :key="index+'_'+column.cepJobName"
                    :label="column.cepJobName"
                    :value="index"
                    ></el-option>
               </el-select>
               
           </el-col>
       </el-form-item>
        <el-form-item  label="Content :" prop="cepJobContent">
          <el-row>
            <el-col :span="22" class="CODEMIRROE CODEMIRROESource" style="margin-top:10px;position:relative"
                            >
                 <codemirror 
                    v-model="job.cepJobContent"  
                    :options="mySqlOption"
                    class="code" 
                    style="line-height:20px;" 
                    @changes="change"
               
                ></codemirror>
            </el-col >
          </el-row>
          </el-form-item>
        <el-form-item  label="Comment :">
            <el-row>
                <el-col :span="22">
                    <el-input v-model="job.comment"></el-input>
                </el-col>
            </el-row>
       </el-form-item>
        <el-form-item label="设置为模板 : ">
            <el-col :span="22">
                <el-radio-group v-model="job.published">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                </el-radio-group>
            </el-col>
       </el-form-item>
       <el-form-item label="">
           <el-col :span="22" class="btnBlock">
                <el-button type="primary" size="mini" @click="submit" :loading='loading'>提交</el-button>
           </el-col>
       </el-form-item>
   </el-form>
</template>

<script>
import {cepJobDetail, cepJobUpdate,cepJobPublicTemplate,cepJobTemplate} from "@/api/piping/job";
import ElFormItem from  '../../../../node_modules/element-ui/packages/form/src/form-item.vue'
import { codemirror } from 'vue-codemirror' 
import 'codemirror/theme/rubyblue.css'
import 'codemirror/mode/sql/sql.js'
export default{
  //  props:['jobId'],
    components: {ElFormItem,codemirror},
    data(){
        return {

            jobId:'',
            loading:false,
            job:{
               cepJobName:'',
               cepJobContent:'',
               comment:'',
               published:0,
            },
            useTemplate:'0',
            jobUserTemplateList:[  // 用户自定义模板
               
            ],
            jobPublicTemplateList:[ // 系统自定义模板
               
            ],  
            templateIndex:'',
            rules:{
                cepJobName:[
                    {required:true,message:"请填写节点名称",trigger:"change,blur"},
                    {validator:this.$checkName,trigger:"change,blur"}
                ],
                cepJobContent:[
                    {required:true,message:"请填Content",trigger:"change,blur"},
                ]
            },
            mySqlOption:{
                tabSize: 4,
                styleActiveLine: true,
                lineNumbers: true,
                line: true,
                mode:'text/x-sql',
                lineWrapping: true,
                theme: 'rubyblue',
                autoRefresh: true
            },
            fullLoading:null,
            LOADING:{
                LOADING: {
                lock: true,
                text: '数据处理中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.6)'
              }
          }, 
        }
    },
    methods:{
        jobDetail:function(){
            cepJobDetail({cepJobId:this.jobId}).then((res)=>{
                if(res.code == 200) {
                    this.job=Object.assign({},this.job,res.data);
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        submit:function(){
           this.$refs.job.validate(res=>{
               if(res){
                    this.job.cepJobId=this.jobId;
                    this.fullLoading=this.$loading(this.LOADING);
                    cepJobUpdate(this.job).then((res)=>{
                        this.fullLoading.close();
                        if(res.code==200){
                            this.$message.success(res.message);
                            this.$emit('cepUpdate');
                        }
                        else{
                            this.$message.error(res.message);
                        } 
                    });
               }
           });
          
           
        },
        changeName:function(val){
           if(val.indexOf('_')>=0){
               
            }
            else{
                 this.$emit('changeName',val);
            }
            this.$emit('changeName',val);
       },
       change:function(){
          this.$refs.job.validateField('cepJobContent');
       },
       setTemplate:function(){
           if(this.useTemplate>0){
               if(this.useTemplate==1){
                   let job=Object.assign({},this.jobUserTemplateList[this.templateIndex]);
                   delete job.cepJobName;
                   Object.assign(this.job,job);
               }
                if(this.useTemplate==2){
                   let job=Object.assign({},this.jobPublicTemplateList[this.templateIndex]);
                   delete job.cepJobName;
                   Object.assign(this.job,job);
               }
           }
       },
       getTemplate:function(){
           cepJobTemplate().then(res=>{
               if(res.code==200){
                    if(res.data && Array.isArray(res.data) && res.data.length>0){
                        this.jobUserTemplateList=res.data;
                    }
               }
               else{
                   this.$message.error(res.message);
               }
           });
       },
       getPublicTemplate:function(){
           cepJobPublicTemplate().then(res=>{
               if(res.code==200){
                    if(res.data && Array.isArray(res.data) && res.data.length>0){
                        this.jobPublicTemplateList=res.data;
                    }
               }
               else{
                   this.$message.error(res.message);
               }
           });
       }
    },
    computed:{
        jobTemplateList:function(){
            if(this.useTemplate>0){
                if(this.useTemplate==1){
                    return this.jobUserTemplateList;
                }
                if(this.useTemplate==2){
                    return this.jobPublicTemplateList;
                }
            }
            else{
                return [];
            }
        }
    },
    watch:{
    },
    mounted(){
        let self=this;
        self.$on('job',function(jobId){
            self.jobId=jobId;
            self.$refs.job.resetFields();
            self.useTemplate=0;
            self.templateIndex='';
            self.jobDetail();
            self.getTemplate();
            self.getPublicTemplate();
        });
      
    }
}
</script>
