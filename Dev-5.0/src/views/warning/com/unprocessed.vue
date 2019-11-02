<template>
    <div class="warning">
        <el-card shadow="never" class="m-t">
            <div slot="header" class="clearfix">
                <span>预警条件</span>
                
            </div> 
            <el-form class="Form" label-width="100px" label-position="right">
                <el-row>
                    <el-col :span="8" v-for="(val,index) in warningInfo.warningCondition" :key="index+'_'+val" > 
                        <el-form-item >
                                {{val}}
                        </el-form-item>
                    </el-col>
                </el-row>
                
            </el-form>
        </el-card>
        <el-card shadow="never" class="m-t">
            <div slot="header" class="clearfix">
                <span>预警信息</span>
                
            </div> 
            <div>
                {{warningInfo.warningInfo}} </div>
            <!-- <el-form class="Form" label-width="100px" label-position="right">
                <el-row>
                    <el-col :span="8" v-for="(val,key) in warningInfo.warningCondition" :key="key+'_'+val" > 
                        <el-form-item :label="key+' : '">
                                {{val}}
                        </el-form-item>
                    </el-col>
                </el-row>
                
            </el-form> -->
        </el-card>
         <el-card shadow="never" class="m-t">
            <div slot="header" class="clearfix">
                <span>预警相关数据</span>
                
            </div>
            <div>
                <el-tabs v-model="activeName" type="card" >
                    <el-tab-pane :label="type=='jl'?XR[0]+'管制图':'控制图'" name="X"></el-tab-pane>
                    <el-tab-pane :label="type=='jl'?XR[1]+'管制图':'累积概率图'" name="R"></el-tab-pane>
                    <el-tab-pane :label="type=='jl'?'制程能力图':'柏拉图'" name="Z"></el-tab-pane>
                    <el-tab-pane label="样本" name="S"></el-tab-pane>
                    <el-tab-pane >
                         <span slot="label">
                           <el-dropdown @command="setActiveName">
                                <span class="el-dropdown-link">
                                    选择趋势<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item
                                          v-for="item in variableArr" 
                                          :key="item"
                                          :command="item"
                                        >{{item}}
                                        </el-dropdown-item>
                                       
                                    </el-dropdown-menu>
                                </el-dropdown>
                                
                                      <!-- <el-select   slot="reference"
                                      @change="setActiveName"
                                      >
                                        <el-option
                                          v-for="item in variableArr" 
                                          :key="item"
                                          :label="item"
                                          :value="item"
                                        >

                                        </el-option>
                                      </el-select> -->
                                        <!-- <el-button slot="reference">选择</el-button> -->
                                   
                         </span>
                        
                    </el-tab-pane>
                    
                </el-tabs>
            </div>
            <div style="height:400px">
                 <v-linex v-if="XcharData.rows.length>0 && type=='jl' && activeName=='X'"
                        ref="linex"
                        :chart-data="XcharData" 
                        :MAX="max" 
                        :MIN="min"
                        :selectedXrules="selectedXrules"
                        WX="100%"
                        HX="480"
                        :show="true"
                ></v-linex> 
                 <v-liner
                        v-if="RcharData.rows.length>0 && type=='jl' && activeName=='R'"
                        :chart-data="RcharData"
                        :min="minR"
                        :max="maxR"
                        :selectedRrules="selectedRrules"
                        HR="480"
                        WR="100%"
                        :show="true"
                ></v-liner>
                <v-bar 
                     v-if="type=='jl' && countDatas.length>0 && activeName=='Z'"
                        :count="countDatas" 
                        :distData="distData" 
                        :MIN="minZF" 
                        :MAX="maxZF"
                        :sigma="sigma"
                        :usl="usl"
                        :lsl="lsl"
                        :sigma1="sigma1"
                        :sigma2="sigma2"
                        :sigma3="sigma3"
                        :sigma_1="sigma_1"
                        :sigma_2="sigma_2"
                        :sigma_3="sigma_3"
                        HZ="480"
                        WZ="100%"
                ></v-bar>
                <v-step v-if="dataX.length>0 && type=='js' && activeName=='X'"
                        :dataX="dataX"
                        :ucl="ucl"
                        :lcl="lcl"
                        :badData="badData"
                        :errorDatas="errorDatas"
                        :type="TYPE"
                        HX="400"
                        WX="100%"
                        :show="true"
                ></v-step>

                <v-line
                       v-if="cumulativeRateData.rows.length>0 && type=='js' && activeName=='R'"
                       :chartData="cumulativeRateData"
                       HR="400"
                       WR="100%"
                       :show="true"
                ></v-line>
                <v-plato
                    v-if="type=='js' && paretoData.count.length>0 && activeName=='Z'"
                    :paretoData="paretoData"
                    HZ="400"
                    WZ="100%"
                    >
                </v-plato>
                  <v-line-sample
                          
                            :data="sampleList"
                            v-if="activeName=='S'"
                            :zoom="true"
                            bottom="50"
                            > </v-line-sample>
                 <template  v-for="item in variableArr">
                        <v-line-sample
                            :key="item+'sample'"
                            :data="chartData[item]"
                            v-if="activeName==item"
                            > </v-line-sample>
             </template>

               

            </div>
           
         </el-card>
        <el-card shadow="never" class="m-t">
            <div slot="header" class="clearfix">
                <span>厂商反馈</span>
                
            </div> 
            <el-form class="Form" label-width="100px" label-position="right">
        
                <el-form-item label="根本原因归类 : ">
                    <el-select v-model="data.exceptionType">
                        <el-option
                         v-for="(item,index) in resourceList" 
                         :key="item"
                         :value="index+1+''"
                         :label="item"
                        >

                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="异常原因分析 : " class="Editor">
                    <v-quill-editor
                     v-model="data.exceptionContent"
                    :options="editorOption"
                     @change="onEditorChange($event)"

                    ></v-quill-editor>
                    <div style="line-height:20px">
                       <div  style="margin-top:10px">
                        <span style="color:#ccc">允许输入内容的最大值 : </span>
                        <span style="color:#666">{{total}} kb</span>
                    </div>
                    <div>
                        <span style="color:#ccc">输入内容:</span>
                         <span style="color:#666">{{size}} kb</span>
                    </div> 
                    </div>
                    
                </el-form-item>
                <el-form-item>
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        :action="action"
                        name="fileName"
                        :data="uploadData"
                        :auto-upload="true"
                        :on-success = "uploadSuccess"
                        :on-error = "uploadError"
                      
                        :show-file-list="false"
                       >
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" :loading="uploadLoading">上传到服务器</el-button> -->
                       
                        </el-upload>
                </el-form-item>
                <el-form-item>
                    <div v-for="(file,index) in fileList" :key="'file'+index"
                       style="line-height:25px;" class="uploadFile"
                    >
                        {{file.name}}
                        <el-button size="mini" style="float:right;margin-left:10px" @click="handleRemove(file)"><i class="el-icon-delete"></i></el-button>
                        <el-button size="mini" style="float:right;" @click="handlePreview(file)"><i class="el-icon-download"></i></el-button>
                        <!-- <span style="border:1px solid #ccc;padding:5px;float:right;margin-left:5px"><i class="el-icon-delete"></i></span>
                        <span style="border:1px solid #ccc;padding:5px;float:right"><i class="el-icon-download"></i></span> -->
                       
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button  v-show="step==0" size="medium"  type="primary" :loading="loading" @click="alertUpdate1">提交</el-button>
                    <el-button v-show="step==1" type="primary" :loading="loadingY" @click="alertUpdate('true')">通过</el-button>
                    <el-button v-show="step==1" type="warning" :loading="loadingN" @click="alertUpdate('false')">驳回</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'
