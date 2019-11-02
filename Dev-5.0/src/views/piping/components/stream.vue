<template>
   <el-form label-position="right"  ref="stream"  :model="stream" :rules="rules" label-width="120px" class="Form " size="mini">
        <el-form-item  label="节点名称 :" prop="cepStreamName">
           <el-col :span='22' >
               <el-input v-model="stream.cepStreamName" @input="changeName"></el-input>
           </el-col>
        </el-form-item>
        <el-form-item  label="描述 :">
           <el-col :span='22'>
               <el-input v-model="stream.comment"></el-input>
           </el-col>
        </el-form-item>
        <el-form-item label="使用模板 : ">
            <el-col :span="22">
                <el-radio-group v-model="useTemplate" @change="templateIndex=''">
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
                    v-for="(column,index) in streamColumnTemplate"
                    :key="index+'_'+column.cepStreamName"
                    :label="column.cepStreamName"
                    :value="index"
                    ></el-option>
               </el-select>
               
           </el-col>
       </el-form-item>
        <el-form-item  label="Stream Column :">
            <el-row   v-for="(column,index) in streamColumn" :key="column.cepStreamColumId">
                <!-- <el-col :span='9'> -->
                    <!-- <el-row> -->
                        <!-- <el-col :span="4">Name :</el-col>  -->
                            <el-col :span="8">
                                <el-input  placeholder="列名称" v-model="column.streamColumnName" :readonly="column.cepStreamColumnId>0"></el-input>
                            </el-col>
                             <!-- <el-col :span="8" v-if="column.cepStreamColumnId>0" :offset="1">
                                <el-input v-model="column.valueTypeName" :readonly="column.cepStreamColumnId>0"></el-input>
                            </el-col> -->
                            <el-col :span="8"  :offset="1">
                                 <el-select v-model="column.valueType" placeholder="列类型">
                                    <el-option v-for="o in valueType" :key="o.label" :label="o.label" :value="o.value"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span='5' class="text-right">
                                <el-button size="mini"
                                    @click="deleteColumn(column,index)" 
                                    v-show="(column.streamColumnName=='' || column.valueType=='')?false:true"     
                                    type="primary"><i class="el-icon-delete"></i>
                                 </el-button>  
                                <el-button size="mini" 
                                    :disabled="(column.streamColumnName=='' || column.valueType=='')?true:false" 
                                    type="primary" 
                                    v-show="index==streamColumn.length-1"
                                    @click="addColumnList">添加
                                </el-button>
                                
                            </el-col> 
                            <!-- <el-col :span='22' class="text-right">   
                                <el-button size="mini" @click="addColumnList" v-show="index==streamColumn.length-1 && column.cepStreamColumnId > 0 "   type="primary"> <i class="el-icon-plus" ></i></el-button>
                            </el-col>  -->

                
            </el-row>
             <!-- <el-row v-show="streamColumn.length==0">
              
                        <el-col :span="9">
                                <el-input v-model="cepStreamColumn.streamColumnName"  placeholder="column_name"></el-input>
                        </el-col> 
                        <el-col :span="8" :offset="1">
                                <el-select v-model="cepStreamColumn.valueType" placeholder="select column_name_type">
                                    <el-option v-for="o in valueType" :key="o.label" :label="o.label" :value="o.value"></el-option>
                                </el-select>
                        </el-col> 
                        <el-col :span='4' class="text-right">
                            <el-button :disabled="(cepStreamColumn.streamColumnName=='' || column.valueType=='')?true:false"  size="mini" type="primary" @click="createStreamColumnFirst">添加</el-button>  
                        </el-col>
                  
            </el-row> -->
         </el-form-item>
         <el-form-item label="设置为模板 : ">
           <el-col :span="22">
               <el-radio-group v-model="stream.published">
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
import {cepStreamDetail,cepStreamUpdate,
        cepStreamColumnDetail,cepStreamColumnList, cepStreamColumnCreate,cepStreamColumnDelete ,
        cepStreamTemplate  
        } from "@/api/piping/stream";
