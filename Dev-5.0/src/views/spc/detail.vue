
<template>
    <div >
        <el-row style="border-bottom:1px solid #dcdfe6;padding:5px 20px">
            <el-col :span="10"  style="font-size:20px;">
                &nbsp;
                    <el-button  
                          @click="$store.commit('SET_TASK',true)"
                        type="text" ><i class="el-icon-menu el-icon--left"></i>{{configData.spcTaskName}}<i class="el-icon-caret-bottom el-icon--right"></i>
                    </el-button>
                   
            </el-col>
            <el-col :span="14" class="text-right" v-if="$store.getters.userRole<4?true:false">
                <el-tooltip    class="item" effect="light" content="添加面板" placement="top-start">
                    <el-button size="mini" @click="showAddPanel('0')">
                        <i class="el-icon-plus" style="font-size:20px"></i>
                         <!--<svg-icon  icon-class="panel" style="font-size:20px"></svg-icon> -->
                    </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="保存" placement="top-start">
                    <el-button size="mini" @click="updatePanel">
                        <svg-icon  icon-class="save" style="font-size:20px"></svg-icon>
                    </el-button>
                </el-tooltip>
                 <el-tooltip class="item" effect="light" content="配置" placement="top-start">
                    <el-button size="mini" @click="config">
                        <svg-icon  icon-class="setting" style="font-size:20px"></svg-icon>
                    </el-button>
                </el-tooltip>
                <!-- <el-tooltip class="item" effect="light" content="辅助" placement="top-start">
                    <el-button size="mini" @click="dialogAttachVisible=true" >
                        <svg-icon  icon-class="attach" style="font-size:20px"></svg-icon>
                    </el-button>
                </el-tooltip> -->
                <el-tooltip class="item" effect="light" content="Excel" placement="top-start">
                    <el-button size="mini" 
                    :disabled="!groupDatas.length>0"
                    @click="excel"
                    >
                        <svg-icon  icon-class="download" style="font-size:20px"></svg-icon>

                    </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="PDF" placement="top-start">
                    <el-button size="mini" 
                    @click="dialogAttachVisible=true;pdfInfo={}"
                    >
                        <svg-icon  icon-class="pdf" style="font-size:20px"></svg-icon>
                    </el-button>
                </el-tooltip>
                <!-- <el-tooltip class="item" effect="light" content="刷新" placement="top-start">
                    <el-button size="mini" >
                        <svg-icon  icon-class="refresh" style="font-size:20px"></svg-icon>
                    </el-button>
                </el-tooltip> -->
            </el-col>
        </el-row>
        <div class="app-container Panel" id="noSelect">
       
           

                 <!-- <el-col :span="24" class="addPermission m-t " v-show="showAddPanel">
                                   
                 </el-col> -->
         
        <!--startprint-->
        <grid-layout
        
            :layout.sync="layout"
                    :col-num="1000"
                    :row-height="10"
                    @layout-updated="layoutUpdatedEvent"
                        
        > 
        <template  v-for="item in layout">
            <grid-item  v-if="item.modelType==0"
                :key="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                :isDraggable="false"
                >
                <div style="height:100%;background:#ddd" >
                    <el-card class="box-card" style="height:100%">
                            <div slot="header"  class="text-center header" style="overflow:hidden;font-size:16px;line-height:22px;">
                                 面板
                                <el-button 
                                @click="showAddPanel('-1')"
                                style="float: right; padding:4px;" type="text" >
                                    <i class="el-icon-close"></i>
                                </el-button>
                            </div>
                            <el-row :gutter="20"  v-if="!toConfig" style="cursor:default" class='detailPanel'>
                                <el-col :span="8"  v-for="panel in panels" 
                                v-show="panel.modelType>0 
                                "
                                :key="panel.modelName+'_'+panel.modelType" 
                                style="margin-bottom:20px;cursor:pointer">
                                    <el-card
                                    :body-style="{ padding: '10px' }"  class="text-center">
                                    <div   @click="addGridItem(panel)">
                                        <svg-icon  :icon-class="panel.icon" style="font-size:40px"></svg-icon>
                                        <div style="padding: 10px;"  >
                                            {{panel.modelName}}
                                        </div>
                                    </div>
                                  </el-card>
                                </el-col>
                                
                               
                            </el-row>
                                <div class="text-center"  style="font-size:20px" v-else>
                                    <router-link :to="'/spc/task/'+ Number(spcTaskId)">
                                    <el-button size="large" type="text">请先配置数据分析 <svg-icon  icon-class="right"></svg-icon></el-button>
                                    </router-link>
                                </div>        
                        </el-card>
                </div>
            </grid-item>
            <grid-item  v-else-if="item.modelType=='1' && !toConfig"
                :key="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                dragAllowFrom="div.header"
            >
               
                <el-card class="box-card" style="height:100%;width:100%">
                    <div slot="header" class="text-center header" style="font-size:16px;line-height:22px;">
                       {{item.modelName}}
                       <el-button 
                       @click="deleteGridItem(item)"
                            style="float: right; padding: 8px;position:relative;top:-4px;" type="text" >
                            <i class="el-icon-close"></i>
                        </el-button>
                    </div>
                    <v-controlinfo
                     :controlInfo="controlInfo"
                     @view="getViewData"
                     @Loading="controlLoading=$event"
                     @changevalue ="changeValue"
                     :show="true"
                     :hasParameterForSql="hasParameterForSql" 
                     :controlLoading="controlLoading"
                    ></v-controlinfo>
                </el-card>
            </grid-item>
            <grid-item  v-else-if="item.modelType=='2' && !toConfig"
                :key="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                dragAllowFrom="div.header"
                    >
               
                <el-card class="box-card" style="height:100%;width:100%">
                    <div slot="header" class="text-center header" style="font-size:16px;line-height:22px;">
                       {{item.modelName}}
                       <el-button 
                       @click="deleteGridItem(item)"
                            style="float: right; padding: 8px;position:relative;top:-4px;" type="text" >
                            <i class="el-icon-close"></i>
                        </el-button>
                    </div>
                    <v-config  v-show="type=='jl'"
                        :variableStats="variableStats"
                        :configData="configData"
                        :XR="XR"
                    ></v-config>
                    <v-config-count
                    v-show="type=='js'"
                    :configData="configData"
                    :xrStats="xrStats"
                    >

                    </v-config-count>
                </el-card>
            </grid-item>
            <grid-item  v-else-if="item.modelType=='3' && !toConfig "
                :key="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                dragAllowFrom="div.header"
            >
               
                <el-card class="box-card" style="height:100%;width:100%">
                    <div slot="header" class="text-center header" style="font-size:16px;line-height:22px;">
                       {{item.modelName}}
                       <el-button 
                         @click="deleteGridItem(item)"
                            style="float: right; padding: 8px;position:relative;top:-4px;" type="text" >
                            <i class="el-icon-close"></i>
                        </el-button>
                    </div>
                    <v-table  
                        v-show="type=='jl' && groupDatas.length>0"
                      :groupDatas="groupDatas"
                      :configData="configData"
                      :XR="XR"
                      :params="params"
                      :rules="rules"
                      :errorDataExcel="errorDataExcel"
                      :errorDataExcel1="errorDataExcel1"
                     ></v-table>
                     <v-table-count
                      v-show="type=='js' && groupDatas.length>0"
                        :groupDatas="groupDatas"
                        :configData="configData"
                        :params="params"
                        :rules="rules"
                        :errorDataExcel="errorDataExcel"
                        :errorDataExcel1="errorDataExcel1"
                     >

                     </v-table-count>
                     <v-empty v-show="groupDatas.length==0"></v-empty>
                </el-card>
            </grid-item>
            <grid-item  v-else-if="item.modelType=='4' && !toConfig"
                :key="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                dragAllowFrom="div.header"
                >
                <el-card class="box-card" style="height:100%;width:100%">
                    <div slot="header" class="text-center header" style="font-size:16px;line-height:22px;">
                       {{item.modelName}}
                       <el-button 
                          @click="deleteGridItem(item)"
                            style="float: right; padding: 8px;position:relative;top:-4px;" type="text" >
                            <i class="el-icon-close"></i>
                        </el-button>
                    </div>
                    <v-analysis  
                        v-show="type=='jl'"
                        :variableStats="variableStats"
                        :configData="configData"
                        :XR="XR"
                     ></v-analysis>
                     <v-analysis-count v-show="type=='js'"
                        :xrStats="xrStats"
                        :configData="configData"
                        :TYPE="TYPE"
                     >

                     </v-analysis-count>
                </el-card>
            </grid-item>
            <grid-item  v-else-if="item.modelType=='5' && !toConfig"
                :key="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                dragAllowFrom="div.header"
                >
                <el-card class="box-card" style="height:100%;width:100%">
                    <div slot="header" class="text-center header" style="font-size:16px;line-height:22px;">
                        {{item.modelName}}
                        <el-button 
                        @click="deleteGridItem(item)"
                        style="float: right; padding: 8px;position:relative;top:-4px;" type="text" >
                        <i class="el-icon-close"></i>
                        </el-button>
                    </div>
                    <v-rules v-show="rules.length>0"
                      :rules="rules"
                     ></v-rules>
                      <v-empty v-show="rules.length==0"></v-empty>
                </el-card>
            </grid-item>
            <grid-item  v-else-if="item.modelType=='6' && !toConfig"
                :key="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                @resize="resizex"
                @resized="resized"
                dragAllowFrom="div.header"
                >
                <el-card class="box-card" style="height:100%;width:100%;">
                    <div slot="header" class="text-center header" style="font-size:16px;line-height:22px;z-index">
                        {{item.modelName}}
                        <el-button 
                        @click="deleteGridItem(item)"
                        style="float: right; padding: 8px;position:absolute;top:4px;right:20px" type="text" >
                        <i class="el-icon-close"></i>
                        </el-button>
                    </div>
                    <v-linex v-if="XcharData.rows.length>0 && type=='jl'"
                        ref="linex"
                        :chart-data="XcharData" 
                        :MAX="max" 
                        :MIN="min"
                        :selectedXrules="selectedXrules"
                        WX="100%"
                        :HX="HX"
                        :show="true"

                        
                    ></v-linex>
                    <v-step v-else-if="dataX.length>0 && type=='js'"
                        :dataX="dataX"
                        :ucl="ucl"
                        :lcl="lcl"
                        :badData="badData"
                        :errorDatas="errorDatas"
                        :type="TYPE"
                        :HX="HX"
                        WX="100%"
                        :show="true"
                        ></v-step>
                    <v-empty v-else></v-empty>
                </el-card>
            </grid-item>
            <grid-item  v-else-if="item.modelType=='7' && !toConfig"
                :key="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                @resize="resizer"
                @resized="resized"
                dragAllowFrom="div.header"
                    >
               
                <el-card class="box-card" style="height:100%;width:100%">
                    <div slot="header" class="text-center header" style="font-size:16px;line-height:22px;">
                        {{item.modelName}}
                        <el-button 
                        @click="deleteGridItem(item)"
                        style="float: right; padding: 8px;position:relative;top:-4px;" type="text" >
                        <i class="el-icon-close"></i>
                        </el-button>
                    </div>
                    <v-liner
                        v-if="RcharData.rows.length>0 && type=='jl'"
                        :chart-data="RcharData"
                        :min="minR"
                        :max="maxR"
                        :selectedRrules="selectedRrules"
                        :HR="HR"
                        :WR="WR"
                        :show="true"
                    ></v-liner>
                    <v-line
                       v-else-if="cumulativeRateData.rows.length>0 && type=='js'"
                       :chartData="cumulativeRateData"
                       :HR="HR"
                       :WR="WR"
                        :show="true"
                    ></v-line>
                     <v-empty v-else></v-empty>
                </el-card>
            </grid-item>
            <grid-item  v-else-if="item.modelType=='8' && !toConfig"
                :key="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                @resize="resizez"
                @resized="resized"
                dragAllowFrom="div.header"
                    >
               
                <el-card class="box-card" style="height:100%;width:100%">
                    <div slot="header" class="text-center header" style="font-size:16px;line-height:22px;">
                        {{item.modelName}}
                        <el-button 
                        @click="deleteGridItem(item)"
                        style="float: right; padding: 8px;position:relative;top:-4px;" type="text" >
                        <i class="el-icon-close"></i>
                        </el-button>
                    </div>
                    <v-bar 
                     v-if="type=='jl' && countDatas.length>0"
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
                        :HZ="HZ"
                        :WZ="WZ"
                    ></v-bar>
                    <v-plato
                    v-else-if="type=='js' && paretoData.count.length>0"
                    :paretoData="paretoData"
                    :HZ="HZ"
                    :WZ="WZ"
                    >
                     </v-plato>
                     <v-empty v-else></v-empty>
                </el-card>
            </grid-item>
            <grid-item  v-else-if="item.modelType=='9'"
                :key="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                @resize="resizez"
                @resized="resized"
                dragAllowFrom="div.header"
                    >
               
                <el-card class="box-card" style="height:100%;width:100%">
                    <div slot="header" class="text-center header" style="font-size:16px;line-height:22px;">
                        {{item.modelName}}
                        <el-button 
                        @click="deleteGridItem(item)"
                        style="float: right; padding: 8px;position:relative;top:-4px;" type="text" >
                        <i class="el-icon-close"></i>
                        </el-button>
                    </div>
                    <v-info></v-info>
                </el-card>
            </grid-item>
           
        </template>
           
           
        </grid-layout>
        <!--endprint-->
   </div>
  
   
    <v-folder v-show="$store.getters.showFolderTask"></v-folder>
    <div class="Dialog">
    <el-dialog title="辅助及原因追查" :visible.sync="dialogAttachVisible" 
        width="700px"
       
    >
     <v-pdf-info 
     v-if="dialogAttachVisible"
     :pdfInfo="{}"
     @close="dialogAttachVisible=false;pdfInfo={}"
     @show-pdf="showPdfPanel"
    ></v-pdf-info>
    </el-dialog>
    </div>
   


     <v-pdf :showPdf="showPdf"
        @close="showPdf=false"
        :name="configData.spcTaskName"
        :panel="selectePanel"
     >
        <v-pdf-info 
        slot="20"
        :pdfInfo="pdfInfo"
        ></v-pdf-info>
            
        
          
           <div style="border:1px solid #999;padding:20px 20px 20px 0;" slot="1" v-show="selectePanel[1]">
                <v-controlinfo 
                    :controlInfo="controlInfo"
                    @view="getViewData"
                    :show="false"
                    :recentInfo="recentInfo"
                    :hasParameterForSql="hasParameterForSql" 
            ></v-controlinfo>
           </div>
           
            <v-config  v-show="type=='jl' && selectePanel[2]"
                        :variableStats="variableStats"
                        :configData="configData"
                        :XR="XR"
                        slot="2"
            ></v-config>
            <v-config-count
                    v-show="type=='js' && selectePanel[2]"
                    :configData="configData"
                    :xrStats="xrStats"
                    slot="2"
                    >
            </v-config-count>
            <v-analysis  
                    v-show="type=='jl' && selectePanel[4]"
                        :variableStats="variableStats"
                        :configData="configData"
                        :XR="XR"
                        slot="4"
            ></v-analysis>
            <v-analysis-count v-show="type=='js' && selectePanel[4]"
                        :xrStats="xrStats"
                        :configData="configData"
                        :TYPE="TYPE"
                        slot="4"
                     >
            </v-analysis-count>
            <v-rules 
                :rules="rules"
                slot="5"
                v-show="selectePanel[5]"
            ></v-rules>
            <v-linex v-if="XcharData.rows.length>0 && type=='jl' && selectePanel[6]"
                ref="linex"
                :chart-data="XcharData" 
                :MAX="max" 
                :MIN="min"
                :selectedXrules="selectedXrules"
                WX="100%"
                HX="400"
                slot="6"
                :show="false"
            ></v-linex>
            <v-step v-else-if="dataX.length>0 && type=='js' && selectePanel[6]"
                :dataX="dataX"
                :ucl="ucl"
                :lcl="lcl"
                :badData="badData"
                :errorDatas="errorDatas"
                :type="TYPE"
                HX="400"
                WX="100%"
                slot="6"
                :show="false"
            ></v-step>
            <v-liner
               
                v-if="RcharData.rows.length>0 && type=='jl' && selectePanel[7]"
                :chart-data="RcharData"
                :min="minR"
                :max="maxR"
                :selectedRrules="selectedRrules"
                HR="400"
                WR="100%"
                slot="7"
                :show="false"
            ></v-liner>
            <v-line
                v-else-if="cumulativeRateData.rows.length>0 && type=='js' && selectePanel[7]"
                :chartData="cumulativeRateData"
                HR="400"
                WR="100%"
                slot="7"
                :show="false"
            ></v-line>
            <v-bar 
                v-if="type=='jl' && countDatas.length>0 && selectePanel[8]"
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
                HZ="400"
                WZ="100%"
                slot="8"
            ></v-bar>
            <v-plato
                v-else-if="type=='js' && paretoData.count.length>0 && selectePanel[8]"
                :paretoData="paretoData"
                HZ="400"
                WZ="100%"
                slot="8"
                >
            </v-plato>
       
     </v-pdf>
    </div>
   
    
