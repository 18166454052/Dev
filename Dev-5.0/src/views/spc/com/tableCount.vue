<template>
      <div  class="Table SPC_Table">
                        <!-- <el-col class="text-right" style="margin-bottom:10px">
                            <el-button-group >
                              
                                 <el-button  size="mini" @click="exportExcel">Excel</el-button>
                            </el-button-group>
                           
                           
                         </el-col> -->
                        <el-table :data="filterGroupData" 
                        size="mini" 
                        style="width:100%"
                        border
                        max-height="360"
                        :row-key="getRowKeys"
                        :expand-row-keys="expands"
                        @cell-click="cellClick"
                        >
                             <el-table-column type="expand" >
                                <template slot-scope="props">
                                  <el-col class="expand_Table" >
                                     <el-table :data="tableMoreInfo(props.row.infoList)"
                                          size="mini" 
                                          style="width:100%"
                                          border
                                      >
                                      <el-table-column prop="type" label="类型"  align="center">
                                      </el-table-column>
                                     <el-table-column prop="value" label="值"  align="center">
                                      </el-table-column>
                                     </el-table>
                                  </el-col>
                                    
                                  
                                </template>
                            </el-table-column>
                            <el-table-column prop="groupNum" label="组号"  align="center"  ></el-table-column>
                            <el-table-column prop="badName" label="错误类型"   align="center" ></el-table-column>
                            <el-table-column prop="samplingNum" label="抽样编号"   align="center" > </el-table-column>
                            <el-table-column prop="badNum" label="不良数"   align="center">
                                <template slot-scope="scope">
                                        {{scope.row.badNum}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="badRate" label="不良率"   align="center" min-width="80px">
                                 <template slot-scope="scope">
                                        {{scope.row.badRate }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="lcl" label="LCL"   align="center"  min-width="80px">
                                <template slot-scope="scope">
                                        {{scope.row.lcl }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="ucl" label="UCL"   align="center" min-width="80px">
                                <template slot-scope="scope">
                                        {{scope.row.ucl }}
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
require('script-loader!@/vendor/Blob');
// let Papa1=require("papaparse")
import  Papa  from "papaparse";
export default {
    props:["groupDatas","params","configData","rules","errorDataExcel","errorDataExcel1"],
    data(){
        return {
            page:1,
            pageSize:20,
            expendRow: [],
            getRowKeys(row) {
                return row.groupNum;
            },
            // 要展开的行，数值的元素是row的key值
            expands: [],
            moreInfo:'',
        }
    },
    methods:{
        handleSizeChange: function(val) {
            this.pageSize = Number(val);
            this.page = 1;
        },
        handleCurrentChange: function(val) {
            this.page = Number(val);
        },
        exportExcel: function() {
            require.ensure([], () => {
            const { export_json_to_excel } = require("@/vendor/Export2Excel");
            let sheetName = ["原始数据","组数据","判异规则"];
            let Header1 = ["组号", "抽样编号", ...this.params],
            Header2 = [
                "组号",
                "错误类型",
                "抽样编号",
                "不良数",
                "不良率",
                "LCL",
                "UCL",
                "是否异常",
                "异常原因"
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
            "badName",
            "badNum",
            "badRate",
            "lcl",
            "ucl",
            "samplingNum",
            "infoList"
            ];
            const list = this.groupDatas; //const data = this.formatJson(filterVal, list);
            this.rules.forEach(rule => {
            Data3.push([Math.abs(rule.ruleNumber), rule.content]);
            });
            list.forEach(item => {
            //data1
            let arr1 = [];
                arr1 = [item.groupNum, item.samplingNum, ...item.infoList];
                Data1.push(arr1);
            
            //data2
            let arr2 = [
                item.groupNum,
                item.badName,
                item.badNum,
                item.badRate,
                item.lcl,
                item.ucl,
                item.samplingNum
            ];
            if (
                !this.errorDataExcel[item.groupNum]
            ) {
                arr2.push("否", "");
            } else {
                arr2.push("是");
                arr2.push(this.errorDataExcel[item.groupNum].join(","));
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
     csv:function(){
        let csv=Papa.unparse({
            fields: ["Column 1", "Column 2"],
            data: [
                ["foo", "bar"],
                ["abc", "def"]
            ]
        },{
            
        });
            console.log("downLoad", csv);
        //定义文件内容，类型必须为Blob 否则createObjectURL会报错
        let content = new Blob([csv]);
        //生成url对象
        let urlObject = window.URL || window.webkitURL || window;
        let url = urlObject.createObjectURL(content);
        //生成<a></a>DOM元素
        let el = document.createElement("a");
        //链接赋值
        el.href = url;
        el.download = this.configData.spcTaskName + "_" + parseTime(new Date());
        //必须点击否则不会下载
        el.click();
        //移除链接释放资源
        urlObject.revokeObjectURL(url);
     },
    tableMoreInfo: function(infoList) {
        //table额外信息处理
        let data = [];
        this.params.forEach((param,index )=> {
            data.push({
            type: param,
            value:infoList[index]
            });
        });
        return data;
    },
    cellClick: function(row, column, cell, event) {
            this.expendRow = row;
            if(this.expands[0]==row.groupNum){
                this.expands.pop();
            }
            else{
                this.$set(this.expands, 0, row.groupNum);
            }
            
            if (column.label && column.label.indexOf("样本") >= 0) {
                let index = column.label.trim().slice(-1);
                this.moreInfo = row.dataList[index - 1].info;
            }
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
        }
    }
}
</script>

