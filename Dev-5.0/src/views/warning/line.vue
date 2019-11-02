
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
    :data="data"
    :legend-visible="false"
    :height='height'
    :width="width"
    :grid="grid"
    :yAxis='yAxis'
    :extend="extend"
  >
  </ve-line>
   
 </div>
 </template>

<script>
import "echarts/lib/component/markLine";
export default {
  props: ["data","HX","WX"],//W H  页面设置的 x图的width height
  data() {
    let self = this;
    
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
            borderWidth:2,
          
          }
        }
      },
      tooltip: {
        /*
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
        */
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
   

    return {
      //height:'400px',
      backgroundColor:'rgb(243,243,243)',
      yAxis: {
       
      },
      grid: {
        right:40,
        top:5,  //10
        bottom:20
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