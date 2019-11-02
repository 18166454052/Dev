<template>
  <div>
   <div ref="myChart"  :style="{height: height,width:width}"></div>
  </div>
</template>

<script>
export default {
  props: [
    "count",
    "distData",
    "MIN",
    "MAX",
    "sigma",
    "usl",
    "lsl",
    "sigma1",
    "sigma2",
    "sigma3",
    "sigma_1",
    "sigma_2",
    "sigma_3",
    "HZ",
    "WZ"
  ],
  computed:{
    height:function(){
      return this.HZ-50+'px';
    },
    width:function(){
        return this.WZ;
    }
  },
  watch:{
    HZ:function(){
       this.myChart.resize();
       this.drawLine();
    },
    WZ:function(){
       this.myChart.resize();
       this.drawLine();
    },
    sigma_3:function(){
       this.myChart.resize();
       this.drawLine();
    }
  },
  data() {
    return {
      myChart:'',
      label: {
        //markLine
        normal: {
          show: true,
          // formatter:function(params){
          //     return '120';
          // },
          formatter: function(params) {
            if (params.data[1] == 0) {
              return "";
            } else {
              return params.data[0];
            }
          },
          color: "#f00",
          fontWight: "bolder"
        }
      },
      itemStyle: {
        //拐点样式
        normal: {
          color: function(params) {
            if (params.data[1] == 0) {
              return "#fff";
            } else {
              return "#f00";
            }
          }
        }
      },
      itemStyleSigma: {
        //拐点样式
        normal: {
          color: function(params) {
            if (params.data[1] == 0) {
              return "#fff";
            } else {
              return "#00f";
            }
          }
        }
      },
     
      colorSigma: "#00f",
      lineStyleSigma: {
        normal: {
          color: "#00f",
          width: 1
        }
      },
      colors: ["#5793f3", "#d14a61", "#675bba"],
      splitLine: {
        //网格线
        show: false
      },
      axisLabel: {
        show: false,
      }
    };
  },
  methods: {
    renderItem: function(params, api) {
      var yValue = api.value(2);
      var start = api.coord([api.value(0), yValue]);
      var size = api.size([api.value(1) - api.value(0), yValue]);
      var style = api.style();
      return {
        type: "rect",
        shape: {
          x: start[0] + 1,
          y: start[1],
          width: size[0] - 2,
          height: size[1]
        },
        style: style
      };
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      //this.myChart = this.$echarts.init(this.$refs.myChart);
      let self = this;
      // 绘制图表
      this.myChart.setOption({
        color: self.colors,
        tooltip: {
          show: true,
          //trigger: "axis",
          axisPointer:'none'
        },
        grid: {
          left:70,
          right:40,
          top:10
        },
        xAxis: [
          {
            //zf
            type: "value",
            min: self.MIN,
            //min:self.count[0][0],
            // max:self.count[self.count.length-1][1],
            max: self.MAX,
            interval: 15, //直方图间隔
            boundaryGap: false,
            splitLine: self.splitLine,
            axisLabel: {
               show: false
            },
            axisTick:{
              show:false 
            }
          },
          {
            type: "value", //zt
            min: self.distData[0][0],
            interval: 100,
            triggerEvent: false,
            splitLine: self.splitLine,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            axisTick:{
              show:false 
            }
            //data:self.distData,
            // min:self.count[0][0],
            //data: self.distData.x,
            //min:self.distData.x[0]
            // data: [
            //   "2015-1",
            // ]
          },
          {
            type: "value" //markLine-100
           
          },
          {
            type: "value" //200
          },
          {
            type: "value" //最中心直线
          },
          {
            type: "value" //sigma1
          },
          {
            type: "value" //sigma2
          },
          {
            type: "value" //sigma3
          },
          {
            type: "value" //sigma-1
          },
          {
            type: "value" //sigma-2
          },
          {
            type: "value" //sigma-3
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "直方图",
            type: "custom",
            tooltip:{
              show:true,
              formatter:function(params){
                   //console.log(params);
                    return  'x : ['+ params.value[0]+','+params.value[1]+']'+'<br/>'+'y : '+params.value[2]
              }
            },
            renderItem: self.renderItem,
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            encode: {
              x: [0, 1],
              y: 2,
              tooltip: 2,
              label: 2
            },
             data: self.count,
            // data: [
            //   [8, 10, 80],
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = [
                    "#C1232B",
                    "#B5C334",
                    "#FCCE10",
                    "#E87C25",
                    "#27727B",
                    "#FE8463",
                    "#9BCA63",
                    "#FAD860",
                    "#F3A43B",
                    "#60C0DD",
                    "#D7504B",
                    "#C6E579",
                    "#F4E001",
                    "#F0805A",
                    "#26C0C0"
                  ];
                  return colorList[params.dataIndex];
                }
              }
            }
            //data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2]
          },
          {
            name: "正态分布",
            type: "line",
            xAxisIndex: 1,
            smooth: true,
            data:self.distData,
             tooltip:{
              show:false
            },
            itemStyle:{
              normal:{
                  opacity:0 //不画点
              }
                
            }
            // data: [
            //   2.6,
            // ]
          },
          {
            //100
            data: self.lsl,
            type: "line", //markLine
            symbol: "arrow",
            hoverAnimation: false,
            symbolSize: [10, 10],
            label: self.label,
            lineStyle: {
              normal: {
                color: "#f00",
                width: 3
              }
            },
            itemStyle: self.itemStyle
          },
          {
            //200
            data: self.usl,
            type: "line", //markLine
            symbol: "arrow",
            hoverAnimation: false,
            symbolSize: [10, 10],
            label: self.label,
            lineStyle: {
              normal: {
                color: "#f00",
                width: 3
              }
            },
            itemStyle: self.itemStyle
          },
          {
            //最中心直线
            data: self.sigma,
            type: "line", //markLine
            symbol: "arrow",
            hoverAnimation: false,
            symbolSize: [10, 10],
            label: self.label,
            lineStyle: {
              normal: {
                color: "#0f0",
                width: 3
              }
            },
            itemStyle:{
               normal: {
                  color: function(params) {
                    if (params.data[1] == 0) {
                      return "#fff";
                    } else {
                      return "#0f0";
                    }
                  }
                }
            }
          },
          {
            //sigma1
            data: self.sigma1,
            type: "line", //markLine
            hoverAnimation: false,
            symbolSize: 1,
            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  if (params.data[1] > 0) {
                    return "";
                  } else {
                    return "+1σ";
                  }
                },
                //formatter:'+1s',
                color: self.colorSigma,
                fontWight: "bolder",
                position:'bottom'
              }
            },
            lineStyle: self.lineStyleSigma,
            itemStyle: self.itemStyleSigma
          },
          {
            //sigma2
            data: self.sigma2,
            type: "line", //markLine
            hoverAnimation: false,
            symbolSize: 1,
            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  if (params.data[1] > 0) {
                    return "";
                  } else {
                    return "+2σ";
                  }
                },
                //formatter:'+1s',
                color: self.colorSigma,
                fontWight: "bolder",
                position:'bottom'
              }
            },
            lineStyle: self.lineStyleSigma,
            itemStyle: self.itemStyleSigma
          },
          {
            //sigma3
            data: self.sigma3,
            type: "line", //markLine
            hoverAnimation: false,
            symbolSize: 1,
            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  if (params.data[1] > 0) {
                    return "";
                  } else {
                    return "+3σ";
                  }
                },
                //formatter:'+1s',
                color: self.colorSigma,
                fontWight: "bolder",
                position:'bottom'
              }
            },
            lineStyle: self.lineStyleSigma,
            itemStyle: self.itemStyleSigma
          },
          {
            //sigma-1
            data: self.sigma_1,
            type: "line", //markLine
            hoverAnimation: false,
            symbolSize: 1,
            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  if (params.data[1] > 0) {
                    return "";
                  } else {
                    return "-1σ";
                  }
                },
                //formatter:'+1s',
                color: self.colorSigma,
                fontWight: "bolder",
                position:'bottom'
              }
            },
            lineStyle: self.lineStyleSigma,
            itemStyle: self.itemStyleSigma
          },
          {
            //sigma-2
            data: self.sigma_2,
            type: "line", //markLine
            hoverAnimation: false,
            symbolSize: 1,
            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  if (params.data[1] > 0) {
                    return "";
                  } else {
                    return "-2σ";
                  }
                },
                //formatter:'+1s',
                color: self.colorSigma,
                fontWight: "bolder",
                position:'bottom'
              }
            },
            lineStyle: self.lineStyleSigma,
            itemStyle: self.itemStyleSigma
          },
          {
            //sigma-3
            data: self.sigma_3,
            type: "line", //markLine
            hoverAnimation: false,
            symbolSize: 1,
            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  if (params.data[1] > 0) {
                    return "";
                  } else {
                    return "-3σ";
                  }
                },
                //formatter:'+1s',
                color: self.colorSigma,
                fontWight: "bolder",
                position:'bottom'
              }
            },
            lineStyle: self.lineStyleSigma,
            itemStyle: self.itemStyleSigma
          }
        ]
      });
    }
  },
  mounted() {
      //this.myChart.resize();
      this.myChart = this.$echarts.init(this.$refs.myChart);
      
      this.myChart.resize();
      this.drawLine();
  },
  beforeDestroy:function() {
    this.myChart.clear()
  }
};
</script>

<style>
</style>