import { msaDetail, msaUpdate, msaRuleList , msaTaskView} from "@/api/msaDoe/msa"
import { dsMsaDetail } from "@/api/dataSource"
import {
  firstBy
} from 'thenby'
export default {
  data() {
    return {
      timeout:null,
      fullLoading:null,
      page: 1,
      pageSize: 10,
      total: 0,
      groupNum:[],
      loopNum:'',
      loopTitle:[],
      pyData: [], //x
      pyData1: [], //r
      LOADING: {
        lock: true,
        text: '需要几秒钟,加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.6)'
      },
      msa_config_id: "",
      configData: {},
      groupData: [],
      XR: ["1", "2", "3"],
      msaStat:{},
      personLen:'',
      partLen:"",
      rowLen:'',
      Box:{
          values:[],
          personName:[],
          average:[],
      },
      XcharData: {
        columns: ["x", "average"],
        rows: []
      },
      RcharData: {
        columns: ["x", "range"],
        rows: []
      },
      HcharData: {
        //柱状图
        columns: ["x", '方差贡献率','研究变异率','公差率'],
        rows: [],
      },
      PartOne: {
        columns: ["x", "avgPart"],
        rows: [],
      },
      PartMore: {
        columns: ["x", "average-A", "average-B", "average-C"],
        rows: [],
      },
      ucl_x:'',
      lcl_x:'',
      ucl_r:'',
      lcl_r:''
     
    };
  },
  methods: {

    getMsaView: function(obj) {
      this.fullLoading=this.$loading(this.LOADING);
      this.recentInfo = obj;
      let self=this;
      msaTaskView({ msaTaskId: this.msaTaskId, ...obj }).then(res => {
        this.fullLoading.close();
       if (res.resCode == 0) {
       
              self.personLen=res.data.personDataList.length;
              self.partLen=res.data.partDataList.length;
              self.rowLen=res.data.rowDataList.length;
          // x图  r图
          let partPersonData = res.data.partPersonDataList;
          let partNames = {};
        
          partPersonData.sort(
            firstBy(function (v1) { return v1.personName})
          .thenBy('partName')
          )
          console.log(partPersonData);
          if (partPersonData.length > 0) {
            partPersonData.forEach(function(item,index) {
              // x r
              let xObj = {
                x: item.personName + "-" + item.partName,
                average: item.average,
                groupNum:Number(index)+1,
                improper:[]
              };
              let rObj = {
                x: item.personName + "-" + item.partName,
                range: item.range,
                groupNum:Number(index)+1,
                improper:[]
              };
              self.XcharData.rows.push(xObj);
              self.RcharData.rows.push(rObj);
              //  partMore  personName--A-B-C  分类
              if (!partNames[item.partName]) {
                partNames[item.partName] = {};
                partNames[item.partName]["average-" + item.personName] =
                  item.average;
              } else {
                partNames[item.partName]["average-" + item.personName] =
                  item.average;
              }
            });
          }
          //x r 错误点
          let errorXData = [],
              errorRData = [];
          let arr = res.data.exceptionResultList.filter(
            item => item.groupNumList.length > 0
          );
        
          arr.forEach(function(item) {
            item.groupNumList.forEach(function(item2) {
              //item2---groupNum
              // x
              if (item.ruleNumber > 0) {
                if (errorXData.length == 0) {
                  let obj = {
                    improper: [self.rules[Number(item.ruleNumber) - 1].content],
                    groupNum: item2
                  };
                  errorXData.push(obj);
                } else {
                  let flag = false; //是否已经存在 gruopNum
                  errorXData.forEach(function(item3) {
                    if (item3.groupNum == item2) {
                      item3.improper.push(
                        self.rules[Number(item.ruleNumber) - 1].content
                      );
                      flag = true;
                    }
                  });
                  if (!flag) {
                    //groupNum bu存在
                    let obj = {
                      improper: [self.rules[Number(item.ruleNumber) - 1].content],
                      groupNum: item2
                    };
                    errorXData.push(obj);
                  }
                }
              }
              //R
              if (item.ruleNumber < 0) {
                if (errorRData.length == 0) {
                  let obj = {
                    improper: [
                      self.rules[Number(Math.abs(item.ruleNumber)) - 1].content
                    ],
                    groupNum: item2
                  };
                  errorRData.push(obj);
                } else {
                  let flag = false; //是否已经存在 gruopNum
                  errorRData.forEach(function(item3) {
                    if (item3.groupNum == item2) {
                      item3.improper.push(
                        self.rules[Number(Math.abs(item.ruleNumber)) - 1].content
                      );
                      flag = true;
                    }
                  });
                  if (!flag) {
                    //groupNum bu存在
                    let obj = {
                      improper: [
                        self.rules[Number(Math.abs(item.ruleNumber)) - 1].content
                      ],
                      groupNum: item2
                    };
                    errorRData.push(obj);
                  }
                }
              }
            });
          });
          self.RcharData.rows.forEach(function(item4) {
            for (let i = 0; i < errorRData.length; i++) {
              if (errorRData[i].groupNum == item4.groupNum) {
                item4.improper = errorRData[i].improper;
                break;
              }
            }
          });
          self.XcharData.rows.forEach(function(item4) {
            for (let i = 0; i < errorXData.length; i++) {
              if (errorXData[i].groupNum == item4.groupNum) {
                item4.improper = errorXData[i].improper;
                //break;
              }
            }
          });
      
         
          //
          for (let name in partNames) {
            let obj = {};
            obj.x = name;
            self.PartMore.rows.push(Object.assign({}, obj, partNames[name]));
          }
      
          //柱状图
          let msaStat = res.data.msaStat;
          self.msaStat=res.data.msaStat;
          self.ucl_x = msaStat['ucl_x'];
          self.lcl_x = msaStat['lcl_x'];
          self.ucl_r = msaStat['ucl_r'];
          self.lcl_r = msaStat['lcl_r'];
          let hArr = [
            {
              x: "量具R&R",
              '方差贡献率': msaStat.prr,
              '研究变异率':msaStat.psvRR,
              '公差率':msaStat.pTRR
            },
            {
              x: "重复性",
              '方差贡献率': msaStat.pev,
              '研究变异率':msaStat.psvEV,
              '公差率':msaStat.pTEV
            },
            {
              x: "再现性",
              '方差贡献率': msaStat.pav,
              '研究变异率':msaStat.psvAV,
              '公差率':msaStat.pTAV
            },
            {
              x: "部件间",
              '方差贡献率': msaStat.ppv,
              '研究变异率':msaStat.psvPV,
              '公差率':msaStat.pTPV
            }
          ];
          self.HcharData.rows = hArr;
          //partDataList  折线图
          let partData = res.data.partDataList;
          if (partData.length > 0) {
            partData.forEach(function(part) {
              self.loopTitle.push(part.partName);//样本标题
              let pObj = {
                x: part.partName,
                avgPart: part.avgPart
              };
              self.PartOne.rows.push(pObj);
            });
          }
          //表格数据
          self.groupData=res.data.rowDataList;
          self.loopNum=res.data.rowDataList[0].values.length;
          
          //箱盒图
          /*box={
              A:{
                  average:'',
                  values:[],
                }
          }
          */
          let  box={ }
          res.data.rowDataList.forEach(function(row){
              
                let avg;
                res.data.personDataList.forEach(item=>{
                      if(item.personName==row.personName){
                          avg=item.avgPerson;
                          
                      }
                });
                if(!box[row.personName]){
                    box[row.personName]={
                        average:avg,
                        values:[...row.values]
                    }
                }
                else{

                      box[row.personName].values=[...box[row.personName].values,...row.values];
                }
          });
        
          for(let key in box){
              self.Box.average.push(box[key].average);
              self.Box.personName.push(key);
              self.Box.values.push(box[key].values);

          }
         
            
          //
        
        } else {
          this.$message.error(res.msg);
        }
     })
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
    getAverage:function(){
       let values=[],self=this;
       values=self.groupData.map(item=> item.values);
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
        //return ['平均值','','1','1','1','1','1','1','1','1','1','1'];
    },
    getMsaDetail:function(res){ // 数据源
      if(res.code==200){
          this.configData=res.data;
          // if(res.data.configDataanalysisMsaId){
          //      this.toConfig=false;
          // }
          // else{
          //    this.toConfig=true;
          // }
          if ( res.data.dashboard && JSON.parse(res.data.dashboard) && JSON.parse(res.data.dashboard) instanceof Array) {

            let layout = JSON.parse(res.data.dashboard);
            //已经配置 页面
            this.layout = layout;
            // 面板 过滤panel  不显示已经设置布局的grid-item
            if (layout.length > 0) {
              layout.forEach(grid => {
                // X R图，设置WX HX
                if (grid.modelType >= 7) { //
                  if(grid.HPx){
                      this['H'+grid.modelType]=grid.HPx;
                      this['W'+grid.modelType]=grid.WPx + 'px';
                  }
                }
  
                //已经设置了 grid-item  不显示对应的panel
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
            }else{
              //如果为空，则显示面板
              this.layout.push({"x":0,"y":0,"w":500,"h":20,"i":"0","modelName":"Panel","modelType":0});
            }
  
  
  
          } else {
            // 未配置 页面
            this.layout = [{
              "x": 0,
              "y": 0,
              "w": 500,
              "h": 20,
              "i": "0",
              "modelName": "Panel",
              "modelType": 0
            }]
  
          }
      }
      else{
          this.$message.error(res.message);
      }
 
},
getDsMsaDetail:function(configDataanalysisMsaId){  //数据分析
  dsMsaDetail({configDataanalysisMsaId:configDataanalysisMsaId}).then(res=>{
      if(res.code==200){
        
        console.log(res);
          //控制信息
          //测量   （部件）control_components  （人员）control_staff  （序号）control_index
          //{valueArr ,value , label , key }
          if(res.data.controlComponents) {
              this.controlInfo.push(
                  {
                      key:'controlComponents',
                      value:[],
                      label:'测量部件',
                      valueArr:res.data.controlComponents.split(";")

                  }
              );
          }
          if(res.data.controlStaff) {
              this.controlInfo.push(
                  {
                      key:'controlStaff',
                      value:[],
                      label:'测量人员',
                      valueArr:res.data.controlStaff.split(";")

                  }
              );
          }
          if(res.data.controlIndex) {
              this.controlInfo.push(
                  {
                      key:'controlIndex',
                      value:'',
                      label:'测量序号',
                      valueArr:res.data.controlIndex.split(";")

                  }
              );
          }
      }
      else{
          this.$message.error(res.message);
      }
  });
},
getRuleList:function(){
  msaRuleList({msaTaskId:this.msaTaskId}).then(res=>{
      if(res.code==200){
        this.rules = res.data.sort(firstBy(v => {
          v.ruleNumber
        }))
        if (this.rules.length > 0) {
          this.rules.forEach(rule => {
            rule.content = rule.content.replace('n', rule.n).replace('m', rule.m).replace('k', rule.k);
          });
        }
      }
      else{
          this.$message.error(res.message);
      }
  });
},

  },
  computed:{
    TRR:function(){
         let obj={
             TRR:[],
             prr:[],
         }
         if(this.msaStat.pTRR<0.1){
                obj.TRR=['<10%','可以接受'];
         }
         else  if(this.msaStat.pTRR>0.3){
                  obj.TRR=['>30%','不可接受'];
         }
         else{
              obj.TRR=['10%-30%','尚可接受'];
         }

         if(this.msaStat.prr<0.01){
                obj.prr=['<1%','可以接受'];
         }
         else  if(this.msaStat.prr>0.09){
                  obj.prr=['>9%','不可接受'];
         }
         else{
              obj.prr=['1%-9%','尚可接受'];
         }

    return obj;
    }
  },
  created: function() {
    this.msaTaskId=this.$route.params.msa_id;
    let self=this;
    async function data(){
      let detail = await  msaDetail({msaTaskId:self.msaTaskId});
               await self.getMsaDetail(detail);
       if(detail.code==200 && detail.data.configDataanalysisMsaId){
          self.getDsMsaDetail(detail.data.configDataanalysisMsaId);
       }
    }
    data();
    this.getRuleList()
  }
};


