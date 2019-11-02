<template>
<div>
    <el-row 
     v-show="!$store.getters.showFolderTask"
    style="border-bottom:1px solid #dcdfe6;padding:5px 20px;position:fixed;top:0;left:66px;right:0px;z-index:999;background:#fff">
            <el-col :span="10"  style="font-size:20px;">
                &nbsp;
                <el-button  
                   @click="$store.commit('SET_TASK',true)" 
                   type="text" ><i class="el-icon-menu el-icon--left">
                    </i>{{Form.spcTaskName}}<i class="el-icon-caret-bottom el-icon--right"></i>
                </el-button>
            </el-col>
            <el-col :span="14" class="text-right">
                <el-button size="mini" type="primary"   @click="back">
                    <svg-icon  icon-class="back" style="font-size:20px"></svg-icon>
                </el-button>
            </el-col>
    </el-row>
    <div class="app-container">
        <el-row class="vertical-tabs" >
            <el-col :xs="{span:20,offset:2}" :sm="{span:18,offset:3}"
                :md="{span:16,offset:4}" :lg="{span:16,offset:4}" :xl="{span:16,offset:4}"  style="position:relative" >
                   <el-button  style="position:absolute;left:20px;top:300px;z-index:99" type="primary" size="small" :loading="updateLoading"  @click="submit">保存</el-button>
                <el-tabs  type="border-card" tab-position="left" v-model="activeName" :style="{'min-height':$Height()-100+'px'}" style="margin-top:50px" >
                    <el-tab-pane label="基本信息" name="first">
                        <el-form  label-position="right"  label-width="120px"  ref="general" :model="Form"  :rules="rules"  class="Form m-t" size="mini">
                            <el-col :span="22">
                                <el-form-item  label="项目名称 :" prop="spcTaskName">
                                <el-input v-model="Form.spcTaskName"></el-input>
                                </el-form-item>
                                <el-form-item  label="项目描述 :">
                                <el-input v-model="Form.comment"></el-input>
                                </el-form-item>
                                <el-form-item label="定时设置 : "  prop="cron">
                                    <el-col :span="18">
                                        <el-input v-model="Form.cron"></el-input>
                                    </el-col>
                                    <el-col :span="3" :offset="1">
                                    <a :href="service+'cron'" target="_blank"  class="cron">在线生成cron </a>
                                    </el-col>
                                </el-form-item>
                                 <el-form-item  label="数据源 :" prop="configDataanalysisId">
                                        <el-select v-model="Form.configDataanalysisId" clearable  placeholder="请选择数据源"
                                        @change="getControlInfo"
                                        >
                                            <el-option
                                            v-for="ds in filterDsList"
                                                :key="ds.configDataanalysisId"
                                                :label="ds.configDataanalysisName"
                                                :value="ds.configDataanalysisId">
                                                <span style="float: left">{{ ds.configDataanalysisName }}</span>
                                                <span style="float: right; color: #999; font-size: 12px">{{ ['计量','计数','MSA'][ds.calculationType-1] }}</span>
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                <!-- <el-form-item  label="最近组数 :" prop="recentGroups" ref="recentGroups" >
                                    <el-input  v-model.number="Form.recentGroups"  :disabled="allRecentGroups"> 
                                        <el-checkbox v-model="allRecentGroups"  slot="append"  label="全部" @change="allGrouop" ></el-checkbox>
                                    </el-input>
                                </el-form-item>
                                
                                <el-form-item  label="小数位数 :" prop="decimalDigits">
                                <el-input v-model="Form.decimalDigits"></el-input>
                                </el-form-item>    -->
                               
                            </el-col>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="规格配置" name="fourth">
                                <el-col :span="22" class="m-t" style="margin-bottom:20px">
                                    <v-control-info
                                    :controlInfo="controlInfo"
                                    :show="false"
                                    :change="true"
                                    @change="control=$event"
                                    @Loading="controlLoading=$event"
                                    @changevalue="changeValue"
                                    :recentInfo="recentInfo"
                                    :hasParameterForSql="hasParameterForSql"
                                    :controlLoading="controlLoading"
                                    ></v-control-info>
                                    <el-form  label-position="right" label-width="140px"  ref="graph1"  :model="Form" :rules="rules"  class="Form m-t" size="mini">
                                        <el-row style="overflow:hidden;">
                                        <div>
                                            <el-col :span="24" class="setting">
                                            <!-- <p class="setTitle">计量型</p> -->
                                            
                                                <el-form-item  label="管制图形 :" prop="controlGraph">
                                                    <el-select v-model="Form.controlGraph" clearable  @change="filterRules" >
                                                    <el-option v-for="graph in graphTypes"
                                                        :label="graph.label"
                                                        :value="graph.value"
                                                        :key="graph.label+'_'+graph.value"
                                                        :disabled="!(graph.type==graphType)"
                                                        >
                                                        <span style="float: left">{{ graph.label }}</span>
                                                        <span  v-show="!(graph.type==graphType)" style="float: right; color: #999; font-size: 12px"><i class="el-icon-close"></i></span>
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item  :label="graphType==1?'规格上限':LABEL +':'" v-show="Form.controlGraph"   prop="usl">
                                                    <el-input  v-model.number="Form.usl" > </el-input>
                                                </el-form-item>
                                                <el-form-item  label="目标值 :" v-show="jljs=='jl'"  prop="targetValue">
                                                    <el-input  v-model.number="Form.targetValue" > </el-input>
                                                </el-form-item>
                                                <el-form-item  label="规格下限 :" v-show="jljs=='jl'" prop="lsl">
                                                <el-input  v-model.number="Form.lsl" > </el-input>
                                                </el-form-item>
                                                
                                                <el-form-item  label="子组容量 :" v-show="jljs=='jl'"  prop="groupNum">
                                                <el-input   v-model.number="Form.groupNum"  placeholder="请填写2-25的整数"> </el-input>
                                                </el-form-item>
                                                <el-form-item  label="移动距离 :" v-show="jljs=='jl' && Form.controlGraph==4"  
                                                prop="moveRange"
                                                >
                                                <el-input   v-model.number="Form.moveRange" 
                                                placeholder="只能填写 2 或 3"
                                                > </el-input>
                                                </el-form-item>
                                                <!-- <el-form-item  :label="LABEL +' :'"  v-show="jljs=='js'">
                                                <el-input     v-model.number="Form.usl"> </el-input>
                                                </el-form-item> -->
                                                
                                            </el-col>
                                        </div>
                                        </el-row>        
                                    </el-form>
                                </el-col>
                            
                    </el-tab-pane>
                    <el-tab-pane label="预警配置" name="second">
                        <el-form  label-position="right" label-width="120px"  ref="graph"  :model="Form" :rules="rules"  class="Form m-t" size="mini">
                          <el-row style="overflow:hidden;">
                              <div>
                                  <el-col :span="22" class="setting">
                                  <!-- <p class="setTitle">计量型</p> -->
                                   
                                    
                                    <!-- <el-form-item  :label="LABEL +' :'"  v-show="jljs=='js'">
                                    <el-input     v-model.number="Form.usl"> </el-input>
                                    </el-form-item> -->
                                    
                                  </el-col>
                              </div>
                            </el-row>        
                        </el-form>

                        <el-form  label-position="right" label-width="120px" size="mini" class="Form">
                            <el-row>
                                <el-col :span="22">
                                    <el-form-item label="过程能力 :">
                                            <el-col :span="24" v-for="(alert,index) in Form.alertProcess" :key="alert.value+'_'+index">
                                                <el-row>
                                                    <el-col :span="6">
                                                        <el-select v-model="alert.keyIndex" placeholder="请选择预警类型">
                                                            <el-option
                                                                    v-for="key in keyIndex"
                                                                    :label="key"
                                                                    :value="key"
                                                                    :key="key"
                                                            ></el-option>
                                                        </el-select>
                                                    </el-col>
                                                    <!-- <el-col :span="8">
                                                            <el-row>
                                                            <el-col :span="5" class="text-right" style="color:#999;font-size:12px;padding-right:5px;">连续</el-col>
                                                            <el-col :span="15">
                                                                    <el-select v-model.number="alert.times" placeholder="请选择次数">
                                                                        <el-option
                                                                                v-for="time in times"
                                                                                :label="time.label"
                                                                                :value="time.value"
                                                                                :key="time.label+'@'+time.value+'_'+index"
                                                                        ></el-option>
                                                                    </el-select>
                                                                </el-col>
                                                                <el-col :span="4" style="color:#999;font-size:12px;padding-left:5px">次</el-col>
                                                            </el-row>
                                                        
                                                        
                                                    </el-col> -->
                                                    <el-col :span="7" :offset="1">
                                                        <el-select v-model.number="alert.symbol" placeholder="请选择符号">
                                                            <el-option
                                                                    v-for="symbol in symbols"
                                                                    :label="symbol.label"
                                                                    :value="symbol.value"
                                                                    :key="symbol.label+'@'+symbol.value+'@'+index"
                                                            ></el-option>
                                                        </el-select>
                                                    </el-col>
                                                    <el-col :span="7" :offset="1" >
                                                        <el-input v-model.number="alert.keyValue"></el-input>
                                                    </el-col>
                                                    <el-col :span="2" class="text-right">

                                                    <el-button  v-show="!alert.spcTaskOnlineAlertProcessId"  size="mini" type="info"  plain class="el-icon-delete"  @click="delAlertProcess(index,'true')"></el-button>
                                                    <el-button  v-show="alert.spcTaskOnlineAlertProcessId"  size="mini" type="primary"  class="el-icon-delete"  @click="deleteProcess(alert,index)"></el-button>
                                                    </el-col>
                                                </el-row>
                                                
                                            </el-col>
                                        
                                            <el-col :span="24" class="text-right">
                                                    <el-button size="mini" type="primary"  class="el-icon-plus"  @click="delAlertProcess(0,'false')"></el-button>
                                            </el-col>
                                            
                                    </el-form-item>
                                    <el-form-item label="样本阈值 :">
                                        <el-col :span="24" v-for="(alert,index) in Form.alertThreshold" :key="'alertThreshold_'+index">
                                            <el-row>
                                                <el-col :span="5">
                                                    <el-select v-model.number="alert.warningType" placeholder="请选择预警类型">
                                                        <el-option
                                                               :value='1'  label="连续"
                                                        ></el-option>
                                                        <el-option
                                                               :value='2'  label="累计"
                                                        ></el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5" :offset="1">
                                                        <el-row>
                                                        
                                                        <el-col :span="20">
                                                            <el-input  v-model.number="alert.occurrences" placeholder="请填写发生次数"></el-input>
                                                               
                                                            </el-col>
                                                            <el-col :span="4" style="color:#999;font-size:12px;padding-left:5px">次</el-col>
                                                        </el-row>
                                                    
                                                    
                                                </el-col>
                                                <el-col :span="4" :offset="1">
                                                    <el-select v-model.number="alert.symbol" placeholder="请选择符号">
                                                        <el-option
                                                                v-for="symbol in symbols"
                                                                :label="symbol.label"
                                                                :value="symbol.value"
                                                                :key="symbol.label+'@'+symbol.value+'@'+index"
                                                        ></el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col :span="5" :offset="1" >
                                                    <el-input v-model.number="alert.threshold" placeholder="请填写阈值"></el-input>
                                                </el-col>
                                                <el-col :span="2" class="text-right">

                                                <el-button  v-show="!alert.spcTaskOnlineAlertThresholdId"  size="mini" type="info"  plain class="el-icon-delete"  @click="delAlertThreshold(index,'true')"></el-button>
                                                <el-button  v-show="alert.spcTaskOnlineAlertThresholdId"  size="mini" type="primary"  class="el-icon-delete"  @click="deleteThreshold(alert,index)"></el-button>
                                                </el-col>
                                            </el-row>
                                            
                                        </el-col>
                                    
                                                <el-col :span="24" class="text-right">
                                                        <el-button size="mini" type="primary"  class="el-icon-plus"  @click="delAlertThreshold(0,'false')"></el-button>
                                                </el-col>
                                        
                                    </el-form-item>
                                    <el-form-item label="SPC判异 :">
                                         <div  class="Table SPC_Table" style="position:relative">
                                            
                                            <el-table 
                                                ref='multipleTable'
                                                :data="filterRuleList"
                                                tooltip-effect="dark"
                                                style="width: 100%;overflow:hidden"
                                                border
                                                size="mini"
                                                row-key="ruleNumber"
                                                @select="selectRules"
                                                @select-all="selectAllRules"
                                                empty-text="请先选择管制图形"
                                            >
                                                <el-table-column
                                                type="selection"
                                                :reserve-selection="true"
                                                align="center"
                                                width="30px">
                                                </el-table-column>
                                                <el-table-column
                                                label="编号"
                                                prop="ruleNumber"
                                                align="center"
                                                width="50px">
                                                </el-table-column>
                                                <el-table-column
                                                label="现行规则"
                                                min-width="10px"
                                                show-overflow-tooltip
                                                >
                                                <template slot-scope="scope">
                                                    {{scope.row.content.replace('n',scope.row.n).replace('m',scope.row.m)}}
                                                </template>
                                                </el-table-column>
                                                <el-table-column
                                                prop="content"
                                                label="规则依据"
                                                min-width="10px"
                                                show-overflow-tooltip>
                                                </el-table-column>
                                                <el-table-column
                                                
                                                label="操作"
                                                width="150px"
                                                align="center"
                                                show-overflow-tooltip>
                                                <template slot-scope="scope">
                                                        <el-button size="mini"  :type="judgeSelect.indexOf(scope.row.ruleNumber)==-1?'info':'primary'" :disabled="judgeSelect.indexOf(scope.row.ruleNumber)==-1"  @click="rowDbclick(scope)" >编辑</el-button>
                                                        <el-button size="mini"  :type="ruleNumber==scope.row.ruleNumber?'success':'info'"  plain
                                                            @click="chartDes(scope.row)"
                                                            ><svg-icon icon-class="line-chart"></svg-icon>
                                                        </el-button>
                                                </template>
                                                </el-table-column>
                                            </el-table>
                                             <div style="z-index:10;position:absolute;width:25px;height:25px;
                                                top:10px;left:4px;text-align:center
                                                line-height:25px;
                                                background:rgb(245,246,250);
                                                ">
                                                    #
                                                </div>
                                        </div>   

                                    </el-form-item>
                                    <el-form-item>
                                         <v-ruleline v-if="activeName=='second'"
                                         :ruleNumber="ruleNumber"
                                         :content="content"
                                         :n="n"
                                         :m="m"
                                         >
                                         </v-ruleline>
                                    </el-form-item>
                                    
                                </el-col>
                            </el-row>
                        </el-form>

                    </el-tab-pane>
                 
                    
                    <!-- <el-tab-pane label="预警规则" name="third">
                        <el-form  label-position="right" label-width="120px"  ref="graph"  :model="Form" :rules="rules"  class="Form m-t" size="mini">
                            <el-form-item label="预警规则 :">
                                <el-col :span="22" v-for="(alert,index) in Form.alertProcess" :key="alert.value+'_'+index">
                                    <el-row>
                                        <el-col :span="4">
                                            <el-select v-model.number="alert.keyIndex" placeholder="请选择预警类型">
                                                <el-option
                                                        v-for="key in keyIndex"
                                                        :label="key.label"
                                                        :value="key.value"
                                                        :key="key.label+'_'+index+'_'+key.value"
                                                ></el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="8">
                                                <el-row>
                                                <el-col :span="5" class="text-right" style="color:#999;font-size:12px;padding-right:5px;">连续</el-col>
                                                <el-col :span="15">
                                                        <el-select v-model.number="alert.times" placeholder="请选择次数">
                                                            <el-option
                                                                    v-for="time in times"
                                                                    :label="time.label"
                                                                    :value="time.value"
                                                                    :key="time.label+'@'+time.value+'_'+index"
                                                            ></el-option>
                                                        </el-select>
                                                    </el-col>
                                                    <el-col :span="4" style="color:#999;font-size:12px;padding-left:5px">次</el-col>
                                                </el-row>
                                            
                                            
                                        </el-col>
                                        <el-col :span="4">
                                            <el-select v-model.number="alert.symbol" placeholder="请选择符号">
                                                <el-option
                                                        v-for="symbol in symbols"
                                                        :label="symbol.label"
                                                        :value="symbol.value"
                                                        :key="symbol.label+'@'+symbol.value+'@'+index"
                                                ></el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="5" :offset="1" >
                                            <el-input v-model.number="alert.keyValue"></el-input>
                                        </el-col>
                                        <el-col :span="2" class="text-right">

                                           <el-button  v-show="!alert.spcTaskOnlineAlertProcessId"  size="mini" type="info"  plain class="el-icon-delete"  @click="delAlertProcess(index,'true')"></el-button>
                                           <el-button  v-show="alert.spcTaskOnlineAlertProcessId"  size="mini" type="primary"  class="el-icon-delete"  @click="deleteProcess(alert,index)"></el-button>
                                        </el-col>
                                    </el-row>
                                    
                                </el-col>
                               
                                        <el-col :span="22" class="text-right">
                                                <el-button size="mini" type="primary"  class="el-icon-plus"  @click="delAlertProcess(0,'false')"></el-button>
                                        </el-col>
                                   
                            </el-form-item>
                             <el-form-item label="判异规则 :">
                                <el-col :span="22" style="margin-top:10px">
                                <div class="Table SPC_Table levle_factor">
                                    <el-table 
                                        :data="filterRuleList"
                                        tooltip-effect="dark"
                                        style="width: 100%;"
                                        border
                                        size="mini"
                                    >
                                        <el-table-column
                                            label="编号"
                                            prop="ruleNumber"
                                            align="center"
                                            width="50px">
                                        </el-table-column>
                                        <el-table-column
                                           
                                            label="现行规则"
                                            show-overflow-tooltip
                                        >
                                         <template slot-scope="scope">
                                                    {{scope.row.content.replace('n',scope.row.n).replace('m',scope.row.m)}}
                                                </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="次数"
                                            width="150"
                                            prop="times"
                                        >
                                        <template slot-scope="scope">
                                            <el-input placeholder="请填写次数"  v-model.number="scope.row.times"></el-input>
                                        </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                                </el-col>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane> -->
                    

                  
                </el-tabs>
            </el-col>
            
        </el-row>
         
    </div>
    <el-dialog
            :close-on-click-modal='false'
            :visible.sync="showChangePy"
            :show-close='false'
            class="dialog setting-form"
            width="300px"
            >
            <el-form label-position="right" label-width="40px"  class="Form" size="mini">
                <el-form-item v-for="(val, k, index) in selectedPy"
                v-if="k!=='ruleNumber'" :key="index+'_'+ graphType +'_'"  :label="'['+ k +'] =' ">
                      <el-input v-model="selectedPy[k]"></el-input>
                </el-form-item>
            </el-form>
            <div style="border-top:1px solid #ebeef5;margin-top:20px;text-align:center;padding-top:20px;margin-bottom:-10px">
                <span slot="footer" class="dialog-footer" >
                    <el-button type="primary"  size="mini" @click="changePy" :loading="ruleLoading">修改</el-button>
                    <el-button size="mini"  @click="cancelChangePy">取消</el-button>
                </span>
            </div>
    </el-dialog>
    <v-folder v-show="$store.getters.showFolderTask"></v-folder>