export default{
     data() {

          let checkName=function(rule, value, callback){
                if(value.indexOf('_')>=0){
                    callback(new Error("节点名称不能包含下划线_"));
                }
                else{
                   callback();
                }
          }

        return {
            useTemplate:false,
            streamColumnTemplate:[
            ],  
            templateIndex:'',
            fullLoading:null,
          
            LOADING:{
                LOADING: {
                lock: true,
                text: '数据处理中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.6)'
              }
            },
            streamId:'',
            loading:false,
            stream:{
                cepStreamId:'',
                cepStreamName:'',
                comment:'',
                published:0
            },
            streamColumn:[
                {
                    
                    streamColumnName:'',
                    valueType:''
                }
            ],
            streamColumnTemplate:[

            ],
            rules:{
                cepStreamName:[
                    {required:true,message:'请填写节点名称',trigger:'change,blur'},
                    {validator:checkName,trigger:"change,blur"}
                ]
            },
            valueType:[
                { label:'int',value:1 },
                { label:'string',value:2},
                { label:'double',value:3 },
                { label:'float',value:4 }
            ]
        }
    },
    methods:{
        streamDetail:function(){
            cepStreamDetail({cepStreamId:this.streamId}).then((res)=>{
               console.log(res);
                 if(res.code==200){
                    this.stream=res.data;
                   
                 }
                 else{
                    this.$message.error(res.message);
                 }
           });
        },
        cepStreamColumnList:function(){
            cepStreamColumnList({cepStreamId:this.streamId}).then(res=>{
                if(res.code==200){
                    if(Array.isArray(res.data) && res.data.length>0){ //[]
                        this.streamColumn=res.data;
                        
                    }
                    else{
                        this.streamColumn=[
                            {
                                
                                streamColumnName:'',
                                valueType:'',
                                
                            }
                        ]
                    }
                   
                }
                else{
                   this.$message.error(res.message);
                }
            })
        },
        createStreamColumn:function(column,index){
           if(this.streamColumn.length==0){
               return false;
           }
           let data=[];
           this.streamColumn.forEach(item=>{
              
                 if(item.streamColumnName && item.valueType){
                     item.cepStreamId=this.streamId;
                     data.push(item);
                 }
           });
            cepStreamColumnCreate(data).then((res)=>{
               
                if(res.code==200){
                      this.$message.success(res.message);
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        addColumnList:function(){
            let obj= {  
                        streamColumnName:'',
                        valueType:''
                     };
            this.streamColumn.push(obj);      
        },
        deleteColumn:function(column,index){
            this.$confirm('确定删除列'+ column.streamColumnName+'?', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
            }).then(()=>{ 
                   this.streamColumn.splice(index,1);
                   if( this.streamColumn.length==0){
                       this.streamColumn.push( {  
                        streamColumnName:'',
                        valueType:''
                     }); 
                   }
                // this.fullLoading=this.$loading(this.LOADING);
                // cepStreamColumnDelete({cepStreamColumnId:column.cepStreamColumnId}).then((res)=>{
                //       this.fullLoading.close();
                //     if(res.code==200){

                //          this.streamColumn.splice(index,1);
                //         this.$message.success(res.message);
                //     }
                //     else{
                //        this.$message.error(res.message);
                //     }

                // });
            }).catch(()=>{});
           
        },
        submit:function(){
           this.$refs.stream.validate(res=>{
               if(res){
                    this.stream.cepStreamId=this.streamId;
                    this.fullLoading=this.$loading(this.LOADING);
                    cepStreamUpdate(this.stream).then(res=>{
                        this.fullLoading.close();
                        if(res.code==200){
                            this.$message.success(res.message);
                            this.$emit('cepUpdate');
                        }
                        else{
                            this.$message.error(res.message);
                        }
                    
                    });
                    // stream_column
                     this.createStreamColumn();

               }
           });
           
           

        },
        changeName:function(val){
            if(val.indexOf('_')>=0){
               //return ;
            }
            else{
                this.$emit('changeName',val);
            }
             
        },
        streamTemplate:function(){
            cepStreamTemplate().then(res=>{
                if(res.code==200){
                    //this.streamColumnTemplate=res.data;
                     if(res.data && Array.isArray(res.data) && res.data.length>0){
                        this.streamColumnTemplate=res.data.filter(column=>column.cepStreamId!=this.streamId);
                     }
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        setTemplate:function(){
            if(this.streamColumnTemplate[this.templateIndex].streamColumnList){
                this.streamColumn=[];
                this.streamColumnTemplate[this.templateIndex].streamColumnList.forEach(item=>{
                       
                       this.streamColumn.push(item);
                });
            }
        }
    },
    watch:{
       
    },
    mounted(){
        let self=this;
        self.$on('stream',function(streamId){
                self.useTemplate=false;
                self.templateIndex='';
               self.streamId=streamId;
               self.streamDetail();
               self.cepStreamColumnList();
               self.streamTemplate();
        });
    }
}
</script>
<style scope>
</style>
