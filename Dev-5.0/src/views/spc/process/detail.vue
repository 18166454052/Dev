<template>
    <div>
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
                <el-tooltip class="item" effect="light" content="刷新" placement="top-start">
                    <el-button size="mini" @click="getProcessView">
                        <svg-icon  icon-class="refresh" style="font-size:20px"></svg-icon>
                    </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="PDF" placement="top-start">
                    <el-button size="mini"   @click="dialogAttachVisible=true">
                        <svg-icon  icon-class="pdf" style="font-size:20px"></svg-icon>
                    </el-button>
                </el-tooltip>
               
            </el-col>
        </el-row>
        <div class="app-container Panel" id="noSelect">
                <grid-layout
         id="pdf"
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
                            <el-row :gutter="20"   style="cursor:default" class='detailPanel'>
                                <el-col :span="6"  v-for="panel in panels" 
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
                                 
                        </el-card>
                </div>
            </grid-item>
            <grid-item  v-else-if="item.modelType=='1'"
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
                    <v-control-info
                     :controlInfo="controlInfo"
                     @view="getProcessView"
                     @loading="controlLoading=$event"
                     @changevalue="changeValue"
                     :show="true"
                     :sqlDes="configData.configDataanalysis.sqlDes"
                     :hasParameterForSql="hasParameterForSql"
                     :controlLoading="controlLoading"
                    ></v-control-info>
                </el-card>
            </grid-item>
            <grid-item  v-else
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
                  <v-line
                  v-if="variableStats[item.modelName] && variableStats[item.modelName].rows.length>0"
                  :data="variableStats[item.modelName]"
                  :HX="size['H'+item.modelType]"
                  :WX="size['W'+item.modelType]"
                
                  ></v-line>
                  <v-empty  v-else></v-empty>
                </el-card>
            </grid-item>
          
           
        </template>
        </grid-layout>
        </div>
<v-folder v-show="$store.getters.showFolderTask"></v-folder>

<div class="Dialog">
    <el-dialog title="辅助及原因追查" :visible.sync="dialogAttachVisible" 
        width="700px"
    >
    <v-pdf-info 
      v-if="dialogAttachVisible"
     :pdfInfo="{}"
     @close="dialogAttachVisible=false"
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
            slot="100"
            :pdfInfo="pdfInfo"
            ></v-pdf-info>

            <div style="border:1px solid #999;padding:20px 20px 20px 0;" slot="1" v-show="selectePanel[1]">
                <v-control-info 
                    :controlInfo="controlInfo"
                     @view="getProcessView"
                    :show="false"
                    :recentInfo="recentInfo"
                     
                ></v-control-info>
           </div>
            
           <template v-for="(panel,index) in panels" v-if="Math.abs(panel.modelType)>1">
                <v-line
                :style="{'margin-top':index==0?'-20px':''}"
                v-show="selectePanel[Math.abs(panel.modelType)]"
                :slot="Math.abs(panel.modelType)"
                :key="'modelType'+panel.modelType"
                :data="variableStats[panel.modelName]"
                :name="panel.modelName"
                HX="400"
                WX="100%"
                ></v-line>
           </template>


    </v-pdf>
   

    </div>
