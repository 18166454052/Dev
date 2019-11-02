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
                                  v-for="(ds,index) in filterDsList" :key="ds.configDataanalysisId">
                                   <el-row>
                                       <el-col :span="7" style="line-height:28px;padding-left:20px">
                                         
                                           &nbsp;<span>{{ds.configDataanalysisName}}</span>
                                       </el-col>
                                       <el-col :span="6" style="line-height:28px">
                                          
                                            &nbsp;<span>{{calculationType[ds.calculationType-1].name}}</span>
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
                                <el-card v-show="filterDsMsaList.length>0" class="box-card m-t-5"  :body-style="{padding: '6px' }" 
                                  v-for="(msa,index) in filterDsMsaList" :key="msa.configDataanalysisMsaId">
                                   <el-row>
                                       <el-col :span="7" style="line-height:28px;padding-left:20px">
                                         
                                           &nbsp;<span>{{msa.configDataanalysisMsaName}}</span>
                                       </el-col>
                                       <el-col :span="6" style="line-height:28px">
                                          
                                            &nbsp;<span>MSA</span>
                                       </el-col>
                                       <el-col :span="7" style="line-height:28px">
                                          
                                            &nbsp;<span>{{msa.createTime | unixTime}}</span>
                                       </el-col>
                                       
                                       <el-col :span="4" class="text-right">
                                             <el-button @click="showUpdate(msa,index,'msa')" type="primary" size="mini"><i class="el-icon-edit"></i></el-button>
                                           <el-button @click="deleteDatasource(msa,index,'msa')" type="warning" size="mini"><i class="el-icon-close"></i></el-button>
                                       </el-col>
                                   </el-row>
                                  
                                </el-card>
                                <div class="Empty text-center" v-show="filterDsList.length==0 && filterDsMsaList.length==0">
                                        没有查询到数据分析数据
                                </div>
                            </div>
            </el-col>
        </el-row>
        <!--创建数据源-->
        <div  v-if="showAdd">
            <!--数据源信息-->
            <el-form   class="small-space Form setting-form FormError"  ref="dsForm" size="mini" :model="Form" :rules="dsRules" label-position="right" label-width="130px"
                    >
                <el-form-item label="数据分析名称 :"   size="mini" prop="configDataanalysis.configDataanalysisName"> 
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
                <el-form-item label="分析类型 :"  size="mini" prop="configDataanalysis.calculationType">
                    <el-col :span="22">
                        <el-select v-model="Form.configDataanalysis.calculationType"  
                        placeholder="请选择分析类型"
                        @change="analysis"
                        >
                            <el-option
                            v-for="item in calculationType"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <div v-show="Form.configDataanalysis.calculationType!=3">
                    <el-form-item label="SQL :" class="required">
                        <el-col :span="22" class="CODEMIRROE CODEMIRROESource" style="margin-top:10px;position:relative"
                            >
                            <codemirror 
                                    v-model="Form.configDataanalysis.selectSql" 
                                    @changes="sqlChange" 
                                    :options="mySqlOption"
                                    class="code" 
                                    style="line-height:20px;"
                                
                                ></codemirror>
                                <!-- <div v-show="spcActionType=='update'"
                                style="z-index:10;position:absolute;top:0;left:0;height:100%;width:100%;background:#ddd;cursor:not-allowed;opacity:0.3">
                        
                                </div> -->
                        </el-col >
                        <el-col :span="22">
                            <el-button size="mini"  type="primary"  @click="analysis"><i class="el-icon-download"></i>参数分析</el-button>
                        </el-col>
                    </el-form-item>
                    <!--计算信息-->
                    <el-form-item  label="计算信息 : "  required >
                        <el-col :span="22">
                            <div class="Table SPC_Table levle_factor m-t-10">
                                <el-table
                                :data="computed"
                                size="small"
                                border
                                >
                                    <el-table-column
                                        prop="controlInfoName"
                                        label="字段"
                                        align="center"
                                    >
                                    <template slot-scope="scope">
                                        <span v-show="scope.row.controlInfoName">{{scope.row.controlInfoName}}</span>
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
                    <!--控制信息-->
                    <el-form-item  label="控制信息 : "  required >
                        <el-col :span="22">
                            <div class="Table SPC_Table levle_factor m-t-10">
                                <el-table
                                :data="Form.configDataanalysisParameterControl"
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
                                        prop="comment"
                                        label="参数描述"
                                        align="center"
                                    > 
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.comment" />
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="parameterValueType"
                                        label="参数值类型"
                                        align="center"
                                    >
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.parameterValueType"
                                        @change="scope.row.parameterValue=''">
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
                                            @change="addOption"
                                            v-show="scope.row.parameterValueType==1"
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
                                            v-show="scope.row.parameterValueType==2"
                                            v-model="scope.row.parameterValue"
                                            type="datetime"
                                    
                                        >
                                        </el-date-picker>  

                                        <el-input 
                                            v-show="scope.row.parameterValueType==3 || scope.row.parameterValueType=='' " 
                                            v-model="scope.row.parameterValue" >
                                        </el-input> 
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-col>
                    </el-form-item>
                    <!--附加信息-->
                    <el-form-item label="附加信息 :" class="required">
                        <el-col :span="22">
                            <div class="Table SPC_Table levle_factor m-t-10">
                                <el-table
                                :data="Form.configDataanalysisParameterAdditional"
                                size="mini"
                                border
                                
                                >
                                    <el-table-column
                                        prop="field"
                                        label="字段"
                                        align="center"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="fieldComment"
                                        label="字段描述"
                                        align="center"
                                        >
                                        <template slot-scope="scope">

                                        <el-input 
                                        
                                            v-model="scope.row.fieldComment" >
                                        </el-input> 
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-col>
                    </el-form-item>
                </div>
                <div v-show="Form.configDataanalysis.calculationType==3">
                    <el-form-item label="表名称 :"   size="mini" prop="configDataanalysis.tableName"> 
                       <el-col :span="22"><el-input type="text" v-model="Form.configDataanalysis.tableName"> </el-input></el-col>
                    </el-form-item>
                    <el-form-item label="测量部件字段名 :"   size="mini" prop="configDataanalysis.fieldComponent"> 
                       <el-col :span="22"><el-input type="text" v-model="Form.configDataanalysis.fieldComponent"> </el-input></el-col>
                    </el-form-item>
                    <el-form-item label="测量部序号字段名 :"   size="mini" prop="configDataanalysis.fieldIndex"> 
                       <el-col :span="22"><el-input type="text" v-model="Form.configDataanalysis.fieldIndex"> </el-input></el-col>
                    </el-form-item>
                    <el-form-item label="测量部人员字段名 :"   size="mini" prop="configDataanalysis.fieldStaff"> 
                       <el-col :span="22"><el-input type="text" v-model="Form.configDataanalysis.fieldStaff"> </el-input></el-col>
                    </el-form-item>
                    <el-form-item label="测量值字段名 :"   size="mini" prop="configDataanalysis.fieldValue"> 
                       <el-col :span="22"><el-input type="text" v-model="Form.configDataanalysis.fieldValue"> </el-input></el-col>
                    </el-form-item>
                       <el-form-item  label="附加信息 : "  required >
                        <el-col :span="22">
                            <div class="Table SPC_Table levle_factor m-t-10">
                                <el-table
                                :data="Form.msaAdditional"
                                size="mini"
                                border
                                
                                >
                                    <el-table-column
                                        prop="parameterName"
                                        label="参数名称"
                                        align="center"
                                    > 
                                    </el-table-column>
                                    <el-table-column
                                        prop="parameterValue"
                                        label="参数值"
                                        align="center"
                                        >
                                        <template slot-scope="scope">

                                        <el-select 
                                            @change="addOption"
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
                                            :key="index +'@1_'+ val"
                                            >

                                            </el-option>

                                        </el-select>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-col>
                    </el-form-item>
                </div>
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
import {dsList, dsCreate, dsDelete , dsUpdate, dsDetail,
    dsMsaList, dsMsaCreate, dsMsaUpdate, dsMsaDetail, dsMsaDelete
 } from "@/api/dataSource"
