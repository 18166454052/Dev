import { parseTime } from '@/utils';
export default {
  methods: {
    exportExcelJl: function () { // 计量
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require('@/vendor/Export2Excel')
        let sheetName = ['原始数据', '组数据', '判异规则']
        let Header1 = ['组号', '样本值', ...this.params],
          Header2 = [
            '组号',
            '合计值',
            '极差值',
            '平均值',
            '是否异常',
            this.XR[0] + '管制图异常原因',
            this.XR[1] + '管制图原因'
          ],
          Header3 = ['判异规则编号', '判异规则'];
        let Data1 = [],
          Data2 = [],
          Data3 = [];
        let filter1 = ['groupNum'],
          filter2 = ['groupNum'],
          filter3 = ['groupNum'];
        const filterVal = [
          'groupNum',
          'datetime',
          'dataList',
          'sum',
          'secondParameter',
          'firstParameter'
        ];
        const list = this.groupDatas; //const data = this.formatJson(filterVal, list);
        this.rules.forEach(rule => {
          Data3.push([Math.abs(rule.ruleNumber), rule.content]);
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
          if (!this.errorDataExcel[item.groupNum] &&
            !this.errorDataExcel1[item.groupNum]
          ) {
            arr2.push('否', '', '');
          } else {
            arr2.push('是');
            if (this.errorDataExcel[item.groupNum]) {
              arr2.push(this.errorDataExcel[item.groupNum].join(','));
            } else {
              arr2.push('');
            }

            if (this.errorDataExcel1[item.groupNum]) {
              arr2.push(this.errorDataExcel1[item.groupNum].join(','));
            } else {
              arr2.push('');
            }
          }
          Data2.push(arr2);
        });
        export_json_to_excel(
          [Header1, Header2, Header3], [Data1, Data2, Data3],
          sheetName,
          this.configData.spcTaskName + '_' + parseTime(new Date())
        );
      });
    },
    exportExcelJs: function () { // 计数
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require("@/vendor/Export2Excel");
        let sheetName = ["原始数据", "组数据", "判异规则"];
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
          if (!this.errorDataExcel[item.groupNum]) {
            arr2.push("否", "");
          } else {
            arr2.push("是");
            arr2.push(this.errorDataExcel[item.groupNum].join(","));
          }
          Data2.push(arr2);
        });
        export_json_to_excel(
          [Header1, Header2, Header3], [Data1, Data2, Data3],
          sheetName,
          this.configData.spcTaskName + "_" + parseTime(new Date())
        );
      });
    }
  }
}
