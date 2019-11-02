<template>
    <div  class="Table SPC_Table">
        <!-- <el-col class="text-right" style="margin-bottom:10px">
            <el-button-group >
                <el-button @click="exportExcel"  size="mini">导出Excel</el-button>
            </el-button-group>
            
        </el-col>   -->
        <el-table :data="filterGroupData" 
            size="mini" 
            style="width:100%"
            max-height="360"
            :summary-method="getSummaries"
            show-summary
            >
            <el-table-column prop="personName" label="人员"  align="center"  min-width="40px">
            </el-table-column>
            <el-table-column prop="index" label="组号"  align="center"  min-width="40px">
            </el-table-column>
            <el-table-column label="样本测定值"  align="center">
                <el-table-column v-for="(t,index) in loopNum"  :label="loopTitle[index]" :key="'ccc'+index"  align="center" min-width="35px">
                    <template slot-scope="scope">
                    {{scope.row.values[index]}}
                    </template>
                </el-table-column> 
            </el-table-column>
            <el-table-column prop="average" label="平均值"   align="center" min-width="40px">
                    <template slot-scope="scope">
                        {{scope.row.average.toFixed(3)}}
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
export default {
    props:["groupDatas","loopTitle","rules"],
    data(){
        return {
            page:1,
            pageSize:20

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
        getAverage:function(){
            console.log(this.groupDatas);
            let values=[],self=this;
            values=self.groupDatas.map(item=> item.values);
            let LEN=values.length;
            let sums=[];
            if(values.length==0){
                return [];
            }
            else{
             let NUM=values[0].length;
             for(let i=0;i<NUM;i++){
                   let arr=[];
                   for(let j=0;j<LEN;j++){
                       arr.push(values[j][i]);
                   }
                   sums.push(arr);

             }
             
            }
            let sum=[];
            sum=sums.map(arr=>{
                    return  arr.reduce((total,num)=> total+num);
            });
            let avg=sum.map(item=> (item/LEN).toFixed(3));
                return ['平均值','',...avg];

        },
        getSummaries() {
             return this.getAverage();
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
                Data3.push([rule.ruleNumber, rule.content]);
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
            if(this.groupDatas.length>0){
                return this.groupDatas[0].values.length
            }
            else{
                return 1;
            }
        }
    },
    created:function(){
        console.log('------table-----');
        console.log(this.groupDatas);
    }
}
</script>

