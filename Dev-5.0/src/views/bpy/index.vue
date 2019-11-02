<template>
  <div >
    <el-row style="border-bottom:1px solid #dcdfe6;padding:5px 20px">
        <el-col :span="24" class="text-right">
            <el-popover
               placement="bottom"
               width="300"
               trigger="click"
            >
              <el-button slot="reference">历史查看</el-button>
              <el-form  :inline="true" :model="Form" :rules="rule" ref="history" label-position="right"  label-width="0"  class="Form " size="mini">
                <el-form-item >
                    <el-select v-model="Form.number" prop="number">
                        <el-option
                        v-for="num in numbers"
                        :key="'@'+num.jiagongNum"
                        :label="num.jiagongNum"
                        :value="num.jiagongNum"
                        >
                        </el-option>
                       
                     </el-select>
                </el-form-item>
                <el-form-item  >
                   <el-button type="success" size="mini"  @click="getBpyHistory" >确定</el-button>
                </el-form-item>
              </el-form>
            </el-popover>
            <el-tooltip class="item" effect="light" content="刷新" placement="top-start">
                <el-button size="mini" @click="refres">
                    <svg-icon  icon-class="refresh" style="font-size:18px"></svg-icon>
                </el-button>
            </el-tooltip>
        </el-col>
    </el-row>
    <div ref='d3' style="width:100%;" :style="{height:$Height()-47+'px'}"></div>
    <div  style="position:fixed;right:50px;top:100px;">
     <div class="text-center" style="font-size:16px" v-show="toolIds.length>0">刀号</div>
      <ul>
       
        <li  v-for="tool in toolIds" :key="tool" style="font-size:14px;margin-top:10px">
            <span style="display:inline-block;;width:100px;padding-right:10px;text-align:right;color:#666;line-height:20px;">{{tool}}号刀</span>
            <span style="display:inline-block;width:40px;height:20px;border-radius:5px;cursor:pointer"
             :style={backgroundColor:aboutColor(tool)}
             @click="selectTool(tool)"
            ></span>
        </li>
      </ul>
    </div>
   <div>

   </div>
  </div>
</template>

