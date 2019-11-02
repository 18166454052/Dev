<template>
<div>
    <el-row 
   
    style="position:fixed;top:0;left:66px;right:0;z-index:999;border-bottom:1px solid #dcdfe6;padding:5px 20px;background:#fff">
            
            <el-col :span="24" class="text-right">
                <el-button size="mini" type="primary"   @click="back">
                    <svg-icon  icon-class="back" style="font-size:20px"></svg-icon>
                </el-button>
            </el-col>
    </el-row>
    <div class="app-container" >
        <el-row class="vertical-tabs" >
            <el-col :xs="{span:20,offset:2}" :sm="{span:18,offset:3}"
                :md="{span:16,offset:4}" :lg="{span:16,offset:4}" :xl="{span:16,offset:4}"  style="position:relative" >
              <el-card class="box-card" :body-style="{'min-height':$Height()-90+'px'}" style="margin-top:47px;">
                    <el-form  label-position="right"  label-width="120px"  class="Form m-t" size="mini">
                        
                            <el-form-item label="时间范围 :">
                                <el-row>
                                <el-col :span="9">
                                    <el-date-picker
                                    
                                        v-model="beginTime"
                                        type="datetime"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选则开始日期" 
                                        
                                    >  
                                    </el-date-picker> 
                                </el-col>
                                <el-col :span="2" class="text-center">
                                    -
                                </el-col>
                                <el-col :span="9">
                                    <el-date-picker
                                        v-model="endTime"
                                        type="datetime"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选则结束日期" 
                                        
                                    > 
                                    </el-date-picker> 
                                </el-col>  
                                <el-col :span="2" class="text-right">
                                    <el-button size="mini" type="primary"
                                     @click="getNums"
                                    :disabled="(!beginTime && !endTime)"
                                    ><i class="el-icon-search"></i></el-button>
                                </el-col>
                                </el-row>
                            </el-form-item>
                    </el-form> 
                    <div  style="margin-left:120px"> 
                           <div  v-if="type=='overlay'" >
                                
                                 <el-col :span="22" class="cncConfigTable">
                                     <el-tabs v-model="activeName" type="card">
                                        
                                        <el-tab-pane label="当前模板" name="first">
                                             <el-table  
                                                border
                                                size="small"
                                                    :data="nowModules"
                                                    tooltip-effect="dark"
                                                    style="width: 100%"
                                                  >  
                                                <el-table-column
                                                   
                                                    width="40">
                                                    <template slot-scope="scope">
                                                        {{scope.$index}}
                                                    </template>
                                                </el-table-column>
                                                <el-table-column
                                                    prop="jiagongNum"
                                                    label="模板列表"
                                                >
                                                </el-table-column>
                                            </el-table>

                                        </el-tab-pane>
                                        <el-tab-pane label="模板列表" name="second">
                                            <el-table  
                                                border
                                                size="small"
                                                    :data="models"
                                                    tooltip-effect="dark"
                                                    style="width: 100%"
                                                    @selection-change="handleSelectionChange">  
                                                <el-table-column
                                                    type="selection"
                                                    width="40">
                                                </el-table-column>
                                                <el-table-column
                                                    prop="jiagongNum"
                                                    label="模板列表"
                                                >
                                                </el-table-column>
                                            </el-table>
                                        </el-tab-pane>
                                    </el-tabs>
                                  

                                </el-col> 
                            </div>

                            <div v-if="type!='overlay'" >
                              
                                 <el-col :span="22" class="cncConfigTable">
                                    <el-col :span="4">
                                    <h3>当前模板 ：</h3>
                                   </el-col>
                                 <el-col :span="18">
                                    <h3>
                                        {{nowModules[0]?nowModules[0].jiagongNum:'还没有设置模板'}}
                                    </h3>
                                 </el-col>
                               
                                
                                    <el-table 
                                        border
                                      size="small"
                                            :data="models"
                                            tooltip-effect="dark"
                                            style="width: 100%;z-index:99"
                                            @current-change="handleCurrentChange"
                                            @row-click = "showRow"
                                       >  
                                        <el-table-column width="40">
                                            <template slot-scope="scope">
                       

                                                <el-radio class="radio" :label="scope.$index" v-model="radio" @change.native="getCurrentRow(scope.$index)" >&nbsp;</el-radio>
                                            </template>
                                        </el-table-column>

                                        <el-table-column
                                            prop="jiagongNum"
                                            label="模板列表"
                                        >
                                        </el-table-column>
                                    </el-table>

                                </el-col> 
                            </div>
                           
                    </div>
                    <el-form  label-position="right"  label-width="120px"  class="Form m-t" size="mini">
                        <el-form-item >
                             <div class="text-center btnBlock">
                                <el-col :span="22">
                                     <el-button  style="margin-left:0;margin-top:20px;" type="primary" size="large" @click="submit" 
                                    v-show="type=='overlay'"
                                    :disabled="selectedModel.length<=0"
                                    >设置模板</el-button>

                                    <el-button  style="margin-left:0;margin-top:20px;" type="primary" size="large" @click="submit" 
                                    v-show="type!='overlay'"
                                    :disabled="radio<0"
                                    >设置模板</el-button>

                                </el-col>
                                
                            </div>    
                        </el-form-item>    
                    </el-form>      
              </el-card>
               
            </el-col>
            
        </el-row>
         
    </div>
  
   
