<template>
  <div>
   <div ref='step' :style="{height:height,width:width}"></div>
  </div>
</template>

<script>
export default {
  props: ["dataX", "ucl", "lcl", "badData", "errorDatas", "type","HX","WX","show"],
  data() {
    let self=this;
    return {
      myChart:'',
      option: {
        
        tooltip: {
          trigger: "axis",
          padding: [5, 10],
          
          formatter: function(params) {
            
           
            let index = params[0].dataIndex;
            let ucl = self.ucl[index],
              lcl = self.lcl[index],
              badData = self.badData[index],
              x = self.dataX[index],
              error = self.errorDatas[params[0].axisValue]; 
               
            if (error) {
              if (self.type == "np" || self.type == "c") {
                return (
                  "groupNumber : " +
                  x +
                  "<br/>" +
                  params[0].marker +
                  "ucl : " +
                  ucl +
                  "<br/>" +
                  params[2].marker +
                  "badNum :" +
                  badData +
                  "<br/>" +
                  params[1].marker +
                  "lcl :" +
                  lcl +
                  "<br/>" +
                  "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#f00);'></span>" +
                  "error: " +
                  error.join(";")
                );
              }
              if (self.type == "p" || self.type == "u") {
                return (
                  "groupNumber : " +
                  x +
                  "<br/>" +
                  params[0].marker +
                  "ucl : " +
                  ucl +
                  "<br/>" +
                  params[2].marker +
                  "badRate :" +
                  badData +
                  "<br/>" +
                  params[1].marker +
                  "lcl :" +
                  lcl +
                  "<br/>" +
                  "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#f00);'></span>" +
                  "error: " +
                  error.join(";")
                );
              }
            } else {
              if (self.type == "np" || self.type == "c") {
                return (
                  "groupNumber : " +
                  x +
                  "<br/>" +
                  params[0].marker +
                  "ucl : " +
                  ucl +
                  "<br/>" +
                  params[2].marker +
                  "badNum :" +
                  badData +
                  "<br/>" +
                  params[1].marker +
                  "lcl :" +
                  lcl +
                  "<br/>"
                );
              }
              if (self.type == "p" || self.type == "u") {
                return (
                  "groupNumber : " +
                  x +
                  "<br/>" +
                  params[0].marker +
                  "ucl : " +
                  ucl +
                  "<br/>" +
                  params[2].marker +
                  "badRate :" +
                  badData +
                  "<br/>" +
                  params[1].marker +
                  "lcl :" +
                  lcl +
                  "<br/>"
                );
              }
            }
          }
          
          
        },
       
        grid: {
          top:10,
          left: 50,
          bottom:80,
          right:30
        },
        xAxis: {
          type: "category",
          data: self.dataX,
          //data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          min: "dataMin",
          axisLabel:{
              height:50
          }
        },
        yAxis: {
          // max:self.ucl,
          type: "value",
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgb(102,102,102)"
            }
          },
          // axisLabel: {                   
          //   formatter: function (value, index) {           
          //         return value.toFixed(4);      
          //         }                
          //    }
        },
       series: [
       
          {
            name: "ucl",
            type: "line",
            step: "middle",
            data: self.ucl,
            //data:[120, 132, 101, 134, 90, 230, 210],
            lineStyle: {
              //
              normal: {
                color: "rgb(97,160,168)"
              }
            },
            itemStyle: {
              //
              normal:{
                color: "rgb(97,160,168)"
              }
            },
            
            markPoint: {
              data: [
                {
                  name: "ucl",
                  type: "max",
                  valueIndex: 0,
                  symbolSize:5,
                  label:{
                     normal:{
                       offset:[-20,30],
                       fontSize:16,
                       show: true,
                        position: "top",
                        formatter: function(param) {
                            return 'ucl'
                        }
                     }
                  }
                }
              ]
            }
           
           
          },
          {
            name: "lcl",
            type: "line",
            step: "middle",
            data: self.lcl,
            // data:[220, 282, 201, 234, 290, 430, 410], 
            lineStyle: {
              //
              normal: {
                color: "#E87C25"
              }
            },
            itemStyle: {
              //
              normal: {
                color: "#E87C25"
              }
            },
            markPoint: {
              data: [
                {
                  name: "lcl",
                  type: "max",
                  valueIndex: 0,
                  symbolSize:5,
                  label:{
                     normal:{
                       offset:[-20,-10],
                       fontSize:16,
                        show: true,
                        position: "top",
                        formatter: function(param) {
                            return 'lcl'
                        }
                     }
                  }
                }
              ]
            }
          },
          {
            name: "badData",
            type: "line",
            data: self.badData,
            //data:[450, 432, 401, 454, 590, 530, 510] ,
            smooth: false,
            showAllSymbol: true,
            symbolSize: [5, 5],
            lineStyle: {
              normal: {
                color: "rgb(25,212,174)"
              }
            },
            
            itemStyle: {
              normal: {
                borderWidth: 1,
                color: function(params) {
                  let data = self.dataX[params.dataIndex];
                  if (self.errorDatas[data]) {
                    return "#f00";
                  } else {
                    return "rgb(25,212,174)";
                  }
                }
              }
            }
            
          }
        ],
        dataZoom : [
          {
            type: "slider",
            startValue: 0,
            endValue: 50,
            show:self.show
            //bottom:-10
          }
        ]
      }
    };
  },
  methods: {
    drawLine: function() {
      let self = this;
      self.myChart = self.$echarts.init(self.$refs.step);
      // setTimeout(() => {
      //     window.onresize = function () {
      //       self.myChart.resize();
      //     }
      //   }, 20)
      
      self.myChart.on('click',function(params){
         self.$emit('clickNode',params);
      });
      self.myChart.setOption(
        self.option
      );

     
    }
  },
  computed:{
    height:function(){
        return this.HX-80+'px';
    },
    width:function(){
      return this.WX;
    }
  },
  watch:{
    HX:function(){
        this.myChart.resize();
    },
    WX:function(){
      this.myChart.resize();
    }

  },
  mounted: function() {
    console.log('strpLine----------------------------------------')
    console.log(this.$props)
    this.drawLine();
    //console.log(this.myChart);
    this.myChart.resize();
  },
  beforeDestroy:function() {
    this.myChart.clear()
  }
};
</script>