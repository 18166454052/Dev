<template>
    <div>
         <!--数据源列表-->
        <el-row v-show="!showAdd" >
            <el-col :span="12">
                <el-input
                    placeholder="使用数据分析名称搜索"
                    prefix-icon="el-icon-search"
                    @input="filterDs"
                    v-model="searchDatasource">
                </el-input>
            </el-col>
            <el-col :span="12" class="text-right">
                <el-button type="primary" size="small"  @click="showAdd=true;type='create'">
                        <i class="el-icon-plus m-r-5"></i>创建
                </el-button>
            </el-col>
            <el-col :span="24">
                <div class="m-t-10 CardList">
                    <el-row class="m-t ConfigListTitle">
                        <el-col :span="7" style="padding-left:26px">数据分析名称</el-col>
                        <el-col :span="6">数据分析类型</el-col>
                        <el-col :span="7">创建时间</el-col>
                        <el-col :span="4" class="text-right" style="padding-right:20px">操作</el-col>
                    </el-row>
                    <el-card v-show="filterDsList.length>0" class="box-card m-t-5"  :body-style="{padding: '6px' }" 
                        v-for="(ds,index) in filterDsList" :key="ds.configDataanalysisId+'ds'">
                        <el-row>
                            <el-col :span="7" style="line-height:28px;padding-left:20px">
                                
                                &nbsp;<span>{{ds.configDataanalysisName}}</span>
                            </el-col>
                            <el-col :span="6" style="line-height:28px">
                                
                                &nbsp;<span>{{projectType[ds.projectType-1].name}} : {{["计量","计数"][ds.calculationType-1]}}</span>
                            </el-col>
                            <el-col :span="7" style="line-height:28px">
                                
                                &nbsp;<span>{{ds.createTime | unixTime}}</span>
                            </el-col>
                            
                            <el-col :span="4" class="text-right">
                                    <el-button @click="showUpdate(ds,index,'spc')" type="primary" size="mini"><i class="el-icon-edit"></i></el-button>
                                <el-button @click="deleteDatasource(ds,index,'spc')" type="warning" size="mini"><i class="el-icon-close"></i></el-button>
                            </el-col>
                        </el-row>
                        
                        
                    </el-card>
            
                    <div class="Empty text-center" v-show="filterDsList.length==0">
                            没有查询到数据分析项
                    </div>
                </div>
            </el-col>
        </el-row>
        <!--创建数据源-->
        <div  v-if="showAdd">
            <!--数据源信息-->
            <el-form   class="small-space Form setting-form FormError"  ref="dsForm" size="mini" :model="Form" :rules="dsRules" label-position="right" label-width="110px"
                    >
                <el-form-item label="名称 :"   size="mini" prop="configDataanalysis.configDataanalysisName"> 
                <el-col :span="22"><el-input type="text" v-model="Form.configDataanalysis.configDataanalysisName"> </el-input></el-col>
                </el-form-item>
                <el-form-item label="数据源 :"   size="mini" prop="configDataanalysis.configDatasourceId">
                    <el-col :span="22">
                    <el-select v-model="Form.configDataanalysis.configDatasourceId"  placeholder="请选择数据源">
                    <el-option
                    v-for="item in dbList"
                    :key="item.configDatasourceId"
                    :label="item.configDatasourceName"
                    :value="item.configDatasourceId">
                    </el-option>
                    </el-select>   
                    </el-col>
                </el-form-item>
                <el-form-item label="描述 :"   size="mini">
                <el-col :span="22"><el-input type="text" v-model="Form.configDataanalysis.comment"> </el-input></el-col>
                </el-form-item>
                <el-form-item label="分析项类型 :"  size="mini" prop="configDataanalysis.projectType">
                    <el-col :span="22">
                        <el-select v-model="Form.configDataanalysis.projectType"  
                        placeholder="请选择分析项类型"
                      
                        >
                            <el-option
                            v-for="item in projectType"
                            :key="'projectType'+item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="分析类型 :"  v-show="Form.configDataanalysis.projectType"   size="mini" prop="configDataanalysis.calculationType">
                    <el-col :span="22">
                        <el-select v-model="Form.configDataanalysis.calculationType"  
                        placeholder="请选择分析类型"
                        @change="calculationTypeChange"
                        >
                            <el-option
                            v-for="item in calculationType"
                            :key="'calculationType'+item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <!-- <el-form-item label="定时设置 : " v-show="Form.configDataanalysis.projectType==3" prop="configDataanalysis.cron">
                        <el-col :span="18">
                            <el-input v-model="Form.configDataanalysis.cron"></el-input>
                        </el-col>
                        <el-col :span="3" :offset="1">
                         <a href="http://localhost:80/cron" target="_blank"  class="cron">在线生成cron <svg-icon icon-class="right2"></svg-icon></a>
                        </el-col>
                </el-form-item> -->
                <div  v-show="Form.configDataanalysis.projectType>0"
                        v-for="(sql,index) in checkProjectType" 
                       :key="'sample'+index"
                    >
                    <!--sql-->
                    <el-form-item :label="index>0?'SQL'+ index+' : ':'SQL : '" class="required" 
                      >
                        <el-col :span="22" class="CODEMIRROE CODEMIRROESource" style="margin-top:10px;position:relative"
                            >
                            <codemirror 
                                    v-model="sql.sql" 
                                   
                                    @changes="analysis(sql.sql +' ',index)"
                                    :options="mySqlOption"
                                    class="code" 
                                    style="line-height:20px;"
                                
                                ></codemirror>
                                <!-- <div v-show="spcActionType=='update'"
                                style="z-index:10;position:absolute;top:0;left:0;height:100%;width:100%;background:#ddd;cursor:not-allowed;opacity:0.3">
                        
                                </div> -->
                        </el-col >
                        <el-col :span="22" class="text-right"  v-show="Form.configDataanalysis.projectType==2">
                            <el-button size="mini" type="primary" @click="addsql(index,'add')"  v-show="index==checkProjectType.length-1">
                                <i class="el-icon-plus"></i>
                            </el-button>
                            <el-button size="mini"  type="primary" plain @click="addsql(index,'del')" v-show="checkProjectType.length!=1">
                                <i class="el-icon-delete" ></i></el-button>
                        </el-col>
                        <!-- <el-col :span="22"  v-show="Form.configDataanalysis.projectType==1">
                            <el-button size="mini"  type="primary"  @click="analysis"><i class="el-icon-download"></i>参数分析</el-button>
                        </el-col> -->
                    </el-form-item>
                    <el-form-item label="描述 :" v-show="Form.configDataanalysis.projectType==2">
                        <el-col :span="22">
                             <el-input v-model="sql.sqlDes"></el-input>
                        </el-col>
                       
                    </el-form-item>
                    <!--分析字段-->
                    <el-form-item  label="分析字段 : "  required >
                        <el-col :span="22">
                            <div class="Table SPC_Table levle_factor m-t-10">
                                <el-table
                                :data="checkComputed(index)"
                                size="small"
                                border
                                >
                                    <el-table-column
                                        prop="controlInfoName"
                                        label="字段"
                                        align="center"
                                    >
                                    <template slot-scope="scope">
                                           
                                         <span v-show="repeatParameter.indexOf(scope.row.controlInfoName)>=0" 
                                            style="color:#f00"
                                            > {{scope.row.controlInfoName}}
                                        </span>
                                        <span v-show="repeatParameter.indexOf(scope.row.controlInfoName)==-1" 
                                            >{{scope.row.controlInfoName}}
                                        </span>
                                        <span v-show="!scope.row.controlInfoName" style="color:#f00">缺失</span>
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="controlLabel"
                                        label="字段描述"
                                        align="center"
                                    >
                                        <!-- <template slot-scope="scope">
                                        {{scope.row['fields_id']}}
                                        </template> -->
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-col>
                    </el-form-item>
                  
                    <!--附加字段-->
                    <el-form-item label="附加字段 :" class="required" >
                        <el-col :span="22">
                            <div class="Table SPC_Table levle_factor m-t-10 ">
                                <el-table
                                :data="checkAdditional(index)"
                                size="mini"
                                border
                                >
                                    <el-table-column
                                        prop="field"
                                        label="字段"
                                        align="center"
                                    ><template slot-scope="scope">
                                         <span v-show="repeatParameter.indexOf(scope.row.field)>=0" 
                                            style="color:#f00"
                                            > {{scope.row.field}} 
                                        </span>
                                        <span v-show="repeatParameter.indexOf(scope.row.field)==-1" 
                                            > {{scope.row.field}} 
                                        </span>
                                    </template>
                                    </el-table-column>
                                    
                                    <el-table-column
                                        prop="fieldComment"
                                        label="字段描述"
                                        align="center"
                                        >
                                        <template slot-scope="scope">

                                        <el-input 
                                            @change="cache('add',scope,index)"
                                            v-model="scope.row.fieldComment" >
                                        </el-input> 
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-col>
                    </el-form-item>
                    <!--参数配置-->
                    <el-form-item  label="参数配置 : "  required >
                        <el-col :span="22">
                            <div class="Table SPC_Table levle_factor m-t-10 Table_code_four">
                                <el-table
                                :data="checkControl(index)"
                                size="mini"
                                border
                                >
                                    <el-table-column
                                        prop="parameter"
                                        label="参数名称"
                                        align="center"
                                    > 
                                    <template slot-scope="scope">
                                        <span v-show="repeatParameter.indexOf(scope.row.parameter)>=0" 
                                            style="color:#f00"
                                            > {{scope.row.parameter}} 
                                        </span>
                                        <span v-show="repeatParameter.indexOf(scope.row.parameter)==-1" 
                                            > {{scope.row.parameter}} 
                                        </span>
                                    </template>
                                    </el-table-column>
                                    <el-table-column 
                                        prop="required"
                                        label="是否必填"
                                        align="center"
                                        width="100"

                                    >
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.required">
                                            <el-option value="1" label="是"></el-option>
                                            <el-option value="0" label="否"></el-option>
                                        </el-select>
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="comment"
                                        label="参数描述"
                                        align="center"
                                        
                                    > 
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.comment" @change="cache('control',scope,index)" />
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="parameterValueType"
                                        label="参数值类型"
                                        align="center"
                                        width="150"
                                    >
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.parameterValueType"
                                            @change="scope.row.parameterValue='';cache('add',scope,index)">
                                            <el-option v-for="t in parameterValueType" 
                                            :value="t.id"
                                            :label="t.name"
                                            :key="t.name+'@'+t.id"
                                            ></el-option>
                                        </el-select>
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="parameterValue"
                                        label="参数值"
                                        align="center"
                                        >
                                        <template slot-scope="scope">

                                        <el-select 
                                          
                                            @change="addOption;cache('control',scope,index)"
                                            v-if="scope.row.parameterValueType==1"
                                            v-model="scope.row.parameterValueArr"
                                                multiple
                                                filterable
                                                allow-create
                                                placeholder="请输入参数值"
                                                no-data-text="请输入参数值"
                                                collapse-tags
                                            >
                                            <el-option v-for="(val,index) in scope.row.parameterValueArr"
                                            :label="val"
                                            :value="val"
                                            :key="index +'@_'+ val"
                                            >

                                            </el-option>

                                        </el-select>

                                        <el-date-picker
                                           @change="cache('control',scope,index)"
                                            v-if="scope.row.parameterValueType==2"
                                            v-model="scope.row.parameterValue"
                                            type="datetime"
                                    
                                        >
                                        </el-date-picker>  


                                        <el-input 
                                           @change="cache('control',scope,index)"
                                            v-show="scope.row.parameterValueType==3 || scope.row.parameterValueType=='' " 
                                            v-model="scope.row.parameterValue" >
                                        </el-input> 

                                        <el-popover
                                          v-show="scope.row.parameterValueType==4"
                                            placement="left"
                                            width="500"
                                            trigger="click"
                                           
                                           >
                                            <div slot="reference">创建sql</div>
                                           <div class="CODEMIRROE four"
                                                >
                                                <codemirror
                                                        v-model="scope.row.parameterValue" 
                                                        :options="mySqlOption"
                                                        class="code" 
                                                        style="line-height:20px;"
                                                        @changes="checkParameter(scope)"
                                                    
                                                ></codemirror>
                                            </div >
                                           
                                        </el-popover>

                                         <el-date-picker
                                            @change="cache('control',scope,index)"
                                            v-if="scope.row.parameterValueType==5"
                                            v-model="scope.row.parameterValue"
                                            type="date"
                                    
                                        >
                                        </el-date-picker> 
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-col>
                    </el-form-item>
                </div>
                <!-- <div  v-show="Form.configDataanalysis.projectType==2">
                    趋势
                    <el-form-item :label="index>0?'SQL'+index+' :':'SQL :'" class="required" 
                     v-for="(sql,index)  in Form.process" :key="index+'process'"
                    >
                        <el-col :span="22" class="CODEMIRROE CODEMIRROESource" style="margin-top:10px;position:relative;"
                            >
                            <codemirror 
                                    v-model="sql.sql" 
                                    @changes="sqlChange(sql.sql,'false')" 
                                    :options="mySqlOption"
                                    class="code" 
                                    style="line-height:20px;"
                                
                                ></codemirror>
                              
                        </el-col >
                        <el-col :span="22" class="text-right">
                            <el-button size="mini"  :type="index==Form.process.length-1?'primary':'info'" @click="addsql('process',index)">
                                <i :class="index==Form.process.length-1?'el-icon-plus':'el-icon-delete'" ></i></el-button>
                        </el-col>
                    </el-form-item>
                </div>
                <div  v-show="Form.configDataanalysis.projectType==3">
                    <el-form-item label="定时 : ">
                        <el-col :span="18">
                            <el-input v-model="Form.cron"></el-input>
                        </el-col>
                        <el-col :span="3" :offset="1">
                         <a href="http://localhost:80/cron" target="_blank"  class="cron">在线生成cron <svg-icon icon-class="right2"></svg-icon></a>
                        </el-col>
                            
                    </el-form-item>
                    // 在线预警
                    <el-form-item :label="index>0?'SQL'+index+' :':'SQL :'" class="required" 
                     v-for="(sql,index)  in Form.warning" :key="index+'warning'"
                    >
                        <el-col :span="22" class="CODEMIRROE CODEMIRROESource" style="margin-top:10px;position:relative;"
                            >
                            <codemirror 
                                    v-model="sql.sql" 
                                    @changes="sqlChange(sql.sql,'false')" 
                                    :options="mySqlOption"
                                    class="code" 
                                    style="line-height:20px;"
                                
                                ></codemirror>
                               
                        </el-col >
                        <el-col :span="22" class="text-right">
                            <el-button size="mini"  :type="index==Form.warning.length-1?'primary':'info'" @click="addsql('warning',index)">
                                <i :class="index==Form.warning.length-1?'el-icon-plus':'el-icon-delete'" ></i></el-button>
                        </el-col>
                    </el-form-item>
                </div> -->
            </el-form>
            <div style="border-top:1px solid #ebeef5;margin-top:20px;text-align:center;padding-top:20px;margin-bottom:20px">
            <span slot="footer" class="dialog-footer" >
                <!-- <el-button v-show="spcActionType=='update' && filedsForSearch.length>0"   type="primary"  size="mini" :loading="loadingSearch" @click="search">查询</el-button>
                 -->
                <el-button type="primary"  size="mini" :loading="createLoading" @click="submit">保存</el-button>
                <el-button size="mini"   @click="back">返回</el-button>
            </span>
        </div>
        </div>
    </div>