import { downloadText } from 'download.js'
//const download = require('download');
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import LineSample from './line'
import viewDataRes from "@/views/spc/viewDataRes";
import Linex from "@/views/spc/component/x_r/lineX"
import Liner from "@/views/spc/component/x_r/lineR"
import Bar from "@/views/spc/component/x_r/bar1"
import Step from '@/views/spc/component/ct/step'
import Plato from '@/views/spc/component/ct/plato'
import Line from '@/views/spc/component/ct/line'
import {onlineAlertUpdate} from "@/api/warning"
const publicPath = require('../../../../config/prod.env.js').publicPath
import {upload, onlineAlertDeleteFiles} from "@/api/warning"
export default {
    mixins:[viewDataRes],
    props:["detail","cpkList","step","processList"],
    components:{
        //'v-line':Line,
        'v-quill-editor':quillEditor,
        'v-linex':Linex,
        'v-liner':Liner,
        'v-bar':Bar,
        'v-step':Step,
        'v-plato':Plato,
        'v-line':Line,
        'v-line-sample':LineSample
    },
    data(){
        return {
            uploadLoading:false,
            upload:upload,
            service:process.env.NODE_ENV=='development'?"localhost:8060/":publicPath,
            loading:false,
            loadingN:false,
            loadingY:false,
            activeName:"X",
            sample:"",
            resourceList:["人员","设备","物料","操作方式","流程","其他"],
            toolbars: {
                bold: true, // 粗体
                italic: true,// 斜体
                header: true,// 标题
                underline: true,// 下划线
                strikethrough: true,// 中划线
                mark: true,// 标记
                superscript: true,// 上角标
                subscript: true,// 下角标
                quote: true,// 引用
                ol: true,// 有序列表
                ul: true,// 无序列表
                link: true,// 链接
                imagelink: true,// 图片链接
                code: true,// code
                table: true,// 表格
                subfield: true,// 是否需要分栏
                fullscreen: true,// 全屏编辑
                readmodel: true,// 沉浸式阅读
                htmlcode: true,// 展示html源码
                help: true// 帮助
            },
            editorOption: {
                 modules: {
                 toolbar: {
                    container:[['bold', 'italic', 'underline', 'strike'],
                        ['blockquote'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        [{ 'color': [] }, { 'background': [] }],
                        ['clean'],
                        [{ 'align': [] },'image'],
                    ],
                    // handlers:{
                    //     'image':function(value){
                    //        // console.log("image---upload");
                    //     }
                    // }
                 }
                   
                },
            },
            data:{
                exceptionType:1,
                exceptionContent:"",
               
            },
            size:0,
            total:512,
            service:''
            
            
           
            
           
            
           
        }
    },
    methods:{
        setActiveName:function(type){
            this.activeName=type;
        },
        alertUpdate1:function(){

            if(this.data.exceptionType=="" || this.data.exceptionContent==""){
                this.$message.warning("请填写完整反馈信息");
                return ;
            }
            let size=(this.sizeof(this.data.exceptionContent,'uft-8')/1024).toFixed(3);
            //this.size=size;
            if(size>this.total){
                this.$message.warning("异常原因分析内容超过最大值");
                return false;

            }
            this.loading=true;
            this.data.spcTaskOnlineAlertingId=this.detail.spcTaskOnlineAlertingId;
            this.data.processingState=1;
            onlineAlertUpdate(this.data).then(res=>{
                this.loading=false;
              
                if(res.code==200){
                    this.$router.go(-1);
                    this.$message.success(res.message);
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        alertUpdate:function(type){
            // 判断异常的内容大小
            let size=(this.sizeof(this.data.exceptionContent,'uft-8')/1024).toFixed(3);
            //this.size=size;
            if(size>this.total){
                this.$message.warning("异常原因分析内容超过最大值");
                return false;

            }

            //
            let data=Object.assign({},this.data);
            data.spcTaskOnlineAlertingId=this.detail.spcTaskOnlineAlertingId;  
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
                     this.$router.go(-1);
                    this.$message.success(res.message);
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        onEditorChange:function(value){
           // this.data.exceptionContent=value.html;
            let size=(this.sizeof(value.html,'uft-8')/1024).toFixed(3);
            this.size=size;
            if(size>this.total){
                this.$message.warning("异常原因分析内容超过最大值");
            }
          
        },
        sizeof : function(str, charset){// 计算富文本编辑器的内容大小
            var total = 0,
                charCode,
                i,
                len;
            charset = charset ? charset.toLowerCase() : '';
            if(charset === 'utf-16' || charset === 'utf16'){
                for(i = 0, len = str.length; i < len; i++){
                    charCode = str.charCodeAt(i);
                    if(charCode <= 0xffff){
                        total += 2;
                    }else{
                        total += 4;
                    }
                }
            }else{
                for(i = 0, len = str.length; i < len; i++){
                    charCode = str.charCodeAt(i);
                    if(charCode <= 0x007f) {
                        total += 1;
                    }else if(charCode <= 0x07ff){
                        total += 2;
                    }else if(charCode <= 0xffff){
                        total += 3;
                    }else{
                        total += 4;
                    }
                }
            }
            return total;// bytes
        },
        submitUpload() {
            this.uploadLoading=true;
            this.$refs.upload.submit();
        },
        handleRemove(file) {// 删除已经上传的文件
       
         this.$confirm('确定删除文件'+file.name+'?', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
            }).then(()=>{
                onlineAlertDeleteFiles({id:this.detail.spcTaskOnlineAlertingId,file:file.file}).then(res=>{
                if(res.code==200){
                   
                    this.$emit("uploadfiles",res.data);
                    this.$message.success(res.message);
                }
                else{
                    this.$message.error(res.message);
                }
                });

    

            }).catch(()=>{

            });
        },
        handlePreview(file) {  //   点击文件列表  下载
           downloadText(file.url, file.name)
           //download(file.url, file.name)
            
        },
        uploadSuccess: function(res, file, fileList){
            this.uploadLoading=false;
           
            if(res.code == 200){
                this.$emit("uploadfiles",res.data);
                this.$message.success(res.message);
            }
            else{
             this.$message.error(res.message);
            }
        },
        uploadError: function(res, file, fileList){
            debugger
            this.uploadLoading=false;
            this.$message.error(res.message);
        }
    },
    computed:{
        warningInfo:function(){
            this.data.exceptionContent=this.detail.exceptionContent;
            this.data.exceptionType=this.detail.exceptionType;
            return this.detail;
        },
        XR: function () {
            let arr = [
                ["X", "R", "平均值", "极差值"],
                ["X", "S", "平均值", "标准差"],
                ["Me", "R", "中位数", "极差"],
                ["X", "MR", "平均值", "移动极差"]
            ];
            if (this.type == 'jl') {
                return arr[Number(this.detail.spcTaskOnline.controlGraph) - 1];
            } else {
                return ["X", "R", "平均值", "极差值"];
            }

        },
        chartData:function(){
            let data={};
            if(this.cpkList.length>0){
                this.cpkList.forEach((item,index)=>{
                     let obj=JSON.parse(item.dataRecordProcessCapability);
                   
                        for(let key in obj) {
                           if(!data[key]){
                                     // this.variableArr.push(key);
                                    data[key]={
                                        columns: ['x', key],
                                        rows:[
                                            {
                                                x:index+1,
                                                [key]:obj[key]
                                            }
                                        ],
                                        process:[]
                                    }
                                    //
                                    if(this.processList && this.processList.length>0){
                                        this.processList.forEach(item=>{
                                        
                                            if(item.keyIndex==key){
                                                data[key].process.push(item.keyValue);
                                            }
                                        });
                                    }

                           }
                           else{
                               data[key].rows.push( 
                                {
                                    x:index+1,
                                    [key]:obj[key]
                                });
                            }
                           }
                });
            }

           
            return data;
        },
        variableArr:function(){
            let data=[];
            let arr=["numGroup","ucl_first","ucl_second","lcl_first","lcl_second"];
            if(this.cpkList.length>0){
                let obj=JSON.parse(this.cpkList[0].dataRecordProcessCapability);
                for(let key in obj) {
                    if(arr.indexOf(key)==-1){
                        data.push(key);
                    }
                }            
                      
            }
            return data;
        },
        sampleList:function(){
            let obj={
                columns:['x','value'],
                rows:[],
                threshold:[],
                error:{}
                
            };
            if(this.detail.spcTaskOnlineAlertThreshold.length>0){
                this.detail.spcTaskOnlineAlertThreshold.forEach(threshold=>{
                    if(threshold.threshold){
                        obj.threshold.push(threshold.threshold);
                    }
                });
            }
           
            //错误原因 
            let errorInfo=JSON.parse(this.detail.dataRecord).spcTaskOnlineAlertThresholds ;// 具体信息
            
            let errorObj={};// {1:联系2次>10,2:联系3次>1}
           if(errorInfo && Array.isArray(errorInfo) && errorInfo.length>0){
                errorInfo.forEach(item=>{
                   errorObj[item.spcTaskOnlineAlertThresholdId]=["连续","累积"][item.warningType]+item.occurrences+'次'+[">",">=","<","<="][item.symbol]+item.threshold;
                });
            }

           let errorArr=JSON.parse(this.detail.dataRecord).exceptionOnlineThresholdList;// index 和 具体信息的对应列表
           
           let errorInfoObj={}; // 1:['联系2次>10','2:联系3次>1']
            if(errorArr && Array.isArray(errorArr) && errorArr.length>0){
                errorArr.forEach(item=>{
                    if(!errorInfoObj[item.dataIndex]){
                        errorInfoObj[item.dataIndex]=[ errorObj[item.ruleNumb] ];
                    }
                    else{
                        errorInfoObj[item.dataIndex].push(errorObj[item.ruleNumb]);
                    }
                });
            }
            obj.error=errorInfoObj;
          
            //  
            let data=JSON.parse(this.detail.dataRecord).spcResult.groupValueList;
            data.forEach(item=>{
                 item.dataList.forEach(info=>{
                     obj.rows.push({
                         "x":obj.rows.length+1,
                         "value":info.value,
                       
                     })
                 });
            });
           


            //
            return obj;

        },
        fileList:function(){
             let arr=[];
            if(this.detail.processUploadFiles){
                let url=this.detail.processUploadFiles.split(";");
                 
                if(Array.isArray(url) && url.length>0){
                    
                    url.forEach(item=>{
                            arr.push({
                            name:item.split("@")[0],
                            url:this.service.slice(1,-1)+'upload/'+item,
                            file:item
                            }
                    );
                    });
                }
             
            }
            return arr; 
        },
        uploadData:function(){
            return {
                 id: this.detail.spcTaskOnlineAlertingId
            }
        },
        action:function(){
          return  this.service.slice(1,-1) + "spc/task/online/alerting/upload";
        }
    },
    watch:{
      detail:function(){
        if(this.detail.spcTaskOnline){
            if(this.detail.spcTaskOnline.controlGraph>0 && this.detail.spcTaskOnline.controlGraph<5){
                this.type="jl";
            }
            else{
                let type = ["p", "np", "c", "u"];
                this.TYPE = type[Number(this.detail.spcTaskOnline.controlGraph) - 5];

                this.type="js";
            }
        }
        if(this.type=="jl"){
            this.jlRes(JSON.parse(this.detail.dataRecord).spcResult);
        }
        if(this.type=="js"){
            this.jsRes(JSON.parse(this.detail.dataRecord).spcResult);
        }
        // cpk  直线的获取
        // this.detail.dataRecordProcessCapability

      }  
    },
    created:function(){
         let env=process.env.NODE_ENV;
         if(env=="development"){
            this.service=require("../../../../config/dev.env.js")['BASE_API'];
         }
         else{
            this.service=require("../../../../config/prod.env.js")['BASE_API'];
         }
    }
    
   
    
}
</script>

