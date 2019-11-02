<template>
<div  class="BPY">
    <el-row style="border-bottom:1px solid #dcdfe6;padding:5px 20px">
        <el-col :span="24" >
            <el-col :span="18" class="cnc">
                
                <el-form size="mini" :inline="true" label-width="40">
                <el-col :span="24">
                    <el-form-item label="时间 :">
                        <el-date-picker
                        :disabled="!stopPromise"
                            v-model="beginTime"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选则开始日期" 
                        >  
                        </el-date-picker> 
                    </el-form-item>
                    <el-form-item label="至">
                        <el-date-picker
                        :disabled="!stopPromise"
                            v-model="endTime"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选则结束日期" 
                        >  
                        </el-date-picker> 
                    </el-form-item>
                    <el-form-item>
                            <el-button size="mini" type="primary"
                                    @click="getNums"
                                    :disabled="(!beginTime && !endTime)"
                                    ><i class="el-icon-search"></i></el-button>
                    </el-form-item>
                    <el-form-item label="模板 :">
                        
                            <el-select v-model="Form.number"
                            filterable
                            :disabled="!stopPromise"
                            @change="getToolList"
                            >
                                <el-option
                                    v-for="num in NumberList"
                                    :key="num.jiagongNum"
                                    :label="num.jiagongNum"
                                    :value="num.jiagongNum"
                                >
                                </el-option>
                            
                            </el-select>
                    </el-form-item>
                    <el-form-item label="刀号 :">
                         <el-select v-model="Form.toolId"
                             :disabled="!stopPromise"
                             placeholder="请选择刀号"
                            >
                              <el-option
                                    v-for="tool in toolList"
                                    :key="tool.toolId+'tool'"
                                    :label="tool.toolId"
                                    :value="tool.toolId"
                                >
                                </el-option>
                            
                            </el-select>
                    </el-form-item>
                    <el-form-item >
                        <el-button @click="history" type="primary" size="mini" :disabled="!(Form.number && Form.toolId)">历史查看</el-button>
                    </el-form-item>
                  
                    
                                    
                   
                </el-col>
                
            </el-form>
            </el-col>
            <el-col :span="6" class="text-right">

           
            <el-tooltip class="item" effect="light" content="配置" 
             placement="top-start"
             style="position:relative;top:2px;right:15px">
                    <el-button size="mini" @click="config">
                        <svg-icon  icon-class="setting" style="font-size:20px"></svg-icon>
                    </el-button>
            </el-tooltip>
                  <el-popover
          placement="bottom"
          width="300"
          trigger="click"
        >
            <el-button slot="reference">时间周期</el-button>
                <el-form  :model="Form" :rules="rule" ref="history" label-position="right"  label-width="0"  class="Form " size="mini">
                    
                    <el-form-item  prop="number">
                        <el-select v-model="Form.time">
                            <el-option  label="0.2s"  value="200"></el-option>
                            <el-option  label="0.5s"  value="500"></el-option>
                            <el-option  label="1s"  value="1000"></el-option>
                            <el-option  label="2s"  value="2000"></el-option>
                            <el-option  label="5s"  value="5000"></el-option>
                            <el-option  label="10s"  value="10000"></el-option>
                           
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item  >
                    <el-button type="success" size="mini"  @click="setTime">确定</el-button>
                    </el-form-item> -->
                    
                </el-form>
            </el-popover>
            <el-tooltip class="item" effect="light" placement="top"  manual style="margin-left:15px">
                 <el-button size="mini"  :type="stopPromise?'success':'warning'"  @click="refresh">
                   {{stopPromise?'实时模式':'关闭实时模式'}}
                   <!-- <svg-icon icon-class="refresh"></svg-icon> -->
                </el-button>
            </el-tooltip>
         </el-col>
        </el-col>
    </el-row>
    <!-- <div  style="position:fixed;right:20px;top:70px;z-index:999" v-show="toolIdList.length>0"> 
     <div class="text-center" style="font-size:16px">刀号</div>
        <ul>
            <li  v-for="tool in toolIdList" :key="'tool'+tool" style="font-size:14px;margin-top:10px">
                <span style="display:inline-block;;width:100px;padding-right:10px;text-align:right;color:#666;line-height:20px;">{{tool}}号刀</span>
                <span style="display:inline-block;width:40px;height:20px;border-radius:5px;cursor:pointer"
                :style={backgroundColor:aboutColor(tool)}
                @click="selectTool(tool)"
                ></span>
            </li>
        </ul>
    </div> -->
   <el-row style="padding:0 20px;"  class="m-t">
       
            <el-col :span="12"  class="m-t" :style="{height:height}"  style="padding-right:10px"> 
               
                    <el-card class="box-card" style="height:100%">
                        <v-line 
                        :chartData="filterData3"
                        name="CH1 (感知控制)"
                        :height="height"
                       
                        ></v-line>
                        
                        
                    </el-card>
              
            </el-col>
           
        <el-col :span="12"  class="m-t" :style="{height:height}" style="padding-left:10px">
            <el-card class="box-card" style="height:100%" >
                <v-line 
                :chartData="filterData4"
                name="CH4 (感知控制)"
                :height="height"
                ></v-line>
            </el-card>
        </el-col>
       
        <el-col :span="24" class="m-t">
              <el-card class="box-card text-center"  >
                  <el-button type="primary" style="margin:15px 0">当前刀号 ： {{toolId}}</el-button>
              </el-card>
        </el-col>
   </el-row>
  
