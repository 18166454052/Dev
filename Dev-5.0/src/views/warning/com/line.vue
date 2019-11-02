<template>
  <ve-line :data="chartData"   
    :legend-visible="false" 
    :grid="grid"
   :data-zoom="dataZoom"
   :mark-line="markLine"
   :yAxis="yAxis"
   :extend="extend"
  ></ve-line>
</template>

<script>
export default {
  props: {
    data: {
      //required: true
    },
    zoom: {
      type: Boolean,
      default: false
    },
    bottom:{
      required: false
    }
  },
  data() {
  
   
    let self=this;
    // this.markLine = {
    //     data: [
    //       {
    //         name: '平均线',
    //         type: 'average'
    //       }
    //     ]
    //   }
    this.dataZoom = [
      {
        type: "slider",
        startValue: 0,
        endValue: 50,
        show: this.zoom
      }
    ];
    this.extend = {
      series: {
        type: "line",
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
             
              if (self.data.error && self.data.error[params.dataIndex] && self.data.error[params.dataIndex].length > 0) {
                return "#f00";
              } else {
                return "rgb(25,212,174)";
              }
              
            }
          }
        }
      },
      tooltip: {
        formatter: function(params) {
          if (self.data.error 
              && self.data.error[params[0].dataIndex] 
              && self.data.error[params[0].dataIndex].length > 0) {
                  return ""+ (params[0].dataIndex+1) + "<br/>"+
                        params[0].marker + '样本 :' +  params[0].value+"<br/>" +
                        "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#f00;'></span>"+
                        self.data.error[params[0].dataIndex].join("<br/>")
          } else {
                 console.log(params);
                return ""+(Number(params[0].dataIndex)+1)+ "<br/>"+
                params[0].marker + params[0].seriesName+ ": " +  params[0].value 
          }
        }
      
            
      },
     
    
    }


    return {
      // chartData: {
      //   columns: ['日期', '访问用户'],
      //   rows: [
      //     { '日期': '1/1', '访问用户': 1393 },
      //     { '日期': '1/2', '访问用户': 3530},
      //     { '日期': '1/3', '访问用户': 2923},
      //     { '日期': '1/4', '访问用户': 1723 },
      //     { '日期': '1/5', '访问用户': 3792 },
      //     { '日期': '1/6', '访问用户': 4593 }
      //   ]
      // },
      grid: {
        top: 20,
        bottom:this.bottom?this.bottom:15,
        right:(self.data.threshold && self.data.threshold.length>0)?40:20
      },
      yAxis:{
        max:function(val){
            if(self.data.threshold && self.data.threshold.length>0){
               return Math.max(val.max,...self.data.threshold).toFixed(3);
            }
            else if(self.data.process && self.data.process.length>0){
               return Math.max(val.max,...self.data.process).toFixed(3);
            }
            else{
              return val.max.toFixed(3);
            }
        },
        axisLine: {
          show: true,
          position:'left',
          lineStyle: {
           color: "#aaa"
            //color: 'rgb(146,146,146)',
           // width:2
          }
        },

      },
      
    };
  },
  computed: {
    chartData: function() {
      return this.data;
    },
    markLine:function(){
      let obj={
        data:[]
      };
      if(this.data.threshold && this.data.threshold.length>0){
            this.data.threshold.forEach(threshold=>{
                obj.data.push(
                  {

                        lineStyle:{
                          normal:{
                          //  type:'solid'
                          color: "#f00"
                          }
                        },
                        yAxis: threshold,
                        itemStyle: {
                          normal: {
                            lineStyle: {
                              color: "#00f"
                            }
                          }
                        },
                        label: {
                          normal: {
                            show: true,
                            position: "end",
                           // formatter: "样本阈值="+threshold
                           formatter:threshold
                          }
                        }
                  }
                );
            });
        }

         if(this.data.process && this.data.process.length>0){
            this.data.process.forEach(process=>{
                obj.data.push(
                  {

                        lineStyle:{
                          normal:{
                          //  type:'solid'
                          color: "#f00"
                          }
                        },
                        yAxis: process,
                        itemStyle: {
                          normal: {
                            lineStyle: {
                              color: "#00f"
                            }
                          }
                        },
                        label: {
                          normal: {
                            show: true,
                            position: "end",
                            // formatter: "过程能力="+process
                             formatter:process
                          }
                        }
                  }
                );
            });
        }
        return obj;



    }
  }
};
</script>