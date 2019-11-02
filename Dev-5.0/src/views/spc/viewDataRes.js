import {
  firstBy
} from 'thenby'
export default {
  data() {
    return {
      showPopover: false,
      pdftemShow: false,
      testGroup: [1, 2, 3, 4],
      editGroupNum: true,
      loading: false,
      control_graph: '1',
      effectiveDigits: '3',
      spc_id: '',
      type: '', // 计量 计数
      configData: {},
      groupDatas: [], //
      XcharData: {
        // columns: ['groupNum','avg','usl','lsl','ucl','lcl','cl'],
        columns: ['groupNum', 'avg', 'improper'],
        rows: [
          // { groupNum:'',avg:'',usl:'',lsl:'',ucl:'',lcl:'',cl:''}
        ]
      },
      RcharData: {
        columns: ['groupNum', 'range', 'improper'],
        rows: [
          // { groupNum:'',avg:'',usl:'',lsl:'',ucl:'',lcl:'',cl:''}
        ]
      },
      countDatas: [],
      // distData: {
      //   x: [],
      //   y: []
      // },
      distData: [],
      min: '', // x 轴
      max: '', // x 轴
      minZF: '', // X
      maxZF: '', // X
      zfMax: 0, // 直方图的 max(y)
      sigmay: '', // 最中心y
      usly: '', // 200--y
      lsly: '', // 100--y
      usl: [],
      lsl: [],
      sigma: [], // 直方图竖线
      sigma1: [],
      sigma2: [],
      sigma3: [],
      sigma_1: [],
      sigma_2: [],
      sigma_3: [],
      avg: '',
      avg_sigma: '',
      variableStats: {},

      fields_info: [], // 修改 fields_options_name
      sql_info: [],
      fullLoading: null,
      LOADING: {
        lock: true,
        text: '需要几秒钟,加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.6)'
      },
      minR: '',
      maxR: '',
      timeout: null,
      showTable: false,
      imgBase64: {},
      errorDatax: [],
      errorDatar: [],
      moreInfo: [],
      params: [],
      expendRow: [],
      getRowKeys(row) {
        return row.groupNum
      },
      // 要展开的行，数值的元素是row的key值
      expands: [],
      errorDataExcel: {}, // groupNum:[rule_num1,rule_num2]
      errorDataExcel1: {},
      fieldsOptionsList: {},
      sqlIndex: -1,
      sqlUpdateLoad: false,
      scrollDom: '',
      rules: [], // 判异规则
      controlInfo: [], // 附加信息
      layout: [],
      // 计数
      TYPE: '', // p np
      xrStats: '',
      dataX: [], // 控制图x轴
      ucl: [], // 控制图ucl
      lcl: [], // 控制图lcl
      errorDatas: {}, // 错误点
      badData: [], // 控制图lcl
      cumulativeRateData: {
        columns: ['groupNum', 'cumulativeRate'],
        rows: [],
        improper: []
      }, // 折线图
      paretoData: {
        badName: [],
        badNum: [],
        count: [],
        rate: []
      }, // 柏拉图 直线
      selectedXrules: [], //  echarts 图中作用的rules
      selectedRrules: []

    }
  },
  methods: {
    jlRes: function (res) {
  
      // stats
      if (res.fieldsInfo) {
        this.params = res.fieldsInfo
      }

      this.variableStats = res.variableStats;

      // group  x-r 图
      this.groupDatas = [];
      this.XcharData.rows = [];
      this.RcharData.rows = [];
      // this.total = res.groupValueList.length;
      // if (res.groupValueList.length > 0) {
      //   if (res.groupValueList[0].datetime) {
      //     this.showGroupTime = true;
      //   } else {
      //     this.showGroupTime = false;
      //   }
      // }
     
      /*
        partPersonData.sort(
        firstBy(function (v1) { return v1.personName})
      .thenBy('partName')
      )
      */
      // min max  X图
      let parameterFirst = res.groupValueList.slice().sort(
        firstBy(function (v1) {
          return v1.firstParameter;
        })
      );

      let usl_f = this.configData.usl,
        ucl_first = this.variableStats.ucl_first,
        parameter_max = parameterFirst.slice(-1)[0].firstParameter,
        lsl_f = this.configData.lsl,
        lcl_first = this.variableStats.lcl_first,
        parameter_min = parameterFirst[0].firstParameter;
      //console.log(usl_f,ucl_first, parameter_max,lsl_f,lcl_first,parameter_min);
      let xUpper = Math.max(usl_f, ucl_first, parameter_max),
        xLower = Math.min(lsl_f, lcl_first, parameter_min);

      this.max = xUpper + (xUpper - xLower) / 4;
      this.min = xLower - (xUpper - xLower) / 4;
      // min max R图
      let parameterSecond = res.groupValueList.slice().sort(
        firstBy(function (v1) {
          return v1.secondParameter;
        })
      );
      let ucl_second = this.variableStats.ucl_second,
        parameter_max_r = parameterSecond.slice(-1)[0].secondParameter;
      let rUpper = Math.max(ucl_second, parameter_max_r);
      this.minR = 0;
      this.maxR = rUpper * 1.2;


      if (this.min == undefined || this.max == undefined) {
        let lsl = this.configData.lsl,
          usl = this.configData.vusl;
        if (!lsl) {
          lsl = this.variableStats.lcl_first
        }
        if (!usl) {
          usl = this.variableStats.ucl_first
        }
        this.min = (lsl - (usl - lsl) / 4).toFixed(2);
        this.max = (usl + (usl - lsl) / 4).toFixed(2);

      }


      //
      res.groupValueList.forEach((item) => {
        this.groupDatas.push(item);
        let objX = {
          groupNum: '',
          avg: '',
          usl: this.configData.usl,
          lsl: this.configData.lsl,
          ucl: this.variableStats.ucl_first,
          lcl: this.variableStats.lcl_first,
          cl: this.variableStats.averageFirst,
          improper: []
        };
        objX.groupNum = item.groupNum;
        objX.avg = item.firstParameter;
        this.XcharData.rows.push(objX);
        /************** */
        let objR = {
          groupNum: "",
          range: "",
          usl: this.configData.usl,
          lsl: this.configData.lsl,
          ucl: this.variableStats.ucl_second,
          lcl: this.variableStats.lcl_second,
          cl: this.variableStats.averageSecond,
          improper: []
        };
        objR.groupNum = item.groupNum;
        objR.range = item.secondParameter;
        this.RcharData.rows.push(objR);
      });

      // 直方图
      this.countDatas = [];
      this.minZF = res.processCapabilityData.allRateCount.min;
      this.maxZF = res.processCapabilityData.allRateCount.max;
      let m = 0;
      res.processCapabilityData.allRateCount.rateCountList.forEach(
        (item, index) => {
          if (Number(item.count) > Number(m)) {
            m = item.count;
          }
          if (item.from_border == -1 || item.to_border == 1) {} else {
            let arr = [];
            arr.push(item.from_border);
            arr.push(item.to_border);
            arr.push(item.count);
            this.countDatas.push(arr);
          }
        }
      );
      this.zfMax = m;

      //正态分布
      this.distData = [];
      res.processCapabilityData.normalDataList.forEach((item) => {
        let arr = [];
        arr.push(item.x);
        arr.push(item.y);
        this.distData.push(arr);
      });
      let maxy;

      let ceil =
        res.processCapabilityData.normalDataList[
          Math.ceil(res.processCapabilityData.normalDataList.length / 2)
        ].y;
      let floor =
        res.processCapabilityData.normalDataList[
          Math.floor(res.processCapabilityData.normalDataList.length / 2)
        ].y;
      maxy = Math.max(ceil, floor).toFixed(2);
      let cl = this.variableStats.averageFirst,
        usl = this.configData.usl,
        lsl = this.configData.lsl,
        cl_y = Math.max(this.zfMax, maxy) + 5;

      cl =
        cl.toString().split(".")[0] +
        "." +
        cl
        .toString()
        .split(".")[1]
        .slice(0, 2);
      this.sigmay = cl_y;
      this.sigma = [
        [cl, 0],
        [cl, cl_y],
        [cl, 0]
      ];
      this.usl = [
        [usl, 0],
        [usl, cl_y],
        [usl, 0]
      ];
      this.lsl = [
        [lsl, 0],
        [lsl, cl_y],
        [lsl, 0]
      ];

      //
      let sigma_1_2_y = cl_y * 0.5,
        sigma_3_y = cl_y * 0.7,
        sigma_1_x = cl - this.variableStats.sigma,
        sigma1_x = Number(cl) + Number(this.variableStats.sigma),
        sigma_2_x = cl - this.variableStats.sigma * 2,
        sigma2_x = Number(cl) + Number(this.variableStats.sigma) * 2,
        sigma_3_x = cl - this.variableStats.sigma * 3,
        sigma3_x = Number(cl) + Number(this.variableStats.sigma) * 3;
      this.sigma1 = [
        [sigma1_x, 0],
        [sigma1_x, sigma_1_2_y],
        [sigma1_x, 0]
      ];
      this.sigma_1 = [
        [sigma_1_x, 0],
        [sigma_1_x, sigma_1_2_y],
        [sigma_1_x, 0]
      ];
      //
      this.sigma2 = [
        [sigma2_x, 0],
        [sigma2_x, sigma_1_2_y],
        [sigma2_x, 0]
      ];
      this.sigma_2 = [
        [sigma_2_x, 0],
        [sigma_2_x, sigma_1_2_y],
        [sigma_2_x, 0]
      ];
      //
      this.sigma3 = [
        [sigma3_x, 0],
        [sigma3_x, sigma_3_y],
        [sigma3_x, 0]
      ];
      this.sigma_3 = [
        [sigma_3_x, 0],
        [sigma_3_x, sigma_3_y],
        [sigma_3_x, 0]
      ];
      // 错误点
      let errorXData = [],
        errorRData = [];
      let arr = res.exceptionResultList.filter(
        item => item.groupNumList.length > 0
      );

      arr.forEach((item) => {
        // this.errorDataExcel[item.ruleNumber]=item.groupNumList;
        item.groupNumList.forEach((item2) => {
          // item2---groupNum
          // x
          if (item.ruleNumber > 0) {
            if (this.selectedXrules.indexOf(item.ruleNumber) == -1) {
              this.selectedXrules.push(item.ruleNumber);
            }
            // excel
            if (!this.errorDataExcel[item2]) {
              this.errorDataExcel[item2] = [];
              this.errorDataExcel[item2].push(item.ruleNumber);
            } else {
              this.errorDataExcel[item2].push(item.ruleNumber);
            }
            //
            if (errorXData.length == 0) {
              let obj = {
                improper: [this.rules[Number(item.ruleNumber) - 1].content],
                groupNum: item2,
                ruleNumber: [item.ruleNumber]
              };
              errorXData.push(obj);
            } else {
              let flag = false; // 是否已经存在 gruopNum
              errorXData.forEach((item3) => {
                if (item3.groupNum == item2) {
                  item3.improper.push(
                    this.rules[Number(item.ruleNumber) - 1].content
                  );
                  item3.ruleNumber.push(
                    Number(item.ruleNumber)
                  );
                  flag = true;
                }
              });
              if (!flag) {
                // groupNum bu存在
                let obj = {
                  improper: [this.rules[Number(item.ruleNumber) - 1].content],
                  groupNum: item2,
                  ruleNumber: [item.ruleNumber]
                };

                errorXData.push(obj);
              }
            }
          }
          // R
          if (item.ruleNumber < 0) {
            //
            if (this.selectedRrules.indexOf(Math.abs(item.ruleNumber)) == -1) {
              this.selectedRrules.push(Math.abs(item.ruleNumber));
            }
            // EXCEL
            if (!this.errorDataExcel1[item2]) {
              this.errorDataExcel1[item2] = [];
              this.errorDataExcel1[item2].push(item.ruleNumber);
            } else {
              this.errorDataExcel1[item2].push(item.ruleNumber);
            }
            //
            if (errorRData.length == 0) {
              let obj = {
                improper: [
                  this.rules[Number(Math.abs(item.ruleNumber)) - 1].content
                ],
                groupNum: item2,
                ruleNumber: [Math.abs(item.ruleNumber)]
              };

              errorRData.push(obj);
            } else {
              let flag = false; // 是否已经存在 gruopNum
              errorRData.forEach((item3) => {
                if (item3.groupNum == item2) {
                  item3.improper.push(
                    this.rules[Number(Math.abs(item.ruleNumber)) - 1].content
                  );
                  item3.ruleNumber.push(
                    Math.abs(item.ruleNumber)
                  );
                  flag = true;
                }
              });
              if (!flag) {
                // groupNum bu存在
                let obj = {
                  improper: [
                    this.rules[Number(Math.abs(item.ruleNumber)) - 1].content
                  ],
                  ruleNumber: [Math.abs(item.ruleNumber)],
                  groupNum: item2
                };

                errorRData.push(obj);
              }
            }
          }
        });
      });
      this.errorDatax = errorXData;
      this.errorDatar = errorRData;
      this.RcharData.rows.forEach((item4) => {
        for (let i = 0; i < errorRData.length; i++) {
          if (errorRData[i].groupNum == item4.groupNum) {
            item4.improper = errorRData[i].improper;
            item4.ruleNumber = errorRData[i].ruleNumber;
            break;
          }
        }
      });
      this.XcharData.rows.forEach((item4) => {
        for (let i = 0; i < errorXData.length; i++) {
          if (errorXData[i].groupNum == item4.groupNum) {
            item4.improper = errorXData[i].improper;
            item4.ruleNumber = errorXData[i].ruleNumber;
            //break;
          }
        }
      })

    },
    jsRes: function(res) {
      if (res.fieldsInfo) {
        this.params = res.fieldsInfo
      }
      this.xrStats = res.attributeStats;
      this.groupDatas = res.attributeGroupDataList;
      res.attributeGroupDataList.forEach((item) => {
        this.dataX.push(item.groupNum);

        this.ucl.push(item.ucl);
        this.lcl.push(item.lcl);
        // console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkk'+this.TYPE);
        if (this.TYPE == "np" || this.TYPE == "c") {
          this.badData.push(item.badNum);
        }
        if (this.TYPE == "p" || this.TYPE == "u") {
          this.badData.push(item.badRate);
        }
      });
      console.log('---------------this.ucl----------------');
      console.log(this.ucl);

      // 折线图
      this.cumulativeRateData.rows = res.cumulativeRateDataList;
      if (this.cumulativeRateData.rows[0] && this.cumulativeRateData.rows[0].groupNum != 0) {
        this.cumulativeRateData.rows.unshift({
          "groupNum": 0,
          "cumulativeRate": 0
        })
      }

      // 错误点
      let errorData = {};
      let arr = res.exceptionResultList.filter(
        item => item.groupNumList.length > 0
      );
      arr.forEach((item)=> {
        //{gropNumber:'',groupList:[]}
        item.groupNumList.forEach((item2) => {
          //excel
          if (!this.errorDataExcel[item2]) {
            this.errorDataExcel[item2] = [];
            this.errorDataExcel[item2].push(item.ruleNumber);
          } else {
            this.errorDataExcel[item2].push(item.ruleNumber);
          }
          //item2---groupNum

          if (!errorData[item2]) {
            // let obj={improper:[this.pyData[Number(item.ruleNumber)-1].rule],groupNum:item2};
            // errorData.push(obj);
            errorData[item2] = []; // {groupNum:[]}
            errorData[item2].push(
              this.rules[Number(item.ruleNumber) - 1].content
            );
          } else {
            errorData[item2].push(
              this.rules[Number(item.ruleNumber) - 1].content
            );
          }
        });
      });
      this.errorDatas = errorData;
      //柏拉图
      //paretoDataList
      let paretoData = res.paretoDataList.sort(function (obj1, obj2) {
        var val1 = obj1.badNum;
        var val2 = obj2.badNum;
        if (val1 < val2) {
          return 1;
        } else if (val1 > val2) {
          return -1;
        } else {
          return 0;
        }
      }); //从大到小排序
      paretoData.forEach((list, index, arr) => {
        this.paretoData.badName.push(list.badName);
        this.paretoData.badNum.push(list.badNum);
        if (index == 0) {
          this.paretoData.count.push(list.badNum);
        } else if (index > 0) {
          this.paretoData.count.push(Number(list.badNum) + Number(this.paretoData.count[index - 1]));
        }
      });
      //计算 percent
      let Max = this.paretoData.count.slice(-1)[0];
      this.paretoData.count.forEach((list1)=> {
        this.paretoData.rate.push(Number((list1 / Max).toString().slice(0, 4)));
      });


    }
  }
}
