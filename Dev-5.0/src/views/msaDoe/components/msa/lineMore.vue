
<template>
   <ve-line
   ref="more"
    :data="datas"
    :legend-visible="false"
    :height='height'
    :width="width"
    :mark-line="markLine"
    :grid="grid"
    :yAxis='yAxis'
    :extend="extend"

    >
  </ve-line>
</template>

<script>
import "echarts/lib/component/markLine";
export default {
  props: ["chartData","H10","W10"],
  data() {
    let self = this;
    this.dataZoom = [
      {
        type: "slider",
        start: 0,
        end: 100
      }
    ];
    this.markLine = {
      data: [
       /*
        {
          name: "ucl",
          yAxis: self.ucl,
          lineStyle:{
            normal:{
              // type:'solid'
            }
          },
          itemStyle: {
            normal: {
              lineStyle: {
                color: "#f00"
              }
            }
          },
          label: {
            normal: {
              show: true,
              position: "end",
              formatter: "ucl="+ self.ucl,
            }
          }
        },
      */
         
      ]
    };
    this.extend = {
      series: {
        type: "line",
        smooth: false,
        showAllSymbol: true,
        symbolSize: [6, 6],
        lineStyle: {
          normal: {
            // color:"rgb(25,212,174)"
            //width
          }
        },
        itemStyle: {
          normal: {
            borderWidth: 2,
            /*
            color: function(params) {
              console.log(params);
              let improper=self.chartData.rows[params.dataIndex].improper;
                 
              if(improper){
                if (improper.length > 0) {
                    return "#f00";
                  } else {
                    return "rgb(25,212,174)";
                  }
              }
              else{
                return "rgb(25,212,174)";
              }
              
            
            }*/
            
          }
        }
      },
      tooltip: {
        /*
        formatter: function(params) {
           console.log(params)
          
        }
      */
      },
      xAxis: {
        axisLabel: {
          //rotate:'90',
          interval: "auto",
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgb(102,102,102)"
          }
        },
        axisTick: {
          show: true,
          lineStyle: {
            color: "rgb(102,102,102)"
          }
        }
      },
      yAxis:{ 
        // max:'dataMax',
        //min:'dataMin',
        // max:function(value){
        //    return (value.max*1.05).toString().slice(0,self.getFixed(value.max*1.05)+2);
        // },
        min:function(value){
        
           return (value.min).toString().slice(0,self.getFixed(value.min)+2);
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgb(102,102,102)"
          }
        }
      }
    }

    return {
      yAxis: {
        max:function(value){
          let range=value.max-value.min;
          let max= value.max+ range/8;
          return  max.toString().slice(0,self.getFixed(max)+3);
          
         
          
        },
        min:function(value){
           let range=value.max-value.min;
           let min= value.min - range/8;
          return  min.toString().slice(0,self.getFixed(min)+3);
           
        },
        // splitLine: {
        //   //网格
        //   show: true,
        //   lineStyle: {
        //     color: ["#EEE"]
        //   }
        // }
      },
      grid: {
        top:10,
        right: 40,
        bottom:40,
       
      }

    };
  },
  methods: {
     getFixed:function(number){
       if(typeof number =='string'){
          return number.search(/[1-9]/);
       }
       else{
           return number.toString().search(/[1-9]/);
       }
       
        //    this.getFixed(0.000123);===5
     }
  },
  computed: {
    datas: function() {
      // let per = 100 / Math.ceil(this.chartData.rows.length / 50);
      // this.dataZoom[0].end = per;
     // console.log(this.chartData);
      return this.chartData;
    } ,
    height:function(){
      return this.H10-50+'px';
    },
    width:function(){
      return this.W10;
    }
  },
  mounted:function(){
    this.$refs['more'].echarts.resize();
  }
};
</script>