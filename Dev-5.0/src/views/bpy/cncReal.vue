<template>
<div  class="BPY">
    <el-row style="border-bottom:1px solid #dcdfe6;padding:5px 20px">
     
        <el-col :span="24">
            <el-col :span="18" class="cnc" >
                
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
                            :disabled="!stopPromise"
                            filterable
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
                <el-form   :model="Form" :rules="rule" ref="history" label-position="right"  label-width="0"  class="Form " size="mini">
                    
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
            <el-tooltip class="item" effect="light"  manual style="margin-left:15px">
                <el-button size="mini"  :type="stopPromise?'primary':'warning'"  @click="refresh">
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
                        :chartData="filterData1"
                        name="CH1 (感知分析)"
                        :height="height"
                        ></v-line>
                    </el-card>
              
            </el-col>
           
        <el-col :span="12"  class="m-t" :style="{height:height}" style="padding-left:10px">
            <el-card class="box-card" style="height:100%" >
                <v-line 
                :chartData="filterData2"
                name="CH4 (感知分析)"
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
    <!-- <div>
      {{now}}
   </div >
   <div class="m-t">
       {{chartData1[0].slice(0,10)}}
   </div>
   <div class="m-t">
       {{chartData1[1].slice(0,10)}}
   </div> -->
</div>
</template>
<script>
import {cncToolIds, cncModelsListReal, cncModelSdReal,cncModelHistoryReal} from "@/api/bpy/cnc"
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
            Form:{time:'1000',number:'',toolId:''},  //
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
            toolIdList:[],
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
            chartData1:[
                []
            ],
            chartData2:[
                []
            ],
            lastIndex:'-1',
            stopPromise:false,
            clear:false,
            proxy:'',
            toolId:'',
            toolIds:[],
            jiagongNum:'',
            timeout:null,
            now:[],
            beginTime:'',
            endTime:'',
            NumberList:[],
            toolList:[]
        }
    },
    computed:{
        filterData2:function(){
            return this.filter('chartData2');
        },
        filterData1:function(){
            return this.filter('chartData1');
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
        getCncReal:function(res){
           
            if(res.code==200){
                if(res.data){
                   
                //    if(res.data.isTotal){
                //        this.lastIndex=-1;
                //        this.toolIds=[];
                //         if(!this.stopPromise){
                //             this.timeout=setTimeout(()=>{
                //                 this.promise();
                //             },this.Form.time);
                //         }
                //         //return ;
                //    }
                    //计算差值
                    let arr1=[],arr2=[];
                   
                    if(this.chartData1[0].length==0 || ( this.chartData1[0].length>0 && this.chartData1[0][0][1]!="")){
                        
                        if(res.data.vData1 &&  this.chartData1[1] && res.data.vData1.length>0 &&  this.chartData1[1].length>0){
                            let min=res.data.vData1[0][0],len=this.chartData1[1].length;
                           
                            for(let index=0;index<len;index++){
                                //console.log("-------"+min+'------'+this.chartData1[1][index][0])
                                if(this.chartData1[1][index][0]<min){
                                    arr1.push([this.chartData1[1][index][0],"",this.chartData1[1][index][2]]);
                                }
                                else{
                                    break;
                                }
                            }
                        }
                    }
                   
                    for(let index=0;index<this.chartData1[0].length;index++){
                          if(this.chartData1[0][index][1]==""){
                              arr1.push(this.chartData1[0][index]);
                          }
                          else{
                              break;
                          }
                         
                    }  
                    ///////
                    if(this.chartData2[0].length==0 || (this.chartData2[0].length>0 && this.chartData2[0][0][1]!="")){
                        
                        if(res.data.vData4 &&  this.chartData2[1] && res.data.vData4.length>0 &&  this.chartData2[1].length>0){
                            let min=res.data.vData4[0][0],len=this.chartData2[1].length;
                           
                            for(let index=0;index<len;index++){
                                if(this.chartData2[1][index][0]<min){
                                    arr2.push([this.chartData2[1][index][0],"",this.chartData2[1][index][2]]);
                                }
                                else{
                                    break;
                                }
                            }
                        }
                       
                    }
                    //
                    for(let index=0;index<this.chartData2[0].length;index++){
                        if(this.chartData2[0][index][1]==""){
                            arr2.push(this.chartData2[0][index]);
                        }
                        else{
                            break;
                        }
                         
                    } 
                   
                    this.chartData1.splice(0,1,[...arr1,...res.data.vData1]); 
                    this.chartData2.splice(0,1,[...arr2,...res.data.vData4]);
                    
                    this.lastIndex=res.data.lastIndex;
                    this.jiagongNum=res.data.jiagongNum;
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
            ////////
            if(!this.stopPromise){
                this.timeout=setTimeout(()=>{
                    this.promise();
                },this.Form.time);
            }
           
        },
        refresh:function(){
            this.stopPromise=!this.stopPromise;
            if(!this.stopPromise){
                this.promise(); 
            }
        },
        getCncModelHistorySd:function(res){//history
            if(res.code==200){
                this.chartData1.splice(1,1);
                this.chartData2.splice(1,1);
                if(res.data && Object.keys(res.data).length>0){
                    for(let num in res.data){
                         if(Object.keys(res.data[num]).length>0){
                            for(let key in res.data[num]){
                                if(key=='vData1'){
                                    //判断 历史是否比实时小
                                    let  arr=[];
                                    if(res.data[num][key].length>0){
                                        for(let index=0;index<res.data[num][key].length;index++){
                                            if(res.data[num][key][index] && res.data[num][key][index].length>0 && 
                                            this.chartData1[0] && this.chartData1[0].length>0
                                            ){
                                               
                                                if(res.data[num][key][index][0]<this.chartData1[0][0][0]){
                                                    arr.push([res.data[num][key][index][0],'',res.data[num][key][index][2]]);
                                                   
                                                }
                                                else{
                                                    break;
                                                }
                                            }
                                            else{

                                                break;
                                            }
                                            
                                        }
                                    }
                                    this.chartData1.splice(0,1,[...arr,...this.chartData1[0]]);
                                    //
                                   
                                   this.chartData1.push(res.data[num][key]);  
                                }
                                if(key=='vData4'){
                                   
                                    let  arr=[];
                                    if(res.data[num][key].length>0){
                                        for(let index=0;index<res.data[num][key].length;index++){
                                            if(res.data[num][key][index] && res.data[num][key][index].length>0 && 
                                            this.chartData2[0] && this.chartData2[0].length>0
                                            ){
                                               
                                                if(res.data[num][key][index][0]<this.chartData2[0][0][0]){
                                                    arr.push([res.data[num][key][index][0],'',res.data[num][key][index][2]]);
                                                }
                                                else{
                                                    break;
                                                }
                                            }
                                            else{

                                                break;
                                            }
                                            
                                        }
                                    }
                                    this.chartData2.splice(0,1,[...arr,...this.chartData2[0]]);
                                    this.chartData2.push(res.data[num][key]);  
                                }
                               
                            }
                         }
                    }
               
                }   
                }
                else{

                    this.$message.error(res.message);
                }
           
        },
        setTime:function(){
            // clearInterval(this.interval);
            // this.interval=null;
            // this.fullLoading=this.$loading(this.LOADING);
            // this.interval=setInterval(()=>{
            //     this.showFullLoading=false;
            //     this.promise();
            // }, this.Form.time);
            this.stopPromise=!this.stopPromise;
        },
        promise:function(){
            this.clear=false;
            this.showSelectTool=false;
            if(this.showFullLoading){
               this.fullLoading=this.$loading(this.LOADING);
            }
            let arr=[];
            let data={};
            if(this.Form.toolId){
               data.toolId=this.Form.toolId;
            }
            arr.push(cncModelsListReal());           
            //arr.push(cncModelSdReal());
            if(this.toolIds.length==0){
                arr.push(cncModelSdReal());
            }
            else{
                if(this.toolIds.length==2 && this.toolIds[0]!=this.toolIds[1]){//换刀
                   arr.push(cncModelSdReal());
                    // 换刀
                    this.chartData1=[[]];
                    this.chartData2=[[]];
                } 
            }
            Promise.all(arr).then(res=>{
                this.fullLoading.close();
                this.showFullLoading=false;
               
                 this.getCncReal(res[0]);//
                if(res.length>1){
                   this.getCncModelHistorySd(res[1]); 
                }
              
                //this.toolId=res[0].data.toolId;
            });
        },
        config:function(){
            this.$router.push("/cncConfig/real");
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
            cncModelSdReal({toolId:this.Form.toolId}).then(res=>{
                console.log(res);
                this.getCncModelHistorySd(res)
                this.chartData1.splice(0,1,[])
                this.chartData2.splice(0,1,[])
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
    padding:0px;
}
</style>

