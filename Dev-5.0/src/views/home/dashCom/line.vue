<template>
  <ve-line 
  :data="chartData" 
  :settings="chartSettings"
  :legend-visible="false"
  :grid="grid"
  :extend="extend"
  ></ve-line>
</template>

<script>
  export default {
    data () {
      this.chartSettings = {
       
      }
    this.extend = {
     
      
      xAxis: {
       axisLine: {
          show: true,
          lineStyle: {
              color: "#999",
              width:2
          }
        },
        axisTick: {
          show: true,
           lineStyle: {
              color: "#999",
              width:2
          } 
        },
        axisLabel:{
            formatter(value,index){
                   if(index==0){
                       return '11-22 '+value
                   }
                   else{
                       return value;
                   }
            }
        }
      },
      yAxis:{ 
        name:'实时',
        position:'left',
        axisLine: {
          show: true,
          lineStyle: {
            color: "#999",
            width:2
          }
        },
        axisTick: {
          show: true,
           lineStyle: {
              color: "#999",
              width:2
          }
        },
        
        
      }
    }
      return {
        chartData: {
          columns: ['日期', '访问用户', '下单用户',"下单率"],
          rows: [
            { '日期': '12:01:00', '访问用户': 3792, '下单用户': 3492, '下单率': 2992 },
            { '日期': '12:02:00', '访问用户': 4593, '下单用户': 4293, '下单率': 3793 },
            { '日期': '12:03:00', '访问用户': 2923, '下单用户': 2623, '下单率': 2123 },
            { '日期': '12:04:00', '访问用户': 1393, '下单用户': 1093, '下单率': 593 },
            { '日期': '12:05:00', '访问用户': 3530, '下单用户': 3230, '下单率': 2730 },
            { '日期': '12:06:00', '访问用户': 2923, '下单用户': 2623, '下单率': 2123 },
            { '日期': '12:07:00', '访问用户': 1723, '下单用户': 1423, '下单率': 923 },
            { '日期': '12:08:00', '访问用户': 1723, '下单用户': 1423, '下单率': 923 },
            { '日期': '12:08:00', '访问用户': 3792, '下单用户': 3492, '下单率': 2992 },
            { '日期': '12:10:00', '访问用户': 4593, '下单用户': 4293, '下单率': 3793 }
          ]
        },
        grid:{
            top:30,
            bottom:10,
            right:20
        },
        
      }
    }
  }
</script>