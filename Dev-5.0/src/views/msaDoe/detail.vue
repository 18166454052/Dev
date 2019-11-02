<template>
    <div>
        <el-row style="border-bottom:1px solid #dcdfe6;padding:5px 20px">
            <el-col :span="10"  style="font-size:20px;">
                &nbsp;
                   <el-button  
                     @click="$store.commit('SET_TASK',true)" 
                    type="text" ><i class="el-icon-menu el-icon--left"></i>{{configData.msaTaskName}}<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
            </el-col>
            <el-col :span="14" class="text-right"  v-if="$store.getters.userRole<4?true:false">
                <el-tooltip class="item" effect="light" content="添加面板" placement="top-start">
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
                <el-tooltip class="item" effect="light" content="PDF" placement="top-start">
                    <el-button size="mini"  @click="dialogAttachVisible=true">
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
                            <div slot="header"  style="overflow:hidden" >
                                <el-button 
                                @click="showAddPanel('-1')"
                                style="float: right; padding:4px;" type="text" >
                                    <i class="el-icon-close"></i>
                                </el-button>
                            </div>
                            <el-row :gutter="20" v-if="!toConfig" style="cursor:default" class='detailPanel'>
                                <el-col :span="8"  v-for="panel in panels" 
                                v-show="panel.modelType>0"
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
                                    <router-link :to="'/msa/task/'+ Number(msaTaskId)">
                                    <el-button size="large" type="text">请先配置数据分析 <svg-icon  icon-class="right"></svg-icon></el-button>
                                    </router-link>
                                </div> 
                                        
                        </el-card>
                </div>
            </grid-item>
            <grid-item  v-else-if="item.modelType=='1' && !toConfig "
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
                     @view="getMsaView"
                     :show="true"
                    ></v-controlinfo>
                </el-card>
            </grid-item>
            <grid-item  v-else-if="item.modelType=='2' && !toConfig "
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
                    <v-config
                        :msaStat="msaStat"
                        :configData="configData"
                        :personLen="personLen"
                        :partLen="partLen"
                        :rowLen="rowLen"
                    ></v-config>
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
                    :groupDatas="groupData"
                    :loopTitle="loopTitle"
                    :rules="rules"
                    ></v-table>
                </el-card>
            </grid-item>
            <grid-item  v-else-if="item.modelType=='4' && !toConfig "
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
                    :msaStat="msaStat"
                    :TRR="TRR"
                    ></v-analysis>
                </el-card>
            </grid-item>
            <grid-item  v-else-if="item.modelType=='5' && !toConfig "
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
                    <v-rules
                    :rules="rules"
                    ></v-rules>
                </el-card>
            </grid-item>
            <grid-item  v-else-if="item.modelType=='6'"
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
            <grid-item  v-else-if="item.modelType=='7' && !toConfig "
                :key="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                @resize="resize"
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
                    <v-linex v-if="XcharData.rows.length>0"
                     :chartData="XcharData"
                     :ucl="ucl_x"
                     :lcl="lcl_x"
                     :H6="H7"
                     :W6="W7"
                    ></v-linex>
                    <v-empty v-else></v-empty>
                </el-card>
            </grid-item>
            <grid-item  v-else-if="item.modelType=='8' && !toConfig "
                :key="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                @resize="resize"
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
                    v-if="RcharData.rows.length>0"
                    :chartData="RcharData"
                    :ucl="ucl_r"
                    :lcl="lcl_r"
                    :H7="H8"
                    :W7="W8"
                    ></v-liner>
                    <v-empty v-else></v-empty>
                </el-card>
            </grid-item>
            <grid-item  v-else-if="item.modelType=='9' && !toConfig"
                :key="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                @resize="resize"
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
                    <v-histogram
                    v-if="HcharData.rows.length>0"
                     :charData="HcharData"
                      :H8="H9"
                      :W8="W9"
                    ></v-histogram>
                    <v-empty v-else></v-empty>
                </el-card>
            </grid-item>
            <grid-item  v-else-if="item.modelType=='10' && !toConfig"
                :key="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                @resize="resize"
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
                    <v-one
                     v-if="PartOne.rows.length>0"
                     :chartData="PartOne"
                     :xPart="msaStat.xPart"
                      :H9="H10"
                      :W9="W10"
                    ></v-one>
                    <v-empty v-else></v-empty>
                </el-card>
            </grid-item>
            <grid-item  v-else-if="item.modelType=='11' && !toConfig"
                :key="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                @resize="resize"
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
                    <v-more
                    v-if="PartMore.rows.length>0"
                     :chartData="PartMore"
                      :H10="H11"
                      :W10="W11"
                    ></v-more>
                    <v-empty v-else></v-empty>
                </el-card>
            </grid-item>
            <grid-item  v-else-if="item.modelType=='12' && !toConfig "
                :key="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                @resize="resize"
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
                    <v-box
                   v-if="Box.values.length>0"
                     :boxObj="Box"
                      :H11="H12"
                      :W11="W12"
                    ></v-box>
                    <v-empty v-else></v-empty>
                   
                </el-card>
            </grid-item>
        </template>
           
           
        </grid-layout>
   </div>
  
   
     <v-folder v-show="$store.getters.showFolderTask"></v-folder>
     <!-- <v-attach 
      :visible="dialogAttachVisible"
     @close="dialogAttachVisible=false"
     ></v-attach> -->

     <div class="Dialog">
    <el-dialog title="辅助及原因追查" :visible.sync="dialogAttachVisible" 
        width="700px"
       
    >
     <v-pdf-info 
     
     :pdfInfo="{}"
     @close="dialogAttachVisible=false;pdfInfo.J=[];pdfInfo={}"
     @show-pdf="showPdfPanel"
    ></v-pdf-info>
    </el-dialog>
    </div>
   

   <v-pdf :showPdf="showPdf"
        @close="showPdf=false"
        :name="configData.msaTaskName"
        :panel="selectePanel"
     >
            <v-pdf-info 
            slot="100"
            :pdfInfo="pdfInfo"
            ></v-pdf-info>
             <div style="border:1px solid #999;padding:20px 20px 0 0;" 
                    v-show="selectePanel[1]"
                    slot="1">
            <v-controlinfo
                    :controlInfo="controlInfo"
                    @view="getMsaView"
                   
                    :show="false"
                    :recentInfo="recentInfo"
            ></v-controlinfo>
             </div>
            <v-config
                v-show="selectePanel[2]"
                slot="2"
                :msaStat="msaStat"
                :configData="configData"
                :personLen="personLen"
                :partLen="partLen"
                :rowLen="rowLen"
            ></v-config>
              
            <v-analysis
                :msaStat="msaStat"
                :TRR="TRR"
                v-show="selectePanel[4]"
                slot="4"
            ></v-analysis>
            <v-rules
                :rules="rules"
                v-show="selectePanel[5]"
                slot="5"
            ></v-rules>
             <v-linex v-if="XcharData.rows.length>0 && selectePanel[7]"
                :chartData="XcharData"
                :ucl="ucl_x"
                :lcl="lcl_x"
                H6="400"
                W6="100%"
                slot="7"
            ></v-linex>
            <v-liner
                v-if="RcharData.rows.length>0 && selectePanel[8]"
                :chartData="RcharData"
                :ucl="ucl_r"
                :lcl="lcl_r"
                H7="400"
                W7="100%"
                slot="8"
            ></v-liner>
            <v-histogram
                v-if="HcharData.rows.length>0 && selectePanel[9]"
                :charData="HcharData"
                H8="400"
                W8="100%"
                slot="9"
            ></v-histogram>
             <v-one
                v-if="PartOne.rows.length>0 && selectePanel[10]"
                :chartData="PartOne"
                :xPart="msaStat.xPart"
                H9="400"
                W9="100%"
                slot="10"
            ></v-one>
            <v-more
                 v-if="PartMore.rows.length>0 && selectePanel[11]"
                :chartData="PartMore"
                H10="400"
                W10="100%"
                slot="11"
            ></v-more>

            <v-box
                v-if="Box.values.length>0 && selectePanel[12]"
                :boxObj="Box"
                H11="400"
                W11="100%"
                slot="12"
            ></v-box>
           
           
   </v-pdf>


    </div>
    
