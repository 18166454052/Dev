<template>
  <ve-line :data="chartData" 
   :settings="chartSettings"
   :legend-visible="false"
   :tooltip-visible="false"
   :yAxis="yAxis"
   :xAxis="xAxis"
   :extend="extend"
   :height="height"
  >
   <div class="data-empty">没有数据</div>
  </ve-line>
</template>

<script>
  export default {
    data () {
        this.extend = {
            series: {
                itemStyle:{
                    normal:{
                        opacity:0 //不画点
                    }
                },
                lineStyle:{
                     normal:{
                        opacity:0 //不画点
                    }
                }
            }
      }
      this.chartSettings = {
        //xAxisType: 'value'
      }
      return {
        chartData: {
          columns: ['日期','下单率'],
          rows: [
           
          ]
        },
       height: "100px",
       width:'100%',
      yAxis: {
        axisLine: {
          show: false,
          lineStyle: {
            color: "#ccc"
          }
        },
        axisLabel:{
             show:false,
        }
       
      },
      xAxis: {
        axisLine: {
          show: false,
          lineStyle: {
            color: "#ccc"
          }
        },
        axisLabel:{
             show:false,
        }
       
      },
       grid: {
        right: "20px",
        top:'10',
      },
      }
    }
  }
</script>
<style>
.data-empty {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, .7);
  color: #888;
  font-size: 16px;
}
</style>