<script>
require("echarts-gl");
import { firstBy } from "thenby";
import { bpyHistory, bpyReal, bpyNums, bpyTools } from "@/api/bpy";
export default {
  data() {
    let self = this;
    return {
      model: "",
      Form: {
        number: ""
      },
      numbers: [],
      rule: {
        number: [
          { required: true, message: "请选择编码", trigger: "change,blur" }
        ]
      },
      myChart: "",
      acTime: "",
      data: [
        //[-118.969, 171.48, -5.638, 2,]
        // [-118.969, 171.48, -5.638, null],
        // [-118.969, 171.48, 23.162, 6000],
        // [-118.969, 171.48, 108.162, 6214]
        // [1,1,1],
        // [1,2,1],
        // [1,3,1],
        // [1,4,1],
        // [2,5,1],
        // [3,5,1],
        // [4,4,1],
        // [4,3,1],
        // [4,2,1],
        // [3,1,1],
        // [3,2,1],
      ],
      filterDatas: [],
      toolIds: [],
      color: [
        "#313695",
        "#4575b4",
        "#74add1",
        "#abd9e9",
        "#e0f3f8",
        "#ffffbf",
        "#fee090",
        "#fdae61",
        "#f46d43",
        "#d73027",
        "#a50026",
        "#c23531",
        "#2f4554",
        "#61a0a8",
        "#d48265",
        "#91c7ae",
        "#749f83",
        "#ca8622",
        "#bda29a",
        "#6e7074",
        "#546570",
        "#c4ccd3",
        "#c1e4e9",
        "#a2d7dd",
        "#a0d8ef",
        "#89c3eb",
        "#84a2d4",
        "#83ccd2",
        "#f9c89b",
        "#f4dda5",
        "#e0c38c",
        "#f3bf88",
        "#eb9b6f",
        "#df7163"
      ],
      // color: [
      //   // '#fdeff2','#e9dfe5','#f6bfbc','#f5b199','#f2a0a1',
      //   // '#eaf4fc','#eaedf7','#e8ecef','#ebf6f7',
      //   '#c1e4e9','#a2d7dd','#a0d8ef','#89c3eb','#84a2d4','#83ccd2',
      //   '#f9c89b','#f4dda5','#e0c38c','#f3bf88','#eb9b6f','#df7163'
      // ],
      selTool: [],
      fullLoading: null,
      LOADING: {
        lock: true,
        text: "数据加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.6)"
      },
      lastId: "" //最后一个 id
    };
  },
  methods: {
    drawLine: function() {
      let self = this;
      self.myChart = self.$echarts.init(self.$refs.d3);
      self.myChart.setOption({
        tooltip: {
          formatter:function(params){
            let data=params.data,marker=params.marker;
            return "" + marker +'<br/>'
                  +' x : ' + data[0] + ' <br/>'
                  +' y : ' + data[1] + ' <br/>'
                  +' z : ' + data[2] + ' <br/>'
                  +' 速度 : ' + data[3] + ' <br/>'
                  +' 刀号 : ' +data[4]
                
          }
        },
        backgroundColor: "#fff",
        visualMap: {
          show: false,
          dimension: 2,
          min: 0,
          max: 30,
          inRange: {
            color: [
              "#313695",
              "#4575b4",
              "#74add1",
              "#abd9e9",
              "#e0f3f8",
              "#ffffbf",
              "#fee090",
              "#fdae61",
              "#f46d43",
              "#d73027",
              "#a50026"
            ]
          }
        },
        xAxis3D: {
          type: "value"
        },
        yAxis3D: {
          type: "value"
        },
        zAxis3D: {
          type: "value"
        },
        grid3D: {
          show: true,
          viewControl: {
            projection: "orthographic"
          }
        },
        series: [
          {
            type: "line3D",
            data: self.filterDatas,
            smooth: false,
            showAllSymbol: true,
            //symbolSize: [5, 5],
            lineStyle: {
              width: 1
              // normal: {
              //   color: "rgb(25,212,174)"
              // }
            }
          }
        ]
      });
    },
    getBpyReal: function(res) {
      // if (res.code == 200) {
      //   this.data = res.data;
      //   this.filterDatas = res.data.slice();
      // }
      // else {
      //   this.$message.error(res.message);
      // }
      this.data = res;
      this.filterDatas = res.slice();
    },
    getBpyByTime: function() {
      let data = {};
      if (this.acTime) {
        data.acTime = this.acTime;
      }
      bpyList(data).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.acTime = res.data.configDataanalysis;
          if (res.data.pathPosition.length > 0) {
            this.data = [...this.data, ...res.data.pathPosition];
          }
          this.drawLine();
          // this.getBpyByTime();
        } else {
          this.$message, error(res.message);
        }
      });
    },
    getBpyHistory: function() {
      this.$refs.history.validate(res => {
        if (res) {
          this.fullLoading = this.$loading(this.LOADING);
          this.getbpyTools();
          bpyHistory({ jiagongNum: this.Form.number }).then(res => {
            this.fullLoading.close();
            this.data = res;
            this.filterDatas = res.slice();
            this.drawLine();
          });
        }
      });
    },
    selectTool: function(tool) {
      if (this.selTool.length == 0) {
        this.selTool.push(tool);
      } else {
        let Index = -1;
        this.selTool.forEach((item, index) => {
          if (item == tool) {
            Index = index; //存在
          }
        });
        if (Index >= 0) {
          //删除
          this.selTool.splice(Index, 1);
        } else {
          this.selTool.push(tool);
        }
      }

      this.filterData();
      this.drawLine();
    },
    aboutColor: function(tool) {
      if (this.selTool.indexOf(tool) >= 0) {
        return "#ddd";
      } else {
        return this.color[tool - 1];
      }
    },
    filterData: function() {
      if (this.selTool.length == 0 || this.data.length == 0) {
        this.filterDatas = this.data;
      } else {
        this.filterDatas = this.data.filter(
          item => this.selTool.indexOf(item[4]) == -1
        );
      }
    },
    refres: function() {
      let self = this;
      async function bpy() {
        self.fullLoading = self.$loading(self.LOADING);
        let bpylist = await bpyReal();
         self.getBpyReal(bpylist);
        self.fullLoading.close();
        self.drawLine();
        self.myChart.resize();
      }
      bpy();
      this.getbpyTools();
    },
    getbpyNums: function() {
      bpyNums().then(res => {
        if (res.code == 200) {
          this.numbers = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getbpyTools: function() {
      this.toolIds=[];
      bpyTools({ 'jiagongNum': this.Form.number }).then(res => {
        //this.toolIds = res;
        if(res.code==200){
        this.toolIds = res.data;
        }
        else{
          this.$message.error(res.message);
        }
      });
    }
  },
  beforeRouteLeave: function(to, from, next) {
    this.fullLoading.close();
    this.getBpyByTime = function() {};
    this.acTime = "";
    next();
  },
  created: function() {
    // this.interval=setInterval(this.getBpyList,0);
    let self = this;

    async function bpy() {
      self.fullLoading = self.$loading(self.LOADING);
      let bpylist = await bpyReal();
      self.getBpyReal(bpylist);
      self.fullLoading.close();
      self.drawLine();
      self.myChart.resize();
    }
    bpy();
    this.getbpyNums();
    this.getbpyTools();
  },
  beforeDestroy:function(){
      this.myChart.clear();
  }
};
</script>