</template>
<script>
import {
  controlInfo
} from '@/api/spc/config'
import Line from "./line";
import folderTask from '@/views/home/folderList'
import { firstBy } from "thenby";
import {
  spcDetail,
  spcTaskProcess,
  spcUpdate
} from "@/api/spc/config";
import Pdf from '@/views/spc/com/pdf'
import PdfInfo from '@/views/spc/com/pdfInfo'
import ControlInfo from './controlInfo'
import Empty from '@/views/spc/component/x_r/empty'
export default {
  components: {
    "v-line": Line,
    'v-folder':folderTask,
    'v-pdf':Pdf,
    'v-pdf-info':PdfInfo,
    'v-control-info': ControlInfo,
    'v-empty':Empty
  },
  data() {
    return {
      controlLoading:true,
      dialogAttachVisible:false,
      showPdf:false,
      selectePanel:{

      },
      recentInfo:{},
      pdfInfo:{
                
      },
      spcId: "",
      panels: [
        {
           icon:'info',modelName:'控制信息',modelType:'1'   
        },
        
      ],
      layout: [],
      configData: {
        spcTaskName: ""
      },
      fullLoading: null,
      LOADING: {
        lock: true,
        text: '需要几秒钟,加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.6)'
      },
      size:{},
     
      pp:{
          columns: ['x','pp'],
          rows:[
            //   {x:1,cp:1},
            //   {x:2,cp:2}
          ]
      },
      controlInfo: [], // 附加信息
      size:{

      },
      variableStats:{
      },
      
      variableArrJl:["numGroup","avg","averageFirst","averageSecond",
      "stdDevLong","stdDevShort",
      "sigma","ppk","pp","ca","cpk","cp","cpm","cpmk","ppm","ppmk",
      "dpmoShort","dpmoLong","sigmaShor","sigmaLong","zBenchShort","zBenchLong"
      ],
       variableArrJs:["avgN","avgP","defectiveLower","defectiveUpper","dpmo",
       "dpmoLower","dpmoUpper","numDefective","numGroup","numTotal","percentDefective",
       "sigmaLevel","target","zBench","zBenchLower","zBenchUpper"
      ],
      hasParameterForSql:{}, // 0:{} 1:{}
      controlLoading:true
    };
  },
  methods: {
    changeValue:function(info){
        let data=info.data.split(";").slice(0,-1);
        this.controlInfo[info.index][info.key].parameterValueArr=data;
    },
    init:function(){
      this.variableArr.forEach((item,index)=>{
          this.$set(this.variableStats,item,{ 
            columns: ['x',item],
            rows:[ ]
          })
          if(index>0){
            this.$set(this.size,'W'+index,'100%');
            this.$set(this.size,'H'+index,'400');
          }
          this.panels.push({
            icon:'line',modelName:item,modelType:index+2  // controlInfo  modelType=1  ，图表从2开始
          });
      });
    },
    showAddPanel: function(val) {
      if (val == 0) {
        let flag = false;
        if (this.layout.length > 0) {
          this.layout.forEach(item => {
            if (item.modelType == 0) {
              flag = true; //存在
            }
          });
        }
        if (!flag || this.layout.length == 0) {
          this.layout.unshift({
            x: 0,
            y: 0,
            w: 500,
            h: 23,
            i: "0",
            modelName: "Panel",
            modelType: 0
          });
        }
      } else {
        //-1   删除

        let Index = -1;
        if (this.layout.length > 0) {
          this.layout.forEach((item, index) => {
            if (item.modelType == 0) {
              Index = index;
            }
          });
        }
        this.layout.splice(Index, 1);
      }
    },
    deleteGridItem: function(Item) {
      // 删除grid_item  ---->添加panel 图标
      this.$confirm("确定删除面板" + Item.modelName + "?", "提示", {
        confirmButtonText: "确定",
        showCancelButton: false,
        type: "warning"
      })
        .then(() => {
          let modelType = Item.modelType,
            Index;
          this.layout.forEach((item, index) => {
            if (item.modelType == modelType) {
              //item.modelType=-item.modelType;// grid_item
              Index = index;
              this.panels.forEach(panel => {
                //panel
                if (Math.abs(panel.modelType) == Math.abs(modelType)) {
                  panel.modelType = Math.abs(panel.modelType);
                }
              });
            }
          });
          this.layout.splice(Index, 1); //删除----刷新排序

          // switch(Item.modelType){
          //     case 6 : this.WX='50%';this.HX='380';break;
          //     case 7 : this.WR='50%';this.HR='380';break;
          //     case 8 : this.WZ='50%';this.HZ='400';break;

          //}
        })
        .catch(() => {});
    },
    addGridItem: function(Panel) {
      //  添加grid_item  ---->删除panel 图标

      let nowGridItem = null,
        lastItem = null;
      this.panels.forEach(panel => {
        //panel---不显示
        if (panel.modelType == Panel.modelType) {
          nowGridItem = Object.assign({}, panel);
          panel.modelType = -panel.modelType;
        }
      });

      //计算坐标   push grid_item  to layout
      lastItem = this.layout
        .sort(
          firstBy(function(v1) {
            return v1.y;
          }).thenBy("x")
        )
        .slice(-1)[0];
      let x = 0,
        y = 0,
        w = 1000,
        h = 0;
     
      //不判断最后的位置  重新一行开始

        x = 0;
        y = lastItem.y + 1;
        h = 20;

      //
      // if (Number(lastItem.x) + Number(lastItem.w) > 500) {
      //   x = 0;
      //   y = lastItem.y + 1;
      //   h = 20;
      // } else {
      //   x = Number(lastItem.x) + Number(lastItem.w);
      //   y = lastItem.y;
      //   h = 20;
      // }

      nowGridItem.x = x;
      nowGridItem.y = y;
      nowGridItem.w = w;
      nowGridItem.h = 20;
      nowGridItem.i = nowGridItem.modelType;

      this.layout.push(nowGridItem);
      this.showAddPanel(-1);
      //x=0,y=0,w=0,h=0,lastItem=null;
    },
    layoutUpdatedEvent: function(newLayout) {
      //
      console.log("layoutUpdatedEvent");
      console.log(newLayout);
    },
    resize: function(i, H,  W, HPx, WPx) {
      // i  modelType
        this.size['W'+i]=WPx-20+'px';
        this.size['H'+i]=HPx;
    },
    resized: function(i, H,  W, HPx, WPx) {
        console.log('-------------------------'+HPx);
         this.layout.forEach(item=>{
            if(item.modelType==i){
                item.WPx=WPx-20;
                item.HPx=HPx;
            }
       });
        spcUpdate({spcTaskId:this.spcTaskId,dashboard:this.layout})
      
    },
    config: function() {
      this.$router.push("/spc/process/config/" + this.spcId);
    },
    pdf: function() {},
    updatePanel: function() {
      
         spcUpdate({spcTaskId:this.spcId,dashboard:this.layout}).then(res=>{
            if(res.code==200){
                this.$message.success(res.message);
            }
            else{
                this.$message.error(res.message); 
            }
        });
    },
    getSpcDetail: function() {
        spcDetail({spcTaskId:this.spcId}).then(res=>{
            if (res.code == 200) {
              this.configData = res.data;
                //获取数据分析数据
                if(res.data.configDataanalysisId){
                     this.getControlInfo(res.data.configDataanalysisId);
                }
                this.init();
                //
                console.log('----------detail----------');
                console.log(res.data);
                
                if (
                res.data.dashboard &&
                JSON.parse(res.data.dashboard) &&
                JSON.parse(res.data.dashboard) instanceof Array
                ) {
                let layout = JSON.parse(res.data.dashboard);
                //已经配置 页面
                this.layout = layout;
                // 面板 过滤panel  不显示已经设置布局的grid-item
                if (layout.length > 0) {
                    layout.forEach((grid,index)=> {
                         //x图
                        if (grid.HPx) {
                            this.size['H'+grid.modelType]=grid.HPx;
                           // this.size['W'+grid.modelType]=grid.WPx+'px';
                           this.size['W'+grid.modelType]='100%'
                        }
                    //已经设置了 grid-item  不显示对应的panel
                    this.panels.forEach(panel => {
                        if (grid.modelType == panel.modelType) {
                        panel.modelType = -Math.abs(panel.modelType);
                        }
                    });
                    });
                }
                // panel 面板不显示
                if (this.layout.length > 0) {
                    if (this.layout[0].modelType == 0) {
                    this.layout[0].modelType == -1;
                    }
                } else {
                    //如果为空，则显示面板
                    this.layout.push({
                    x: 0,
                    y: 0,
                    w:500,
                    h: 23,
                    i: "0",
                    modelName: "Panel",
                    modelType: 0
                    });
                }
                } else {
                // 未配置 页面
                this.layout = [
                    {
                    x: 0,
                    y: 0,
                    w: 500,
                    h: 23,
                    i: "0",
                    modelName: "Panel",
                    modelType: 0
                    }
                ];
                }
            } else {
                this.$message.error(res.message);
            }
        })
    },
    getProcessView:function(info){
        this.fullLoading=this.$loading(this.LOADING);
        this.recentInfo = info;
        spcTaskProcess({spcTaskId:this.spcId,...info}).then(res=>{
            this.fullLoading.close(); 
            console.log(res);
            if(res.code==200){
              let type="";
              if(this.configData.calculationType==1){
                type='variableStats';
              }
              else if(this.configData.calculationType==2){
                type='attributeStats'
              }
              if(res.data.length>0){
                res.data.forEach((list,index)=>{
                  for(let item in list[type]){
                    if(this.variableStats[item]){
                      if(isFinite(list[type][item])){   // js 的表示范围之内
                        this.variableStats[item].rows.push({
                            x:index+1,
                            [item]:list[type][item]
                        })
                      }
                    }
                  }
                });
              }
            }
            else{
                this.$message.error(res.message);
            }
        });
    },
    showPdfPanel:function(pdfInfo){
        console.log(pdfInfo);
         this.pdfInfo=pdfInfo;
         this.panels.forEach(panel=>{//panel---不显示
            if(panel.modelType>0){
                this.selectePanel[panel.modelType]=false;//不再显示
            }
            else{
                this.selectePanel[Math.abs(panel.modelType)]=true;//显示
            }
        })
        this.dialogAttachVisible=false;
        this.showPdf=true
    },
    getControlInfo: function (configDataanalysisId) {
      controlInfo({
        configDataanalysisId: configDataanalysisId
      }).then(res => {
        if (res.code == 200) {
          this.controlLoading=false;
          console.log('getControlInfo-----------------');
          console.log(res);
          //解析附加信息
          let info =[]; //
          
          if (res.data.length > 0) {
            res.data.forEach(item => {
              //sqlIndex
              if(!info[item.sqlIndex]){
                info[item.sqlIndex]={};
              }

              //
              // 类型判断
              if (item.parameterValueType == 1 || item.parameterValueType == 4) { // 选择类型
                if (item.parameterValue) {
                    if (item.parameterValueType == 4 && item.parameterValue.indexOf('@') >= 0) {
                    // sql 中有变量
                    let reg = /@.+?\s+/g;
                    let result = item.parameterValue.match(reg); // [@aa,@bb]
                   
                    this.$set(this.hasParameterForSql,item.sqlIndex,{});
                    this.hasParameterForSql[item.sqlIndex][item.sectionValue]={
                      source: result.map(item1 => item1.trim()),
                      target: item
                    }
                    //
                    item.sql = item.parameterValue;
                    item.parameterValue = "";
                    item.parameterValueArr = [];
                  } else {
                      item.parameterValueArr = item.parameterValue.split(";");
                      if(item.parameterValueType == 4){
                        if(item.parameterValueArr.length>0){
                            item.parameterValueArr.pop();
                        }
                      }
                      item.parameterValue = ""
                  }
                   
                } else {
                  // item.parameterValueArr=[];
                }

              }

              if (!item.sectionStart && !item.sectionOff) { // a=@a
                info[item.sqlIndex][item.sectionValue] = item;
                // comment
                // if(item.comment){
                //   info[item.comment]=item;
                // }
                // else{
                //   info[item.sectionValue]=item;
                // }

              } else {
                if (!info[[item.sqlIndex]][item.sectionValue]) {
                  info[item.sqlIndex][item.sectionValue] = {
                    start: {},
                    off: {}
                  }
                  if (item.sectionStart) {
                    info[item.sqlIndex][item.sectionValue].start = Object.assign({}, item);
                  }
                  if (item.sectionOff) {
                    info[item.sqlIndex][item.sectionValue].off = Object.assign({}, item);
                  }
                } else {

                  if (item.sectionStart) {

                    info[item.sqlIndex][item.sectionValue].start = Object.assign({}, item);
                  }
                  if (item.sectionOff) {

                    info[item.sqlIndex][item.sectionValue].off = Object.assign({}, item);
                  }
                }
              }
            });

          }
          //
          this.controlInfo = Object.assign({}, info);
         
        } else {
          this.$message.error(res.message);
        }
      });
    }
  },
  computed:{
    variableArr:function(){
      if(this.configData.calculationType==1){// jl
           return this.variableArrJl;
      }
      else if(this.configData.calculationType==2){ // js
           return this.variableArrJs;
      }
      else{
          return [];
      }
    }
  },
  created: function() {
    this.spcId = this.$route.params.spc_id;
    this.getSpcDetail();
   
    
    
    // this.getProcessView();
  },
  beforeDestroy:function(){
      if(this.fullLoading){
          this.fullLoading.close();
      }
  }
};
</script>

