import {
  firstBy
} from 'thenby'
import {
  spcDetail,
  spcTaskView,
  spcRulesList,
  controlInfo
} from '@/api/spc/config'
import viewDataRes from './viewDataRes'
export default {
  mixins: [viewDataRes],
  methods: {
    getRuleList: function () {
      spcRulesList({
        spcTaskId: this.spcTaskId
      }).then(res => {
        if (res.code == 200) {
          this.rules = res.data.sort(firstBy(v => {
            v.ruleNumber
          }))
          if (this.type == 'js') {
            this.rules = this.rules.slice(0, 4)
          }
          if (this.rules.length > 0) {
            this.rules.forEach(rule => {
              rule.content = rule.content.replace('n', rule.n).replace('m', rule.m).replace('k', rule.k);
            });
          }
        }
      })
    },
    getViewData: function (info) {
      this.fullLoading = this.$loading(this.LOADING);
      this.recentInfo = info;
      if (this.configData.controlGraph > 0 && this.configData.controlGraph < 5) { // 计量
        spcTaskView({
          spcTaskId: this.spcTaskId,
          ...info
        }).then(res => {
          console.log(res);
          let self = this;
          this.fullLoading.close();
          if (res.code == 200) {
            this.jlRes(res.data);
          } else {
            this.$message.error(res.message);
          }

        });
      }
      // ////////////////////////////////////////////////////////////////////////////////////////
      if (this.configData.controlGraph > 4 && this.configData.controlGraph < 9) { // 计数
        spcTaskView({
          spcTaskId: this.spcTaskId,
          ...info
        }).then(res => {
          console.log(res);
          let self = this;
          self.fullLoading.close();
          if (res.code == 200) {
            this.jsRes(res.data);
          } else {
            this.$message.error(res.message);
          }

        });
      }



    },
    cellClick: function (row, column, cell, event) {
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
    clickNode: function (e) {
      this.$set(this.expands, 0, e.name);
      let T = () => {
        this.page = Math.ceil(e.name / this.pageSize);
        let top;
        let INDEX = e.dataIndex + 1;
        //console.log('num--'+e.name+'-------pageSize---'+this.pageSize)
        if (/^[1-9]+$/.test(INDEX / this.pageSize)) { //20 40

          top = 35 * (this.pageSize - 1);
        } else if (INDEX % this.pageSize == 1) {

          top = 0;
        } else {

          top = 35 * (INDEX % this.pageSize - 1);
        }
        this.scrollDom.scrollTo(0, top);
      }
      T();


      //console.log(document.querySelectorAll('.el-table__body-wrapper')[1].scrollTop)
      //this.$nextTick(() => {
      //this.$refs.tableScroll.scrollTo(0,'100px');
      //})


    },
    tableMoreInfo: function (dataList) {
      //table额外信息处理
      /*
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
      */
      return data;
    },
    getSpcDetail: function (res) {
      if (res.code == 200) {

        if (res.data.controlGraph) {

          if (res.data.controlGraph > 0 && res.data.controlGraph < 5) {
            this.type = 'jl'

          } else if (res.data.controlGraph > 4 && res.data.controlGraph < 9) {
            this.type = 'js'
            // 计数
            let type = ["p", "np", "c", "u"];
            this.TYPE = type[Number(res.data.controlGraph) - 5];
          }
        }
        //
        // if(res.data.configDataanalysisId){
        //     this.toConfig=false;
        // }
        // else{
        //     this.toConfig=true;
        // }






        this.configData = res.data;
        if (res.data.dashboard && JSON.parse(res.data.dashboard) && JSON.parse(res.data.dashboard) instanceof Array) {

          let layout = JSON.parse(res.data.dashboard);
          //已经配置 页面
          this.layout = layout;
          // 面板 过滤panel  不显示已经设置布局的grid-item
          if (layout.length > 0) {
            layout.forEach(grid => {
              // X R图，设置WX HX
              if (grid.modelType == 6) { //x图
                if (grid.HPx) {
                  this.HX = grid.HPx;
                  // this.WX = grid.WPx + 'px';
                  this.WX = '100%';
                }

              }
              if (grid.modelType == 7) { // R图
                if (grid.HPx) {
                  this.HR = grid.HPx;
                  // this.WR = grid.WPx + 'px';
                  this.WR = '100%';
                }
              }
              if (grid.modelType == 8) { // 直方图图
                if (grid.HPx) {
                  this.HZ = grid.HPx;
                  // this.WZ = grid.WPx + 'px';
                  this.WZ = '100%';
                }
              }

              // 已经设置了 grid-item  不显示对应的panel
              this.panels.forEach(panel => {
                if (grid.modelType == panel.modelType) {
                  panel.modelType = -Math.abs(panel.modelType);
                }
              });
            });
          }

          // panel 面板不显示
          if (this.layout.length > 0) {
            if (this.layout[0].modelType == 0) {
              this.layout[0].modelType == -1;
            }
          } else {
            //如果为空，则显示面板
            this.layout.push({
              "x": 0,
              "y": 0,
              "w": 500,
              "h": 23,
              "i": "0",
              "modelName": "Panel",
              "modelType": 0
            });
          }



        } else {
          // 未配置 页面
          this.layout = [{
            "x": 0,
            "y": 0,
            "w": 500,
            "h": 23,
            "i": "0",
            "modelName": "Panel",
            "modelType": 0
          }]

        }

      } else {
        this.$message.error(res.message);
      }

    },
    getControlInfo: function (configDataanalysisId) {
      controlInfo({
        configDataanalysisId: configDataanalysisId
      }).then(res => {
        this.controlLoading = false ; 
        if (res.code == 200) {
         
          //解析附加信息
          let info = {};
          if (res.data.length > 0) {
            res.data.forEach(item => {
              // 类型判断
              if (item.parameterValueType == 1 || item.parameterValueType == 4) { // 选择类型
                if (item.parameterValue) {
                  if (item.parameterValueType == 4 && item.parameterValue.indexOf('@') >= 0) {
                    // sql 中有变量
                    
                    let reg = /@.+?\s+/g;
                    let res = item.parameterValue.match(reg); // [@a,@b]
                   
                    this.hasParameterForSql[item.sectionValue]={
                      source: res.map(item => item.trim()),
                      target: item
                    }
                    //
                    item.sql = item.parameterValue
                    item.parameterValue = ''
                    item.parameterValueArr = []
                  } else {
                   
                    item.parameterValueArr = item.parameterValue.split(";");
                    if (item.parameterValueType == 4) {
                      if (item.parameterValueArr.length > 0) {
                        item.parameterValueArr.pop();
                      }
                    }
                    item.parameterValue = "";
                  }

                } else {
                  // item.parameterValueArr=[];
                }

              }

              if (!item.sectionStart && !item.sectionOff) { // a=@a
                info[item.sectionValue] = item;
                // comment
                // if(item.comment){
                //   info[item.comment]=item;
                // }
                // else{
                //   info[item.sectionValue]=item;
                // }

              } else {
                if (!info[item.sectionValue]) {
                  info[item.sectionValue] = {
                    start: {},
                    off: {}
                  }
                  if (item.sectionStart) {
                    info[item.sectionValue].start = Object.assign({}, item);
                  }
                  if (item.sectionOff) {
                    info[item.sectionValue].off = Object.assign({}, item);
                  }
                } else {

                  if (item.sectionStart) {

                    info[item.sectionValue].start = Object.assign({}, item);
                  }
                  if (item.sectionOff) {

                    info[item.sectionValue].off = Object.assign({}, item);
                  }
                }
              }
            });

          }
          //
          this.controlInfo = Object.assign({}, info);
          
        } else {
          this.$message.error(res.message);
        }
      });
    }
  },
  computed: {
    showPagination: function () {
      //console.log(this.total);
      // return this.total/this.pageSize>1?true:false;
    },
    XR: function () {
      let arr = [
        ["X", "R", "平均值", "极差值"],
        ["X", "S", "平均值", "标准差"],
        ["Me", "R", "中位数", "极差"],
        ["X", "MR", "平均值", "移动极差"]
      ];
      if (this.type == 'jl') {
        return arr[Number(this.configData.controlGraph) - 1];
      } else {
        return ["X", "R", "平均值", "极差值"];
      }

    },
  },
  beforeMount: function () {
    // this.fullLoading = this.$loading(this.LOADING);
    // let self = this;
    // self.timeout = setTimeout(function () {
    //   self.fullLoading.close();
    //   // self.$message.warning('数据源发生错误');
    // }, 120000);
  },
  created: function () {
    this.spcTaskId = Number(this.$route.params.spc_id);
    let self = this;
    async function spc() {
      let spcDetails = await spcDetail({
        spcTaskId: self.spcTaskId
      });

      if (spcDetails.code == 200) {
        await self.getSpcDetail(spcDetails);
        self.getRuleList();

        if (spcDetails.data && spcDetails.data.configDataanalysisId) {
          self.getControlInfo(Number(spcDetails.data.configDataanalysisId));
        }
      }


      //   let spcView = await spcTaskView({
      //     spcTaskId: self.spcTaskId
      //   });
      //   self.getViewData(spcView);
    }
    spc();

    /*
    if (!self.datas) {
      //不传参数，默认第一次选中的值
      console.log("默认值********************");
      let test = async function () {
        let configDatail = await spcConofigDetail({
          spc_config_id: self.spc_id
        });
        await self.getSpcConofigDetail(configDatail);
        let viewData = await spcViewData({
          spc_config_id: self.spc_id
        });
        console.log("=======================viewData=====");
        console.log(viewData);
        self.fullLoading.close();
        clearTimeout(self.timeout);
        self.timeout = null;
        await self.getViewData(viewData);
      };
      test();
    } else {
      if (self.datas.move_range) {
        console.log(
          self.datas.graph + "-------------move_range---------------"
        );
        //self.$on(self.datas.label,function(){
        let test = async function () {
          let configDatail = await spcConofigDetail({
            spc_config_id: self.spc_id
          });
          await self.getSpcConofigDetail(configDatail);
          self.configData.control_graph = self.datas.graph;
          let viewData = await spcViewData({
            spc_config_id: self.spc_id,
            control_graph: self.datas.graph,
            move_range: self.datas.move_range
          });
          self.fullLoading.close();
          clearTimeout(self.timeout);
          self.timeout = null;
          await self.getViewData(viewData);
        };
        test();
        // });
      } else {
        console.log(self.datas.graph + "----------------------------");
        let test = async function () {
          let configDatail = await spcConofigDetail({
            spc_config_id: self.spc_id
          });
          await self.getSpcConofigDetail(configDatail);
          self.configData.control_graph = self.datas.graph;
          let viewData = await spcViewData({
            spc_config_id: self.spc_id,
            control_graph: self.datas.graph
          });
          self.fullLoading.close();
          clearTimeout(self.timeout);
          self.timeout = null;
          await self.getViewData(viewData);
        };
        test();
      }
    }
    */
  }

};
