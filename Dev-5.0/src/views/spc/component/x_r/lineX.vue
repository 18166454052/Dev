
<template>
 <div style="position:relative">
   <!-- <div class="ruleBtn text-center">
      <ul>
       
        <li v-for="(rule,index) in selectedXrules" :key="rule" style="font-size:14px;margin-top:10px;float:left">
            <span style="display:inline-block;;width:30px;padding-right:10px;text-align:right;color:#666;line-height:20px;">{{rule}}</span>
            <span style="display:inline-block;width:40px;height:20px;border-radius:5px;cursor:pointer;vertical-align:top"
             :style={backgroundColor:aboutColor(rule)}
            @click="selectRule(rule)"
            ></span>
        </li>
      </ul>
    </div> -->
   <ve-line
    ref="lineX"
    :data="datas"
    :legend-visible="false"
    :height='height'
    :mark-area="markArea"
    
    :grid="grid"
    :yAxis='yAxis'
    :extend="extend"
    :data-zoom="dataZoom"
    :settings="chartSettings"
    :events="chartEvents"
    >
   
  </ve-line>
    <el-popover v-if="selectedXrules.length>0 && show"
          placement="left"
          width="210"
         trigger="click"
        >
          <span slot="reference" 
          style="text-align:center;display:inline-block;cursor:pointer;width:20px;line-height:20px;background:#c93756;border-radius:10px;color:#fff">R</span>
          <div class="checkTools">
            <ul>
              <li v-for="(rule,index) in selectedXrules" :key="rule" style="font-size:14px;margin-top:10px;float:left">
                <span style="display:inline-block;;width:30px;padding-right:10px;text-align:right;color:#666;line-height:20px;">{{rule}}</span>
                <span style="display:inline-block;width:40px;height:20px;border-radius:5px;cursor:pointer;vertical-align:top"
                  :style={backgroundColor:aboutColor(rule)}
                  @click="selectRule(rule)"
                ></span>
              </li>
            </ul>
          </div>
   </el-popover>
 </div>
 </template>

