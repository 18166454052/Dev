
<template>
<div style="position:relative">
<!-- <div class="ruleBtn text-center">
      <ul>
       
        <li v-for="(rule,index) in selectedRrules" :key="rule" style="font-size:14px;margin-top:10px;float:left">
            <span style="display:inline-block;;width:30px;padding-right:10px;text-align:right;color:#666;line-height:20px;">{{rule}}</span>
            <span style="display:inline-block;width:40px;height:20px;border-radius:5px;cursor:pointer;vertical-align:top"
             :style={backgroundColor:aboutColor(rule)}
            @click="selectRule(rule)"
            ></span>
        </li>
      </ul>
    </div> -->
 <ve-line
    ref="lineR"
    :data="datas"
    :height='height'
    :width="width"
    :mark-area="markArea"
    :legend-visible="false"
    :grid="grid"
    :yAxis="yAxis"
    :data-zoom="dataZoom"
    :extend="extend"
    :events="chartEvents"
    >
  </ve-line>
    <el-popover v-if="selectedRrules.length>0 && show"
          placement="left"
          width="210"
         trigger="click"
        >
          <span slot="reference" 
          style="text-align:center;display:inline-block;cursor:pointer;width:20px;line-height:20px;background:#c93756;border-radius:10px;color:#fff">R</span>
          <div class="checkTools">
            <ul>
              <li v-for="(rule,index) in selectedRrules" :key="rule" style="font-size:14px;margin-top:10px;float:left">
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
import "echarts/lib/component/markLine"
import Mixins from './mixins'
export default {
  
  mixins:[Mixins],
  props: ["chartData","min","max","selectedRrules",'HR',"WR","show"],
  data() {
    let self=this;
     this.dataZoom = [
        {
         type: "slider",
         startValue: 0,
         endValue: 50,
         show:self.show
        }
      ]
      this.chartEvents = {
        click: function (e) {
          self.$emit('clickNode',e);
        }
     }
     /*
      this.markLine = {
        data: [
          {
            name: "ucl",
            yAxis:this.chartData.rows[0]["ucl"],
            lineStyle: {
              normal:{
                 color: "#00f"
              }
            },
             label:{
             normal:{
               show:true,
               position:'end',
               formatter:'ucl='+this.chartData.rows[0]["ucl"]
             }
               
            }
          
          },
          {
            name: "lcl",
            yAxis: this.chartData.rows[0]["lcl"],
             lineStyle: {
               normal:{
                 color: "#00f"
               }
                  
                },
             label:{
             normal:{
               show:true,
               position:'end',
               formatter:'lcl='+this.chartData.rows[0]["lcl"]
             }
               
            }
          },
          {
            name: "cl",
            yAxis: this.chartData.rows[0]["cl"],
             lineStyle: {
               normal:{
                  color: 'rgb(254, 201, 0)'
               }
                  
               },
             label:{
             normal:{
               show:true,
               position:'end',
               formatter:'c l='+this.chartData.rows[0]["cl"]
             }
               
            }
          }
        ]
      };
      */
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
                    yAxis: this.chartData.rows[0]["ucl"],
                },
                {
                    yAxis: this.chartData.rows[0]["ucl"],
                    name:"ucl="+this.chartData.rows[0]["ucl"],
                    label:{
                        show:true,
                        position:'right',
                        offset:[-100,-10],
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
                        offset:[-100,10],
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
      this.visualMap = [
     {
      right: 0,
      top: 30,
      pieces: [{
            gt:this.chartData.rows[0]["lcl"],
            lte:this.chartData.rows[0]["cl"],
           // symbolSize:[],
            color: '#096',
           },
            {
            gt: this.chartData.rows[0]["cl"],
            lte: this.chartData.rows[0]["ucl"],
            color: '#ffde33'
        }],
        // inRange: {
        //       color: ['#096', 'ffde33'],
        //         //symbolSize: [30, 100]
        //   }
      }
    ]  
    this.extend = {
      series: {
         type:'line',
         smooth:false,
         showAllSymbol: true,
         symbolSize: [5, 5],
         lineStyle:{  //会覆盖visualMap中的颜色
          normal:{

              color:'rgb(25,212,174)'
          },
        },
        itemStyle : {
         //  color:'#f00',
          // normal : {
          //   color : function(params){
          //        return '#f00'
          //   }
          // }

            normal: {
              borderWidth:1,
              color: function(params) {
                //console.log('*********params****************');
                if(self.datas.rows[params.dataIndex].improper.length>0){ 
                
                      return "#f00";
                }
                else{
                  return 'rgb(25,212,174)';
                }
              }
            }
          }

      },
      tooltip:{
            formatter:function(params){//[]
              let data=self.datas.rows[params[0].dataIndex];
                if(data.improper.length>0){
                     // return  '<span style="color:rgb(25,212,174)">groupNum</span>:'+ data.groupNum+'<br/>' + '<span style="color:rgb(25,212,174)">svg</span>:'+data.avg +'</br>'+'<span style="color:#C45245">error</span>:'+data.improper.join('<br/>');
                return  'groupNum : '+data.groupNum+'<br/>'+ 'range : '+ data.range+'<br/>'+'error : '+data.improper.join('<br/>');
               }
                else{
                    return  'groupNum : '+data.groupNum+'<br/>'+ 'range : '+data.range;
                }
            }
        },
         xAxis:{
           axisLabel: { 
                //rotate:'90',
                 interval:'auto',
                // formatter : function(params,index){
                //     if (index % 2 != 0) {
                //         //return '\r\n' + params;
                //     }
                //     else {
                //         return params;
                //     }
                // } 
          },
          axisLine: {
            show: true,
            lineStyle: {
             // color: "rgb(102,102,102)"
            }
         }, 
         axisTick: {
            show: true,
            lineStyle: {
              color: "rgb(102,102,102)"
            }
         },  
        }
    }
  

    return {
      yAxis: {
        max:function(value){
          //console.log(value.max.toString().split('.')[0]*1.1+'************************');
            let index=self.max.toString().indexOf('.')
            if(index>0){
                return Number(self.max.toString().slice(0,index+3));
            }
            else{

                return self.max;
            }
          
        },
        min :self.min,
        //  max: function(value) {
        //     return this.chartData.rows[0]["ucl"].split('.')[0]
        // },
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgb(102,102,102)"
          }
        },
        splitLine:{
          show:false
        },
        
      },
      grid:{
        right:40,
        top:10,
        bottom:50
      }
    };
  },
  computed:{
    height:function(){
      return this.HR-80+'px';
    },
    width:function(){
      return this.WR ;
    }
  },
  mounted: function() {
    this.$refs['lineR'].echarts.resize();
  },
  beforeDestroy:function() {
     this.$refs['lineR'].echarts.clear()
  }
};
</script>