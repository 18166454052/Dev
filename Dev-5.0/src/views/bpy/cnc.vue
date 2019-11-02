<template>
<div  class="BPY">
   <el-row style="position:fixed;top:0;z-index:99;background:#fff;
   left:66px;right:0;border-bottom:1px solid #dcdfe6;padding:5px 20px">
        <el-col :span="24" class="cnc">
            <el-col :span="16" >
                <el-form size="mini" :inline="true" label-width="40">
                <el-col :span="24">
                    <el-form-item label="时间 :">
                        <el-date-picker
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
                    <el-form-item>
                        <el-button size="mini" type="primary" @click="history" :disabled="!Form.number" >历史查看</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
            </el-col>
            <el-col :span="8" class="text-right">
                <!--
                    <el-popover
                        placement="bottom"
                        width="300"
                        trigger="click"
                        >
                        <el-button slot="reference">历史查看</el-button>
                            <el-form    :inline="true" :model="Form" :rules="rule" ref="history" label-position="right"  label-width="0"  class="Form " size="mini">
                                
                                <el-form-item  prop="number">
                                    <el-select v-model="Form.number"
                                    filterable
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
                                <el-form-item  >
                                <el-button type="success" size="mini"  @click="showFullLoading=true;getCncReal()">确定</el-button>
                                </el-form-item>
                                
                            </el-form>
                    </el-popover> 
                -->
                    <el-tooltip class="item" effect="light" content="配置" 
                        placement="top-start"
                        style="position:relative;top:2px;left:2px">
                                <el-button size="mini" @click="config">
                                    <svg-icon  icon-class="setting" style="font-size:20px"></svg-icon>
                                </el-button>
                    </el-tooltip> 
                    <el-tooltip class="item" effect="light" content="刷新" placement="top-start">
                        <el-button size="mini" @click="refresh">
                            <svg-icon  icon-class="refresh" style="font-size:18px"></svg-icon>
                        </el-button>
                    </el-tooltip>
            </el-col>
             
            
        </el-col>
    </el-row>
    <div  style="position:fixed;right:20px;top:70px;z-index:999" v-show="toolIdList.length>0"> 
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
    </div>
   <el-row style="padding:0 20px;margin-top:50px">
       
            <el-col :span="22"  class="m-t" :style="{height:height}"> 
               
                    <el-card class="box-card" style="height:100%">
                        <v-line 
                        :chartData="filterData1"
                        name="CH1 (感知分析)"
                        :height="height"
                        ></v-line>
                        
                        
                    </el-card>
              
            </el-col>
           
        <el-col :span="22"  class="m-t" :style="{height:height}">
            <el-card class="box-card" style="height:100%" >
                <v-line 
                :chartData="filterData2"
                 name="CH4 (感知分析)"
                :height="height"
                ></v-line>
            </el-card>
        </el-col>
        <el-col :span="22" class="m-t" :style="{height:height}">
            <el-card class="box-card" style="height:100%" >
                <v-line
                    :chartData="filterData3"
                     name="CH1 (感知控制)"
                    :height="height"
                ></v-line>
            </el-card>
        </el-col>
        <el-col :span="22" class="m-t" :style="{height:height}" style="margin-bottom:20px">
            <el-card class="box-card" style="height:100%" >
            <v-line
                :chartData="filterData4"
                 name="CH4 (感知控制)"
                :height="height"
            ></v-Line>
            </el-card>
           

        </el-col>
   </el-row>
   <!-- <div class="m-t">
       {{chartData3[0].slice(0,10)}}-{{chartData3[0].slice(-10)}}
   </div>
   <div class="m-t">
       {{chartData3[1].slice(0,10)}}-{{chartData3[1].slice(-10)}}
   </div> -->