</template>
<script>
import mixins from './mixins'
//import Corn from './corn'
export default {

    mixins:[mixins],
    computed:{
        checkProjectType:function(){
            let type=this.Form.configDataanalysis.projectType;
            return type==1?this.Form.sample:type==2?this.Form.process:type==3?this.Form.warning:[];
        },
       
    },
    methods:{
        checkComputed:function(index){ //分析字段（计算属性）
            let type=this.Form.configDataanalysis.projectType;
            if(type){
                return  this['computed'+type][index]
            }
            else{
                return [];
            }
        },
        checkControl:function(index){  //参数配置
            let type=this.Form.configDataanalysis.projectType;
            if(type){
                return  this.Form['configDataanalysisParameterControl'+type][index]
            }
            else{
                return [];
            }
        },
        checkAdditional:function(index){ // 附加信息
            let type=this.Form.configDataanalysis.projectType;
            if(type){
                return  this.Form['configDataanalysisParameterAdditional'+type][index]
            }
            else{
                return [];
            }
        },
        calculationTypeChange:function(){ // 计量 计数发生变化  重新分析sql
            let type = this.Form.configDataanalysis.projectType; // 抽样 趋势 预警
            let arr=[];
            switch(type){
                case 1: arr=this.Form.sample;break;
                case 2: arr=this.Form.process;break;
                case 3: arr=this.Form.warning;break;
            }
            if(arr.length>0){
                arr.forEach((sql,index)=>{
                    this.analysis(sql.sql,index);
                }); 
            }
        },
        checkParameter:function(scope){
           
            let reg = /@.+?\s+/g;
            let res=scope.row.parameterValue.match(reg);
           
            if(res && Array.isArray(res) && res.length>0){
                let type=this.Form.configDataanalysis.projectType;
                if(type){
                   let ParameterControl=this.Form['configDataanalysisParameterControl'+type][scope.$index-1];
                 
                   if(Array.isArray(ParameterControl) && ParameterControl.length>0){
                     res.forEach( par => {
                             let flag=false;
                           
                             for(let i=0;i<ParameterControl.length;i++){
                             
                                 console.log(ParameterControl[i])
                                 console.log(par.toString().trim())
                                  if(ParameterControl[i].parameter == par.toString().trim()){
                                     
                                      flag=true;
                                      return true;
                                  }
                             }
                            if(!flag){
                                this.$message.warning("参数" + par + "不存在");
                            }
                       });
                      
                       
                   }
                }
            }

        }
    },
    created:function(){
        this.getDblist();
        this.getDsList();
       // this.getDsMsaList();
        this.$on('init',()=>{
           this.showAdd=false;
           this.searchDatasource="";
           this.filterDs();
       })
    }
}
</script>
<style >

</style>


