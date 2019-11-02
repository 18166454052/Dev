<template>
  <ve-histogram 
  :data="chartData" 
  :settings="chartSettings"
  :grid="grid"
  :extend="extend"
  ></ve-histogram>
</template>

<script>
  export default {
    data () {
      this.chartSettings = {
        stack: { '用户': ["刀具",'扩展数据', '基础数据'] }
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
            formatter:function(value,index){
                if(index==0){
                    return '2018-'+value;
                }
                else{
                    return value;
                }
            }
        }
      },
      yAxis:{ 
          name:'历史',
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
        }
        
      }
    }


      return {
        chartData: {
          columns: ['日期', '扩展数据', '基础数据',"刀具"],
          rows: [
            { '日期': '11-5', '扩展数据': 1393, '基础数据': 1093,"刀具":593 },
            { '日期': '11-6', '扩展数据': 3530, '基础数据': 1230,"刀具":3230 },
            { '日期': '11-7', '扩展数据': 2923, '基础数据': 2623,"刀具":568 },
            { '日期': '11-8', '扩展数据': 1723, '基础数据': 1423, "刀具":653 },
            { '日期': '11-9', '扩展数据': 3792, '基础数据': 492, "刀具":697 },
            { '日期': '11-10', '扩展数据': 4593, '基础数据': 4293, "刀具":392 },
            { '日期': '11-11', '扩展数据': 1393, '基础数据': 1093,"刀具":693 },
            { '日期': '11-12', '扩展数据': 3530, '基础数据': 3230,"刀具":1230 },
            { '日期': '11-13', '扩展数据': 2923, '基础数据': 623,"刀具":1568 },
            { '日期': '11-14', '扩展数据': 1723, '基础数据': 1423, "刀具":953 },
            { '日期': '11-15', '扩展数据': 3792, '基础数据': 3492, "刀具":1697 },
            { '日期': '11-16', '扩展数据': 4593, '基础数据': 4293, "刀具":2392 }
          ]
        },
        grid:{
          top:30,
          bottom:10
        },
      }
    }
  }
</script>