import {dbList} from "@/api/config/datasourceConfig"
import { codemirror } from 'vue-codemirror'
import 'codemirror/theme/rubyblue.css'
import 'codemirror/theme/seti.css'
import 'codemirror/mode/sql/sql.js'
export default {
    components: {codemirror},
    data(){
        return {
            type:'',
            searchDatasource:'',
            showAdd:false,
            createLoading:false,
            mySqlOption:{
                tabSize: 4,
                styleActiveLine: true,
                lineNumbers: true,
                line: true,
                mode:'text/x-sql',
                lineWrapping: true,
                theme: 'rubyblue',
                autoRefresh: true
            },
            calculationType:[
                {id:1,name:'计量'},
                {id:2,name:'计数'},
                {id:3,name:'MSA'},
               // {id:4,name:'DOE'},
            ],
            parameterValueType:[
                {id:1,name:'选项'},
                {id:2,name:'时间'},
                {id:3,name:'输入'},
            ],
            Form:{
                configDataanalysis:{//数据源信息
                    configDataanalysisName:'', 
                    configDatasourceId:'',
                    calculationType:'',
                    comment:"",
                    selectSql:'',
                    createTime:'',
                    //MSA
                    //config_dataanalysis_msa_name
                    configDataanalysisMsaName:'',
                    tableName:'',
                    fieldComponent:'',
                    fieldIndex:'',
                    fieldStaff:'',
                    fieldValue:'',
                },
                configDataanalysisParameterControl:[
                    // {parameter:'@111',parameterValueType:1,
                    // parameterValue:'',parameterValueArr:[],comment:'',index:''}
                ],
                configDataanalysisParameterAdditional:[
                      //  {field:'aaa',fieldComment:'comment'}
                ],
                msaAdditional:[
                    {
                        parameterName:'测量部件选项',
                        parameter:'controlComponents',
                        parameterValueArr:[],
                    },
                    {
                        parameterName:'测量人员选项',
                        parameter:'controlStaff',
                        parameterValueArr:[],
                    },
                    {
                        parameterName:'测量序号选项',
                        parameter:'controlIndex',
                        parameterValueArr:[],
                    }
                ]
                

            },
            computed:[//  计算信息
               // {controlInfoName:'name',controlLabel:'label'}
            ], 
            dsRules:{
                configDataanalysis:{
                    configDataanalysisName:[
                        {required:true,message:'请填写数据分析名称',trigger:"change,blur"}
                    ],  
                    calculationType:[
                        {required:true,message:'请选择分析类型',trigger:"change,blur"}
                    ], 
                    configDatasourceId:[
                        {required:true,message:'请选择数据源',trigger:"change,blur"}
                    ],
                    tableName:[
                        {required:true,message:'请填写表名称',trigger:"change,blur"}
                    ],
                    fieldComponent:[
                        {required:true,message:'请填写测量部件字段名',trigger:"change,blur"}
                    ],
                    fieldIndex:[
                        {required:true,message:'请填写测量序号字段名',trigger:"change,blur"}
                    ],
                    fieldStaff:[
                        {required:true,message:'请填写测量人员字段名',trigger:"change,blur"}
                    ],
                    fieldValue:[
                        {required:true,message:'请填写测量值字段名',trigger:"change,blur"}
                    ]
                }
                
            },
            filterDsList:[],
            dsList:[
                // {
                //     configDatasourceName:'name', 
                //     configDatasourceId:'11',
                //     calculationType:'1',
                //     comment:"",
                //     selectSql:'',
                //     createTime:'11111',
                //     sql_info:[],
                //     sql_control_info:[

                    
                //     ],
                // }
            ],
            filterDsMsaList:[],
            dsMsaList:[
                // {
                //     configDatasourceName:'name', 
                //     configDatasourceId:'11',
                //     calculationType:'1',
                //     comment:"",
                //     selectSql:'',
                //     createTime:'11111',
                //     sql_info:[],
                //     sql_control_info:[

                    
                //     ],
                // }
            ],
            dbList:[],
            Booleananalysis:true,  //编辑时,首次进入要不要分析sql
            repeatParameter:[]
           
        }
    },
    methods:{
        deleteDatasource:function(ds,index,type){
            let name="";
            if(ds.configDataanalysisName){
                name=ds.configDataanalysisName
            }
            if(ds.configDataanalysisMsaName){
                name=ds.configDataanalysisMsaName
            }
            this.$confirm('确定删除分析项'+ name+'?', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
            }).then(()=>{ 
                if(type=='spc'){
                        dsDelete({configDataanalysisId:ds.configDataanalysisId}).then(res=>{
                        if(res.code==200){
                            this.$message.success("删除数据分析成功");
                            this.dsList.splice(index,1);
                            this.filterDsList.splice(index,1);

                        }
                        else{
                            this.$message.error(res.message);
                        }
                    });
                }

                if(type=='msa'){
                    dsMsaDelete({configDataanalysisMsaId:ds.configDataanalysisMsaId}).then(res=>{
                        if(res.code==200){
                            this.$message.success("删除数据分析成功");
                            this.dsMsaList.splice(index,1);
                            this.filterDsMsaList.splice(index,1);

                        }
                        else{
                            this.$message.error(res.message);
                        }
                    });
                }
               
            }).catch(()=>{}); 
        },
        back:function(){

            this.Form={
                configDataanalysis:{//数据源信息
                    configDataanalysisName:'', 
                    configDatasourceId:'',
                    calculationType:'',
                    comment:"",
                    selectSql:'',
                    createTime:'',
                    // config_dataanalysis_msa_name
                    configDataanalysisMsaId:'',
                    tableName:'',
                    fieldComponent:'',
                    fieldIndex:'',
                    fieldStaff:'',
                    fieldValue:'',
                },
                configDataanalysisParameterControl:[],
                configDataanalysisParameterAdditional:[],
                msaAdditional:[
                    {
                        parameterName:'测量部件选项',
                        parameter:'controlComponents',
                        parameterValueArr:[],
                    },
                    {
                        parameterName:'测量人员选项',
                        parameter:'controlStaff',
                        parameterValueArr:[],
                    },
                    {
                        parameterName:'测量序号选项',
                        parameter:'controlIndex',
                        parameterValueArr:[],
                    }
                ]
            },
            this.$refs.dsForm.resetFields()
            this.createLoading=false;
           //this.$refs.controlForm.resetFields();
            this.showAdd=false;
        },
        analysis:function(){//解析SQL
            if(!this.Form.configDataanalysis.calculationType){
                this.$message.warning('请先选择分析类型');
                return false;
            }
            //判断  update insert delete
            if(/delete/i.test(this.Form.configDataanalysis.selectSql)){
                 this.$message.warning('SQL中不能包含关键字 delete');
            }
            if(/insert/i.test(this.Form.configDataanalysis.selectSql)){
                 this.$message.warning('SQL中不能包含关键字 insert');
            }
            if(/update/i.test(this.Form.configDataanalysis.selectSql)){
                 this.$message.warning('SQL中不能包含关键字 update');
            }
            if(/\*/i.test(this.Form.configDataanalysis.selectSql)){
                 this.$message.warning('SQL中不能包含关键字 *');
            }
           let self=this;
         
            /////////////////  参数信息
            if(this.Booleananalysis){ 
                this.Form.configDataanalysisParameterControl=[];
                let reg=/where\s*\w+(>|<|>=|=<|=)\s*@\w+((?!\s*and))/gi,arr=[];
                console.log("a=@a");
                console.log(this.Form.configDataanalysis.selectSql.match(reg));
               
               
                let result=this.Form.configDataanalysis.selectSql.match(reg);
                // null []
                if(result && result instanceof Array  && result.length>0){
                       // result1=this.replace(result1);
                        result=this.replace(result);
                       let res=result.map(item=>{
                              return item.split(" ");
                       });
                       //[["a", "=", "@a"]]
                        
                        res.forEach((item,index)=>{
                            // 参数不能重复
                            let flag=true;
                            res.forEach((item1,index1)=>{
                                if(index>index1){
                                    if(item1[2].trim()==item[2].trim()){
                                        flag=false;
                                        if(self.repeatParameter.indexOf(item[2].trim())==-1){
                                        self.repeatParameter.push(item[2].trim()); 
                                        self.$message.warning('参数名称不能重复,'+ item  +'重复出现');
                                        }
                                    }
                                }
                                else if(index==index1){
                                    if(flag){ //没有相同项
                                        if(self.repeatParameter.indexOf(item[2].trim())>=0){
                                        self.repeatParameter.splice(index,1); 
                                        }
                                    }
                                }
                            });
                            //
                            this.Form.configDataanalysisParameterControl.push(
                                {
                                    parameter:item[2].trim(),
                                    parameterValueType:3,
                                    parameterValue:'',
                                    parameterValueArr:[],
                                    comment:'',
                                    sectionStart:false,
                                    sectionOff:false,
                                    sectionValue:item[0].trim(),
                                    symbol:item[1].trim(),
                                    configDataanalysisId:null
                                }
                            );
                        });     
                }
                

                 /////////
              
                let reg2=/\w+\s*(>|<|>=|=<)\s*@\w+\s*and\s*\w+\s*(>|<|>=|=<)\s*@\w+/gi,arr2=[];
                 console.log("a>@a1 and a>@2");
                 console.log(this.Form.configDataanalysis.selectSql.match(reg2));
                 let result2=this.Form.configDataanalysis.selectSql.match(reg2);
                // null []
                if(result2 && result2 instanceof Array  && result2.length>0){
                       // result1=this.replace(result1);
                      let arr=[];
                       result2.forEach(item=>{
                           item=item.replace(/and/i,',');
                           arr=[...arr,...item.split(",")]
                       });
                       result2=this.replace(arr);
                       
                       console.log(result2);
                       let res=result2.map(item=>{
                              return item.split(" ");
                       });
                       //[["a", "=", "@a"]]
                         console.log(res);
                        res.forEach((item,index)=>{
                            // 参数不能重复
                            let flag=true;
                            res.forEach((item1,index1)=>{
                                if(index>index1){
                                    if(item1[2].trim()==item[2].trim()){
                                        flag=false;
                                        if(self.repeatParameter.indexOf(item[2].trim())==-1){
                                        self.repeatParameter.push(item[2].trim()); 
                                        self.$message.warning('参数名称不能重复,'+ item  +'重复出现');
                                        }
                                    }
                                }
                                else if(index==index1){
                                    if(flag){ //没有相同项
                                        if(self.repeatParameter.indexOf(item[2].trim())>=0){
                                        self.repeatParameter.splice(index,1); 
                                        }
                                    }
                                }
                            });
                            //
                            this.Form.configDataanalysisParameterControl.push(
                                {
                                    parameter:item[2].trim(),
                                    parameterValueType:3,
                                    parameterValue:'',
                                    parameterValueArr:[],
                                    comment:'',
                                    sectionStart:item[1].indexOf(">")>=0?true:false,
                                    sectionOff:item[1].indexOf("<")>=0?true:false,
                                    sectionValue:item[0].trim(),
                                    symbol:item[1].trim()
                                }
                            );
                        });     
                }



                let reg3=/\w+\s*between\s*@\w+\s*and\s*@\w+/gi,arr3=[];
                console.log(" between @a1 and @2");
               let result3=this.Form.configDataanalysis.selectSql.match(reg3);
                if(result3 && result3 instanceof Array  && result3.length>0){
                       // result1=this.replace(result1);
                       let arr=[]
                         result3.forEach(item=>{
                               arr.push(item.replace(/between/i,',').replace(/and/i,",").split(","));
                        });
                        let res=arr;
                        console.log(res);
                    
                        res.forEach((item,index)=>{
                            // 参数不能重复
                            /*
                            let flag=true;
                            res.forEach((item1,index1)=>{
                                if(index>index1){
                                    if(item1[2].trim()==item[2].trim()){
                                        flag=false;
                                        if(self.repeatParameter.indexOf(item[2].trim())==-1){
                                        self.repeatParameter.push(item[2].trim()); 
                                        self.$message.warning('参数名称不能重复,'+ item  +'重复出现');
                                        }
                                    }
                                }
                                else if(index==index1){
                                    if(flag){ //没有相同项
                                        if(self.repeatParameter.indexOf(item[2].trim())>=0){
                                        self.repeatParameter.splice(index,1); 
                                        }
                                    }
                                }
                            });
                            */
                            //
                            this.Form.configDataanalysisParameterControl.push(
                                {
                                    parameter:item[1].trim(),
                                    parameterValueType:3,
                                    parameterValue:'',
                                    parameterValueArr:[],
                                    comment:'',
                                    sectionStart:true,
                                    sectionOff:false,
                                    sectionValue:item[0].trim(),
                                    symbol:"至",
                                    configDataanalysisId:null
                                }
                            );
                            this.Form.configDataanalysisParameterControl.push(
                                {
                                    parameter:item[2].trim(),
                                    parameterValueType:3,
                                    parameterValue:'',
                                    parameterValueArr:[],
                                    comment:'',
                                    sectionStart:false,
                                    sectionOff:true,
                                    sectionValue:item[0].trim(),
                                    symbol:'至',
                                    configDataanalysisId:null
                                }
                            );
                        });  
                         
                }


                let reg1=/@\w+\s*=?<\s*\w+\s*=?<\s*@\w+/gi,arr1=[];
                // console.log("a<b<c");
                 let  result1=this.Form.configDataanalysis.selectSql.match(reg1);
                   if(result1 && result1 instanceof Array  && result1.length>0){
                        let arr=result1.map(item=>{
                            if(item.indexOf(">=")>=0){
                                item=item.replace(/>=/g," >= ");
                            }
                            else if(item.indexOf(">")>=0){
                                item=item.replace(/>/g," > ");
                            }


                            if(item.indexOf("<=")>=0){
                                item=item.replace(/<=/g," <=");
                            }
                            else if(item.indexOf("<")>=0){
                                item=item.replace(/</g," < ");
                            }
                            
                            return item.split(" ");
                        });
                        
                        //[["a", "=", "@a"]]
                        let res=arr;
                        console.log(res);
                        res.forEach((item,index)=>{
                            // 参数不能重复
                            /*
                            let flag=true;
                            res.forEach((item1,index1)=>{
                                if(index>index1){
                                    if(item1[2].trim()==item[2].trim()){
                                        flag=false;
                                        if(self.repeatParameter.indexOf(item[2].trim())==-1){
                                        self.repeatParameter.push(item[2].trim()); 
                                        self.$message.warning('参数名称不能重复,'+ item  +'重复出现');
                                        }
                                    }
                                }
                                else if(index==index1){
                                    if(flag){ //没有相同项
                                        if(self.repeatParameter.indexOf(item[2].trim())>=0){
                                        self.repeatParameter.splice(index,1); 
                                        }
                                    }
                                }
                            });
                            */
                            this.Form.configDataanalysisParameterControl.push(
                                {
                                    parameter:item[0].trim(),
                                    parameterValueType:3,
                                    parameterValue:'',
                                    parameterValueArr:[],
                                    comment:'',
                                    sectionStart:item[1].indexOf("<")>=0?true:false,
                                    sectionOff:item[1].indexOf("<")>=0?false:true,
                                    sectionValue:item[2].trim(),
                                    symbol:item[1].trim(),
                                    configDataanalysisId:null
                                }
                            );
                            this.Form.configDataanalysisParameterControl.push(
                                {
                                    parameter:item[4].trim(),
                                    parameterValueType:3,
                                    parameterValue:'',
                                    parameterValueArr:[],
                                    comment:'',
                                    sectionStart:item[1].indexOf("<")>=0?false:true,
                                    sectionOff:item[1].indexOf("<")>=0?true:false,
                                    sectionValue:item[2].trim(),
                                    symbol:item[3].trim(),
                                    configDataanalysisId:null
                                }
                            );
                        });     
                }

                /////////
               
            }
           
           /////////////////  计算信息/附加信息 
            let reg1=/^\s*select\s+.+?\s+from/gi;
            let arrConfig=this.Form.configDataanalysis.selectSql.match(reg1);
            if(arrConfig && arrConfig instanceof Array && arrConfig.length>0){
                this.computed=[];
                if(this.Booleananalysis){
                    this.Form.configDataanalysisParameterAdditional=[]
                }
               
                let  config_info=[];
                if(arrConfig && arrConfig instanceof Array &&  arrConfig.length>0){
                    config_info=arrConfig.map(item=>{
                        return  item.replace(/select/i,'').replace(/from/i,'').replace('，',',').trim().split(',');
                    });
                }

                let column=[];
                config_info.forEach(col=>{
                    column=[...column,...col];
                })
                console.log(column)
                //计量
                if(self.Form.configDataanalysis.calculationType==1){
                
                        if(column.length>0){
                            column.forEach((item,index)=>{
                                if(index==0){//计算
                                    self.computed.push({
                                        controlInfoName:item,controlLabel:'数值'
                                    });
                                }
                                else{   //附加信息
                                if(this.Booleananalysis){
                                    if(item){
                                        self.Form.configDataanalysisParameterAdditional.push({
                                        field:item,
                                        fieldComment:'',
                                       
                                        });
                                    }
                                }
                            }
                                    
                            });
                        }
                        else{
                        self.computed.push({
                                controlInfoName:'',controlLabel:'数值'
                            });
                        }
                        
                
                    
                }
                else if(self.Form.configDataanalysis.calculationType==2){
                    //计数
                    let colName=['不良原因','采样总数','不良总数']; 
                    if(column.length>=3){
                
                        column.forEach((item,index)=>{
                            if(index<3){
                            self.computed.push({
                                    controlInfoName:item,controlLabel:colName[index]
                                });
                            }
                            else{
                                if(this.Booleananalysis){
                                    if(item){
                                        self.Form.configDataanalysisParameterAdditional.push({
                                                field:item,
                                                fieldComment:'',
                                               
                                        });
                                    }
                                }
                            
                                
                            }
                                
                        }); 
                    }
                    else{
                        colName.forEach((name,index)=>{
                             self.computed.push({
                                    controlInfoName:column[index]?column[index]:'',
                                    controlLabel:name
                                });
                            
                        });
                    }
                
                }
                else if(self.Form.configDataanalysis.calculationType==3){
                    //msa
                    let colName=['测量部件列名','测量人员列名','测量序号列名','测量数值列名']; 
                    if(column.length>=4){
                
                        column.forEach((item,index)=>{
                            if(index<4){
                                self.computed.push({
                                        controlInfoName:item,controlLabel:colName[index]
                                });
                            }
                            else{
                                if(this.Booleananalysis){
                                    if(item){
                                        self.Form.configDataanalysisParameterAdditional.push({
                                                field:item,
                                                fieldComment:'',
                                               
                                        });
                                    }
                                }
                            }
                                
                        }); 
                    }
                    else{
                        colName.forEach((name,index)=>{
                            self.computed.push({
                                controlInfoName:column[index]?column[index]:'',
                                controlLabel:name
                            });
                        })
                    }

                }
                else{
                    self.$message.warning('请选择分析类型');
                }
               
            }
             this.Booleananalysis=true;
        },
        replace:function(arr){
              return  arr.map(item=>{
                    if(item.indexOf(">=")>=0){
                        item=item.replace(">="," >= ");
                    }
                    else if(item.indexOf("<=")>=0){
                         item=item.replace("<="," <=");
                    }
                    else if(item.indexOf("<")>=0){
                         item=item.replace("<"," < ");
                    }
                    else if(item.indexOf(">")>=0){
                         item=item.replace(">"," > ");
                    }
                    else if(item.indexOf("=")>=0){
                         item=item.replace("="," = ");
                    }
                    return item.replace(/where/gi,"").trim();
               });
                
        },
        getDblist:function(){
            dbList().then(res=>{
                if(res.code==200){
                    this.dbList=res.data.list;
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        getDsList:function(){//  spc
            dsList().then(res=>{
                console.log('------------------');
                console.log(res)
                if(res.code==200){
                    this.dsList=res.data.list;
                    this.filterDsList= this.dsList.slice();
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        addOption:function(val){
           let last =val.slice(-1);
           if(last.length>0){
              if(last[0].indexOf(';')>=0){
                  this.$message.warning("参数值 "+last+" 中不能包含 ;");
                  val.pop();
              }
           }
            
        },
        submit:function(){
            this.$refs.dsForm.validate(res=>{
                if(res){
                    if(this.Form.configDataanalysis.calculationType!=3){//计量 计数

                   
                        //判断 sql  是否存在
                        if(!this.Form.configDataanalysis.selectSql || !this.Form.configDataanalysis.selectSql.trim()){
                            this.$message.warning("请填写SQL");
                            return false;
                        }

                        //sql  存在
                        if(this.Form.configDataanalysisParameterControl.length>0){
                            this.Form.configDataanalysisParameterControl.forEach(item=>{
                                if(item.parameterValueType==1&&item.parameterValueArr.length>0){
                                    item.parameterValue=item.parameterValueArr.join(";")
                                
                                } 
                            delete item.parameterValueArr;
                            })
                        }
                        if(this.type=='update'){
                            //添加configDataanalysisId
                            if(this.Form.configDataanalysisParameterAdditional.length>0){
                                this.Form.configDataanalysisParameterAdditional.forEach(item=>{
                                    item.configDataanalysisId=this.Form.configDataanalysis.configDataanalysisId;
                                })
                            }
                            if(this.Form.configDataanalysisParameterControl.length>0){
                                this.Form.configDataanalysisParameterControl.forEach(item=>{
                                    item.configDataanalysisId=this.Form.configDataanalysis.configDataanalysisId;
                                })
                            }
                        }
                        this.createLoading=true;
                    ///////// 接口
                        if(this.type=='create'){
                            dsCreate(this.Form).then(res=>{
                            this.createLoading=false;
                            if(res.code==200){
                                this.back();
                                //this.showAdd=false;
                                this.getDsList();
                                this.$message.success('创建数据分析成功');
                            }
                            else{
                                this.$message.error(res.message);
                            }
                        }); 
                        };
                        if(this.type=='update'){
                            dsUpdate(this.Form).then(res=>{
                            this.createLoading=false;
                            if(res.code==200){
                                this.back();
                                //this.showAdd=false;
                                this.$message.success('修改数据分析成功');
                                this.getDsList();
                            }
                            else{
                                this.$message.error(res.message);
                            }
                        }); 
                        }
                    }
                    else{
                        let data={
                            configDataanalysisMsaName:this.Form.configDataanalysis.configDataanalysisName,
                            tableName:this.Form.configDataanalysis.tableName,
                            fieldComponent:this.Form.configDataanalysis.fieldComponent,
                            fieldIndex:this.Form.configDataanalysis.fieldIndex,
                            fieldStaff:this.Form.configDataanalysis.fieldStaff,
                            fieldValue:this.Form.configDataanalysis.fieldValue,
                            configDatasourceId:this.Form.configDataanalysis.configDatasourceId,
                            comment:this.Form.configDataanalysis.comment
                            
                        }
                        this.Form.msaAdditional.forEach(item=>{
                             if(item.parameterValueArr.length>0){
                                 data[item.parameter]=item.parameterValueArr.join(";");
                             }
                             else{
                                 data[item.parameter]="";
                             }
                        });
                        //接口
                        console.log(data);
                        if(this.type=='create'){
                              dsMsaCreate(data).then(res=>{
                                   this.createLoading=false;
                                    if(res.code==200){
                                        this.back();
                                        //this.showAdd=false;
                                        this.getDsMsaList();
                                        this.$message.success('创建数据分析成功');
                                    }
                                    else{
                                        this.$message.error(res.message);
                                    }
                              });
                        };
                        if(this.type=='update'){
                            data.configDataanalysisMsaId=this.Form.configDataanalysis.configDataanalysisMsaId;
                            this.createLoading=false;
                            dsMsaUpdate(data).then(res=>{
                                if(res.code==200){
                                    this.back();
                                    //this.showAdd=false;
                                    this.$message.success('修改数据分析成功');
                                    this.getDsList();
                                }
                                else{
                                    this.$message.error(res.message);
                                }
                            });
                            
                        }; 
                    }
            }
            });      
        },
        sqlChange:function(){
           if(!this.Form.configDataanalysis.calculationType){
               this.$message.warning("请选择分析类型");
           }
           else{
             this.analysis();
           }
        },
        filterDs:function(){ // 搜索
            if(this.searchDatasource){
                let reg=new RegExp("^" + this.searchDatasource ,"gi");
                if(this.dsList.length>0){
                    this.filterDsList=this.dsList.filter(ds=>reg.test(ds.configDataanalysisName));
                }
                else{
                     this.filterDsList=this.dsList.slice(); 
                }

                if(this.dsMsaList.length>0){
                    this.filterDsMsaList=this.dsMsaList.filter(msa=>reg.test(msa.configDataanalysisMsaName));
                }
                else{
                     this.filterDsMsaList=this.dsMsaList.slice(); 
                }
            }
            else{
                this.filterDsList=this.dsList.slice(); 
                this.filterDsMsaList=this.dsMsaList.slice();  
            }
        },
        showUpdate:function(ds,index,type){
            this.type="update";
            this.Booleananalysis=false;
           
            if(type=='spc'){// 计量 计数
                dsDetail({configDataanalysisId:ds.configDataanalysisId}).then(res=>{
                    console.log(res);
                    if(res.code==200){
                         this.showAdd=true;
                            if(res.data.configDataanalysisParameterAdditional.length>0){
                            res.data.configDataanalysisParameterAdditional.forEach(item=>{
                                this.Form.configDataanalysisParameterAdditional.push({
                                    field:item.field,
                                    fieldComment:item.fieldComment
                                })
                            })
                            }
                            if(res.data.configDataanalysisParameterControl.length>0){
                            res.data.configDataanalysisParameterControl.forEach(item=>{
                                    let obj={
                                    parameter:item.parameter,
                                    parameterValueType:item.parameterValueType,
                                    parameterValue:item.parameterValue,
                                    parameterValueArr:[],
                                    comment:item.comment,
                                    sectionStart:item.sectionStart,
                                    sectionOff:item.sectionOff,
                                    sectionValue:item.sectionValue,
                                    symbol:item.symbol,
                                    }
                                    if(item.parameterValueType==1){
                                        obj.parameterValueArr=obj.parameterValue.split(";");
                                    }
                                this.Form.configDataanalysisParameterControl.push(obj);
                                
                            })
                            }
                        this.Form.configDataanalysis=Object.assign({},this.Form.configDataanalysis,res.data.configDataanalysis);
                        //this.Form.configDataanalysisParameterAdditional=res.data.configDataanalysisParameterAdditional.slice();
                        //this.Form.configDataanalysisParameterControl=res.data.configDataanalysisParameterControl.slice();
                    }
                    else{
                        this.$message.error(res.message);
                    }
                });
            }
            if(type=='msa'){ // msa
                dsMsaDetail({configDataanalysisMsaId:ds.configDataanalysisMsaId}).then(res=>{
                   if(res.code==200){
                      this.showAdd=true;
                       //
                      this.Form.configDataanalysis=Object.assign({},this.Form.configDataanalysis,res.data);
                      this.Form.configDataanalysis.configDataanalysisName=res.data.configDataanalysisMsaName
                      this.Form.configDataanalysis.calculationType=3;
                      //  附加信息的处理
                      this.Form.msaAdditional.forEach(item=>{
                        if(res.data[item.parameter]){
                             item.parameterValueArr=res.data[item.parameter].split(";")
                        }
                      });
                   }
                   else{
                        this.$message.error(res.message);
                   }
                });
            }
           
        },
        getDsMsaList:function(){//  spc
            dsMsaList().then(res=>{
                console.log('------------------');
                console.log(res)
                if(res.code==200){
                    this.dsMsaList=res.data.list;
                    this.filterDsMsaList= this.dsMsaList.slice();
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
    },
    watch:{
        'Form.configDataanalysis.calculationType':function(){
            if(this.Form.configDataanalysis.calculationType==3){
                this.dsRules.configDataanalysis={
                    configDataanalysisName:[
                        {required:true,message:'请填写数据分析名称',trigger:"change,blur"}
                    ],  
                    calculationType:[
                        {required:true,message:'请选择分析类型',trigger:"change,blur"}
                    ], 
                    configDatasourceId:[
                        {required:true,message:'请选择数据源',trigger:"change,blur"}
                    ],
                    tableName:[
                        {required:true,message:'请填写表名称',trigger:"change,blur"}
                    ],
                    fieldComponent:[
                        {required:true,message:'请填写测量部件字段名',trigger:"change,blur"}
                    ],
                    fieldIndex:[
                        {required:true,message:'请填写测量序号字段名',trigger:"change,blur"}
                    ],
                    fieldStaff:[
                        {required:true,message:'请填写测量人员字段名',trigger:"change,blur"}
                    ],
                    fieldValue:[
                        {required:true,message:'请填写测量值字段名',trigger:"change,blur"}
                    ]
                }
            }
            else{
                this.dsRules.configDataanalysis={
                    configDataanalysisName:[
                        {required:true,message:'请填写数据分析名称',trigger:"change,blur"}
                    ],  
                    calculationType:[
                        {required:true,message:'请选择分析类型',trigger:"change,blur"}
                    ], 
                    configDatasourceId:[
                        {required:true,message:'请选择数据源',trigger:"change,blur"}
                    ]
                }
            }
        }
    },
    created:function(){
        this.getDblist();
        this.getDsList();
        this.getDsMsaList();
        this.$on('init',()=>{
           this.showAdd=false;
           this.searchDatasource="";
           this.filterDs();
       })
    }
}
</script>

