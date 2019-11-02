<template>
  <div class="app-container pt-none">
    <div class="m-t">
       <el-row>
        <el-col :span="12">
          <span class="TITLE" >MSA 任务创建</span>
        </el-col>
        <el-col :span="24" class="STEPS">
            <el-steps  :active="stepActive"  align-center  finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="分析配置"></el-step>
                <el-step title="判异配置"></el-step>
            </el-steps>
        </el-col>
      </el-row> 
    </div>
   <div  class="m-t">
        <el-form label-position="right"  v-show="stepActive==1"    label-width="80px" ref="msaForm1" :model="configForm" :rules="rules"  class="Form" size="mini">
            <el-row style="overflow:hidden;">
              <div>
                <el-col :xs="{span:20,offset:2}" :sm="{span:18,offset:3}" 
                :md="{span:14,offset:5}" :lg="{span:12,offset:6}" :xl="{span:12,offset:6}" class="setting" >
                    <!-- <p  class="setTitle">基本信息</p> -->
                   <el-form-item  label="任务名称 :" prop="config_name">
                        <el-input  v-model="configForm.config_name"> </el-input>
                    </el-form-item>
                    <!-- <el-form-item  label="小数位数 :" prop="decimal_digits">
                       <el-input  v-model.number="configForm.decimal_digits"> </el-input>
                    </el-form-item> -->
                   
                    <el-form-item  label="数据来源 :" prop="spc_source_id">
                        <el-select v-model="configForm.spc_source_id"  @change="getSourceFields" clearable> 
                            <el-option v-for="source in dataSourceLists" 
                            :key="source.spc_source_id"
                            :label="source.source_name"
                            :value="source.spc_source_id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="控制信息 :" required  v-show="configForm.spc_source_id && dataSourceFields.length>0">
                      <el-row v-for="(fields,index) in  dataSourceFields" :key="fields.spc_fields_id">
                          <el-col :span="11">
                              <div class="el-input el-input--mini">
                               <span style="vertical-align:middle;line-height:28px;background:#ddd" class="el-input__inner">{{fields.fields_name}}</span>
                              </div>
                          </el-col>
                          <el-col :span="11" :offset="2">
                             <el-form-item>
                                <el-select v-if="msaFieldsOptionsList[fields.fields_id] && msaFieldsOptionsList[fields.fields_id].length>0"
                                  v-model="configForm.fields_info[index].spc_fields_options_id"
                                    clearabl
                                  >
                                      <el-option v-for="options in msaFieldsOptionsList[fields.fields_id]"
                                        :key="options.spc_fields_options_id"
                                        :label="options.fields_options_name"
                                        :value='options.spc_fields_options_id'
                                      ></el-option>  
                                </el-select>

                              </el-form-item>
                         </el-col>
                       </el-row>
                    </el-form-item>
                     <el-form-item  label="备注 :" >
                        <el-input  v-model="configForm.comment"> </el-input>
                    </el-form-item>
                </el-col>
              </div>
            </el-row>        
        </el-form>

        <el-form label-position="right"  v-show="stepActive==2"    label-width="80px" ref="msaForm2" :model="configForm" :rules="rules " class="Form" size="mini">
             <el-row style="overflow:hidden;">
                  <div>
                   <el-col :xs="{span:20,offset:2}" :sm="{span:18,offset:3}" 
                :md="{span:14,offset:5}" :lg="{span:12,offset:6}" :xl="{span:12,offset:6}" class="setting" >
                    <!-- <p class="setTitle">计量型</p> -->
                        <el-form-item  label="管制图形 :" required >
                          <el-select v-model="empty"  disabled>
                              <el-option 
                                label="GageR&R"  
                                value='1'
                              ></el-option>
                            
                          </el-select>
                        </el-form-item>
                        <el-form-item  label="规格上限 :" prop="usl">
                        <el-input  v-model.number="configForm.usl"> </el-input>
                        </el-form-item>
                        <el-form-item  label="规格下限 :"  prop="lsl">
                        <el-input  v-model.number="configForm.lsl" > </el-input>
                        </el-form-item>
                        <el-form-item  label="目标值 :"  prop="target_value">
                            <el-input  v-model.number="configForm.target_value" > </el-input>
                        </el-form-item>
                        <el-form-item  label="测量次数 :" prop="recent_groups">
                          <el-input  v-model.number="configForm.recent_groups"  :disabled="allRecentGroups"> 
                              <!-- <el-checkbox v-model.number="allRecentGroups"  slot="append"  label="全部"></el-checkbox> -->
                          </el-input>
                        </el-form-item>
                        <el-form-item  label="测量人员 :"  required>
                            <el-row  v-for="(msaStaff,index) in configForm.msa_info.staff" :key="msaStaff.spc_fields_options_id">
                                <el-col :span="10">
                                  <el-select 
                                  v-model="msaStaff.spc_fields_id"  
                                  @change="getFieldsOPtionsAll({type:'staff',index:index,fields_id:''})">
                                      <el-option  v-for="fields in msaFieldsList"
                                         :label="fields.fields_name"
                                         :value="fields.spc_fields_id"
                                         :key="fields.spc_fields_id+'_a_'+fields.fields_name"
                                      >
                                      </el-option>
                                  </el-select>
                                </el-col>
                                <el-col :span="10" v-show="msaStaff.spc_fields_id">
                                    <el-select   v-model="msaStaff.spc_fields_options_id"
                                     @change="addMasStaff"
                                    >
                                        <el-option  v-for="options in filterMsaFieldsOptionsList(msaStaff.spc_fields_id) "
                                        
                                          :label="options.fields_options_name"
                                          :value="options.spc_fields_options_id"
                                          :key="options.spc_fields_options_id+'a'+options.fields_options_name"
                                          :disabled="options.disabled"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="4" class="text-right" v-show="msaStaff.spc_fields_options_id">
                                   <el-button  icon="el-icon-delete" @click="delMasStaff(index,'staff')" v-show="index < configForm.msa_info.staff.length-1" ></el-button>
                                 
                                </el-col>
                            </el-row>
                        </el-form-item>
                          <el-form-item  label="测量部件 :"  required>
                            <el-row  v-for="(msaCom,index) in configForm.msa_info.components" :key="msaCom.spc_fields_options_id+Math.random()">
                                <el-col :span="10">
                                  <el-select 
                                  v-model="msaCom.spc_fields_id"  
                                  @change="getFieldsOPtionsAll({type:'components',index:index,fields_id:''})">
                                      <el-option  v-for="fieldsCom in msaFieldsList"
                                         :label="fieldsCom.fields_name"
                                         :value="fieldsCom.spc_fields_id"
                                         :key="fieldsCom.spc_fields_id+'_b_'+fieldsCom.fields_name"
                                      >
                                      </el-option>
                                  </el-select>
                                </el-col>
                                <el-col :span="10" v-show="msaCom.spc_fields_id">
                                    <el-select   v-model="msaCom.spc_fields_options_id"
                                     @change="addMasComponents"
                                    >
                                        <el-option  v-for="optionsCom in filterMsaFieldsOptionsList(msaCom.spc_fields_id)"
                                          :label="optionsCom.fields_options_name"
                                          :value="optionsCom.spc_fields_options_id"
                                          :key="optionsCom.spc_fields_options_id+'b'+optionsCom.fields_options_name"
                                          :disabled="optionsCom.disabled"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="4" class="text-right" v-show="msaCom.spc_fields_options_id">
                                   <el-button  icon="el-icon-delete" @click="delMasStaff(index,'components')" v-show="index < configForm.msa_info.components.length-1" ></el-button>
                                 
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-col>
                  </div>
              </el-row>        
        </el-form>

        <el-row  v-show="stepActive==3">
          <div>
            <el-col :sm="{span:20,offset:2}" :md="{span:18,offset:3}" :lg="{span:16,offset:4}" :xl="{span:16,offset:4}" class="Table">
            <el-table 
              ref='multipleTable'
              :data="pyData"
              tooltip-effect="dark"
              style="width: 100%;overflow:hidden"
              border
              size="mini"
               row-key="rule_num"
               @select="selectRules"
               @select-all="selectAllRules"
            >
              <el-table-column
                type="selection"
                :reserve-selection="true"

                width="30px">
              </el-table-column>
              <el-table-column
                label="编号"
                prop="rule_num"
                width="50px">
              </el-table-column>
              <el-table-column
                prop="rule"
                label="现行规则"
                min-width="10px"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                prop="ruleBase"
                label="规则依据"
                min-width="10px"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
               
                label="操作"
                width="100px"
                align="center"
                show-overflow-tooltip>
                <template slot-scope="scope">
                      <el-button size="mini"  :type="judgeSelect.indexOf(scope.row.rule_num)==-1?'info':'primary'" :disabled="judgeSelect.indexOf(scope.row.rule_num)==-1"  @click="rowDbclick(scope)" >编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
            </el-col> 
          </div>  
        </el-row>

        <el-row>
          <el-col :span="24">
            <div style="border-top:1px solid #ebeef5;margin-top:20px;text-align:center;padding-top:20px;margin-bottom:-10px">
              <el-button type="primary"  size="mini" :loading="loadingSave" 
                      v-show="stepActive>2"  @click="submit"
                >提交</el-button>
                <!-- <el-button size="mini"  @click="cancel">重置</el-button> -->
                <el-button size="mini" type="primary" @click="preStep" :disabled="stepActive<=1">上一步</el-button>
                <el-button size="mini" type="primary"  @click="nextStep" :disabled="stepActive>2">下一步</el-button>
            </div>
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
        <el-form label-position="right" label-width="40px" :model="configForm"  class="Form" size="mini">
            <el-form-item v-for="(val, k, index) in selectedPy"
             v-if="k!=='rule_num'" :key="index+'_'+k"  :label="'['+ k +'] =' ">
                  <el-input v-model="selectedPy[k]"></el-input>
            </el-form-item>
        </el-form>
        <div style="border-top:1px solid #ebeef5;margin-top:20px;text-align:center;padding-top:20px;margin-bottom:-10px">
            <span slot="footer" class="dialog-footer" >
                <el-button type="primary"  size="mini" :loading="loadingSave" @click="changePy">修改</el-button>
                <el-button size="mini"  @click="cancelChangePy">取消</el-button>
            </span>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { dataSourceList, dataSourceDetail } from "@/api/dataSource";