</template>

<script>
import folderTask from '@/views/home/folderList'
import VueGridLayout from "vue-grid-layout"
import Linex from "./component/x_r/lineX"
import Liner from "./component/x_r/lineR"
import Bar from "./component/x_r/bar1"
import Table from './com/table'
import TableCount from './com/tableCount'
import Rules from './com/rules'
import Analysis from './com/analysis'
import AnalysisCount from './com/analysisCount'
import Config from './com/config'
import ConfigCount from './com/configCount'
import ControlInfo from './com/controlInfo'
import Step from './component/ct/step'
import Plato from './component/ct/plato'
import Line from './component/ct/line'
import Empty from './component/x_r/empty'
import Info from './com/info'
import Attach from './com/attach'
import PdfInfo from './com/pdfInfo'
import Pdf from './com/pdf'
import {firstBy} from "thenby";
import { spcUpdate} from "@/api/spc/config"
import viewMixins from './viewMixins.js'
import PdfJs from '@/views/mixins/pdf';
import Excel from '@/views/spc/com/excel'
export default {
  mixins:[viewMixins,PdfJs,Excel],
  components: {
    "grid-layout": VueGridLayout.GridLayout,
    'grid-item':VueGridLayout.GridItem,
    'v-linex':Linex,
    'v-liner':Liner,
    'v-bar':Bar,
    'v-table':Table,
    'v-rules':Rules,
    'v-analysis':Analysis,
    'v-config':Config,
    'v-controlinfo':ControlInfo,
    'v-table-count':TableCount,
    'v-analysis-count':AnalysisCount,
    'v-config-count':ConfigCount,
    'v-step':Step,
    'v-plato':Plato,
    'v-line':Line,
    'v-empty':Empty,
    'v-folder':folderTask,
    'v-info':Info,
    'v-attach':Attach,
    'v-pdf-info':PdfInfo,
    'v-pdf':Pdf

  },
  data() {
    return {
        WX:'100%',
        HX:'380',
        WR:'100%',
        HR:'380',
        WZ:'50%',
        HZ:'400',
        spcTaskId:'',
        toConfig:false,
        dialogAttachVisible:false,
        showPdf:false,
        selectePanel:{

        },
        recentInfo:{},
        pdfInfo:{
              
        },
        hasParameterForSql: {}, // sql中含有参数，保存关系 sectionValue:{},parameter:[]
        controlLoading:true
        // layout:[ 
        //     {"x":0,"y":0,"w":500,"h":23,"i":"0","modelName":"Panel","modelType":0}
        // ],
        // LINEX:null
    };
  },
  methods:{
    changeValue:function(info){  // {key:"",data}
        let data=info.data.split(";").slice(0,-1);
        this.controlInfo[info.key].parameterValueArr=data;
    },
    showAddPanel:function(val){
        if(val==0){
            let flag=false;
            if(this.layout.length>0){
               this.layout.forEach(item=>{
                      if(item.modelType==0){
                          flag=true;  //存在
                      }
               })
            }
            if(!flag || this.layout.length==0){
                this.layout.unshift({"x":0,"y":0,"w":500,"h":23,"i":"0","modelName":'Panel',"modelType":0});
            }
           
        }
        else{  //-1   删除
           
            let Index=-1;
            if(this.layout.length>0){
               this.layout.forEach((item,index)=>{
                      if(item.modelType==0){
                          Index=index; 
                      }
               })
            }
            this.layout.splice(Index,1);
        }
    },
    resizex:function(i, H,  W, HPx, WPx){  // H W 表示比例   HPx WPx 表示实际的 px
        // this.$Bus.$emit('resizex',{h: HPx,w:WPx});
        //this.$store.commit("SET_WX",WPx);
        //this.$store.commit("SET_HX",HPx);
        this.WX=WPx-20+'px';
        this.HX=HPx;
    },
    resizer:function(i, H,  W, HPx, WPx){  // H W 表示比例   HPx WPx 表示实际的 px
        this.WR=WPx-20+'px';
        this.HR=HPx;
    },
    resizez:function(i, H,  W, HPx, WPx){  // H W 表示比例   HPx WPx 表示实际的 px
        this.WZ=WPx-20+'px';
        this.HZ=HPx;
    },
    resized:function(i, H,  W, HPx, WPx){
       //设置 具体宽度
       this.layout.forEach(item=>{
            if(item.modelType==i){
                item.WPx=WPx-20;
                item.HPx=HPx;
            }
       });
       if(this.$store.getters.userRole<4){
         spcUpdate({spcTaskId:this.spcTaskId,dashboard:this.layout})
       }
       
     
    },
    layoutUpdatedEvent: function(newLayout){  //
       console.log('layoutUpdatedEvent');
       console.log(newLayout);
    },
    deleteGridItem:function(Item){// 删除grid_item  ---->添加panel 图标 
         this.$confirm('确定删除面板'+ Item.modelName +'?', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
            }).then(()=>{ 
                
                        let modelType=Item.modelType,Index;
                        this.layout.forEach((item,index)=>{
                            if(item.modelType==modelType){
                                //item.modelType=-item.modelType;// grid_item 
                                 Index=index;
                                this.panels.forEach(panel=>{//panel
                                    if(Math.abs(panel.modelType)==Math.abs(modelType)){
                                        panel.modelType=Math.abs(panel.modelType);
                                    }
                                })
                                this.selectePanel[Math.abs(modelType)]=false
                            }
                        });
                        this.layout.splice(Index,1);//删除----刷新排序
                        
                        switch(Item.modelType){
                            case 6 : this.WX='50%';this.HX='380';break;
                            case 7 : this.WR='50%';this.HR='380';break;
                            case 8 : this.WZ='50%';this.HZ='400';break;

                        }
                    
                   }).catch(()=>{ })
       

    },
    addGridItem:function(Panel){ //  添加grid_item  ---->删除panel 图标 
      console.log('********Panel***********');
  
        let nowGridItem=null,lastItem=null;
        this.panels.forEach(panel=>{//panel---不显示
            if(panel.modelType==Panel.modelType){
                nowGridItem=Object.assign({},panel);
                panel.modelType=-(panel.modelType);
                this.selectePanel[Panel.modelType]=true
                
            }
        })
       
        //计算坐标   push grid_item  to layout
        lastItem=this.layout.sort(
            firstBy(function (v1) { return v1.y})
            .thenBy('x')
        ).slice(-1)[0];
        let x=0,y=0,w=0,h=0;
        if(Math.abs(Panel.modelType)==6 || Math.abs(Panel.modelType)==7){
            w=1000;
        }
        else{
            w=500;
        }

        if(Number(lastItem.x)+Number(lastItem.w)>500){
            x=0;y=lastItem.y+1;h=20;
        }
        else{
            x=Number(lastItem.x)+Number(lastItem.w);
            y=lastItem.y;h=20;
        }
       
            nowGridItem.x=x;
            nowGridItem.y=y;
            nowGridItem.w=w;
            nowGridItem.h=20;
            nowGridItem.i=nowGridItem.modelType; 
       
        this.layout.push(nowGridItem); 
        this.showAddPanel(-1);
        //x=0,y=0,w=0,h=0,lastItem=null;
    },
    updatePanel:function(){
        spcUpdate({spcTaskId:this.spcTaskId,dashboard:this.layout}).then(res=>{
            if(res.code==200){
                this.$message.success(res.message);
            }
            else{
                this.$message.error(res.message); 
            }
        });
    },
    config:function(){
        this.$router.push("/spc/task/"+ Number(this.spcTaskId));
    },
    pdf:function(){
       // this.convertCanvasToImage("pdf","p");
    },
    showPdfPanel:function(pdfInfo){
        console.log(pdfInfo);
         this.pdfInfo=pdfInfo;
         this.panels.forEach(panel=>{//panel---不显示
         if(Math.abs(panel.modelType)!=3){//table
            if(panel.modelType>0){
                this.selectePanel[panel.modelType]=false;//不再显示
            }
            else{
                this.selectePanel[Math.abs(panel.modelType)]=true;//显示
            }
         }
           
        })
        this.dialogAttachVisible=false;
        this.showPdf=true
    },
    excel:function(){
        
        if (this.configData.controlGraph > 0 && this.configData.controlGraph < 5) {//jl
             this.exportExcelJl();

        }
        if (this.configData.controlGraph > 4 && this.configData.controlGraph < 9) { // 计数
            this.exportExcelJs();
       
        }
    }
  },
  computed:{
       panels:function(){
           if(this.type=='jl'){
               return  [
                    {
                        icon:'info',modelName:'分析条件',modelType:'1'
                    },
                    {
                        icon:'info',modelName:'基本信息',modelType:'2'
                    },
                    {
                    icon:'panel',modelName:'样本数据',modelType:'3'
                    },
                    {
                    icon:'analysis',modelName:'过程能力分析',modelType:'4'
                    },
                    {
                    icon:'rules',modelName:'判异规则',modelType:'5'
                    },
                    {
                    icon:'line',modelName:this.XR[0]+'管制图',modelType:'6'
                    },
                    {
                    icon:'line',modelName:this.XR[1]+'管制图',modelType:'7'
                    },
                    {
                    icon:'histogram',modelName:'过程能力图',modelType:'8'
                    },
                    // {
                    // icon:'info',modelName:'xxxxxxxx',modelType:'9'
                    // },
                ]
           }
           else  if(this.type=='js'){
               return  [
                    {
                        icon:'info',modelName:'分析条件',modelType:'1'
                    },
                    {
                        icon:'info',modelName:'基本信息',modelType:'2'
                    },
                    {
                    icon:'panel',modelName:'样本数据',modelType:'3'
                    },
                    {
                    icon:'analysis',modelName:'制程能力分析',modelType:'4'
                    },
                    {
                    icon:'rules',modelName:'判异规则',modelType:'5'
                    },
                    {
                    icon:'line',modelName:'控制图',modelType:'6'
                    },
                    {
                    icon:'line',modelName:'累积概率图',modelType:'7'
                    },
                    {
                    icon:'histogram',modelName:'柏拉图',modelType:'8'
                    },
                    // {
                    // icon:'info',modelName:'xxxxxxxx',modelType:'9'
                    // },
                ]
           }
           else {
               return  [
                    {
                        icon:'info',modelName:'分析条件',modelType:'1'
                    },
                    {
                        icon:'info',modelName:'基本信息',modelType:'2'
                    },
                    {
                    icon:'panel',modelName:'样本数据',modelType:'3'
                    },
                    {
                    icon:'analysis',modelName:'制程能力分析',modelType:'4'
                    },
                    {
                    icon:'rules',modelName:'判异规则',modelType:'5'
                    },
                    {
                    icon:'line',modelName:this.XR[0]+'管制图',modelType:'6'
                    },
                    {
                    icon:'line',modelName:this.XR[1]+'管制图',modelType:'7'
                    },
                    {
                    icon:'histogram',modelName:'制程能力图',modelType:'8'
                    },
                    // {
                    // icon:'info',modelName:'xxxxxxxx',modelType:'9'
                    // },
                ]
           }
       }
       
  },
 beforeDestroy:function(){
     if(this.fullLoading){
            this.fullLoading.close();
     }
 }
  
};
</script>
<style>

</style>

