
<template>
   <ve-line
   ref="linR"
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
  props: ["chartData",'ucl','lcl',"H7",'W7'],
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
       precision:4,
       data: [
       
        {
          name: "ucl",
          yAxis: this.ucl,
          lineStyle:{
            normal:{
              // type:'solid'
              color: "#f00"
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
              formatter: "ucl="+ this.ucl
            }
          }
        },
        {
          
          name: "lcl",
          yAxis: this.lcl,
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
              formatter: "lcl="+ this.lcl,
            }
          }
        },
         
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
             color:"rgb(25,212,174)"
            //width
          }
        },
        itemStyle: {
          normal: {
            borderWidth: 2,
            
            color: function(params) {
             
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
              
            
            }
            
          }
        }
      },
      tooltip: {
        formatter: function(params) {
           //console.log(params)
           let index=params[0].dataIndex,
               name=params[0].name,
               marker=params[0].marker,
               value=params[0].value;
          let improper=self.chartData.rows[index].improper;
          if(improper && improper.length>0){
                return name+"<br/>"
                       + marker +name +" : "+ value +'<br/>'
                       + marker +"error : "+ improper.join(';<br/>')
          }
          else{
                return name+"<br/>"
                       + marker +name +" : "+ value
                      
          }
                
           

          
        }
      
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
        max:function(value){
          let range=value.max-value.min;
          let max= Math.max(value.max,self.ucl)+ range/8;
          return  max.toString().slice(0,self.getFixed(max)+3);
           //  return (Number(value.max)*1.05).toString().slice(0,self.getFixed(Number(value.max)*1.05) + 2);
         
          
        },
       // max:1,
        min:function(value){
           let range=value.max-value.min;
           let min= value.min - range/8;
          return  min.toString().slice(0,self.getFixed(min)+3);
           
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
      UCL:'',
      LCL:'',
      yAxis: {
        //max: this.MAX>'dataMax'?this.MAX:'dataMax',
        // max: function(value){
        //   let self=this;
        //   console.log(value);
        //     return   value.max>self.MAX?Number(value.max.toString('.')[0])*1.1:self.MAX;
        // },
        // max:'',
        // min: this.MIN,
        // axisLine: {
        //   show: true,
        //   lineStyle: {
        //     color: "rgb(102,102,102)"
        //   }
        // }
        // splitLine: {
        //   //网格
        //   show: true,
        //   lineStyle: {
        //     color: ["#EEE"]
        //   }
        // }
      },
      grid: {
        top:5,
        right: 80,
        bottom:30
       
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
      return this.H7-50+'px';
    },
    width:function(){
      return this.W7;
    }
  },
  created:function(){
    this.$refs.lineR.echarts.resize();
  }
  
};
</script>