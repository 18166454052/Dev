import {
  dsList,
  dsCreate,
  dsDelete,
  dsUpdate,
  dsDetail,
  dsMsaList,
  dsMsaDetail,
  dsMsaDelete
} from '@/api/dataSource'
import {
  dbList
} from '@/api/config/datasourceConfig'
import {
  codemirror
} from 'vue-codemirror'
import 'codemirror/theme/rubyblue.css'
import 'codemirror/theme/seti.css'
import 'codemirror/mode/sql/sql.js'
import { firstBy } from 'thenby'
export default {
  components: {
    codemirror
  },
  data() {
    return {
      type: '',
      searchDatasource: '',
      showAdd: false,
      createLoading: false,
      mySqlOption: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        mode: 'text/x-sql',
        lineWrapping: true,
        theme: 'rubyblue',
        autoRefresh: true
      },
      calculationType: [
        {
          id: 1,
          name: '计量管制'
        },
        {
          id: 2,
          name: '计数管制'
        },
        // {
        //   id: 3,
        //   name: '制程能力'
        // }
        // {id:4,name:'MSA管制'},
        // {id:5,name:'DOE'},
      ],
      projectType: [
        {
          id: 1,
          name: '抽样'
        },
        {
          id: 2,
          name: '趋势'
        },
        {
          id: 3,
          name: '在线预警'
        }
      ],
      parameterValueType: [
        {
          id: 1,
          name: '选项'
        },
        {
          id: 5,
          name: '日期'
        },
        {
          id: 2,
          name: '日期时间'
        },
        {
          id: 3,
          name: '输入'
        },
        {
          id: 4,
          name: 'sql'
        }
      ],
      Form: {
        configDataanalysis: { // 数据源信息
          configDataanalysisName: '',
          configDatasourceId: '',
          calculationType: '',
          projectType: '',
          comment: '',
          selectSql: '',
          sqlDes: '',
          createTime: '',
          // MSA
          // config_dataanalysis_msa_name
          configDataanalysisMsaName: '',
          tableName: '',
          fieldComponent: '',
          fieldIndex: '',
          fieldStaff: '',
          fieldValue: '',
          cron: ''
        },
        configDataanalysisParameterControl1: [ // 参数配置-抽样
          []
          // {parameter:'@111',parameterValueType:1,
          // parameterValue:'',parameterValueArr:[],comment:'',index:''}
        ],
        configDataanalysisParameterAdditional1: [ // 附加字段-抽样
          []
          //  {field:'aaa',fieldComment:'comment'}
        ],
        configDataanalysisParameterControl2: [ // 参数配置-趋势
          []
        ],
        configDataanalysisParameterAdditional2: [ // 附加字段-趋势
          []
        ],
        configDataanalysisParameterControl3: [ // 参数配置-预警
          []
        ],
        configDataanalysisParameterAdditional3: [ // 附加字段-预警
          []
        ],
        msaAdditional: [
          {
            parameterName: '测量部件选项',
            parameter: 'controlComponents',
            parameterValueArr: []
          },
          {
            parameterName: '测量人员选项',
            parameter: 'controlStaff',
            parameterValueArr: []
          },
          {
            parameterName: '测量序号选项',
            parameter: 'controlIndex',
            parameterValueArr: []
          }
        ],
        sample: [ // 抽样
          {
            sql: ''
          }
        ],
        process: [ // 趋势
          {
            sql: '',
            sqlDes: ''

          }
        ],
        warning: [ // 预警
          {
            sql: ''
          }
        ]

      },
      computed1: [ // 分析字段-抽样
        // {controlInfoName:'name',controlLabel:'label'}
        []
      ],
      computed2: [ // 分析字段-趋势
        []
      ],
      computed3: [ // 分析字段-预警
        []
      ],
      dsRules: {
        configDataanalysis: {
          configDataanalysisName: [{
            required: true,
            message: '请填写数据分析名称',
            trigger: 'change,blur'
          }],
          calculationType: [{
            required: true,
            message: '请选择分析类型',
            trigger: 'change,blur'
          }],
          projectType: [{
            required: true,
            message: '请选择分析项类型',
            trigger: 'change,blur'
          }],
          configDatasourceId: [{
            required: true,
            message: '请选择数据源',
            trigger: 'change,blur'
          }],
          cron: [
            {
              required: true,
              message: '请填写定时设置',
              trigger: 'change,blur'
            }
          ]
        }

      },
      filterDsList: [],
      dsList: [
        // {
        //     configDatasourceName:'name', 
        //     configDatasourceId:'11',
        //     calculationType:'1',
        //     comment:'',
        //     selectSql:'',
        //     createTime:'11111',
        //     sql_info:[],
        //     sql_control_info:[
        //     ],
        // }
      ],
      filterDsMsaList: [],
      dsMsaList: [
        // {
        //     configDatasourceName:'name', 
        //     configDatasourceId:'11',
        //     calculationType:'1',
        //     comment:'',
        //     selectSql:'',
        //     createTime:'11111',
        //     sql_info:[],
        //     sql_control_info:[


        //     ],
        // }
      ],
      dbList: [],
      Booleananalysis: true, // 编辑时,首次进入要不要分析sql
      repeatParameter: [],
      parameterCache1: [{}], // 抽样
      parameterCache2: [{}], // 趋势
      parameterCache3: [{}] // 预警

    }
  },
  methods: {
    deleteDatasource: function (ds, index, type) {
      let name = '';
      if (ds.configDataanalysisName) {
        name = ds.configDataanalysisName
      }
      if (ds.configDataanalysisMsaName) {
        name = ds.configDataanalysisMsaName
      }
      this.$confirm('确定删除分析项' + name + '?', '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        if (type == 'spc') {
          dsDelete({
            configDataanalysisId: ds.configDataanalysisId
          }).then(res => {
            if (res.code == 200) {
              this.$message.success('删除数据分析成功');
              this.dsList.splice(index, 1);
              this.filterDsList.splice(index, 1);

            } else {
              this.$message.error(res.message);
            }
          });
        }

        if (type == 'msa') {
          dsMsaDelete({
            configDataanalysisMsaId: ds.configDataanalysisMsaId
          }).then(res => {
            if (res.code == 200) {
              this.$message.success('删除数据分析成功');
              this.dsMsaList.splice(index, 1);
              this.filterDsMsaList.splice(index, 1);

            } else {
              this.$message.error(res.message);
            }
          });
        }

      }).catch(() => {});
    },
    back: function () {
      let type=this.Form.configDataanalysis.projectType;
      this['parameterCache' + type] = {};
      this.repeatParameter = [];
      this.Form = {
        configDataanalysis: { // 数据源信息
          configDataanalysisName: '',
          configDatasourceId: '',
          calculationType: '',
          comment: '',
          selectSql: '',
          sqlDes: '',
          createTime: '',
          // config_dataanalysis_msa_name
          configDataanalysisMsaId: '',
          tableName: '',
          fieldComponent: '',
          fieldIndex: '',
          fieldStaff: '',
          fieldValue: '',
          cron: ''
        },
        configDataanalysisParameterControl1: [[]],
        configDataanalysisParameterAdditional1: [[]],
        configDataanalysisParameterControl2: [[]],
        configDataanalysisParameterAdditional2: [[]],
        configDataanalysisParameterControl3: [[]],
        configDataanalysisParameterAdditional3: [[]],
        msaAdditional: [{
          parameterName: '测量部件选项',
          parameter: 'controlComponents',
          parameterValueArr: [],
        },
        {
          parameterName: '测量人员选项',
          parameter: 'controlStaff',
          parameterValueArr: [],
        },
        {
          parameterName: '测量序号选项',
          parameter: 'controlIndex',
          parameterValueArr: [],
        }
        ],
        sample: [ //  制程能力
          {
            sql: '',
            sqlDes: ''
          }
        ],
        process: [ //  制程能力
          {
            sql: ''
          }
        ],
        warning: [ //  制程能力
          {
            sql: ''
          }
        ]
      },
      this.computed1 = [[]]
      this.computed2 = [[]]
      this.computed3 = [[]]
      this.parameterCache1 = [{}]
      this.parameterCache2 = [{}]
      this.parameterCache3 = [{}]
      this.$refs.dsForm.resetFields()
      this.createLoading = false;
      // this.$refs.controlForm.resetFields();
      this.showAdd = false;
    },
    analysis: function (sql, INDEX) { // 解析SQL
      if (!this.Form.configDataanalysis.calculationType) {
        this.$message.warning('请先选择分析类型')
        return false;
      }

      if (!sql || typeof sql == 'number') {
        return false;
      }
      let type = this.Form.configDataanalysis.projectType; // 抽样 趋势 预警
      console.log("------type=-----"+type+'---'+INDEX)
      // 判断  update insert delete
      if (/\s+delete\s+/i.test(sql)) {
        this.$message.warning('SQL中不能包含关键字 delete')
      }
      if (/\s+insert\s+/i.test(sql)) {
        this.$message.warning('SQL中不能包含关键字 insert')
      }
      if (/\s+update\s+/i.test(sql)) {
        this.$message.warning('SQL中不能包含关键字 update')
      }
      if (/\s+\*\s+/i.test(sql)) {
        this.$message.warning('SQL中不能包含关键字 *')
      }
      let self = this;
      let parameterArr = [],
        parameterCount = {};
      // 参数信息
      if (this.Booleananalysis) {
        this.Form['configDataanalysisParameterControl' + type][INDEX] = [];
        let reg = /\s+\w+\s*(>|<|>=|<=|=)\s*@\w+\s+/gi,//   c<@c1   @c2<c<@c1
        // let reg = /[^><=]\s+\w+\s*(>|<|>=|<=|=)\s*@\w+\s+/gi,//   c<@c1   @c2<c<@c1
          arr = [];
        console.log('a=@a');
        // console.log(sql.match(reg));


        let result = sql.match(reg);
        // null []
        if (result && result instanceof Array && result.length > 0) {
          // result1=this.replace(result1);
          result = this.replace(result);
          let res = result.map(item => {
            item=item.trim();
            return item.split(' ');
          });
          // [['a', '=', '@a']]
          console.log(res);
          // 过滤表示区间的字段 
          let valueCount = {} // a:1 b:2
          res.forEach((item, index) => {
            // 统计 参数出现的次数
            if (!valueCount[item[0]]) {
              valueCount[item[0].trim()] = 1;
            } else {
              valueCount[item[0].trim()] += 1
            }
          });
          //
          console.log(valueCount);
          if(res.length>0) {
            res.forEach((item, index) => {
              if (valueCount[item[0].trim()] == 1) { // 过滤
                parameterArr = [...parameterArr, ...item.slice(-1)];
                let OBJ={
                  parameter: item[2].trim(),
                  parameterValueType: 3,
                  parameterValue: '',
                  parameterValueArr: [],
                  comment: '',
                  sectionStart: false,
                  sectionOff: false,
                  sectionValue: item[0].trim(),
                  symbol: item[1].trim(),
                  configDataanalysisId: null,
                  sqlIndex: INDEX,
                  required: '1'
                };
                if (!this['parameterCache'+type][INDEX] || !this['parameterCache'+type][INDEX][item[2].trim()]) {
                  this['parameterCache'+type][INDEX][item[2].trim()] = OBJ;

                  this.Form['configDataanalysisParameterControl' + type][INDEX].push(OBJ);
                } else {
                  this.Form['configDataanalysisParameterControl' + type][INDEX].push(
                    Object.assign({}, this['parameterCache' + type][INDEX][item[2]])
                  );
                }

              }
            });
          }
        }

        // let reg2=/\w+\s*(>|<|>=|=<)\s*@\w+\s*and\s*\w+\s*(>|<|>=|=<)\s*@\w+/gi,arr2=[];
        let reg2 = /\s+(\w+)\s*(>|<|>=|<=)\s*@\w+\s*and\s*\1\s*(>|<|>=|<=)\s*@\w+\s+/gi,
          arr2 = [];
        // 回溯  同一个值(a)的 范围  
        console.log('a>@a1 and a>@2');
        // console.log(sql.match(reg2));
        let result2 = sql.match(reg2);
      
        // null []
        if (result2 && result2 instanceof Array && result2.length > 0) {
          // result1=this.replace(result1);
          let arr = [];
          result2.forEach(item => {
            item = item.replace(/and/i, ',');
            arr = [...arr, ...item.split(',')]
          });
          result2 = this.replace(arr);

          // console.log(result2);
          let res = result2.map(item => {
            item=item.trim();
            return item.split(' ');
          });
          //[['a', '=', '@a']]
          console.log(res);
         
          if (res.length > 0) {
            res.forEach((item, index) => {
              console.log(item.slice(-1));
              parameterArr = [...parameterArr, ...item.slice(-1)];
              let OBJ = {
                parameter: item[2].trim(),
                parameterValueType: 3,
                parameterValue: '',
                parameterValueArr: [],
                comment: '',
                sectionStart: item[1].indexOf('>') >= 0 ? true : false,
                sectionOff: item[1].indexOf('<') >= 0 ? true : false,
                sectionValue: item[0].trim(),
                symbol: item[1].trim(),
                sqlIndex: INDEX,
                required: '1'
              } 
             
              if (!this['parameterCache' + type][INDEX][item[2].trim()]) {
                this['parameterCache' + type][INDEX][item[2].trim()] = OBJ;
                this.Form['configDataanalysisParameterControl' + type][INDEX].push(OBJ);
              } else {
                this.Form['configDataanalysisParameterControl' + type][INDEX].push(
                  Object.assign({}, this['parameterCache' + type][INDEX][item[2].trim()])
                );
              }

            });
          }
        }


        let reg3 = /\s+\w+\s+between\s+@\w+\s+and\s+@\w+\s+/gi,
          arr3 = [];
        console.log(' between @a1 and @2');
        let result3 = sql.match(reg3);
        console.log(result3)
        if (result3 && result3 instanceof Array && result3.length > 0) {
          // result1=this.replace(result1);
          let arr = []
          result3.forEach(item => {
            arr.push(item.replace(/between/i, ',').replace(/and/i, ',').split(','));
          });
          let res = arr;
          console.log(res);
          // [[a,@a1,@a1],[b,@b1,@b2]]
          if(res.length>0)  {
            res.forEach((item, index) => {
              parameterArr = [...parameterArr, ...item.slice(1)];
              let OBJ = {
                parameter: item[1].trim(),
                parameterValueType: 3,
                parameterValue: '',
                parameterValueArr: [],
                comment: '',
                sectionStart: true,
                sectionOff: false,
                sectionValue: item[0].trim(),
                symbol: '至',
                configDataanalysisId: null,
                sqlIndex: INDEX,
                required: '1'
              }
              if (!this['parameterCache' + type][INDEX][item[1].trim()]) {
                this['parameterCache' + type][INDEX][item[1].trim()] = OBJ;
                this.Form['configDataanalysisParameterControl' + type][INDEX].push(OBJ);
              } else {
                this.Form['configDataanalysisParameterControl' + type][INDEX].push(
                  Object.assign({}, this['parameterCache' + type][INDEX][item[1].trim()])
                )
              }
              let OBJ1 = {
                parameter: item[2].trim(),
                parameterValueType: 3,
                parameterValue: '',
                parameterValueArr: [],
                comment: '',
                sectionStart: false,
                sectionOff: true,
                sectionValue: item[0].trim(),
                symbol: '至',
                configDataanalysisId: null,
                sqlIndex: INDEX,
                required: '1'
              }
              if (!this['parameterCache' + type][INDEX][item[2].trim()]) {

                this['parameterCache' + type][INDEX][item[2].trim()] = OBJ1;
                this.Form['configDataanalysisParameterControl' + type][INDEX].push(OBJ1);
              } else {
                this.Form['configDataanalysisParameterControl' + type][INDEX].push(
                  Object.assign({}, this['parameterCache' + type][INDEX][item[2].trim()])
                );
              }
            });
          }
        }


        let reg1 = /\s+@\w+\s*=?<\s*\w+\s*=?<\s*@\w+\s+/gi,
          arr1 = [];
        // console.log('a<b<c');
        let result1 = sql.match(reg1);
        if (result1 && result1 instanceof Array && result1.length > 0) {
          let arr = result1.map(item => {
            item=item.trim();
            if (item.indexOf('>=') >= 0) {
              item = item.replace(/>=/g, ' >= ');
            } else if (item.indexOf('>') >= 0) {
              item = item.replace(/>/g, ' > ');
            }


            if (item.indexOf('<=') >= 0) {
              item = item.replace(/<=/g, ' <=');
            } else if (item.indexOf('<') >= 0) {
              item = item.replace(/</g, ' < ');
            }

            return item.split(' ');
          });

          // [['@a', '<', 'a', '<', '@b']]
          let res = arr;
          console.log("[['@a1', '<', 'a', '<', '@a2]]");
          console.log(res);
          if(res.length>0) {
            console.log( parameterArr)
            res.forEach((item, index) => {
              parameterArr = [...parameterArr, ...item.slice(0,1)]
              parameterArr = [...parameterArr, ...item.slice(4)]
              console.log( parameterArr)
              let OBJ = {
                parameter: item[0].trim(),
                parameterValueType: 3,
                parameterValue: '',
                parameterValueArr: [],
                comment: '',
                sectionStart: item[1].indexOf('<') >= 0 ? true : false,
                sectionOff: item[1].indexOf('<') >= 0 ? false : true,
                sectionValue: item[2].trim(),
                symbol: item[1].trim(),
                configDataanalysisId: null,
                sqlIndex: INDEX,
                required: '1'
              }
              if (!this['parameterCache' + type][INDEX][item[0].trim()]) {
                this['parameterCache' + type][INDEX][item[0].trim()] = OBJ;
                this.Form['configDataanalysisParameterControl' + type][INDEX].push(OBJ);
              } else {
                this.Form['configDataanalysisParameterControl' + type][INDEX].push(
                  Object.assign({}, this['parameterCache' + type][INDEX][item[0].trim()])
                )
              }
              let OBJ1 = {
                parameter: item[4].trim(),
                parameterValueType: 3,
                parameterValue: '',
                parameterValueArr: [],
                comment: '',
                sectionStart: item[1].indexOf('<') >= 0 ? false : true,
                sectionOff: item[1].indexOf('<') >= 0 ? true : false,
                sectionValue: item[2].trim(),
                symbol: item[3].trim(),
                configDataanalysisId: null,
                sqlIndex: INDEX,
                required: '1'
              }
              if (!this['parameterCache' + type][INDEX][item[4].trim()]) {

                this['parameterCache' + type][INDEX][item[4].trim()] = OBJ1
                this.Form['configDataanalysisParameterControl' + type][INDEX].push(OBJ1);
              } else {
                this.Form['configDataanalysisParameterControl' + type][INDEX].push(
                  Object.assign({}, this['parameterCache'+type][INDEX][item[4].trim()])
                )
              }

            });
          }
        
        }
      }
      // 参数信息结束

      // 分析字段 / 附加信息
      let reg1 = /^\s*select\s*[\s\S]+?\s*from/gi; // [\s\S]匹配所有字符 包括换行
      
      this['computed'+type][INDEX] = [];
      let config_info = [];
      this.Form['configDataanalysisParameterAdditional' + type][INDEX] = [];
      let arrConfig = sql.match(reg1);
      if (arrConfig && arrConfig instanceof Array && arrConfig.length > 0) {

        if (this.Booleananalysis) {
          this.Form['configDataanalysisParameterAdditional' + type][INDEX] = []
        }
        if (arrConfig && arrConfig instanceof Array && arrConfig.length > 0) {
          config_info = arrConfig.map(item => {
            return item.replace(/select/i, '').replace(/from/i, '').replace('，', ',').trim().split(',');
          });
        }

        let column = [];
        config_info.forEach(col => {
          column = [...column, ...col];
        })
        console.log(parameterArr)
        console.log('附加信息-----------')
        console.log(column) // [@a,@b,@c]

        parameterArr = [...parameterArr, ...column];
        // 判断参数是否重复
        self.repeatParameter = [];
        parameterCount = {};
        if (parameterArr.length > 0) {
          parameterArr.forEach(par => {
            if (!parameterCount[par.trim()]) {
              parameterCount[par.trim()] = 1;
            } else {
              parameterCount[par.trim()] += 1;
              self.repeatParameter.push(par.trim());
              self.$message.warning('参数名称不能重复,' + par + '重复出现');
            }
          });
        }

        // 分析字段
        if (self.Form.configDataanalysis.calculationType == 1) {
          if (column.length > 0) {
            column.forEach((item, index) => {
              if (index == 0) { // 计算
                self['computed' + type][INDEX].push({
                  controlInfoName: item,
                  controlLabel: '数值'
                });
              } else { // 附加信息
                // if (this.Booleananalysis) {
                if (item) {
                  // cache
                  if (!this['parameterCache' + type][INDEX][item]) {

                    this['parameterCache' + type][INDEX][item] = '';
                    //
                    self.Form['configDataanalysisParameterAdditional' + type][INDEX].push({
                      field: item,
                      fieldComment: '',
                      sqlIndex: INDEX

                    });
                  } else {
                    self.Form['configDataanalysisParameterAdditional' + type][INDEX].push({
                      field: item,
                      fieldComment: this['parameterCache' + type][INDEX][item],
                      sqlIndex: INDEX

                    });
                  }
                }
                // }
              }
            });
          } else {
            self['computed' + type][INDEX].push({
              controlInfoName: '',
              controlLabel: '数值'
            });
          }



        } else if (self.Form.configDataanalysis.calculationType == 2) {
          // 计数
          let colName = ['不良原因', '采样总数', '不良总数'];

          if (column.length >= 3) {

            column.forEach((item, index) => {
              if (index < 3) {
                self['computed' + type][INDEX].push({
                  controlInfoName: item,
                  controlLabel: colName[index]
                });
              } else {
                // if (this.Booleananalysis) {
                if (item) {
                  if (!this['parameterCache' + type][INDEX][item]) {
                    this['parameterCache' + type][INDEX][item] = '';
                    self.Form['configDataanalysisParameterAdditional' + type][INDEX].push({
                      field: item,
                      fieldComment: '',
                      sqlIndex: INDEX


                    });
                  } else {
                    self.Form['configDataanalysisParameterAdditional' + type][INDEX].push({
                      field: item,
                      fieldComment: this['parameterCache' + type][INDEX][item],
                      sqlIndex: INDEX

                    });
                  }

                }
                // }


              }

            });
          } else {
            colName.forEach((name, index) => {
              self['computed' + type][INDEX].push({
                controlInfoName: column[index] ? column[index] : '',
                controlLabel: name
              });

            });
          }

        }
      }
      this.Booleananalysis = true;
    },
    replace: function (arr) {
      return arr.map(item => {
        if (item.indexOf('>=') >= 0) {
          item = item.replace('>=', ' >= ');
        } else if (item.indexOf('<=') >= 0) {
          item = item.replace('<=', ' <=');
        } else if (item.indexOf('<') >= 0) {
          item = item.replace('<', ' < ');
        } else if (item.indexOf('>') >= 0) {
          item = item.replace('>', ' > ');
        } else if (item.indexOf('=') >= 0) {
          item = item.replace('=', ' = ');
        }
        return item.trim();
      });

    },
    getDblist: function () {
      dbList().then(res => {
        if (res.code == 200) {
          this.dbList = res.data.list;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getDsList: function () { //  spc
      dsList().then(res => {

        if (res.code == 200) {
          this.dsList = res.data.list;
          this.filterDsList = this.dsList.slice();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    addOption: function (val) {
      let last = val.slice(-1);
      if (last.length > 0) {
        if (last[0].indexOf(';') >= 0) {
          this.$message.warning('参数值 ' + last + ' 中不能包含 ;');
          val.pop();
        }
      }

    },
    checkSql(type) {
      if (this.Form[type].length == 0) {
        this.$message.warning('请最少填写一条SQL');
        return false;
      }
      //select a from 
      let reg1 = /^\s*select\s*[\s\S]+?\s*from/gi;
      let config_info = [];
      for (let i = 0; i < this.Form[type].length; i++) {
        let arrConfig = this.Form[type][i].sql.match(reg1);
        if (arrConfig && arrConfig instanceof Array && arrConfig.length > 0) {

          if (arrConfig && arrConfig instanceof Array && arrConfig.length > 0) {
            config_info = arrConfig.map(item => {
              return item.replace(/select/i, '').replace(/from/i, '').replace('，', ',').trim().split(',');
            });
          }
        }
        //  ['a','b']
        if (config_info.length >= 1) {
          if (config_info[0].length > 1) {
            this.$message.warning(config_info[0].join(',') + '只能查询一个');
            return false;
          }
        }
      }
      //
      let sql = '';
      this.Form[type].forEach(item => {
        if (item.sql) {
          sql = sql + '{' + item.sql + '}';
        }
      });
      sql = sql;
    },
    submit: function () {

      this.$refs.dsForm.validate(res => {
        if (res) {
       
        let type=this.Form.configDataanalysis.projectType;
        let arr=[];
          switch(type){
            case 1: arr=this.Form.sample;break;
            case 2: arr=this.Form.process;break;
            case 3: arr=this.Form.warning;break;
          }
          if(arr.length==1 && !arr[0].sql){
             this.$message.warning('请填写SQL');
             return false;
          }
          let flag=true;
          if(arr.length>0){
            arr.forEach((SQL,INDEX)=>{
                //sql  存在
              
                if (/\s+delete\s+/i.test(SQL.sql)) {
                  this.$message.warning('SQL中不能包含关键字 delete')
                  flag=false;
                }
                if (/\s+insert\s+/i.test(SQL.sql)) {
                  this.$message.warning('SQL中不能包含关键字 insert')
                  flag=false;
                }
                if (/\s+update\s+/i.test(SQL.sql)) {
                  this.$message.warning('SQL中不能包含关键字 update')
                  flag=false;
                }
                if (/\s+\*\s+/i.test(SQL.sql)) {
                  this.$message.warning('SQL中不能包含关键字 *')
                  flag=false;
                }
                // 控制信息
                if (this.Form['configDataanalysisParameterControl' + type][INDEX] 
                    && this.Form['configDataanalysisParameterControl' + type][INDEX] instanceof Array 
                    && this.Form['configDataanalysisParameterControl' + type][INDEX].length > 0) {
                  this.Form['configDataanalysisParameterControl' + type][INDEX].forEach(item => {
                    if (item.parameterValueType == 1 && item.parameterValueArr instanceof Array  && item.parameterValueArr.length > 0) {
                      item.parameterValue = item.parameterValueArr.join(';')

                    }
                    delete item.parameterValueArr;
                  })
                }
                if (this.type == 'update') {
                  //添加configDataanalysisId
                  if (this.Form['configDataanalysisParameterAdditional'+type][INDEX] 
                  && this.Form['configDataanalysisParameterAdditional'+type][INDEX] instanceof Array 
                  && this.Form['configDataanalysisParameterAdditional'+type][INDEX].length > 0) {
                    this.Form['configDataanalysisParameterAdditional' + type][INDEX].forEach(item => {
                      item.configDataanalysisId = this.Form.configDataanalysis.configDataanalysisId;
                    })
                  }
                  if (this.Form['configDataanalysisParameterControl' + type][INDEX]
                      && this.Form['configDataanalysisParameterControl' + type][INDEX] instanceof  Array
                      && this.Form['configDataanalysisParameterControl' + type][INDEX].length > 0) {
                    this.Form['configDataanalysisParameterControl' + type][INDEX].forEach(item => {
                      item.configDataanalysisId = this.Form.configDataanalysis.configDataanalysisId;
                      if(item.parameterValueType==4){
                        item.parameterValue.trim().trim(";").trim(",");
                         item.parameterValue=item.parameterValue+' ';
                      }
                    })
                  }
                }
            
             //
             if(flag){
                this.Form.configDataanalysisParameterControl=[];
                this.Form['configDataanalysisParameterControl' + type].forEach(control=>{
                this.Form.configDataanalysisParameterControl=[...this.Form.configDataanalysisParameterControl,...control]
                });
                this.Form.configDataanalysisParameterAdditional=[];
                this.Form['configDataanalysisParameterAdditional' + type].forEach(additional=>{
                  this.Form.configDataanalysisParameterAdditional=[...this.Form.configDataanalysisParameterAdditional,...additional];
                });
             }
                

            });
          }
          if(!flag){
            return false;
          }
              // sql 处理
              this.Form.configDataanalysis.selectSql = "";
              this.Form.configDataanalysis.sqlDes = "";
              if(type==2){
                  arr.forEach(sql=>{
                    if(sql.sql){
                    
                      this.Form.configDataanalysis.selectSql+='{' + sql.sql + '}'
                      if(sql.sqlDes){
                        this.Form.configDataanalysis.sqlDes+='{' + sql.sqlDes + '}'
                      }
                      else{
                        this.Form.configDataanalysis.sqlDes+='{}'
                      }
                    
                    }
                  });
              }
              else{
                this.Form.configDataanalysis.selectSql=arr[0].sql;
              }
              
              let obj={
                configDataanalysisParameterAdditional:this.Form.configDataanalysisParameterAdditional,
                configDataanalysisParameterControl:this.Form.configDataanalysisParameterControl,
                configDataanalysis:this.Form.configDataanalysis
              }
              this.createLoading = true;
              console.log(obj);
              ///////// 接口
              if (this.type == 'create') {
                dsCreate(obj).then(res => {
                  this.createLoading = false;
                  if (res.code == 200) {
                    this.getDsList();
                    this.back();
                    //this.showAdd=false;

                    this.$message.success(res.message);
                  } else {
                    this.$message.error(res.message);
                  }
                });
              };
        
              if (this.type == 'update') {
                dsUpdate(obj).then(res => {
                  this.createLoading = false;
                  if (res.code == 200) {
                    this.getDsList();
                    this.back();
                    //this.showAdd=false;
                    this.$message.success(res.message);

                  } else {
                    this.$message.error(res.message);
                  }
                });
              }
            
        

        }
      });
    },
    sqlChange: function (sql, bool) {

      if (!this.Form.configDataanalysis.calculationType) {
        this.$message.warning('请选择分析类型');
      } else {
        if (bool != 'false') { // 抽样

          this.analysis();
        } else { //  趋势  预警

          if (/\s+delete\s+/i.test(sql)) {
            this.$message.warning('SQL中不能包含关键字 delete');
          }
          if (/\s+insert\s+/i.test(sql)) {
            this.$message.warning('SQL中不能包含关键字 insert');
          }
          if (/\s+update\s+/i.test(sql)) {
            this.$message.warning('SQL中不能包含关键字 update');
          }
          if (/\s*\*\s*/i.test(sql)) {
            this.$message.warning('SQL中不能包含关键字 *');
          }
          //  select a from   只能有一个字段
          let reg1 = /^\s*select\s*.+?\s*from/gi;
          let config_info = [];
          let arrConfig = sql.match(reg1);
          console.log(sql);
          console.log(arrConfig);
          if (arrConfig && arrConfig instanceof Array && arrConfig.length > 0) {

            if (arrConfig && arrConfig instanceof Array && arrConfig.length > 0) {
              config_info = arrConfig.map(item => {
                return item.replace(/select/i, '').replace(/from/i, '').replace('，', ',').trim().split(',');
              });
            }
          }
          //  ['a','b']

          if (config_info.length >= 1) {
            if (config_info[0].length > 1) {
              this.$message.warning(config_info[0].join(',') + '只能查询一个');
            }
          }

        }
      }
    },
    filterDs: function () { // 搜索
      if (this.searchDatasource) {
        let reg = new RegExp(this.searchDatasource, 'i');
        if (this.dsList.length > 0) {
          this.filterDsList = this.dsList.filter(ds => reg.test(ds.configDataanalysisName));
        } else {
          this.filterDsList = this.dsList.slice();
        }

        if (this.dsMsaList.length > 0) {
          this.filterDsMsaList = this.dsMsaList.filter(msa => reg.test(msa.configDataanalysisMsaName));
        } else {
          this.filterDsMsaList = this.dsMsaList.slice();
        }
      } else {
        this.filterDsList = this.dsList.slice();
        this.filterDsMsaList = this.dsMsaList.slice();
      }
    },
    backSql: function (type,SQL,sqlDes) { // {select a from b}=>[{sql:select a from b}]
      let reg = /{.*?}/g;
      let sql = SQL.match(reg);
      let des=sqlDes.match(reg);
      console.log(sql);
      if (sql && sql instanceof Array && sql.length > 0) {
        let arr = [];
        sql.forEach((item,index1) => {
          arr.push({
            sql: item.replace('{', '').replace('}', ''),
            sqlDes: des[index1].replace('{', '').replace('}', '')
          });
        });
        if(type==2){
          this.Form.process= arr;
          console.log('--------------------------------------');
          console.log(arr);
          arr.forEach((sql1,index)=>{
            this.Form['configDataanalysisParameterControl2'].push([{}]);
            this.Form['configDataanalysisParameterAdditional2'].push([{}]);
            this['parameterCache2'].push({});
            this['computed2'].push([]);
            this.analysis(sql1.sql +' ',index)
          });
        }
      }
    },
    showUpdate: function (ds, index, type) {
      this.type = 'update';
      this.Booleananalysis = false;

      if (type == 'spc') { // 计量 计数  
        dsDetail({
          configDataanalysisId: ds.configDataanalysisId
        }).then(res => {
          if (res.code == 200) {
            console.log(res);
            this.showAdd = true;
            let TYPE=res.data.configDataanalysis.projectType;
            //configDataanalysis
            this.Form.configDataanalysis = Object.assign({}, this.Form.configDataanalysis, res.data.configDataanalysis);
            if(TYPE==2){
               
              this.backSql(TYPE,res.data.configDataanalysis.selectSql,res.data.configDataanalysis.sqlDes);
                
            }
            else{
              if(TYPE==1){
                this.Form.sample=[{sql:res.data.configDataanalysis.selectSql}];
              }
              if(TYPE==3){
                this.Form.warning=[{sql:res.data.configDataanalysis.selectSql}];
              }
              this.analysis(res.data.configDataanalysis.selectSql +' ',0)
              
            }
            //configDataanalysisParameterAdditional
            if (res.data.configDataanalysisParameterAdditional instanceof Array && res.data.configDataanalysisParameterAdditional.length > 0) {
              res.data.configDataanalysisParameterAdditional.sort(v=>v.sqlIndex);
              this.Form['configDataanalysisParameterAdditional' + TYPE]=[];
              this['parameterCache' +TYPE]=[];
              res.data.configDataanalysisParameterAdditional.forEach(item => {
                //cache
                if(!this['parameterCache' +TYPE][item.sqlIndex]){
                  this.$set(this['parameterCache' +TYPE],item.sqlIndex,{});
                  this.$set(this['parameterCache' +TYPE][item.sqlIndex],item.field,item.fieldComment);
                 
                }
                else{
                  this['parameterCache' +TYPE][item.sqlIndex][item.field] = item.fieldComment;
                }
               
                //
                if(!this.Form['configDataanalysisParameterAdditional' + TYPE][item.sqlIndex]){
                  this.$set(this.Form['configDataanalysisParameterAdditional' + TYPE],item.sqlIndex,[]);
                  this.Form['configDataanalysisParameterAdditional' + TYPE][item.sqlIndex].push({
                    field: item.field,
                    fieldComment: item.fieldComment,
                    sqlIndex:item.sqlIndex
                  })
                }
                else{
                 
                  this.Form['configDataanalysisParameterAdditional'+TYPE][item.sqlIndex].push({
                    field: item.field,
                    fieldComment: item.fieldComment,
                    sqlIndex:item.sqlIndex
                  })
                }
               
              })
            }
            // 
            if (res.data.configDataanalysisParameterControl instanceof Array && res.data.configDataanalysisParameterControl.length > 0) {
              res.data.configDataanalysisParameterControl.sort(v=>v.sqlIndex);
              this.Form['configDataanalysisParameterControl' + TYPE ]=[];
              //this['parameterCache' + TYPE]=[]
              res.data.configDataanalysisParameterControl.forEach(item => {
                let obj = {
                  parameter: item.parameter,
                  parameterValueType: item.parameterValueType,
                  parameterValue: item.parameterValue,
                  parameterValueArr: [],
                  comment: item.comment,
                  sectionStart: item.sectionStart,
                  sectionOff: item.sectionOff,
                  sectionValue: item.sectionValue,
                  symbol: item.symbol,
                  sqlIndex: item.sqlIndex,
                  required: item.required.toString()
                }
                if (item.parameterValueType == 1) {
                  obj.parameterValueArr = obj.parameterValue.split(';');
                }
                //cache
                if(!this['parameterCache' +TYPE][item.sqlIndex]){
                  this.$set(this['parameterCache'+TYPE],item.sqlIndex,{});
                  this.$set(this['parameterCache'+TYPE][item.sqlIndex],item.parameter,obj);
                }
                else{
                  this.$set(this['parameterCache'+TYPE][item.sqlIndex],item.parameter,obj);
                }
                  
                //
                if(!this.Form['configDataanalysisParameterControl'+TYPE][item.sqlIndex]){
                  this.$set(this.Form['configDataanalysisParameterControl'+TYPE],item.sqlIndex,[]);
                  this.Form['configDataanalysisParameterControl' + TYPE][item.sqlIndex].push(obj);
                }
                else{
                  this.Form['configDataanalysisParameterControl' + TYPE][item.sqlIndex].push(obj);
                }
                
               

              })
            }
            //计算信息
            /*
            let arr=[];
            switch(TYPE){
              case 1: arr=this.Form.sample;break;
              case 2: arr=this.Form.process;break;
              case 1: arr=this.Form.warning;break;
            }
            if(arr.length>0){
              arr.forEach((sql,index)=>{
               // this.analysis(sql.sql,index);
              });
            }
            */


            
          } else {
            this.$message.error(res.message);
          }
        });
      }
      if (type == 'msa') { // msa
        dsMsaDetail({
          configDataanalysisMsaId: ds.configDataanalysisMsaId
        }).then(res => {
          if (res.code == 200) {
            this.showAdd = true;
            //
            this.Form.configDataanalysis = Object.assign({}, this.Form.configDataanalysis, res.data);
            this.Form.configDataanalysis.configDataanalysisName = res.data.configDataanalysisMsaName
            this.Form.configDataanalysis.calculationType = 4;
            //  附加信息的处理
            this.Form.msaAdditional.forEach(item => {
              if (res.data[item.parameter]) {
                item.parameterValueArr = res.data[item.parameter].split(';')
              }
            });
          } else {
            this.$message.error(res.message);
          }
        });
      }

    },
    getDsMsaList: function () { //  spc
      dsMsaList().then(res => {
        console.log('------------------');
        console.log(res)
        if (res.code == 200) {
          this.dsMsaList = res.data.list;
          this.filterDsMsaList = this.dsMsaList.slice();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    cache: function (type, info,index) {
      let  TYPE = this.Form.configDataanalysis.projectType; // 抽样 趋势 预警
      if (type == 'add') { //  附加信息
        this['parameterCache' + TYPE][index][info.row.field] = info.row.fieldComment;
      } else if (type == 'control') {
        this['parameterCache' + TYPE][index][info.row.parameter] = Object.assign({}, info.row);
      }

    },
    addsql: function (index,t) {
      //制程能力   添加codeMirror 删除
      let type = this.Form.configDataanalysis.projectType;
      if (t=='add') { // 添加

        if (type == '2') {
          this.Form.process.push({
            sql: '',
            sqlDes: ''
          });

        }
        this.Form['configDataanalysisParameterControl' + type].push([{}]);
        this.Form['configDataanalysisParameterAdditional' + type].push([{}]);
        this['parameterCache' + type].push({});
        this['computed' + type].push([]);

      } else { //删除
        this.$confirm(index > 0 ? '确定删除SQL' + index + '?' : '确定删除SQL' + '?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          if (type == '2') {
            this.Form.process.splice(index, 1);
          }
          if (type == '3') {
            this.Form.warning.splice(index, 1);
          }
          this.Form['configDataanalysisParameterControl' + type].splice(index, 1);
          this.Form['configDataanalysisParameterAdditional' + type].splice(index, 1);
          this['parameterCache' + type].splice(index, 1);
          this['computed' + type].splice(index, 1);


        }).catch(() => {})
      }
    }
  },
  watch:{
    
  }

}