</div>
   

</template>
<script>
import {
  realSetting,
  controlSetting,
  historySetting,
  overlaySetting,
  jiagongNums,
  modelSetted
} from "@/api/bpy/config";
export default {
  data() {
    return {
        activeName:'first',
      LOADING: {
        lock: true,
        text: "数据处理中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.6)"
      },
      fullLoading: null,
      pickerOptionsStart: {
        disabledDate: time => {
          if (this.endTime) {
            return (
              time.getTime() > Date.now() - 8.64e7 + 76400000 ||
              time.getTime() >= this.endTime
            );
          } else {
            return time.getTime() > Date.now() - 8.64e7 + 76400000;
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          return time.getTime() <= this.beginTime;
          //|| time.getTime() > Date.now() - 8.64e7 + 76400000
        }
      },
      endTime: "",
      beginTime: "",
      models: [
        // { id:'1111',name:'20181214122410'},
        // { id:'22222',name:'20191214122410'}
      ],
      nowModules: [],
      selectedModel: [],
      jiagongNum: "",
      radio: -1, // index
      type: "" // 1 real   2history  3overlay 4 control
    };
  },
  methods: {
    back: function() {
      this.$router.go(-1);
    },
    handleSelectionChange: function(val) {
      this.selectedModel = val;
    },
    handleCurrentChange: function() {},
    showRow: function(row) {
      this.radio = this.models.indexOf(row);
    },
    getCurrentRow: function(scope, index) {},
    getNums: function() {
      this.fullLoading = this.$loading(this.LOADING);
      console.log(this.beginTime);
      jiagongNums({ beginTime: this.beginTime, endTime: this.endTime }).then(
        res => {
          this.fullLoading.close();
          if (res.code == 200) {
            this.models = res.data;
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    setReal: function() {
      this.fullLoading = this.$loading(this.LOADING);
      realSetting({ jiagongNum: this.jiagongNum }).then(res => {
        this.fullLoading.close();
        if (res.code == 200) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    setHistory: function() {
      this.fullLoading = this.$loading(this.LOADING);
      historySetting({ jiagongNum: this.jiagongNum }).then(res => {
        this.fullLoading.close();
        if (res.code == 200) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    setOverlay: function() {
        if(this.selectedModel.length>=100){
        this.$message.warning("最多只能设置100个模板");
        return ;
      }
      this.fullLoading = this.$loading(this.LOADING);
      let nums = [];
    
      this.selectedModel.forEach(num => {
        nums.push(num.jiagongNum);
      });
      overlaySetting({ jiagongNums: nums.join(",") }).then(res => {
        this.fullLoading.close();
        console.log(res);
        if (res.code == 200) {
          this.selectedModel = [];
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    setControl: function() {
      this.fullLoading = this.$loading(this.LOADING);
      controlSetting({ jiagongNum: this.jiagongNum }).then(res => {
        this.fullLoading.close();
        if (res.code == 200) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    submit: function() {
      if (this.type == "overlay") {
        // 多选
            this.setOverlay();
      } else {
        if (this.radio < 0) {
          this.$message.warning("请选择加工编码");
          return;
        } else {
          this.jiagongNum = this.models[this.radio].jiagongNum;
        }

        if (this.type == "real") {
          this.setReal();
        } else if (this.type == "history") {
          this.setHistory();
        } else if (this.type == "control") {
          this.setControl();
        } else {
        }
      }
    },
    getModelInfo: function() {
      let modelType;
      //1 real   2history  3overlay 4 control
      switch (this.type) {
        case "real":
          modelType = 1;
          break;
        case "history":
          modelType = 2;
          break;
        case "overlay":
          modelType = 3;
          break;
        case "control":
          modelType = 4;
          break;
      }
      modelSetted({ modelType: modelType }).then(res => {
        this.nowModules = res.data;
      });
    }
  },
  created: function() {
    this.type = this.$route.params.type;
    if (!["real", "history", "control", "overlay"].includes(this.type + "")) {
      this.$router.replace("/404");
    }
    this.getModelInfo();
    //this.getRuleList();
  }
};
</script>
