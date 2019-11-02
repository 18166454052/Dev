<template>
<div  class="BPY">
     <el-row style="border-bottom:1px solid #dcdfe6;padding:5px 20px">
        <el-col :span="20" class="cnc">
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
                            @change="getCncReal"
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
                        <el-button size="mini" type="primary" :disabled="!Form.number" @click="history">历史查看</el-button>
                    </el-form-item>
                  
                    
                                    
                   
                </el-col>
                
            </el-form>
        </el-col>
        <el-col :span="4" class="text-right">
                  <el-tooltip class="item" effect="light" content="配置" 
             placement="top-start"
             style="position:relative;right:15px">
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
    </el-row>
   <el-row  style="padding:0 20px">
       <el-col :span="24"  class="m-t" :style="{height:height}"> 
            <el-card class="box-card" style="height:100%">
                <v-line 
                :chartData="chartData1"
                name="CH1 (叠加)"
                :height="height"
                :setColor="true"
                
                ></v-line>
            </el-card>
        </el-col>
       <el-col :span="24"  class="m-t" :style="{height:height}"> 
            <el-card class="box-card" style="height:100%">
                <v-line 
                :chartData="chartData2"
                name="CH4 (叠加)"
                :height="height"
                :setColor="true"
                
                ></v-line>
            </el-card>
        </el-col>
   </el-row>
   <!-- <div>
       {{chartData1[1].slice(670,680)}}
   </div> -->
</div>
</template>
<script>
import { cncModelSdList,cncModelsList } from "@/api/bpy/cnc"
import {jiagongNums} from "@/api/bpy/config"
import Line from './component/line'
export default {
    components:{
        'v-line':Line,
    },
    data(){
        return {
            stop:true,
            height:'420px',
            showSelectTool:false,
            Form:{time:'1000',number:""},  //
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
            ],
            chartData2:[
            ],
            lastIndex:'-1',
            toolId:'',
             beginTime:'',
            endTime:'',
            Form:{
                number:''
            },
            NumberList:[]
        }
    },
    computed:{

    },
    methods:{
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
        refresh:function(){
           this.getCncList();
           this.getCncReal();
        },
        getCncList:function(){
            this.fullLoading=this.$loading(this.LOADING);
            cncModelSdList().then(res=>{
                this.fullLoading.close();
                if(res.code==200){
                  if(res.data && Object.keys(res.data).length>0){
                      for(let key in res.data){
                          this.chartData1.push(res.data[key].vData1);
                           this.chartData2.push(res.data[key].vData4);
                      }
                  }
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        getCncReal:function(){
            cncModelsList().then(res=>{
                if(res.code==200){
                   
                          this.chartData1.unshift(res.data.vData1);
                          this.chartData2.unshift(res.data.vData4);
                     
                  
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        config:function(){
            this.$router.push("/cncConfig/overlay");
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
            cncModelsList({jiagongNum:this.Form.number}).then(res=>{
                if(res.code==200){
                    this.chartData1.unshift(res.data.vData1);
                    this.chartData2.unshift(res.data.vData4);
                }
                else{
                    this.$message.error(res.message);
                }
            })
        }
        
        
       
        
    },
    created:function(){
      this.getCncList();
      this.getCncReal();
   
    },
    beforeDestroy:function(){
        if(this.fullLoading){
            this.fullLoading.close();
        }
        clearInterval(this.interval);
        
    }
}
</script>
<style>
.BPY .el-card__body{
    padding:0pX;
}
</style>