<script>
import "echarts/lib/component/markLine";
import Bus from "@/utils/bus.js"
import Mixins from './mixins'
export default {
  mixins:[Mixins],
  props: ["chartData", "MAX", "MIN","WX","HX","selectedXrules","show"],//W H  页面设置的 x图的width height
  data() {
    let self = this;
    this.chartSettings = {
        metrics: ['avg'],
        dimension: ['groupNum']
      }
    this.dataZoom = [
      {
        type: "slider",
        startValue: 0,
        endValue: 50,
        show:self.show
      }
    ];
    this.chartEvents = {
        click: function (e) {
          self.$emit('clickNode',e);
        }
    }

    this.markLine = {
      data: [
     /*
        {
          name: "usl",
          yAxis: this.chartData.rows[0]["usl"],
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
              formatter: "usl="+ this.chartData.rows[0]["usl"]
            }
          }
        },
    
        {
          name: "lsl",
          yAxis:  this.chartData.rows[0]["lsl"],
          lineStyle:{
            normal:{
             //  type:'solid'
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
              formatter: "lsl="+this.chartData.rows[0]["lsl"]
            }
          }
        },
     
        {
          name: "ucl",
          lineStyle:{
            normal:{
             //  type:'solid'
             color: "#00f"
            }
          },
          yAxis: this.chartData.rows[0]["ucl"],
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
              formatter: "ucl="+this.chartData.rows[0]["ucl"]
            }
          }
        }, 
        {
          name: "lcl",
          lineStyle:{
            normal:{
             //  type:'solid'
             color: "#00f"
            }
          },
          yAxis: this.chartData.rows[0]["lcl"],
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
              formatter: "lcl="+this.chartData.rows[0]["lcl"]
            }
          }
        }
        {
          name: "cl",
          yAxis: this.chartData.rows[0]["cl"],
          lineStyle:{
            normal:{
              // type:'solid'
              color: "rgb(254, 201, 0)"
            }
          },
          itemStyle: {
            normal: {
              lineStyle: {
                color: "rgb(254, 201, 0)"
              }
            }
          },
          label: {
            normal: {
              show: true,
              position: "end",
              formatter: "c l="+ this.chartData.rows[0]["cl"]
            }
          }
        },*/
       
      ]
    };
    this.markArea={
        silent:true,
        label:{
            show:true,
            position:'right',
            fontWeight:500
        },
        // itemStyle: {
        //     normal: {
        //         borderColor:'#f00',
        //         borderWidth: 1,
        //         borderType: 'dashed'
        //     }
        // },
        data: [ 
            [
                {
                    yAxis: this.chartData.rows[0]["usl"],
                },
                {
                    yAxis: this.chartData.rows[0]["usl"],
                    name:"usl="+ this.chartData.rows[0]["usl"],
                    label:{
                        show:true,
                        position:'right',
                        offset:[-100,-10],
                        color: "#f00"
                    },
                    itemStyle: {
                    
                          borderColor:'#f00',
                          borderWidth: 0.5,
                          borderType: 'dashed'
                   
                      },
                }
            ],
            [
                {
                    yAxis: this.chartData.rows[0]["lsl"],
                },
                {
                    yAxis: this.chartData.rows[0]["lsl"],
                    name:"lsl="+ this.chartData.rows[0]["lsl"],
                    label:{
                        show:true,
                        position:'right',
                        offset:[-100,10],
                        color: "#f00"
                    },
                    itemStyle: {
                    
                          borderColor:'#f00',
                          borderWidth: 0.5,
                          borderType: 'dashed'
                   
                      },
                }
            ],
            [
                {
                    yAxis: this.chartData.rows[0]["ucl"],
                },
                {
                    yAxis: this.chartData.rows[0]["ucl"],
                    name:"ucl="+this.chartData.rows[0]["ucl"],
                    label:{
                        show:true,
                        position:'right',
                        offset:[-200,-10],
                         color: "#00f"
                    },
                    itemStyle: {
                    
                          borderColor: "#00f",
                          borderWidth: 0.5,
                          borderType: 'dashed'
                   
                      },
                }
            ],
            [
                {
                    yAxis: this.chartData.rows[0]["lcl"],
                },
                {
                    yAxis: this.chartData.rows[0]["lcl"],
                    name:"lcl="+this.chartData.rows[0]["lcl"],
                    label:{
                        show:true,
                        position:'right',
                        offset:[-200,10],
                         color: "#00f"
                    },
                    itemStyle: {
                    
                          borderColor: "#00f",
                          borderWidth: 0.5,
                          borderType: 'dashed'
                   
                      },
                }
            ],
            [
                {
                    yAxis: this.chartData.rows[0]["cl"],
                },
                {
                    yAxis: this.chartData.rows[0]["cl"],
                    name:"c l="+ this.chartData.rows[0]["cl"],
                    label:{
                        show:true,
                        position:'right',
                        offset:[-100,-10],
                        color:  "rgb(254, 201, 0)"
                    },
                    itemStyle: {
                    
                          borderColor: "rgb(254, 201, 0)",
                          borderWidth: 0.5,
                          borderType: 'dashed'
                   
                      },
                }
            ]
            
        ]
    }
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
              //console.log('*********params****************');
              //console.log(params.dataIndex);
              if (self.datas.rows[params.dataIndex].improper.length > 0) {
                return "#f00";
              } else {
                return "rgb(25,212,174)";
              }
              // if (params.data[1] == 0) {
              //   return "#fff";
              // } else {
              //   return "#f00";
              // }
            }
          }
        }
      },
      tooltip: {
        formatter: function(params) {
          //[]
          let data = self.datas.rows[params[0].dataIndex];
          if (data.improper.length > 0) {
            // return  '<span style="color:rgb(25,212,174)">groupNum</span>:'+ data.groupNum+'<br/>' + '<span style="color:rgb(25,212,174)">svg</span>:'+data.avg +'</br>'+'<span style="color:#C45245">error</span>:'+data.improper.join('<br/>');
            return (
              "groupNum : " +
              data.groupNum +
              "<br/>" +
              "avg : " +
              data.avg +
              "<br/>" +
              "error : " +
              data.improper.join("<br/>")
            );
          } else {
            return (
              "groupNum : " + data.groupNum + "<br/>" + "avg : " + data.avg
            );
          }
        }
      },
      xAxis: {
        axisLabel: {
          //rotate:'90',
          interval: "auto",
          // formatter: function(params, index) {
          //   if (index % 2 != 0) {
          //     //return '\r\n' + params;
          //   } else {
          //     return params;
          //   }
          // }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgb(102,102,102)",
            // color: 'rgb(146,146,146)',
            // width:2
          }
        },
        axisTick: {
          show: true,
          lineStyle: {
            color: "rgb(102,102,102)"
            // color: 'rgb(146,146,146)',
            // width:2
          }
        }
      },
      yAxis:{ 
        max:function(value){
          //console.log(value.max.toString().split('.')[0]*1.1+'************************');
            let index=self.MAX.toString().indexOf('.');
            if(index>0){
                return Number(self.MAX.toString().slice(0,index+3));
            }
            else{

                return self.MAX;
            }
          
        },
        min:function(value){
          //console.log(value.max.toString().split('.')[0]*1.1+'************************');
            let index=self.MIN.toString().indexOf('.');
            if(index>0){
                return Number(self.MIN.toString().slice(0,index+3));
            }
            else{
              
                return self.MIN;
            }
          
        },
        splitLine:{
          show:false
        },
        axisLine: {
          show: true,
          lineStyle: {
           color: "rgb(102,102,102)"
            //color: 'rgb(146,146,146)',
           // width:2
          }
        },
         axisTick: {
          show: true,
          lineStyle: {
            color: "rgb(102,102,102)"
           // color: 'rgb(146,146,146)',
            //width:2
          }
        }
        
      }
    }
    /*
    this.visualMap = [
     {
            top: 10,
            right: 10,
            pieces: [{
                gt: 0,
                lte: 50,
                color: '#096'
            }, {
                gt: 50,
                lte: 100,
                color: '#ffde33'
            }, {
                gt: 100,
                lte: 150,
                color: '#ff9933'
            }, {
                gt: 150,
                lte: 200,
                color: '#cc0033'
            }, {
                gt: 200,
                lte: 300,
                color: '#660099'
            }, {
                gt: 300,
                color: '#7e0023'
            }],
            outOfRange: {
                color: '#999'
            }
      } 
    ]
   */

    return {
      // height:this.$store.getters.HX-100+'px',
      // width:'100%',
      backgroundColor:'rgb(243,243,243)',
      yAxis: {
        // max: this.MAX>'dataMax'?this.MAX:'dataMax',
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
        right: 20,
        top:5,  //10
       // bottom:50
      },
     
    };
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
        this.$refs['lineX'].echarts.resize();
    },
    WX:function(){
        this.$refs['lineX'].echarts.resize();
    }
  },
  
  mounted: function() {
    this.$refs['lineX'].echarts.resize();
  },
  beforeDestroy:function() {
     this.$refs['lineX'].echarts.clear()
  }

};
</script>
<style>
.ruleBtn{
  position:relative;
  top:-15px;
}
.ruleBtn ul{
 overflow: hidden;
 display:inline-block;
}
</style>