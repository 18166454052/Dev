<template>
<div>
<!--用户填写辅助原因-->

        
        <div class="stats_top" style="border-bottom:1px solid #999;border-right:1px solid #999">
            
            <el-row > 
                <el-col :span="4">
                    <ul  class="spc-li-bg">
                        
                        <li>制品名称</li>
                        <li>管制项目</li>
                        <li>测量单位</li>
                    </ul>
                </el-col>
                <el-col :span="4">
                    <ul>
                       
                        <li><el-input  v-model="Form['a']"/></li>
                        <li><el-input  v-model="Form['b']"/></li>
                        <li><el-input  v-model="Form['c']"/></li>
                    </ul>
                </el-col>
                <el-col :span="4">
                    <ul  class="spc-li-bg">
                        
                        <li>制造部门</li>
                        <li>级别</li>
                        <li>测定者</li>
                    </ul>
                </el-col>
                <el-col :span="4">
                    <ul>
                       
                        <li><el-input  v-model="Form.d"/></li>
                        <li><el-input  v-model="Form.e"/></li>
                        <li><el-input  v-model="Form.f"/></li>
                    </ul>
                </el-col>
                <el-col :span="4">
                    <ul  class="spc-li-bg">
                        
                        <li>期</li>
                        <li>抽样方法</li>
                        <li>日期</li>
                    </ul>
                </el-col>
                <el-col :span="4">
                    <ul>
                        <li><el-input  v-model="Form.g"/></li>
                        <li><el-input  v-model="Form.h"/></li>
                        <li><el-input  v-model="Form.i"/></li>
                    </ul>
                </el-col>
                
              
               
                
            </el-row>
            <el-row v-for="(j,index) in Form.J"  :key="'ii'+index">
                 <el-col :span="4">
                    <ul  class="spc-li-bg" v-show="index==0">
                        
                        <li>&nbsp;{{j.key}}</li>
                       
                    </ul>
                    <ul  v-show="index>0">
                        <li><el-input v-model="j.key"/></li>
                        
                    </ul>
                </el-col>
                <el-col :span="Object.keys(pdfInfo).length==0?18:20" style="position:relative">
                    <ul>
                        <li><el-input v-model="j.value"/></li>
                        
                    </ul>
                    
                </el-col>
                <el-col :span="2"  v-show="Object.keys(pdfInfo).length==0">
                    <ul>
                    <li class="pdfInfo">
                             <el-button v-show="index==0"  size="mini" type="primary"  @click="addList(index)">
                             <i class="el-icon-plus"></i>
                             </el-button>
                              <el-button v-show="index>0"  size="mini" type="info"  plain  @click="addList(index)">
                             <i class="el-icon-delete"></i>
                              </el-button>
                   
                        </li>
                        
                    </ul>
                   
                    </el-col>  
            </el-row>
            
        </div> 

        <div class="dialog-footer text-center m-t"  v-show="Object.keys(this.pdfInfo).length==0">
            <el-button size="mini" @click="cancel">取 消</el-button>
            <el-button size="mini" type="primary" @click="showPdf">PDF预览</el-button>
        </div>
    
</div>

</template>
<script>
/*
打印时的信息填写
*/
export default {
    props:["pdfInfo"],
    data(){
        return {
            
            J:[{
               key:"辅助及原因追查",value:''
            }]
        }
    },
    methods:{
        close:function(){
            this.$emit('close');
        },
        cancel:function(){
           
            this.close();
        },
        submit:function(){
            /* 提交代码 */

            //
            this.close();
        },
        showPdf:function(){

            this.$emit('show-pdf',this.Form);
        },
        addList:function(index){
             if(index==0){//add
                  this.J.push({
                    key:"",value:''
                });
             }
             else{//delete
               this.J.splice(index,1);
               
             }
        }
    },
    computed:{
        Form:function(){
            return {
                a:Object.keys(this.pdfInfo).length==0?'':this.pdfInfo.a,
                b:Object.keys(this.pdfInfo).length==0?'':this.pdfInfo.b,
                c:Object.keys(this.pdfInfo).length==0?'':this.pdfInfo.c ,
                d:Object.keys(this.pdfInfo).length==0?'':this.pdfInfo.d ,
                e:Object.keys(this.pdfInfo).length==0?'':this.pdfInfo.e ,
                f:Object.keys(this.pdfInfo).length==0?'':this.pdfInfo.f ,
                g:Object.keys(this.pdfInfo).length==0?'':this.pdfInfo.g ,
                h:Object.keys(this.pdfInfo).length==0?'':this.pdfInfo.h ,
                i:Object.keys(this.pdfInfo).length==0?'':this.pdfInfo.i,
                J:Object.keys(this.pdfInfo).length==0?this.J:this.pdfInfo.J
            }
                
            }
    },
    beforeDestroy:function(){
        this.$off();
    }
}
</script>
<style>

</style>