</div>
</template>
<script>
import {cncReal,cncToolIds, cncModelsList,cncControlsSd, cncModelSd} from "@/api/bpy/cnc"
import {jiagongNums} from "@/api/bpy/config"
import Line from './component/line'
export default {
    components:{
        'v-line':Line,
    },
    data(){
        return {
            height:'420px',
            showSelectTool:false,
            Form:{number:''},  //
            rule:{
                number:[
                    {required:true,message:'请选择编码',trigger:"change,blur"}
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
            chartData1:[
                []
            ],
            chartData2:[
                []
            ],
            chartData3:[
                [],[],[]
            ],
            chartData4:[
                [],[],[]
            ],
            lastIndex:'-1',
            beginTime:'',
            endTime:''
        }
    },
    computed:{
        filterData4:function(){
            return this.filter('chartData4');
        },
        filterData3:function(){
            return this.filter('chartData3');
        },
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
        getCncReal:function(){
            this.showSelectTool=false;
            if(this.showFullLoading){
               this.fullLoading=this.$loading(this.LOADING);
            }
            // this.chartData1=[];
            // this.chartData2=[];
            // this.chartData3=[];
            // this.chartData4=[];
            // this.selTool=[];
            let data={};
            if(this.lastIndex>0){
                data.index=this.lastIndex;
            }
            if(this.Form.number){
                data.jiagongNum=this.Form.number;
            }
            cncModelsList(data).then(res=>{
               // this.Form.number="";
                this.fullLoading.close();
                //this.showFullLoading=false;
                if(res.code==200){
                   
                if(!this.Form.number){ //real
                
                    // this.$set(this.chartData1,0,[...this.chartData1[0],...res.data.vData1]);
                    // this.$set(this.chartData2,0,[...this.chartData2[0],...res.data.vData4]);
                    // this.$set(this.chartData3,0,[...this.chartData3[0],...res.data.aData1]);
                    // this.$set(this.chartData4,0,[...this.chartData4[0],...res.data.aData4]);
                    this.chartData1.splice(0,1,res.data.vData1);
                    this.chartData2.splice(0,1,res.data.vData4);
                    this.chartData3.splice(0,1,res.data.aData1);
                    this.chartData4.splice(0,1,res.data.aData4);
                }
                else{
                   
                    console.log(res.data);
                    this.chartData1.splice(0,1,res.data.vData1);
                    this.chartData2.splice(0,1,res.data.vData4);
                    this.chartData3.splice(0,1,res.data.aData1);
                    this.chartData4.splice(0,1,res.data.aData4);
                   
                   // this.Form.number="";
                }
                
                   
                   
                   this.toolIdList=res.data.tools;
                }
                else{

                    this.$message.error(res.message);
                }
            });
        },
        getControlSd:function(){
            cncControlsSd().then(res=>{
                if(res.code==200){
                 
                  // this.chartData3.push(res.data.uData1);
                  // this.chartData3.push(res.data.lData1);
                this.$set(this.chartData3,1,[...this.chartData3[1],...res.data.uData1]);
                this.$set(this.chartData3,2,[...this.chartData3[2],...res.data.lData1]);
                  // this.chartData4.push(res.data.uData4);
                  // this.chartData4.push(res.data.lData4);
                this.$set(this.chartData4,1,[...this.chartData4[1],...res.data.udata4]);
                this.$set(this.chartData4,2,[...this.chartData4[2],...res.data.ldata4]);  

                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        getCncToolId:function(){
            cncToolIds({'jiagongNum':this.Form.number}).then(res=>{
                if(res.code==200){
                     this.toolIdList=[];
                   if(res.data.length>0){
                       res.data.forEach(tool=>{
                            this.toolIdList.push(tool.toolId);
                       });
                   }

                 
                   //this.chartData.rows=res.data;
                }
                else{

                    this.$message.error(res.message);
                }
            });
        },
        getCncNums:function(){
            cncNumbers().then(res=>{
                if(res.code==200){
                    this.NumberList=res.data;
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        refresh:function(){
            // this.chartData1=[[]];
            // this.chartData2=[[]];
            // this.chartData3=[[],[],[]];
            // this.chartData4=[[],[],[]];
            this.selTool=[];
            this.showFullLoading=true;
            this.lastElectricId='';
            this.lastVibrationId='';
            this.getCncReal();
            //this.getCncNums();
          //  this.setInterval();
        },
        getCncModelHistorySd:function(){//history
            cncModelSd().then(res=>{
               if(res.code==200){
                   
                //    //this.chartData1.push(res.data.vData1);
                //    //this.chartData2.push(res.data.vData4);
                //    this.$set(this.chartData1,0,[...this.chartData1[0],...res.data.vData1]);
                //    this.$set(this.chartData2,0,[...this.chartData2[0],...res.data.vData4]);

                //   // this.chartData3.push(res.data.aData1);
                //    //this.chartData4.push(res.data.aData4);
                //    this.$set(this.chartData3,0,[...this.chartData3[0],...res.data.aData1]);
                //    this.$set(this.chartData4,0,[...this.chartData4[0],...res.data.aData4]);
                //    this.toolIdList=res.data.tools;
                if(Object.keys(res.data).length>0){
                    for(let num in res.data){
                         if(Object.keys(res.data[num]).length>0){
                            for(let key in res.data[num]){
                                if(key=='vData1'){
                                    let len= this.chartData1.length;
                                    this.$set(this.chartData1,len,res.data[num][key]);
                                    
                                }
                                 if(key=='vData4'){
                                    let len= this.chartData2.length;
                                    this.$set(this.chartData2,len,res.data[num][key]);
                                     //this.chartData2.push(res.data[num][key]);
                                }
                               
                            }
                         }
                    }
                }
                     
                }
                else{

                    this.$message.error(res.message);
                }
            });
        },
        setInterval:function(){
            
            this.interval=setInterval(()=>{
                this.showFullLoading=false;
                 this.getCncReal();
            },5000);
        },
       
        config:function(){
            this.$router.push("/cncConfig/history");
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
        history:function(){
             this.getCncReal();
            // cncModelsList({jiagongNum:this.Form.number}).then(res=>{
            //     this.getCncReal(res);
            // })
        }

        
    },
    created:function(){
       this.getCncReal();
       this.getControlSd()
       this.getCncModelHistorySd();
       //this.getCncNums();
       //this.setInterval();
   
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

