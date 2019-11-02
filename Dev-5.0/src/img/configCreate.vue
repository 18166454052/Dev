<template>
  <div class="app-container pt-none">
    <div class="m-t">
       <el-row>
        <el-col :span="12">
          <span style="border-left:4px solid #ebeef5;padding-left:10px;line-height:35px" >SPC Config  Create</span>
        </el-col>
        <el-col :span="24">
            <el-steps  :active="stepActiv"  align-center  finish-status="success">
                <el-step title="步骤一"></el-step>
                <el-step title="步骤二"></el-step>
                <el-step title="步骤三"></el-step>
            </el-steps>
        </el-col>
      </el-row> 
    </div>
   <div  class="m-t">
        <el-form label-position="right" label-width="80px" :model="configForm"  class="Form" size="mini">
            <el-row  style="overflow:hidden">
                  <div v-show="stepActiv==0">

                <el-col :span="10"  :offset="7" class="setting">
                    <!-- <p  class="setTitle">基本信息</p> -->
                   <el-form-item  label="控制图标题 :" >
                        <el-input  v-model="configForm.config_name"> </el-input>
                    </el-form-item>
                    <el-form-item  label="控制图描述 :">
                            <el-input  v-model="configForm.comment" ></el-input>
                        </el-form-item>
                    <el-form-item  label="小数位数 :">
                       <el-input  v-model="configForm.decimal_digits" type="number" min='0'> </el-input>
                    </el-form-item>
                    <el-form-item  label="最近组数 :">
                       <el-input  v-model="configForm.recent_groups" type="number" min='0'> </el-input>
                    </el-form-item>
                    <el-form-item  label="数据源 :">
                       
                            <el-select v-model="configForm.spc_source_id" @change="getSourceFields" clearable> 
                                <el-option v-for="source in dataSourceFilter" 
                                :key="source.spc_source_id"
                                :label="source.source_name"
                                :value="source.spc_source_id+','+ source.data_type"
                                >
                                </el-option>
                            </el-select>
                       
                    </el-form-item>
                    <el-form-item label="fields :"  v-show="configForm.spc_source_id && fieldsList.length>0">
                      <el-row v-for="(fields,index) in  fieldsList" :key="fields.spc_fields_id">
                         <el-col :span="11">
                              <div class="el-input el-input--mini">
                               <span style="vertical-align:middle;line-height:28px;background:#ddd" class="el-input__inner">{{fields.fields_name}}</span>
                              </div>
                         </el-col>
                          <el-col :span="11" :offset="2">
                             <el-form-item>
                        <el-select v-if="fieldsOptionsList[fields.spc_fields_id] && fieldsOptionsList[fields.spc_fields_id].length>0"
                           v-model="configForm.fields_info[index].spc_fields_options_id"
                             clearabl
                          >
                              <el-option v-for="options in fieldsOptionsList[fields.spc_fields_id]"
                                :key="options.spc_fields_options_id"
                                :label="options.fields_options_name"
                                :value='options.spc_fields_options_id'
                              ></el-option>  
                        </el-select>

                    </el-form-item>
                         </el-col>
                       </el-row>
                    </el-form-item>
                    </el-col>
                 </div>
                <div v-show="stepActiv==1">  
                   <el-col :span="10" :offset="7" class="setting">
                    <!-- <p class="setTitle">计量型</p> -->
                         <el-form-item  label="管制图形 :" >
                        <el-select v-model="configForm.control_graph" clearable>
                            <el-option label="x_r"  value='1'></el-option>
                            <el-option label="X-S3" value='2'></el-option>
                            <el-option label="中位数" value='3'></el-option>
                            <el-option label="X-MR" value='4'></el-option>
                            <el-option label="P" value='5'></el-option>
                            <el-option label="np" value='6'></el-option>
                            <el-option label="c" value='7'></el-option>
                            <el-option label="u" value='8'></el-option>
                        </el-select>
                    </el-form-item>
                        <el-form-item  label="规格上限 :" v-show="jljs=='jl'">
                        <el-input  v-model="configForm.config_info.usl" type="number" min='0'> </el-input>
                        </el-form-item>
                        <el-form-item  label="规格下限 :" v-show="jljs=='jl'">
                        <el-input  v-model="configForm.config_info.lsl" type="number" min='0'> </el-input>
                        </el-form-item>
                        <el-form-item  label="目标值 :" v-show="jljs=='jl'">
                            <el-input  v-model="configForm.config_info.target_value" type="number" min='0'> </el-input>
                        </el-form-item>
                        <el-form-item  label="子组容量 :" v-show="jljs=='jl'">
                        <el-input   v-model="configForm.config_info.group_num" type="number" min='0'> </el-input>
                        </el-form-item>
                        <el-form-item  label="分类组别 :" v-show="jljs=='js'">
                        <el-input  v-model="empty"> </el-input>
                        </el-form-item>
                        <el-form-item  label="抽检数量 :" v-show="jljs=='js'">
                            <el-input   v-model="empty"> </el-input>
                        </el-form-item>
                        <el-form-item  label="不良名称 :" v-show="jljs=='js'">
                            <el-input   v-model="empty"> </el-input>
                        </el-form-item>
                        <el-form-item  label="不良数量 :" v-show="jljs=='js'">
                        <el-input   v-model="empty"> </el-input>
                        </el-form-item>

                  </el-col>
                 </div>
            </el-row>        
        </el-form>
        <el-row  v-show="stepActiv==2 || stepActiv==3">
           <el-col :span="14" :offset="5" class="Table">
            <el-table 
              ref='multipleTable'
              :data="pyData"
              tooltip-effect="dark"
              style="width: 100%;overflow:hidden"
              border
              size="mini"
              row-key="rule_num"
               @select="selectRules"
              @row-dblclick="rowDbclick"
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
            </el-table>
            </el-col> 
        </el-row>
        <div style="border-top:1px solid #ebeef5;margin-top:20px;text-align:center;padding-top:20px;margin-bottom:-10px">

                <el-button type="primary"  size="mini" :loading="loadingSave" 
                     v-show="stepActiv>2"  @click="submit"
                >保存</el-button>
                <!-- <el-button size="mini"  @click="cancel">重置</el-button> -->
                <el-button size="mini" type="primary" @click="preStep" :disabled="stepActiv<=0">上一步</el-button>
                <el-button size="mini" type="primary"  @click="nextStep" :disabled="stepActiv>2">下一步</el-button>
          
        </div>
   </div>
     <el-dialog
        :close-on-click-modal='false'
        :visible.sync="showChangePy"
        :show-close='false'
        class="dialog setting-form"
        width="300px"
        >
        <el-form label-position="right" label-width="40px" :model="configForm"  class="Form" size="mini">
            <el-form-item v-for="(val, k) in selectedPy"
             v-if="k!=='rule_num' && k!=='spc_config_id' " :key="val"  :label="'['+ k +'] =' ">
                  <el-input v-model="changePyForm[k]"></el-input>
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
  spcConofigCreate,
  spcConofigUpdate,
  spcConofigDelete,
  spcConofigDetail,
  spcConofigList,
} from "@/api/spc/config";
import { fieldsOptionList } from "@/api/config/fieldsOption.js";
export default {
  data() {
    return {
      stepActiv:0,
      empty:'',
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
      forList: {
        graph: "",
        type: ""
      },
      loadingSave: false,
      spcType: "spcList", //spcList  spcConfig
      spcLists: [
        //spc-list
      ],
      configForm: {
        config_name: "",
        comment: "",
        control_graph: "1",
        decimal_digits: "",
        recent_groups: "",
        spc_source_id: "",
        config_info: {
          usl: "",
          lsl: "",
          target_value: "",
          group_num: ""
        },
        rules_info: [],
        fields_info: []
      },
      config: {
        config_name: "",
        comment: "",
        control_graph: "1",
        decimal_digits: "",
        recent_groups: "",
        spc_source_id: "",
        config_info: {
          usl: "",
          lsl: "",
          target_value: "",
          group_num: ""
        },
        rules_info: [],
        fields_info: []
      },
      info: {
        usl: "",
        lsl: "",
        target_value: "",
        group_num: ""
      },
      dataSourceLists: [],
      fieldsList: [],
      fieldsOptionsList: {},
      //pyData:[],
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
    };
  },
  methods: {
    nextStep:function(){
        this.stepActiv=this.stepActiv+1;
    },
    preStep:function(){
         if(this.stepActiv==3){
            this.stepActiv=this.stepActiv-2;
         }
         else{
            this.stepActiv=this.stepActiv-1;
         }
       
       
    },
    submit: function() {
      let self = this;
      self.loadingSave = true;
      //self.configForm.data_info=JSON.stringify(self.configForm.data_info);
      console.log(self.configForm);
      let data = Object.assign({}, self.configForm); 
        data.rules_info = [];
     // if (self.spcActionType == "create") {
        if (self.multipleSelection.length > 0) {
          self.multipleSelection.forEach(function(item) {
            let obj = self.pyNum[Number(item.rule_num) - 1];
            data.rules_info.push(obj);
          });
        }
        data.spc_source_id = data.spc_source_id.split(",")[0];
        spcConofigCreate(data).then(function(res) {
          console.log(res);
          self.loadingSave = false;
          if (res.resCode == 0) {
            self.$message({
              message: res.msg,
              type: "success"
            });
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
      dataSourceList({}).then(function(res) {
        if (res.resCode == 0) {
          self.dataSourceLists = res.data;
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
      self.fieldsOptionsList = {};
      self.configForm.control_graph = val.split(",")[1] + "";
      // self.configForm.spc_source_id='';
      dataSourceDetail({ spc_source_id: val.split(",")[0] }).then(function(
        res
      ) {
        if (res.resCode == 0) {
          console.log(res.data.fields_info);
          self.fieldsList = res.data.fields_info;
          self.configForm.fields_info = [];
          if (res.data.fields_info.length > 0) {
            for (let o of res.data.fields_info) {
              let obj = {
                    spc_fields_id: o.spc_fields_id,
                    spc_fields_options_id: o.spc_fields_options_id
                      ? o.spc_fields_options_id
                      : ""
                  };
                  self.configForm.fields_info.push(obj);
              //fields-options
              let obj1 = o;
              fieldsOptionList({ spc_fields_id: obj1.spc_fields_id }).then(
                function(res1) {
                  if (res1.resCode == 0) {
                    self.$nextTick(function(){
                        self.$set(
                        self.fieldsOptionsList,
                        obj1.spc_fields_id,
                        res1.data
                      );
                    });
                    // self.$set(
                    //   self.fieldsOptionsList,
                    //   obj1.spc_fields_id,
                    //   res1.data
                    // );
                  } else {
                    self.$message({
                      message: res1.msg,
                      type: "error"
                    });
                  }
                }
              );
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
    selectRules: function(selection, row) {
      let self = this;
      self.multipleSelection = selection;
    
    },
    rowDbclick: function(row, event) {
      console.log(row);
      let self = this,
        flag = false;
      if (self.multipleSelection.length > 0) {
        for (let o of self.multipleSelection) {
          console.log(o);
          if (o.rule_num == row.rule_num) {
            //选中状态
            flag = true;
          }
        }
        console.log('flag----'+flag)
        if (flag) {
          //console.log('选中');
          self.showChangePy = true;

          self.pyNum.forEach(function(item, index) {
            if (item.rule_num == row.rule_num) {
              self.selectedPy = item;
              self.selectedPyIndex = index;
              console.log('选中---------------------')
              console.log(index)
              console.log(item)
            }
          });
        } else {
          console.log("未选中");
        }
      } else {
        console.log("为选中111");
      }
    },
    cancelChangePy: function() {
      this.showChangePy = false;
    },
    changePy: function() {
      let self = this;
      function change() {
        let obj = self.pyNum[self.selectedPyIndex];
        for (let attr in self.changePyForm) {
          if (self.changePyForm[attr]) {
            obj[attr] = self.changePyForm[attr];
          }
        }
        self.pyNum.splice(self.selectedPyIndex, 1, obj);
        self.showChangePy = false;
        self.changePyForm = { n: "", m: "", k: "" };
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
      console.log("------end-------");
      //let self=this;
    },
    fieldsChange:function(index){ //spc_fields_options_id,index
         let self=this;//index=val.split(',')[1]
        if(self.spcActionType=='update'){
          
           let data=Object.assign({},self.configForm.fields_info[index]);
              data.spc_config_id=self.spc_config_id;
              console.log(data);
              if(!data.spc_fields_options_id){
                  data.spc_fields_options_id=0;
              }
              fieldsUpdate(data).then(function(res){
                  if(res.resCode==0){
                    console.log(res);
                  }
                  else{
                    self.$message({
                      message:res.msg,
                      type:'error'
                    });
                  }
              });
        }
    }
  },
  computed: {
    dataSourceFilter: function() {
      let self = this,
        arr;
      if (!self.configForm.control_graph) {
        return self.dataSourceLists;
      } else {
        if (['1','2','3','4'].indexOf(self.configForm.control_graph,0)!==-1) {
          arr = self.dataSourceLists.filter(item =>{
             return   [1,2,3,4].indexOf(item.data_type,0)!==-1 
          });
        } else if (['5','6','7','8'].indexOf(self.configForm.control_graph,0)!==-1) {
           arr = self.dataSourceLists.filter(item =>{
            return   [5,6,7,8].indexOf(item.data_type,0)!== -1 
          })
        }
      }
      if (arr.length == 0) {
        self.configForm.spc_source_id = "";
      }
      return arr;
    },
    jljs:function(){
        let self=this;
        if(['5','6','7','8'].indexOf(self.configForm.control_graph,0)>=0){
            return 'js';
        }
         if(['1','2','3','4'].indexOf(self.configForm.control_graph,0)>=0){
            return 'jl';
        }
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
      this.getPyData();
  }
};
</script>

<style scoped>

</style>
