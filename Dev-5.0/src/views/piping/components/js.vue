<template>
   <el-form label-position="right" :model="js" :rules="rules" ref="js" label-width="100px" class="Form" size="mini">
       <el-form-item  label="节点名称 :" prop="cepJsName">
           <el-col :span="22">
               <el-input v-model="js.cepJsName"  @input="changeName"></el-input>
           </el-col>
       </el-form-item>
       <el-form-item label="使用模板 : ">
           <el-col :span="22">
               <el-radio-group v-model="useTemplate" @change="useTemplate?'':templateIndex=''">
                    <el-radio :label='true'>是</el-radio>
                    <el-radio :label='false'>否</el-radio>
            </el-radio-group>
               
           </el-col>
       </el-form-item>
       <el-form-item label="模板 : " v-show="useTemplate">
           <el-col :span="22">
               <el-select v-model="templateIndex"
               @change="setTemplate"
               >
                    <el-option 
                    v-for="(column,index) in jsTemplateList    "
                    :key="index+'_'+column.cepJsName"
                    :label="column.cepJsName"
                    :value="index"
                    ></el-option>
               </el-select>
               
           </el-col>
       </el-form-item>
       <el-form-item  label="返回类型 :" prop="returnType">
           <el-col :span="22">
              <el-select v-model="js.returnType">
                        <el-option
                           v-for="type in type"
                           :label="type.label"
                           :value="type.value"
                           :key="type.label"
                           @changes="change"
                        >

                        </el-option>
              </el-select>
           </el-col>
       </el-form-item>
        <el-form-item  label="Content :" prop="cepJsContent">
          <el-row>
            <el-col :span="22" class="CODEMIRROE CODEMIRROESource">
              <codemirror 
                    v-model="js.cepJsContent"  
                    :options="mySqlOption"
                    @changes="change"
                    class="code" 
                    style="line-height:20px;" 
               
                 ></codemirror>
            </el-col>
          </el-row>
          </el-form-item>
        <el-form-item  label="Comment :">
            <el-row>
                <el-col :span="22">
                    <el-input v-model="js.comment"></el-input>
                </el-col>
            </el-row>
       </el-form-item>
        <el-form-item label="设置为模板 : ">
            <el-col :span="22">
                <el-radio-group v-model="js.published">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                </el-radio-group>
            </el-col>
       </el-form-item>
       <el-form-item lable="">
           <el-col :span="22" class="btnBlock">
                <el-button type="primary" size="mini" @click="submit">提交</el-button>
           </el-col>
       </el-form-item>
   </el-form>
</template>

<script>
import {cepJsDetail, cepJsUpdate,cepJsTemplate} from "@/api/piping/js";
import ElFormItem from  '../../../../node_modules/element-ui/packages/form/src/form-item.vue'
import { codemirror } from 'vue-codemirror' 
import 'codemirror/theme/rubyblue.css'
import 'codemirror/mode/sql/sql.js'
export default{
  //  props:['jobId'],
    components: {ElFormItem,codemirror},
    data(){
        return {
           jsId:'',
            
           js:{
               cepJsName:'',
               returnType:'',
               cepJsContent:'',
               comment:'',
               published:0,
           },
            useTemplate:false,
            jsTemplateList:[
            ],  
            templateIndex:'',
           rules:{
               cepJsName:[
                   {required:true,message:"请填写节点名称",trigger:"change,blur"},
                    {validator:this.$checkName,trigger:"change,blur"}
               ],
               returnType:[
                   {required:true,message:"请选择返回类型",trigger:"change,blur"},
               ],
               cepJsContent:[
                   {required:true,message:"请填写Content",trigger:"change,blur"},
               ],
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
         type:[
             {label:'int',value:1},
             {label:'string',value:2},
             {label:'double',value:3},
         ],
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
       jsDetail:function(){
          
           cepJsDetail({cepJsId:this.jsId}).then(res=>{
                if(res.code==200){
                  this.js=Object.assign({},this.js,res.data);
                }
                else{
                    this.$message.error(res.message);
                }
           });
       },
       submit:function(){
           this.$refs.js.validate(res=>{
               if(res){
                    this.fullLoading=this.$loading(this.LOADING);
                    cepJsUpdate(this.js).then(res=>{
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
            this.$emit('changeName',val);
       },
       change:function(){
            this.$refs.js.validateField('cepJsContent');
       },
       getTemplate:function(){
            cepJsTemplate().then(res=>{
                if(res.code==200){
                    if(res.data && Array.isArray(res.data) && res.data.length>0){
                            this.jsTemplateList=res.data.filter(js=>js.cepJsId!==this.jsId);
                    }
                }
                else{
                   this.$message.error(res.message);
                }
           });
       },
       setTemplate:function(){
             if(this.useTemplate && this.templateIndex>=0){//
                 let js=Object.assign({},this.jsTemplateList[this.templateIndex]);
                 delete js.cepJsName;
                 Object.assign(this.js,js);
            }
       }
    },
    watch:{
    },
    mounted(){
        let self=this;
        self.$on('js',function(jsId){
            self.jsId=jsId;
            self.$refs.js.resetFields();
            self.js.cepJsContent="";
            self.useTemplate=false;
            self.templateIndex='';
            self.jsDetail();
            self.getTemplate();
        });
      
    }
}
</script>