import {
  msaCreate,
} from "@/api/msaDoe/msa";
import { fieldsOptionsAll } from "@/api/config/fieldsOption.js";
import { fieldsAll } from "@/api/config/fields.js";
export default {
  data() {
        let uslValidate=(rule,value,callback)=>{
             if(value){
                let reg=/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/;
                  if(reg.test(value) && value>0){
                        if(this.configForm.lsl && value <= this.configForm.lsl){
                              callback(new Error('规格上限必须大于规格下限'));
                        }
                        else  if(this.configForm.target_value && value <= this.configForm.target_value){
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
        }
        let lslValidate=(rule,value,callback)=>{
             if(value){
                let reg=/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/;
                  console.log('usl');
                  if(reg.test(value) && value>0){
                        if(this.configForm.usl && value >= this.configForm.usl){
                             callback(new Error('规格下限必须小于规格上限'));
                         }
                        else if(this.configForm.target_value && value >= this.configForm.target_value){
                                callback(new Error('规格下限必须小于目标值'));
                        }
                        else{
                           callback();
                        }
                       
                  }
                  else{
                      callback(new Error('规格下限只能是>=0的数字'));
                  }
             }
             else{
               callback();
             }
        }
        let targetValidate=(rule,value,callback)=>{
              if(value){
                let reg=/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/;
                  if(reg.test(value) && value>0){
                        if(this.configForm.usl && value >= this.configForm.usl){
                              callback(new Error('目标值必须小于规格上限'));
                        }
                        else if(this.configForm.lsl && value <= this.configForm.lsl){
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
        }

    return {
      stepActive: 1,
      graphType: "",
      empty: "1",
      pyNum: [
        {
          rule_num: 1,
          n: "1",
          m: "3"
        },
        {
          rule_num: 2,
          n: "9"
        },
        {
          rule_num: 3,
          n: "6"
        },
        {
          rule_num: 4,
          n: "14"
        },
        {
          rule_num: 5,
          n: "3",
          m: "2",
          k: "2"
        },
        {
          rule_num: 6,
          n: "5",
          m: "4",
          k: "1"
        },
        {
          rule_num: 7,
          n: "15",
          m: "1"
        },
        {
          rule_num: 8,
          n: "8",
          m: "1"
        }
      ],
      loadingSave: false,
      rules:{
        config_name:[
          {
            required:true,message:'请填写任务名称',trigger:'change,blur'
          }
        ],
        // decimal_digits:[
        //    {
        //     required:true,message:'请填写小数位数',trigger:'change,blur'
        //    },
        //    {
        //     type:'number',min:0,message:'小数位数只能是>=0的数字',trigger:'change,blur'
        //    }
        // ],
        spc_source_id:[
          {
            required:true, message:'请选择数据来源',trigger:'change,blur'
          }
        ],
        usl:[
          { required:true,message:'请填写规格上限',trigger:'change,blur'},
          { type:'number', min:0,message:'规格上限只能是>=0的数字',trigger:'change,blur'},
          { validator: uslValidate,trigger:'change,blur'}

        ],
        lsl:[
          { required:true,message:'请填写规格下限',trigger:'change,blur'},
          { type:'number',min:0,message:'规格下限只能是>=0的数字',trigger:'change,blur'},
          { validator: lslValidate,trigger:'change,blur'}
       
        ],
        target_value:[
              { validator: targetValidate,trigger:'change,blur'}
        ], 
        recent_groups:[
           { required:true,message:'请填写测量次数',trigger:'change,blur'},
           { type:'number',min:0,message:'测量次数只能是>=0的数字',trigger:'change,blur'}
         ]
      },
      configForm: {
        config_name: "",
        decimal_digits: 2,
        recent_groups: "",
        spc_source_id: "",
        usl:'',
        lsl:'',  
        target_value: "",
        comment:'',
        rules_info: [],
        fields_info: [],
        msa_info:{
          staff:[
             {
                type:1,
                spc_fields_id:'',
                spc_fields_options_id:''
             }
          ],
          components:[
             {
                type:2,
                spc_fields_id:'',
                spc_fields_options_id:''
             }
    
          ]
        }
      },
      config: {
        config_name: "",
        decimal_digits: "",
        recent_groups: "",
        spc_source_id: "",
        usl: "",
        lsl: "",
        target_value: "", 
        comment: "",
        rules_info: [],
        fields_info: [],
        msa_info:{
          staff:[
             {
                type:1,
                spc_fields_id:'',
                spc_fields_options_id:''
             }
          ],
          components:[
             {
                type:2,
                spc_fields_id:'',
                spc_fields_options_id:''
             }
    
          ]
        }
      },
      info: {
        usl: ""
      },
      dataSourceLists: [],
      dataSourceFields:[],
      msaFieldsList: [],
      msaFieldsOptionsList:{}, //测试人员&测试零件&控制信息_options
      //msaComponentsFieldsOptionsList:{},//测试零件_options
      // dataSourcefieldsOptionsList: {}, //{spc_fields_id:{spc_fields_name:'',spc_fields_id:'',spc_fields_options_id:''}}
      multipleSelection: [], //所有被选中的判异规则
      showChangePy: false,
      selectedPy: "", //{rule_num:'',n:'',m:'',k:''}
      changePyForm: {
        n: "",
        m: "",
        k: ""
      },
      selectedPyIndex: "",
      pyData: [],
      allRecentGroups: false
    };
  },
  methods: {
    nextStep: function() {
     let stepActive = this.stepActive + 1;
     let self=this;
     if(stepActive==2){
         self.$refs.msaForm1.validate(res=>{
              if(res){
              //控制信息
              let flag=false;
                if(this.configForm.fields_info.length>0){
                      this.configForm.fields_info.forEach(item=>{
                           if(!item.spc_fields_options_id){
                               flag=true;
                           }
                      });
                }
                if(flag){
                    self.$message.warning('请选择所有的控制信息');
                    return false;
                }

              //
                self.stepActive=stepActive;
              }
         })
     }
     if(stepActive==3){
        self.$refs.msaForm2.validate(res=>{
              if(res){
                //测试人员  测试零件  最少要选两个
                if(self.configForm.msa_info.staff.length<=2){
                    self.$message.warning('请最少填写两个信息完整的测试人员');
                    return false;
                 }
                if(self.configForm.msa_info.staff.length>2){
                   let count=0;
                    self.configForm.msa_info.staff.forEach(staff=>{
                         if(staff.spc_fields_id && staff.spc_fields_options_id){
                             count++;
                         }
                    })
                    if(count<2){
                        self.$message.warning('请最少填写两个信息完整的测量人员');
                        return false;
                    }
                 }
                 /////测试零件
                if(self.configForm.msa_info.components.length<=2){
                    self.$message.warning('请最少填写两个信息完整的测量部件');
                    return false;
                 }
                if(self.configForm.msa_info.components.length>2){
                   let count=0;
                    self.configForm.msa_info.components.forEach(staff=>{
                         if(staff.spc_fields_id && staff.spc_fields_options_id){
                             count++;
                         }
                    })
                    if(count<2){
                        self.$message.warning('请最少填写两个信息完整的测量部件');
                        return false;
                    }
                }
                  self.stepActive=stepActive;
              }
        });
     }
    },
    preStep: function() {
    
        this.stepActive = this.stepActive - 1;
    
    },
    submit: function() {
      let self = this;
      self.loadingSave = true;
      //self.configForm.data_info=JSON.stringify(self.configForm.data_info);
      let data = Object.assign({}, self.configForm);
      data.rules_info = [];
      // if (self.spcActionType == "create") {
      if (self.multipleSelection.length > 0) {
        self.multipleSelection.forEach(function(item) {
          let obj = self.pyNum[Number(item.rule_num) - 1];
          data.rules_info.push(obj);
        });
      }

      if (self.allRecentGroups) {
          data.recent_groups = "-1";
      }
      let staff=data.msa_info.staff.slice();
      let com=data.msa_info.components.slice();
      
      let arr=[...staff,...com];
      data.msa_info=arr.filter(item=>item.spc_fields_options_id);
      //console.log(data)
      msaCreate(data).then(function(res) {
        console.log(res);
        self.loadingSave = false;
        if (res.resCode == 0) { 
          self.$router.push('/msa');
          self.$message.success(res.msg);
         
          //self.configList.unshift(res.data);
        } else {
          self.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
      // }
    },
    cancel: function() {
      let self = this;
      self.loadingSave = false;
      self.configForm = Object.assign({}, self.config);
      self.$refs.multipleTable.clearSelection();
    },
    getDataSourceList: function() {
      let self = this;
      dataSourceList({type:3}).then(function(res) {
        if (res.resCode == 0) {
          self.dataSourceLists = res.data.sourceList;
          //
        } else {
          self.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    getSourceFields: function(val) {
      //获取dataSource 已经选择的fields
      let self = this;
      self.dataSourcefieldsOptionsList = {};
      //val=source_id  从sourceList 得到 data_type
      let selectSource = self.dataSourceLists.filter(
        source => source.spc_source_id == val
      );
      console.log(selectSource);
      self.graphType = selectSource[0]["data_type"];
      //

      //self.configForm.control_graph = val.split(",")[1] + "";
      //=val.split(",")[1];
      // self.configForm.spc_source_id='';
      dataSourceDetail({ spc_source_id: val }).then(function(res) {
        if (res.resCode == 0) {
          console.log(res);
          self.dataSourceFields =[];
          self.configForm.fields_info = [];
          if (res.data.fields_info && res.data.fields_info.length > 0 && res.data.fields_info[0].fields_id>0) {
            self.dataSourceFields = res.data.fields_info;
           for (let o of res.data.fields_info) {
              let obj = {
                spc_fields_id: o.fields_id,
                spc_fields_options_id: o.spc_fields_options_id
                  ? o.spc_fields_options_id
                  : ""
              };
              self.configForm.fields_info.push(obj);
              //fields-options
              let obj1 = o;
              self.getFieldsOPtionsAll({fields_id:obj1.fields_id});
            }
          }
        } else {
          self.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    getFieldsAll:function(){
        let self=this;
        fieldsAll({}).then(function(res){
             if(res.resCode==0){
                self.msaFieldsList=res.data;
             }
             else{
               self.$message.error(res.msg);
             }
        });

    },
    getFieldsOPtionsAll:function(obj){
        let self=this;
        console.log(obj);
        let  fields_id;
        if(obj.fields_id){
          fields_id=obj.fields_id
        }
        else{
            if(obj.type=='staff'){
              fields_id=self.configForm.msa_info.staff[obj.index].spc_fields_id;
              self.configForm.msa_info.staff[obj.index].spc_fields_options_id='';
          }
          if(obj.type=='components'){
              fields_id=self.configForm.msa_info.components[obj.index].spc_fields_id;
              self.configForm.msa_info.components[obj.index].spc_fields_options_id='';
          }
        }
       
        if(fields_id && !self.msaFieldsOptionsList[fields_id]){
           fieldsOptionsAll({spc_fields_id:fields_id}).then(function(res){
            if(res.resCode==0){
                //self.msaFieldsOptionsList=res.data;
                self.$set(self.msaFieldsOptionsList,fields_id,res.data);
            }
            else{
              self.$message.error(res.msg);
            }
          });
        }
       
    },
    selectRules: function(selection, row) {
      let self = this;
      self.multipleSelection = selection;
    },
    selectAllRules: function(selection) {
      console.log("select-all");
      console.log(selection);
      this.multipleSelection = selection;
    },
    rowDbclick: function(scope) {
     console.log(scope);
      let self = this,
        row=scope.row;
          self.showChangePy = true;
            self.pyNum.forEach(function(item, index) {
              if (item.rule_num == scope.row.rule_num) {
                self.selectedPy = Object.assign({}, item);
                self.selectedPyIndex = index;
              }
            });
    
    
    },
    cancelChangePy: function() {
      this.showChangePy = false;
    },
    changePy: function() {
      let self = this;
      function change() {
        let obj = self.pyNum[self.selectedPyIndex];
        for (let attr in self.selectedPy) {
          if (attr !== "rule_num") {
            if (self.selectedPy[attr]) {
              obj[attr] = self.selectedPy[attr];
            }
          }
        }
        self.pyNum.splice(self.selectedPyIndex, 1, obj);
        self.showChangePy = false;
        self.selectedPy = { n: "", m: "", k: "" };
      }
      change();
    },
    getPyData: function() {
      let self = this;
      // let datas=self.$options.data().pyNum;
      let pyData = [
        {
          rule_num: "1",
          rule: `${self.pyNum[0].n}个点落在${self.pyNum[0].m}倍Sigma区外`,
          ruleBase: "[n]个点落在[m]倍Sigma区外"
        },
        {
          rule_num: "2",
          rule: `连续${self.pyNum[1].n}个点落在中心线的同一侧`,
          ruleBase: "连续[n]个点落在中心线的同一侧"
        },
        {
          rule_num: "3",
          rule: `连续${self.pyNum[2].n}个点递增或递减`,
          ruleBase: "连续[n]个点递增或递减"
        },
        {
          rule_num: "4",
          rule: `连续${self.pyNum[3].n}个点中相邻点交替上下`,
          ruleBase: "连续[n]个点中相邻点交替上下"
        },
        {
          rule_num: "5",
          rule: `连续${self.pyNum[4].n}个点中有${
            self.pyNum[4].m
          }个点落在中心线的同一侧的${self.pyNum[4].k}倍Sigma区以外`,
          ruleBase: "连续[n]个点中有[m]个点落在中心线的同一侧的[k]倍Sigma区以外"
        },
        {
          rule_num: "6",
          rule: `连续${self.pyNum[5].n}个点中有${
            self.pyNum[5].m
          }个点落在中心线的同一侧的${self.pyNum[5].k}倍Sigma区以外`,
          ruleBase: "连续[n]个点中有[m]个点落在中心线的同一侧的[k]倍Sigma区以外"
        },
        {
          rule_num: "7",
          rule: `连续${self.pyNum[6].n}个点落在中心线两侧的${
            self.pyNum[6].m
          }倍Sigma区域内`,
          ruleBase: "连续[n]个点落在中心线两侧的[m]倍Sigma区域内"
        },
        {
          rule_num: "8",
          rule: `连续${self.pyNum[7].n}个点落在中心线两侧且无一在${
            self.pyNum[7].m
          }倍Sigma区内`,
          ruleBase: "连续[n]个点落在中心线两侧且无一在[m]倍Sigma区内"
        }
      ];
      self.pyData = pyData;
      self.multipleSelection=pyData;
     
      //let self=this;
    },
    addMasStaff:function(){
      let obj= this.configForm.msa_info.staff.slice(-1);
      if(obj[0].spc_fields_options_id){
          this.configForm.msa_info.staff.push({
            type:1,
            spc_fields_id:'',
            spc_fields_options_id:''
          });
      }
      
    },
    addMasComponents:function(){
         let obj= this.configForm.msa_info.components.slice(-1);
      if(obj[0].spc_fields_options_id){
          this.configForm.msa_info.components.push({
            type:2,
            spc_fields_id:'',
            spc_fields_options_id:''
          });
      }
      
    },
    delMasStaff:function(index,type){
       if(type=='staff'){
          this.configForm.msa_info.staff.splice(index,1);
       }
        if(type=='components'){
          this.configForm.msa_info.components.splice(index,1);
       }   
    },
     filterMsaFieldsOptionsList: function(spc_fields_id) {
      //测试人员  测试零件 的次级信息不能重复
      let selInfo = [],
        self = this;
      for (let obj in self.configForm.msa_info) {
        if (self.configForm.msa_info[obj].length > 0) {
          self.configForm.msa_info[obj].forEach(item => {
            if (item.spc_fields_options_id) {
              selInfo.push(item.spc_fields_options_id);
            }
          });
        }
      }
      let arr = [];
      if (
        self.msaFieldsOptionsList[spc_fields_id] &&
        self.msaFieldsOptionsList[spc_fields_id].length > 0
      ) {
        arr = self.msaFieldsOptionsList[spc_fields_id].map(info => {
          if (selInfo.indexOf(info.spc_fields_options_id) >= 0) {
            info.disabled = true;
          } else {
            info.disabled = false;
          }
          return info;
        });
      }

      return arr;
    },
  },
  computed:{
      judgeSelect:function(){
                let arr=[];
                if(this.multipleSelection.length>0){
                  this.multipleSelection.filter(item=>{
                        arr.push(item.rule_num);
                  });
                }
                return arr;     
          }
  },
  watch: {
    pyNum: function() {
      console.log("watch---------");
      this.getPyData();
      //  console.log('------toggleRowSelection-------');
    }
  },
  mounted: function() {
    this.getDataSourceList();
    this.getFieldsAll();
    let self=this;
    let pyData=new Promise(function(resolve,reject){
      self.getPyData(); 
      resolve();
    });
    pyData.then(()=>{
         self.multipleSelection=self.pyData;
            if (self.multipleSelection.length > 0) {
              self.multipleSelection.forEach(row => {
                self.$refs.multipleTable.toggleRowSelection(row, true);
            });
            
         }
    });
  }
};
</script>

<style scoped>
</style>