</template>

<script>
import folderTask from '@/views/home/folderList'
import VueGridLayout from "vue-grid-layout"
import Linex from "./components/msa/lineX"
import Liner from "./components/msa/lineR"
import Box from './components/msa/box'
import Histogram from './components/msa/histogram'
import One from './components/msa/partOne'
import More from './components/msa/lineMore'

import Rules from './components/msa/rules'
import Analysis from './components/msa/analysis'
import Config from './components/msa/config'
import ControlInfo from './components/msa/controlInfo'
import Table from './components/msa/tables'
import Empty from '@/views/spc/component/x_r/empty'
import Info from './components/msa/info'
import Attach from './components/msa/attach'
import {firstBy} from "thenby";
import Mixins from './mixins'
import { msaUpdate } from "@/api/msaDoe/msa"
import PdfInfo from '@/views/spc/com/pdfInfo'
import Pdf from '@/views/spc/com/pdf'
export default {
   mixins:[Mixins],
  components: {
    "grid-layout": VueGridLayout.GridLayout,
    'grid-item':VueGridLayout.GridItem,
    'v-linex':Linex,
    'v-liner':Liner,
    'v-box':Box,
    'v-one':One,
    'v-more':More,
    'v-histogram':Histogram,
    'v-table':Table,
    'v-rules':Rules,
    'v-analysis':Analysis,
    'v-config':Config,
    'v-controlinfo':ControlInfo,
    'v-empty':Empty,
    'v-folder':folderTask,
    'v-info':Info,
    'v-attach':Attach,
    'v-pdf-info':PdfInfo,
    'v-pdf':Pdf

  },
  data() {
    return {
        dialogAttachVisible:false,
        msaTaskId:'',  
        panels:[
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
            //  {
            //    icon:'info',modelName:'xxxxxx',modelType:'6'
            // },
            {
               icon:'line',modelName:'X管制图',modelType:'7'//linex
            },
            {
               icon:'line',modelName:'R管制图',modelType:'8'//liner
            },
            {
               icon:'histogram',modelName:'变异分量',modelType:'9'//histogram
            },
            {
               icon:'line',modelName:'数据 - 部件编号',modelType:'10'//one
            },
            {
               icon:'line',modelName:'部件编号 - 人员编号',modelType:'11'  //more
            },
            {
               icon:'box',modelName:'数据 - 人员编号',modelType:'12'  //box
            },
        ],
        layout:[ 
          //{"x":0,"y":0,"w":500,"h":23,"i":"0","modelName":"Panel","modelType":0}
        ],
        rules:[],
        controlInfo:[],   //{valueArr ,value , label , key }
        H7:'380',
        H8:'380',
        H9:'400',
        H10:'400',
        H11:'400',
        H12:'400',
        W7:'100%',
        W8:'100%',
        W9:'100%',
        W10:'100%',
        W11:'100%',
        W12:'100%',
        toConfig:false,
        showPdf:false,
        selectePanel:{

        },
        recentInfo:{},
        pdfInfo:{
              
        }
        
        
    };
  },
  methods:{
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
                            }
                        });
                        this.layout.splice(Index,1);//删除----刷新排序
                    
                   }).catch(()=>{ })
       

    },
    addGridItem:function(Panel){ //  添加grid_item  ---->删除panel 图标 

        let nowGridItem=null,lastItem=null;
        this.panels.forEach(panel=>{//panel---不显示
            if(panel.modelType==Panel.modelType){
                nowGridItem=Object.assign({},panel);
                panel.modelType=-(panel.modelType);
                
            }
        })
        
        //计算坐标   push grid_item  to layout
        lastItem=this.layout.sort(
            firstBy(function (v1) { return v1.y})
            .thenBy('x')
        ).slice(-1)[0];
        let x=0,y=0,w=0,h=0;
        if(Math.abs(Panel.modelType)>=6){
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
        x=0,y=0,w=0,h=0,lastItem=null;
    },
    updatePanel:function(){
        msaUpdate({msaTaskId:this.msaTaskId,dashboard:this.layout}).then(res=>{
            if(res.code==200){
                this.$message.success(res.message);
            }
            else{
                this.$message.error(res.message); 
            }
        });
    },
    config:function(){
        this.$router.push("/msa/task/"+ Number(this.msaTaskId));
    },
    resize:function(i, H,  W, HPx, WPx){
        this['H'+i]=HPx;
        this['W'+i]=WPx - 20 + 'px';
    },
    resized:function(i, H,  W, HPx, WPx){
        this.layout.forEach(item=>{
            if(item.modelType==i){
                item.WPx=WPx - 20;
                item.HPx=HPx;
            }
       });
       if(this.$store.getters.userRole<4){
           msaUpdate({spcTaskId:this.spcTaskId,dashboard:this.layout})
       }
      
    },
    showPdfPanel:function(pdfInfo){
        
         this.pdfInfo=pdfInfo;
       
            this.panels.forEach(panel=>{//panel---不显示
              if(Math.abs(pdfInfo.modelType)!=3){//table  不显示
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
    }
    
   
   },
   beforeRouteLeave:function(to,from,next){
        // msaUpdate({spcTaskId:this.spcTaskId,dashboard:this.layout}).then(res=>{
        //     next();
        // });
        next();
    },
   created:function(){
     
     
     
  }
};
</script>
<style>
#noSelect{
    -moz-user-select:none;/*火狐*/
    -webkit-user-select:none;/*webkit浏览器*/
    -ms-user-select:none;/*IE10*/
    -khtml-user-select:none;/*早期浏览器*/
    user-select:none;
}
</style>