</div>
</template>
<script>
import {cncToolIds, cncNumbers, cncModelsListReal,cncControlsSdReal,cncModelHistoryReal} from "@/api/bpy/cnc"
import {jiagongNums} from "@/api/bpy/config"
import Line from './component/line'
export default {
    components:{
        'v-line':Line,
    },
    data(){
        return {
            stop:true,
            height:'600px',
            showSelectTool:false,
            Form:{time:'5000',number:'',toolId:''},  //
            rule:{
                time:[
                    {required:true,message:'请选择时间周期',trigger:"change,blur"}
                ]
            },
            fullLoading: null,
            LOADING: {
                lock: true,
                text: '数据加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.6)'
            },
            toolList:[],
            toolIdList:[],
            NumberList:[],
            selTool:[],
            color: [
                // '#70f3ff','#44cef6','#1685a9','#177cb0','#065279',
                // '#003472','#4a4266','#426666','#425066','#574266',
                '#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83', 
                '#ca8622', '#bda29a','#6e7074', '#FF6600', '#CC3399',
                '#815463','#815476','#003371','#1BE9BF','#63C2FF',
                '#FF7993','#FFCB8C','#0071B6','#D7C6FA','#61a0a8',
                '#FF00FF'
            ],
            showFullLoading:true,
            interval:null,
            chartData3:[
                []
            ],
            chartData4:[
                []
            ],
            lastIndex:'-1',
            toolId:'',
            stopPromise:false,
            toolIds:[],
            beginTime:'',
            endTime:'',
        }
    },
    computed:{
        filterData3:function(){
            return this.filter('chartData3');
        },
        filterData4:function(){
            return this.filter('chartData4');
        }

    },
    methods:{
        filter:function(data){
            if(this.selTool.length==0){
               return this[data];
            }
            else{
              let Arr=[];
              this[data].forEach(item=>{
                  if(item.length>0){
                      Arr.push(item.filter(data=>{
                       if(this.selTool.indexOf(data[2])==-1){
                       return data;
                    }
                    }));
                  }
                  else{
                      return [];
                  }
                  
              });
              return Arr;
            }
        },
        aboutColor: function(tool) {
            if (this.selTool.indexOf(tool) >= 0) {
                return "#ddd";
            } else {
                return this.color[tool - 1];
               
            }
        },
        selectTool: function(tool) {
            if (this.selTool.length == 0) {
                this.selTool.push(tool);
            } else {
                let Index = -1;
                this.selTool.forEach((item, index) => {
                if (item == tool) {
                    Index = index; //存在
                }
                });
                if (Index >= 0) {
                //删除
                this.selTool.splice(Index, 1);
                } else {
                this.selTool.push(tool);
                }
            }
        },
        getCncReal:function(res){
           
            if(res.code==200){
                if(res.data){
                     let arr1=[],arr2=[];
                    if(this.chartData3[0].length==0 || ( this.chartData3[0].length>0 && this.chartData3[0][0][1]!="")){
                        
                        if(res.data.aData1 &&  this.chartData3[1] && res.data.aData1.length>0 &&  this.chartData3[1].length>0){
                            let min=res.data.aData1[0][0],len=this.chartData3[1].length;
                            for(let index=0;index<len;index++){
                                if(this.chartData3[1][index][0]<min){
                                    arr1.push([this.chartData3[1][index][0],"",this.chartData3[1][index][2]]);
                                }
                                else{
                                    break;
                                }
                            }
                        }
                    }
                    for(let index=0;index<this.chartData3[0].length;index++){
                          if(this.chartData3[0][index][1]==""){
                              arr1.push(this.chartData3[0][index]);
                          }
                          else{
                              break;
                          }
                         
                    } 
                    
                    ///////
                    if(this.chartData4[0].length==0 || (this.chartData4[0].length>0 && this.chartData4[0][0][1]!="")){
                        
                        if(res.data.aData4 &&  this.chartData4[1] && res.data.aData4.length>0 &&  this.chartData4[1].length>0){
                            let min=res.data.aData4[0][0],len=this.chartData4[1].length;
                            for(let index=0;index<len;index++){
                                if(this.chartData4[1][index][0]<min){
                                    arr2.push([this.chartData4[1][index][0],"",this.chartData4[1][index][2]]);
                                }
                                else{
                                    break;
                                }
                            }
                        }
                    }
                    for(let index=0;index<this.chartData4[0].length;index++){
                          if(this.chartData4[0][index][1]==""){
                              arr2.push(this.chartData3[0][index]);
                          }
                          else{
                              break;
                          }
                         
                    } 
                   /***************************************************************** */
                    this.chartData3.splice(0,1,[...arr1,...res.data.aData1]);
                    this.chartData4.splice(0,1,[...arr2,...res.data.aData4]);
                  
                   
                    this.toolId=res.data.toolId;
                    if(this.toolIds.length<2){
                        this.toolIds.push(res.data.toolId);
                    }
                    else{
                        this.toolIds.shift();
                        this.toolIds.push(res.data.toolId);
                    }
                    

                   
                    
                   
                }
                    
            }
            else{

                this.$message.error(res.message);
            }
           
        },
        refresh:function(){
            this.stopPromise=!this.stopPromise;
             if(!this.stopPromise){
                  this.promise(); 
             }
        },
        getControlSd:function(res){
                if(res.code==200){
                    //差值
                    let arr1=[],arr2=[];
                    if(this.chartData3[0].length==0 || ( this.chartData3[0].length>0 && this.chartData3[0][0][1]!="")){
                        
                        if(res.data.uData1 &&  this.chartData3[1] && res.data.uData1.length>0 &&  this.chartData3[1].length>0){
                            let min=res.data.uData1[0][0],len=this.chartData3[1].length;
                            for(let index=0;index<len;index++){
                                if(this.chartData3[1][index][0]<min){
                                    arr1.push([this.chartData3[1][index][0],"",this.chartData3[1][index][2]]);
                                }
                                else{
                                    break;
                                }
                            }
                        }
                    }
                        
                    this.chartData3.splice(0,1,[...arr1,...this.chartData3[0]]);
                    this.chartData4.splice(0,1,[...arr1,...this.chartData4[0]]);    
                    //
                    this.$set(this.chartData3,1,[...res.data.uData1]);
                    this.$set(this.chartData3,2,[...res.data.lData1]);
                    
                    this.$set(this.chartData4,1,[...res.data.udata4]);
                    this.$set(this.chartData4,2,[...res.data.ldata4]);  

                }
                else{
                    this.$message.error(res.message);
                }
           
        },
        Interval:function(){
            this.interval=setInterval(()=>{
                this.showFullLoading=false;
                this.promise();
            },this.Form.time);
        },
        setTime:function(){
            clearInterval(this.interval);
            this.interval=null;
            this.fullLoading=this.$loading(this.LOADING);
            this.interval=setInterval(()=>{
                this.showFullLoading=false;
                this.promise();
            }, this.Form.time);
        },
        promise:function(){
            this.showSelectTool=false;
            if(this.showFullLoading){
               this.fullLoading=this.$loading(this.LOADING);
            }
            let arr=[];
            let data={};
            // if(this.lastIndex>0){
            //     data.index=this.lastIndex;
            // }
            arr.push(cncModelsListReal());
                //
            if(this.toolIds.length==0){
                    arr.push(cncControlsSdReal());
            }
            else{
                if(this.toolIds.length==2 && this.toolIds[0]!=this.toolIds[1]){
                   arr.push(cncControlsSdReal());
                   //换刀
                    this.chartData3=[[]];
                    this.chartData4=[[]];
                } 
            }
           
            //
            Promise.all(arr).then(res=>{
                this.fullLoading.close();
                 this.showFullLoading=false;
                this.getCncReal(res[0]);
                if(res.length>1){
                   this.getControlSd(res[1]); 
                }

                if(!this.stopPromise){
                  setTimeout(()=>{
                   this.promise();
                  },this.Form.time);
                }

                

            });
        },
        config:function(){
            this.$router.push("/cncConfig/control");
        },
        getNums:function(){
            this.fullLoading=this.$loading(this.LOADING);
            jiagongNums({beginTime:this.beginTime,endTime:this.endTime}).then(res=>{
               this.fullLoading.close();
                if(res.code==200){
                  this.NumberList=res.data;
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        getToolList:function(){
            cncToolIds({jiagongNum:this.Form.number}).then(res=>{
                if(res.code==200){
                    console.log(res.data);
                    this.toolList=res.data;
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        history:function(){
            
            // cncModelHistoryReal({jiagongNum:this.Form.number,toolId:this.Form.toolId}).then(res=>{
            //    //this.getCncReal(res);
              
            // }); 
            cncControlsSdReal({toolId:this.Form.toolId}).then(res=>{
                
                this.getControlSd(res)
                this.chartData3.splice(0,1,[])
                this.chartData4.splice(0,1,[])
                cncModelHistoryReal({jiagongNum:this.Form.number,toolId:this.Form.toolId}).then(res=>{
                   this.getCncReal(res);
              
                }); 

                
            });
        }
        
    },
    created:function(){
       this.promise();
       //this.Interval();
   
    },
    beforeDestroy:function(){
        clearInterval(this.interval);
        this.interval=null;
        if(this.fullLoading){
            this.fullLoading.close();
        }
        
    }
}
</script>
<style>
.BPY .el-card__body{
    padding:0PX;
}
</style>