</div>
   

</template>
<script>

import folderTask from '@/views/home/folderList'
import { dsList,dsControlUpdate } from "@/api/dataSource";
import { spcCreate, spcDetail , spcUpdate, spcRulesList, spcRuleUpdate, 
  controlInfo} from "@/api/spc/config"  
import { processAdd, processUpdate,processDelete,processList,
         abnormalAdd,abnormalUpdate,abnormalDelete,abnormalList,
         thresholdAdd,thresholdUpdate,thresholdDelete,thresholdList,
         onlineUpdate, onlineDetail
} from "@/api/warning"   
import ControlInfo from './com/controlInfo'
import RuleLine from "@/views/spc/com/ruleLine"
const publicPath = require('../../../config/prod.env.js').publicPath
console.log(publicPath)
export default {
    components:{
       'v-folder':folderTask,
       'v-ruleline':RuleLine,
       'v-control-info':ControlInfo
    },
    data(){
       
        return {
            service:process.env.NODE_ENV=='development'?"localhost:80/":publicPath,
            ruleNumber:'',
            content:'',
            n:'',
            m:'',
            activeName:'first',
            ruleLoading:false,
            updateLoading:false,
            updatePyLoading:false,
            showChangePy:false,
            selectedPy: {}, //{rule_num:'',n:'',m:'',k:''}
            changePyForm: {
                n: "",
                m: "",
                k: ""
            },
            selectedPyIndex: "",
            spcTaskId:'',
            allRecentGroups:false,
            graphType:'', // 1:：计量   2：计数
            graphTypes:[
                { label: "X-R", value:1,type:1 },
                { label: "X-S", value:2,type:1 },
                { label: "me-R", value:3,type:1 },
                { label: "X-MR", value:4,type:1 },
                { label: "P", value:5,type:2 },
                { label: "np", value:6,type:2 },
                { label: "c", value:7,type:2 },
                { label: "u", value:8,type:2 }
            ],
            Form:{
                 spcTaskId:'',
                 configDataanalysisId:'',
                 spcTaskName:'',
                 controlGraph:'',// 1 jl   2 js
                 decimalDigits:'',
                 recentGroups:'',
                 usl:'',
                 lsl:'',
                 targetValue:'',
                 groupNum:'',
                 moveRange:'',
                 comment:'',
                 alertProcess:[
                    //  {
                    //     keyIndex:'',
                    //     keyValue:'',
                    //     symbol:'',
                    //     times:''废弃
                    //  }
                 ],
                 alertThreshold:[
                    //  {
                    //     warningType:'',
                    //     occurrences:'',
                    //     symbol:'',
                    //     threshold:''
                    //  }
                 ],
                 cron:''
            },
            rules:{ 
                spcTaskName:[
                    { required: true, message: '请填写项目名称',trigger: 'change,blur'}
                ],
                controlGraph:[
                    { required: true, message: '请选择管制图形',trigger: 'change,blur'}
                ],
                cron: [
                    {
                    required: true,
                    message: '请填写定时设置',
                    trigger: 'change,blur'
                    }
                ],
                // decimalDigits:[
                //      {required: true,message: '请填写小数位数',trigger: 'change,blur'},
                //      { validator:this.decimalDigitslValidator,trigger: 'change,blur'}
                // ], 
                // recentGroups:[
                //     // { validator:recentGroups, trigger: 'change,blur'}
                //     {required: true, message: '请填写最近组数', trigger: 'change,blur'},
                //     { type:'number',min:1,message: '最近组数必须为>0的整数',trigger: 'change,blur'},
                //     { validator:this.recentGroupslValidator,trigger: 'change,blur'}
                // ],
                configDataanalysisId:[
                    { required: true, message: '请选择数据源',trigger: 'change'}
                ],
                usl:[
                    {validator:this.uslValidator,trigger: 'change,blur'}
                ],
                lsl:[
                    {validator:this.lslValidator,trigger: 'change,blur'}
                ],
                targetValue:[
                    {validator:this.targetValidator,trigger: 'change,blur'}
                ],
                moveRange:[
                   { required: true, message: '请填写移动距离',trigger: 'change,blur'},
                   { type:'number',min:2,max:3,message: '移动距离必须为数字2或3',trigger: 'change,blur'}

                ],
                groupNum:[
                    { required: true, message: '请填写子组容量',trigger: 'change,blur'},
                    { type: 'number', min:2 ,max:25,message: '子组容量必须为数字',trigger: 'change,blur'}
                ],
                // ausl:[
                //     { required: true, message: '请选择子组容量',trigger: 'change,blur'}
                // ]
            },
            dsList:[],
            pyNum: [//  计量 X
                {
                ruleNumber: 1,
                n: "1",
                },
                {
                ruleNumber: 2,
                n: "9"
                },
                {
                ruleNumber: 3,
                n: "6"
                },
                {
                ruleNumber: 4,
                n: "14"
                },
                {
                ruleNumber: 5,
                n: "3",
                m: "2"
                },
                {
                ruleNumber: 6,
                n: "5",
                m: "4"
                },
                {
                ruleNumber: 7,
                n: "15"
                },
                {
                ruleNumber: 8,
                n: "8"
                }
            ],
            multipleSelection:[],
            ruleList:[],
            filterRuleList:[],
            LOADING: {
                lock: true,
                text: "数据处理中...",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.6)"
            },
            fullLoading: null,
            times: [{
                label: '1',
                value: 1
                },
                {
                label: '2',
                value: 2
                },
                {
                label: '3',
                value: 3
                },
                {
                label: '4',
                value: 4
                },
                {
                label: '5',
                value: 5
                },
                {
                label: '6',
                value: 6
                }
            ],
            symbols: [{
                label: '>',
                value: 1
                },
                {
                label: '>=',
                value: 2
                },
                {
                label: '<',
                value: 3
                },
                {
                label: '<=',
                value: 4
                }
            ],
            controlInfo:{},
            control:{
                 analysisParms:{}
            } ,  //  control 的所有数据
            online:{
                spcTaskOnlineId:'',
                cron:''

            } , // cron
            spcTaskOnlineId:'',
            parameterValueApply:{
                analysisParms:{}
            },
            recentInfo:{digit:''},
            jl:["ca","cp","pp","avg","cpk","cpm","ppk","ppm","cpmk","ppmk","sigma",
               "sigmaLong","sigmaShort","dpmoLong","dpmoShort","stdDevLong",
               "stdDevShort","zBenchShort","zBenchLong","averageFirst","averageSecond"],
            js:["dpmo","zBench","sigmaLevel","percentDefective"],
            hasParameterForSql:{},
            controlLoading:true
           
        }
    },
    methods:{
        changeValue:function(info){  // {key:"",data}
            let data=info.data.split(";").slice(0,-1);
            this.controlInfo[info.key].parameterValueArr=data;
        },
        getDsList:function(){
            dsList().then(res=>{
                console.log(res);
                if(res.code==200){
                    this.dsList=res.data.list;
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        selectRules: function(selection, row) {
            console.log(selection);
            console.log(row);
            //let self = this;
            //self.multipleSelection = selection;
            let data=Object.assign({},this.filterRuleList[row.ruleNumber-1]);
            data.enable=-(data.enable);
            //this.filterRuleList[row.ruleNumber-1].enable=-(this.filterRuleList[row.ruleNumber-1].enable)
            this.fullLoading=this.$loading(this.LOADING);
            spcRuleUpdate(data).then(res=>{
                this.fullLoading.close();
                if(res.code==200){
                    this.filterRuleList[row.ruleNumber-1].enable=-(this.filterRuleList[row.ruleNumber-1].enable)
                }
            });
        },
        selectAllRules: function(selection) {
            console.log('selectAllRules-----------------------');
            console.log(selection);
            let arr=[];
            if(selection.length>0){ // 全选
                this.filterRuleList.forEach(rule=>{
                let rule1=Object.assign({},rule);
                  rule1.enable=Math.abs(rule1.enable);
                  arr.push(rule1);
                });
            }
            else if(selection.length==0){  // 全不选
                this.filterRuleList.forEach(rule=>{
                let rule1=Object.assign({},rule);
                  rule1.enable=-(Math.abs(rule1.enable));
                  arr.push(rule1);
                });
            }
             console.log(arr);
            let request=[];
            arr.forEach(data=>{
                request.push(spcRuleUpdate(data));
            });
            /*
            this.fullLoading=this.$loading(this.LOADING);
            Promise.all(request).then(resArr=>{
                this.fullLoading.close();
                resArr.forEach((res,index)=>{
                    if(res.code==200){
                      this.filterRuleList.splice(index,1,arr[index]);
                    }
                });
                //
               if(this.filterRuleList.length>0){
                 this.filterRuleList.forEach(row => {
                    if(row.enable==1){
                        this.$refs.multipleTable.toggleRowSelection(row, true);
                    }
                    
                });
            }

            });
            */
        //    this.filterRuleList.forEach(rule=>{
        //         rule.enable=-(rule.enable);
        //    });
        
        },
        rowDbclick: function(scope) {//编辑
            console.log(scope)
            this.showChangePy = true;
            let rule=this.pyNum[scope.$index];
            for(let k in rule){
                if(k!='ruleNumber'){
                    rule[k]=scope.row[k]
                }
            }
            //rule.spcTaskId=scope.row.spcTaskId;
            //rule.enable=scope.row.enable;
            this.selectedPy = Object.assign({},rule);
            this.selectedPyIndex = scope.$index;    
        },
        cancelChangePy: function() {
            this.showChangePy = false;
        },
        changePy: function() {
            let selectRule=this.filterRuleList[this.selectedPyIndex];
            let data=Object.assign({},selectRule,this.selectedPy);
           
           
            this.fullLoading=this.$loading(this.LOADING);
            spcRuleUpdate(data).then(res=>{
                 this.fullLoading.close();
                 if(res.code==200){
                    this.showChangePy=false;
                    this.filterRuleList.splice(this.selectedPyIndex,1,data);
                    this.$message.success(res.message);
                    console.log(data);
                    //修改属性
                    this.n=data.n;
                    this.m=data.m;
                    this.content=data.content.replace('n',data.n).replace('m',data.m);  
                    this.ruleNumber=data.ruleNumber;
                 }
                 else{
                    this.$message.error(res.message);
                 }
            });
          
        },
        setGraphType:function(dsId){
            this.Form.controlGraph='';
            let selectedDs;
            this.$refs.graph.clearValidate();
            this.$refs.graph1.clearValidate();
            if(dsId){
                selectedDs=this.dsList.filter(item=>item.configDataanalysisId==dsId);
                //console.log(selectedDs);
                this.graphType=selectedDs[0].calculationType;
                // if([1,2,3,4].indexOf(selectedDs[0].calculationType)>=0){
                //     this.graphType = 1; // 计量
                // }
                // else{
                //     this.graphType = 2; //计数
                // }
            }
        },
        submit:function(){
           
           
            //this.Form.decimalDigits=2;
            this.$refs.general.validate(res=>{
                if(res){

                     this.$refs.graph.validate(res=>{
                        if(res){
                             this.$refs.graph1.validate(res1=>{
                                 if(res1){
                                      if(this.graphType==1){
                                                if(!(this.Form.usl || this.Form.lsl)){
                                                this.$message.warning('规格上限和规格下线必须填写一个');
                                                return false;
                                                }
                                            }
                                            //预警规则 和阈值 必须填写完整
                                            if(this.Form.alertProcess.length>0){
                                                let flag=false;
                                                for(let i=0;i<this.Form.alertProcess.length;i++){
                                                    let keyIndex=this.Form.alertProcess[i].keyIndex,
                                                    keyValue=this.Form.alertProcess[i].keyValue,
                                                    symbol=this.Form.alertProcess[i].symbol;
                                                
                                                    if(keyIndex=="" || keyValue=="" || symbol==""){
                                                        flag=true;
                                                        break;
                                                    }
                                
                                                }
                                                if(flag){
                                                this.$message.error("预警规则信息必须填写完整");
                                                return ;
                                                }
                                            }
                                            // 阈值
                                            if(this.Form.alertThreshold.length>0){
                                                let flag=false;
                                                for(let i=0;i<this.Form.alertThreshold.length;i++){
                                                    let warningType=this.Form.alertThreshold[i].warningType,
                                                    occurrences=this.Form.alertThreshold[i].occurrences,
                                                    symbol=this.Form.alertThreshold[i].symbol,
                                                    threshold=this.Form.alertThreshold[i].threshold ;
                                                
                                                    if(warningType=="" || occurrences=="" || symbol=="" || threshold==""){
                                                        flag=true;
                                                        break;
                                                    }
                                
                                                }
                                                if(flag){
                                                this.$message.error("阈值信息必须填写完整");
                                                return ;
                                                }
                                            }
                                            //
                                            this.updateLoading=true;
                                            spcUpdate(this.Form).then(res=>{
                                                    console.log(res);
                                                        this.updateLoading=false;
                                                    if(res.code==200){
                                                        this.$message.success(res.message);
                                                    }
                                                    else{
                                                        this.$message.error(res.message);
                                                    }
                                            });
                                            //this.updateControlInfo(); //控制信息
                                            this.updateOnline(); // cron
                                            this.createProcess();
                                            this.updateProcess();
                                            // this.createAbnormal();
                                            // this.updateAbnormal();
                                            this.createThreshold();
                                            this.updateThreshold();
                                 }
                                 else{
                                    this.$message.warning("请检查条件配置参数填写是否完整");
                                 }
                             })
                           
                        }
                        else{
                            this.$message.warning("请检查预警配置填写是否完整");
                        }
                     });
                }
                else{
                    this.$message.warning("请检查基本信息填写是否完整");
                }
            })
            
        },
        recentGroupslValidator:function(rule,value,callback){
            if(value){
                let reg=/^[1-9]+[0-9]*$/;
                console.log(reg.test(0));
                if(reg.test(value)){
                      callback();
                }
                else{
                    callback(new Error('最近组数只能是>0的整数'));
                }
            }
            else{
              callback();
            }
        },
        decimalDigitslValidator:function(rule,value,callback){
            if(value){
                let reg=/^[0-6]$/;
                if(reg.test(value)){
                      callback();
                }
                else{
                    callback(new Error('小数位数只能0-6的整数'));
                }
            }
            else{
              callback();
            }
        },
        uslValidator:function(rule,value,callback){
            if(value){
              let reg=/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/;
                console.log('usl');
                  console.log(reg.test(value));
                if(reg.test(value) && typeof value=='number' &&  value>0){
                      if(this.Form.lsl && value <= this.Form.lsl){
                            callback(new Error('规格上限必须大于规格下限'));
                      }
                      else  if(this.Form.targetValue && value <= this.Form.targetValue){
                            callback(new Error('规格上限必须大于目标值'));
                        }
                        else{
                          callback();
                        }
                      
                }
                else{
                    callback(new Error('规格上限只能是>0的数字'));
                }
            }
            else{
              callback();
            }
        },
        lslValidator:function(rule,value,callback){
                if(value){
                let reg=/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/;
                    console.log('usl');
                    if(reg.test(value) && value>0){
                        if(this.Form.usl && value >= this.Form.usl){
                                callback(new Error('规格下限必须小于规格上限'));
                            }
                        else if(this.Form.targetValue && value >= this.Form.targetValue){
                                callback(new Error('规格下限必须小于目标值'));
                        }
                        else{
                            callback();
                        }
                        
                    }
                    else{
                        callback(new Error('规格下限只能是>0的数字'));
                    }
                }
                else{
                callback();
                }
            },
        targetValidator:function(rule,value,callback){
            if(value){
              let reg=/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/;
                if(reg.test(value) && value>0){
                      if(this.Form.usl && value >= this.Form.usl){
                            callback(new Error('目标值必须小于规格上限'));
                      }
                      else if(this.Form.lsl && value <= this.Form.lsl){
                          callback(new Error('目标值必须大于规格下限'));
                      }
                      else {
                          callback();
                      }
                      
                }
                else{
                    callback(new Error('目标值只能是>0的数字'));
                }
            }
            else{
              callback();
            }
        },
        getSpctaskDetail:function(){
            spcDetail({spcTaskId:this.spcTaskId}).then(res=>{
                console.log(res);
                if(res.code==200){

                   this.getProcessList(res.data.spcTaskOnline.spcTaskOnlineId);
                   this.getThresholdList(res.data.spcTaskOnline.spcTaskOnlineId); 
                   if(res.data.controlGraph){
                        if(res.data.controlGraph>0 && res.data.controlGraph<5){
                            this.graphType=1 // 计量
                        }
                        else if(res.data.controlGraph>4 && res.data.controlGraph<9){
                             this.graphType=2 // 计数
                        }
                   }
                    this.Form=Object.assign({},this.Form,res.data);
                    this.$refs.general.clearValidate();
                    this.getRuleList();   // 判异规则
                    this.getOnlineDetail();  // spcTaskOnline
                }
                else{
                    this.$message.error(res.message);
                }

            })
        },
        getRuleList:function(){
            spcRulesList({spcTaskId:this.spcTaskId}).then(res=>{
                if(res.code==200){
                    this.ruleList=res.data;
                    this.ruleList.forEach(rule=>{
                        rule.times="";
                        rule.spcTaskOnlineAlertAbnormalId='';
                    });
                   this.filterRules(Number(this.Form.controlGraph));
                   // 获取 预警判异配置
                   //this.getAbnormalList(this.Form.spcTaskOnline.spcTaskOnlineId);
                }
                else {
                   this.$message.error(res.message);
                }
            });
        },
        filterRules:function(controlGraph){

            if ([5, 6, 7, 8].indexOf(controlGraph, 0) >= 0) {
                this.filterRuleList=this.ruleList.slice(0,4);
               
               
               // return self.ruleList.slice(0,4);
            }
            else if ([1, 2, 3, 4].indexOf(controlGraph, 0) >= 0) {
                this.filterRuleList= this.ruleList.slice();
            }
         
            if(this.filterRuleList.length>0){
               this.filterRuleList.forEach(row => {
                    if(row.enable==1){
                        this.$refs.multipleTable.toggleRowSelection(row, true);
                    }
                    
                });
            }
          
        },
        back:function(){
            this.$router.push("/spc/warning/"+ this.spcTaskId+"_"+this.spcTaskOnlineId);
        },
        allGrouop:function(){
            if(this.allRecentGroups){
                this.Form.recentGroups=100000;
            }
            else{
                if( this.Form.recentGroups==100000){
                   this.Form.recentGroups=1;
                }
                 
            }
        },
        chartDes:function(info){
          
            this.n=info.n;
            this.m=info.m;
            this.content=info.content.replace('n',info.n).replace('m',info.m);  
            this.ruleNumber=info.ruleNumber;
        },
        delAlertProcess:function(index,bool){//删除没有创建的制程规则
             if(bool=='false'){//add
                 this.Form.alertProcess.push( {
                        keyIndex:'',
                        keyValue:'',
                        symbol:'',
                        times:''
                     });

             }else{//delete
            
                this.Form.alertProcess.splice(index,1);
            
                
            }
        },
        delAlertThreshold:function(index,bool){//删除没有创建的阈值
             if(bool=='false'){//add
                 this.Form.alertThreshold.push( {
                      
                        warningType:'',
                        occurrences:'',
                        symbol:'',
                        threshold:''
                     
                     });

             }else{//delete
            
                this.Form.alertThreshold.splice(index,1);
            
                
            }
        },
        deleteProcess:function(process,index){// 从数据库删除制程预警规则
            this.$confirm('确定删除制程预警规则'+'?', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
            }).then(()=>{
                this.fullLoading=this.$loading(this.LOADING);
                processDelete({spcTaskOnlineAlertProcessId:process.spcTaskOnlineAlertProcessId}).then(res=>{
                    this.fullLoading.close();
                    if(res.code==200){
                         this.Form.alertProcess.splice(index,1);
                         this.$message.success(res.message);
                    }
                    else{
                         this.$message.error(res.message);
                    }
                });

             }).catch(()=>{})
             
        },
        deleteThreshold:function(threshold,index){// 从数据库删除制程预警阈值
            this.$confirm('确定删除制程预警阈值'+'?', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
            }).then(()=>{
                 this.fullLoading=this.$loading(this.LOADING);
                thresholdDelete({spcTaskOnlineAlertThresholdId:threshold.spcTaskOnlineAlertThresholdId}).then(res=>{
                    this.fullLoading.close();
                    if(res.code==200){
                       this.Form.alertThreshold.splice(index,1);
                       this.$message.success(res.message);
                    }
                    else{
                        this.$message.error(res.message);
                    }
                });
             }).catch(()=>{})
             
        },
        createProcess:function(){ // 批量创建制程预警规则
            let process=this.Form.alertProcess.filter(process=>{
                if(!process.spcTaskOnlineAlertProcessId){
                    process.spcTaskOnlineId=this.Form.spcTaskOnline.spcTaskOnlineId;
                    return process;
                }
            });
            if(process.length>0){
                processAdd(process).then(res=>{
                    if(res.code==200){
                        //刷新process 列表
                        this.getProcessList(this.Form.spcTaskOnline.spcTaskOnlineId);
                       // this.$message.success(res.message);
                    }
                    else{
                        this.$message.error(res.message);
                    }
                });
            }
           
        },
        updateProcess:function(){  //
            let process=this.Form.alertProcess.filter(process=>{
                if(process.spcTaskOnlineAlertProcessId){
                    return process;
                }
            });
            if(process.length>0){
                processUpdate(process).then(res=>{
                    if(res.code==200){
                        this.getProcessList(this.Form.spcTaskOnline.spcTaskOnlineId);
                        //this.$message.success(res.message);
                    }
                    else{
                        this.$message.error(res.message);
                    }
                });
            }
        },
        createThreshold:function(){
            let threshold=this.Form.alertThreshold.filter(threshold=>{
                if(!threshold.spcTaskOnlineAlertThresholdId){
                    threshold.spcTaskOnlineId=this.Form.spcTaskOnline.spcTaskOnlineId;
                    return threshold;
                }
            });
            if(threshold.length>0){
                thresholdAdd(threshold).then(res=>{
                    if(res.code==200){
                        //刷新process 列表
                        this.getThresholdList(this.Form.spcTaskOnline.spcTaskOnlineId);
                       // this.$message.success(res.message);
                    }
                    else{
                        this.$message.error(res.message);
                    }
                });
            }
        },
        updateThreshold:function(){
             let threshold=this.Form.alertThreshold.filter(threshold=>{
                if(threshold.spcTaskOnlineAlertThresholdId){
                    threshold.spcTaskOnlineId=this.Form.spcTaskOnline.spcTaskOnlineId;
                    return threshold;
                }
            });
            if(threshold.length>0){
                thresholdUpdate(threshold).then(res=>{
                    if(res.code==200){
                        //刷新process 列表
                        this.getThresholdList(this.Form.spcTaskOnline.spcTaskOnlineId);
                       // this.$message.success(res.message);
                    }
                    else{
                        this.$message.error(res.message);
                    }
                });
            }
        },
        getProcessList:function(spcTaskOnlineId){
            processList({spcTaskOnlineId:spcTaskOnlineId}).then(res=>{
                if(res.code==200){
                      if(res.data.length>0){
                          this.Form.alertProcess=res.data;
                          
                      }
                      else{
                        //    this.Form.alertProcess.push(
                        //         {
                        //             keyIndex:'',
                        //             keyValue:'',
                        //             symbol:'',
                        //             times:''
                        //         }
                        //    );
                      }
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        getAbnormalList:function(spcTaskOnlineId){
            abnormalList({spcTaskOnlineId:spcTaskOnlineId}).then(res=>{
                if(res.code==200){
                    if(res.data.length>0){
                        res.data.forEach(item=>{
                            this.ruleList[item.rulesNum-1].times=item.times;
                            this.ruleList[item.rulesNum-1].spcTaskOnlineAlertAbnormalId=item.spcTaskOnlineAlertAbnormalId;
                        });
                    }
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        getThresholdList:function(spcTaskOnlineId){
            thresholdList({spcTaskOnlineId:spcTaskOnlineId}).then(res=>{
                if(res.code==200){
                    if(res.data.length>0){
                        this.Form.alertThreshold=res.data;
                    }
                    else{
                        // this.Form.alertThreshold.push({
                        //     warningType:'',
                        //     occurrences:'',
                        //     symbol:'',
                        //     threshold:''
                        // });
                    }
                }
                else{
                    this.$message.error(res.message);
                }

            });
        },
        createAbnormal:function(){
            let abnormal=this.ruleList.filter(rule=>{
                  if(!rule.spcTaskOnlineAlertAbnormalId &&  rule.times>0){
                      rule.rulesNum=rule.ruleNumber;
                      rule.spcTaskOnlineId=this.Form.spcTaskOnline.spcTaskOnlineId;
                      return rule;

                  }
            });
            if(abnormal.length>0){
                 abnormalAdd(abnormal).then(res=>{
                    if(res.code==200){
                        //重新获取列表
                        this.getAbnormalList(this.Form.spcTaskOnline.spcTaskOnlineId);
                        //this.$message.success(res.message);
                    }
                    else{
                       this.$message.error(res.message);
                    }
                 });
            }
        },
        updateAbnormal:function(){
            let abnormal=this.ruleList.filter(rule=>{
                  if(rule.spcTaskOnlineAlertAbnormalId){
                      rule.rulesNum=rule.ruleNumber;
                      rule.spcTaskOnlineId=this.Form.spcTaskOnline.spcTaskOnlineId;
                      return rule;

                  }
            });
            if(abnormal.length>0){
                 abnormalUpdate(abnormal).then(res=>{
                    if(res.code==200){
                        //重新获取列表
                        this.getAbnormalList(this.Form.spcTaskOnline.spcTaskOnlineId);
                        //this.$message.success(res.message);
                    }
                    else{
                       this.$message.error(res.message);
                    }
                 });
            }
        },
        getOnlineDetail:function(){
            onlineDetail({spcTaskId:this.spcTaskId,spcTaskOnlineId:''}).then(res=>{
                if(res.code==200){
                 console.log('onlineDetail');
                   console.log(res);
                   this.online=res.data[0];
                   if(this.online.parameterValueApply){
                       this.parameterValueApply=JSON.parse(this.online.parameterValueApply);
                       if(this.parameterValueApply.digit){
                         this.recentInfo.digit=this.parameterValueApply.digit;   
                       }
                   }

                  
                   this.Form.cron=res.data[0].cron;
                   this.getControlInfo(); // 控制信息
                }
                else{
                     this.$message.error(res.message);
                }
            });
        },
        updateOnline:function(){
           
            onlineUpdate(Object.assign({},
            this.online,
            {cron:this.Form.cron},
            {parameterValueApply:JSON.stringify(this.control)})).then(res=>{
                    if(res.code!=200){
                        this.$message.error(res.message);
                    }
                });
        },
        getControlInfo: function () {
            if(this.Form.configDataanalysisId){
                controlInfo({ configDataanalysisId: this.Form.configDataanalysisId }).then(res => {
                   if (res.code == 200) {
                    this.controlLoading=false;
                    console.log('getControlInfo-----------------');
                    //解析附加信息
                    let info = {};
                    if (res.data.length > 0) {
                        res.data.forEach(item => {
                        // 类型判断
                        if (item.parameterValueType == 1 || item.parameterValueType == 4) { // 选择类型
                            if (item.parameterValue) {
                                if (item.parameterValueType == 4 && item.parameterValue.indexOf('@') >= 0) {
                                    // sql 中有变量
                                    let reg = /@.+?\s+/g;
                                    let res = item.parameterValue.match(reg); // [@a,@b]
                                
                                    this.hasParameterForSql[item.sectionValue]={
                                    source: res.map(item => item.trim()),
                                    target: item
                                    }
                                    //
                                    item.sql = item.parameterValue
                                    item.parameterValue = ''
                                    item.parameterValueArr = []

                                } else {

                                    item.parameterValueArr = item.parameterValue.split(";");
                                    if (item.parameterValueType == 4) {
                                        if (item.parameterValueArr.length > 0) {
                                        item.parameterValueArr.pop();
                                        }
                                    }
                                }
                                  
                            // 已经提交的值
                            if(this.parameterValueApply.analysisParms[item.parameter]){
                              item.parameterValue = this.parameterValueApply.analysisParms[item.parameter];  
                            }
                            else{
                               item.parameterValue=""; 
                            }
                            
                            } else {
                            // item.parameterValueArr=[];
                            }

                        }

                        if (!item.sectionStart && !item.sectionOff) { // a=@a
                            info[item.sectionValue] = item;
                            // comment
                            // if(item.comment){
                            //   info[item.comment]=item;
                            // }
                            // else{
                            //   info[item.sectionValue]=item;
                            // }

                        } else {
                            if (!info[item.sectionValue]) {
                            info[item.sectionValue] = {
                                start: {},
                                off: {}
                            }
                            if (item.sectionStart) {
                                info[item.sectionValue].start = Object.assign({}, item);
                            }
                            if (item.sectionOff) {
                                info[item.sectionValue].off = Object.assign({}, item);
                            }
                            } else {

                            if (item.sectionStart) {

                                info[item.sectionValue].start = Object.assign({}, item);
                            }
                            if (item.sectionOff) {

                                info[item.sectionValue].off = Object.assign({}, item);
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
        updateControlInfo:function(){
            if(this.control.length>0){
                this.control.forEach(item=>{
                    if( item.parameterValueArr 
                        && item.parameterValueArr instanceof Array 
                        && item.parameterValueArr.length>0){
                        item.parameterValue=item.parameterValueArr.join(";")
                    }
                    // delete item.parameterValueArr;
                });
            }
            console.log(this.control);
            if(this.control.length>0){
                dsControlUpdate(this.control).then(res=>{
                    if(res.code==200){
                        console.log('-------update------');
                    }
                    else{
                        this.$message.error(res.message);
                    }
                });
            }
            
        }
    },
    computed:{
        jljs: function() {
            let self = this;
            if ([5, 6, 7, 8].indexOf(self.Form.controlGraph, 0) >= 0) {
                return "js";
            }
            if ([1, 2, 3, 4].indexOf(self.Form.controlGraph, 0) >= 0) {
                return "jl";
            }
        },
        LABEL: function() {
            let self = this;
            let arr = ["不良率上限", "不良率上限", "缺陷率上限", "缺陷率上限"];
            return arr[Number(self.Form.controlGraph) - 5];
            },
        judgeSelect:function(){
            let arr=[];
            if(this.filterRuleList.length>0){
                this.filterRuleList.forEach(item=>{
                    if(item.enable==1){
                        arr.push(item.ruleNumber);
                    }
                });
            }
            return arr;     
        },
        keyIndex: function () {
            if (this.Form.controlGraph > 0 && this.Form.controlGraph < 5) {
                // return [{
                //     label: 'CPK',
                //     value: 1
                // },
                // {
                //     label: 'PPK',
                //     value: 2
                // },
                // {
                //     label: 'dpmo_lomg',
                //     value: 3
                // }
                // ]
                return this.jl;
            } else if (this.Form.controlGraph >= 5) {
                // return [{
                // label: '不良频率',
                // value: 4
                // }, ]
                  return this.js;
            } else {
                return [];
            }

        },
        filterDsList:function(){
            if(this.dsList.length>0){
                return this.dsList.filter(ds=>ds.calculationType==this.Form.calculationType && ds.projectType==this.Form.analysisMethod)
            }
            else{
                return []
            }
        }
    },
    watch:{
        'Form.controlGraph':function(){
          //this.Form.moveRange='';
          
        
          let groupNum=(rule,value,callback)=>{
            if(value){
             let arr=[];
               for(let i=2;i<=25;i++){
                      arr.push(i);
               }
               if(arr.indexOf(value)==-1){
                  callback(new Error('子组容量是2-25的整数'));
               }
                callback();   
            }
            else{
               callback();
            }
          }

            this.rules.groupNum=[
                { required: this.graphType==1, message: '请填写子组容量',trigger: 'change,blur'},
                {validator:groupNum,trigger:'change,blur'}
            
            ]
            if(this.graphType==1){
                this.rules.groupNum.push({ type:'number',min:1,max:25,message: '子组容量必须为1-25的整数',trigger: 'change,blur'})
            }
            // this.rules.ausl=[
            //     { required: this.graphType==2, message:  '请填写'+["不良率上限", "不良率上限", "缺陷率上限", "缺陷率上限"][Number(this.Form.controlGraph) - 5],trigger: 'change,blur'},
            // ]
            // if(this.graphType==2){
            //      this.rules.ausl.push({ type: 'number',message: ["不良率上限", "不良率上限", "缺陷率上限", "缺陷率上限"][Number(this.Form.controlGraph) - 5]+'必须为数字',trigger: 'change,blur'})
            // }
            if(this.graphType==1){
            this.rules.usl=[
                {validator:this.uslValidator,trigger:'change,blur'}]
            this.rules.lsl.push({validator:this.lslValidator,trigger:'change,blur'})
            this.rules.targetValue.push({validator:this.targetValidator,trigger:'change,blur'})
            if(this.Form.controlGraph==4){
                this.rules.moveRange=[
                { required: true, message: '请填写移动距离',trigger: 'change,blur'},
                { type: 'number',min:2,max:3,message: '移动距离必须为数字2或3',trigger: 'change,blur'}
                ]
            }
            else{
                this.rules.moveRange=[];
            }
            }
            else{
                //this.rules.usl=[]
                this.rules.usl=[ 
                    { required: true, message:  '请填写'+["不良率上限", "不良率上限", "缺陷率上限", "缺陷率上限"][Number(this.Form.controlGraph) - 5],trigger: 'change,blur'},
                    { type: 'number',message: ["不良率上限", "不良率上限", "缺陷率上限", "缺陷率上限"][Number(this.Form.controlGraph) - 5]+'必须为数字',trigger: 'change,blur'}
                ]
                this.rules.lsl=[]
                this.rules.targetValue=[],
                this.rules.moveRange=[];
            } 
        },
        'Form.recentGroups':function(){
            
                if(this.Form.recentGroups==100000){
                    this.allRecentGroups=true;
                }
                else{
                    this.allRecentGroups=false
                }
        
        }
     },
    created:function(){
        this.spcTaskOnlineId=this.$route.params.spc_id.split("_")[1];
        this.spcTaskId=this.$route.params.spc_id.split("_")[0];
        this.getSpctaskDetail();
        this.getDsList(); 
       
        //this.getRuleList();
    }
}
</script>
<style>
.cron{
    padding-bottom:5px;
    color: #0066cc;
}
.cron:visited{
    color: #0066cc;
}
.cron:hover{
    color: #0066cc;
    border-bottom:1px solid  #0066cc;
}
</style>