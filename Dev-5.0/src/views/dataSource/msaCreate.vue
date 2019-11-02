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
                                <el-card v-show="filterDsMsaList.length>0" class="box-card m-t-5"  :body-style="{padding: '6px' }" 
                                  v-for="(msa,index) in filterDsMsaList" :key="msa.configDataanalysisMsaId+'msa'">
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
                                <div class="Empty text-center" v-show="filterDsMsaList.length==0">
                                        没有查询到数据分析项
                                </div>
                            </div>
            </el-col>
        </el-row>
        <!--创建数据源-->
        <div  v-if="showAdd">
            <!--数据源信息-->
            <el-form   class="small-space Form setting-form FormError"  ref="dsForm" size="mini" :model="Form" :rules="dsRules" label-position="right" label-width="130px"
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
                <!-- <el-form-item label="分析类型 :"  size="mini" prop="configDataanalysis.calculationType">
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
                </el-form-item> -->
              
                <div >
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
import {
  dsMsaCreate,
  dsMsaUpdate
} from "@/api/dataSource"
import mixins from './mixins'
export default {
    mixins:[mixins],
    data(){
        return {
            dsRules: {
                configDataanalysis: {
                configDataanalysisName: [{
                    required: true,
                    message: '请填写名称',
                    trigger: 'change,blur'
                }],
                calculationType: [{
                    required: true,
                    message: '请选择分析类型',
                    trigger: 'change,blur'
                }],
                projectType: [{
                    required: true,
                    message: '请选择分析项类型',
                    trigger: 'change,blur'
                }],
                configDatasourceId: [{
                    required: true,
                    message: '请选择数据源',
                    trigger: 'change,blur'
                }],
                tableName: [{
                    required: true,
                    message: '请填写表名称',
                    trigger: 'change,blur'
                }],
                fieldComponent: [{
                    required: true,
                    message: '请填写测量部件字段名',
                    trigger: 'change,blur'
                }],
                fieldIndex: [{
                    required: true,
                    message: '请填写测量序号字段名',
                    trigger: 'change,blur'
                }],
                fieldStaff: [{
                    required: true,
                    message: '请填写测量人员字段名',
                    trigger: 'change,blur'
                }],
                fieldValue: [{
                    required: true,
                    message: '请填写测量值字段名',
                    trigger: 'change,blur'
                }]
                }

            },
        }
    },
    methods:{
        submit: function () {
            this.$refs.dsForm.validate(res => {
                if (res) {
                
                    let data = {
                    configDataanalysisMsaName: this.Form.configDataanalysis.configDataanalysisName,
                    tableName: this.Form.configDataanalysis.tableName,
                    fieldComponent: this.Form.configDataanalysis.fieldComponent,
                    fieldIndex: this.Form.configDataanalysis.fieldIndex,
                    fieldStaff: this.Form.configDataanalysis.fieldStaff,
                    fieldValue: this.Form.configDataanalysis.fieldValue,
                    configDatasourceId: this.Form.configDataanalysis.configDatasourceId,
                    comment: this.Form.configDataanalysis.comment

                    }
                    this.Form.msaAdditional.forEach(item => {
                    if (item.parameterValueArr && item.parameterValueArr.length > 0) {
                        data[item.parameter] = item.parameterValueArr.join(";");
                    } else {
                        data[item.parameter] = "";
                    }
                    });
                    // 接口
                    console.log(data);
                    if (this.type == 'create') {
                    dsMsaCreate(data).then(res => {
                        this.createLoading = false;
                        if (res.code == 200) {
                        this.back();
                        //this.showAdd=false;
                        this.getDsMsaList();
                        this.$message.success(res.message);
                        } else {
                        this.$message.error(res.message);
                        }
                    });
                    };
                    if (this.type == 'update') {
                    data.configDataanalysisMsaId = this.Form.configDataanalysis.configDataanalysisMsaId;
                    this.createLoading = false;
                    dsMsaUpdate(data).then(res => {
                        if (res.code == 200) {
                        this.back();
                        //this.showAdd=false;
                        this.$message.success(res.message);
                        this.getDsList();
                        } else {
                        this.$message.error(res.message);
                        }
                    });

                    };

                }
            
            });
        },
       
    },
    created:function(){
        this.getDblist();
        // this.getDsList();
        this.getDsMsaList();
        this.$on('init',()=>{
           this.showAdd=false;
           this.searchDatasource="";
           this.filterDs();
       })
    }
}
</script>>

