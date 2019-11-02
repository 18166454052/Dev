<template>
<div class="Table SPC_Table ">
     <!-- <el-col class="text-right" style="margin-bottom:10px">
            <el-button-group >
                <el-button @click="exportExcel"  size="mini">导出Excel</el-button>
            </el-button-group>
            
    </el-col> -->
    <el-table :data="filterGroupData" 
        ref="tableScroll"
        size="mini" 
        style="width:100%"
        max-height="320"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        @cell-click="cellClick"
        >
        <el-table-column type="expand" >
            <template slot-scope="props">
                
                <el-col class="expand_Table" >
                    <el-table :data="tableMoreInfo(props.row.dataList)"
                        size="mini" 
                        style="width:100%"
                        border
                    >
                    <el-table-column prop="type" label="类型"  align="center">
                    </el-table-column>
                    <el-table-column v-for="(t,index) in loopNum"  :label="'样本'+ Number(Number(index)+1)" :key="'ddff'+index"  align="center">
                        <template slot-scope="scope">
                        {{scope.row['eg'+index]}}
                        </template>
                    </el-table-column>
                    </el-table>
                </el-col>
               
                
            </template>
        </el-table-column>
        <el-table-column prop="groupNum" label="组号"  align="center"  min-width="40px">
        </el-table-column>
        <!-- <el-table-column  v-if="showGroupTime" prop="datetime" label="时间"  align="center">
            <template slot-scope="scope">
                    {{scope.row.datetime}}
            </template>
        </el-table-column> -->

        <el-table-column label="样本测定值"  align="center">

            <el-table-column v-for="(t,index) in loopNum"  :label="'样本'+ Number(Number(index)+1)" :key="'ccc'+index"  align="center" min-width="35px">
                    <template slot-scope="scope">
                    {{scope.row.dataList[index].value}}
                </template>
                </el-table-column> 
        </el-table-column>
        <el-table-column prop="sum" label="合计值"   align="center" min-width="40px">
                <template slot-scope="scope">
                    {{scope.row.sum }}
                </template>
        </el-table-column>
        <el-table-column prop="firstParameter" :label="XR[2]"   align="center" min-width="40px">
            <template slot-scope="scope">
                {{scope.row.firstParameter }}
            </template>
        </el-table-column>
        <el-table-column prop="secondParameter" :label="XR[3]"    align="center" min-width="40px">
            <template slot-scope="scope">
                {{scope.row.secondParameter }}
            </template>
        </el-table-column>
    </el-table>
    <div class="m-t text-center" style="border-top:1px solid #ebeef5;margin-top:0px;padding-top:15px" >
        <el-pagination   v-show="total>0" 
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            :page-size="pageSize"
            :page-sizes="[20,50,100,200]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
     </div>
</div>
</template>
<script>
import { parseTime } from "@/utils";
export default {
  props:["groupDatas","configData","XR","params","rules","errorDataExcel","errorDataExcel1"],
  data() {
    return {
      expendRow: [],
      getRowKeys(row) {
        return row.groupNum;
      },
      // 要展开的行，数值的元素是row的key值
      expands: [],
      page: 1,
      pageSize: 20,
      //total: 0,
    };
  },
  methods: {
    cellClick: function(row, column, cell, event) {
        this.expendRow = row;
        if (this.expands[0] == row.groupNum) {
            this.expands.pop();
        } else {
            this.$set(this.expands, 0, row.groupNum);
        }

        if (column.label && column.label.indexOf("样本") >= 0) {
            let index = column.label.trim().slice(-1);
            this.moreInfo = row.dataList[index - 1].info;
           }
    },
    handleSizeChange: function(val) {
        //this.$store.commit('SET_PAGESIZE',val);
        let self = this;
        this.pageSize = Number(val);
        this.page = 1;
    },
    handleCurrentChange: function(val) {
        let self = this;
        this.page = Number(val);
    },
    tableMoreInfo: function(dataList) {
            //table额外信息处理
            let data = [];
            this.params.forEach(param => {
            data.push({
                type: param
            });
            });
            //console.log(data);
            dataList.forEach((list, index) => {
            // console.log(list);
            list.info.forEach((info, index1) => {
                this.$set(data[index1], "eg" + index, info);
            });
            });
            return data;
    },
    exportExcel: function() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/vendor/Export2Excel");
        let sheetName = ["原始数据", "组数据", "判异规则"];
        let Header1 = ["组号", "样本值", ...this.params],
          Header2 = [
            "组号",
            "合计值",
            "极差值",
            "平均值",
            "是否异常",
            this.XR[0]+"管制图异常原因",
            this.XR[1]+"管制图原因"
          ],
          Header3 = ["判异规则编号", "判异规则"];
        let Data1 = [],
          Data2 = [],
          Data3 = [];
        let filter1 = ["groupNum"],
          filter2 = ["groupNum"],
          filter3 = ["groupNum"];
        const filterVal = [
          "groupNum",
          "datetime",
          "dataList",
          "sum",
          "secondParameter",
          "firstParameter"
        ];
        const list = this.groupDatas; //const data = this.formatJson(filterVal, list);
        this.rules.forEach(rule => {
          Data3.push([Math.abs(rule.ruleNumber),rule.content]);
        });
        list.forEach(item => {
          //data1
          let arr1 = [];
          item.dataList.forEach(list => {
            arr1 = [item.groupNum, list.value, ...list.info];
            Data1.push(arr1);
          });

          //data2
          let arr2 = [
            item.groupNum,
            item.sum,
            item.secondParameter,
            item.firstParameter
          ];
          if (
            !this.errorDataExcel[item.groupNum] &&
            !this.errorDataExcel1[item.groupNum]
          ) {
            arr2.push("否", "", "");
          } else {
            arr2.push("是");
            if (this.errorDataExcel[item.groupNum]) {
              arr2.push(this.errorDataExcel[item.groupNum].join(","));
            } else {
              arr2.push("");
            }

            if (this.errorDataExcel1[item.groupNum]) {
              arr2.push(this.errorDataExcel1[item.groupNum].join(","));
            } else {
              arr2.push("");
            }
          }
          Data2.push(arr2);
        });
        export_json_to_excel(
          [Header1, Header2, Header3],
          [Data1, Data2, Data3],
          sheetName,
          this.configData.spcTaskName + "_" + parseTime(new Date())
        );
      });
    },
  },
  computed:{
    filterGroupData: function() {
        let from = (this.page - 1) * this.pageSize;
        let to = from + this.pageSize;
        return this.groupDatas.slice(from, to);
    },
    total:function(){
        return this.groupDatas.length;
    },
    loopNum:function(){
        if(this.groupDatas.length>0 && this.groupDatas[0].dataList && this.groupDatas[0].dataList instanceof Array){
            return this.groupDatas[0].dataList.length;
        }
        else{
            return 0;
        }
        
    }
  }
};
</script>

