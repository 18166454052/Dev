<template>
  <ve-line
    :height='height'
    :data="chartData"
    :colors="colors"
    :legend-visible="false"
    :tooltip-visible="false"
    :yAxis="yAxis"
    :xAxis="xAxis"
    >
  </ve-line>
</template>

<script>
  module.exports = {
    created: function () {
      this.chartData = {
        columns: ['日期','成本','count'],
        rows: [
          { '日期': '1月1日', '成本': 15,'count':20},
          { '日期': '1月2日', '成本': 12,'count':17},
          { '日期': '1月3日', '成本': 21,'count':26},
          { '日期': '1月4日', '成本': 41,'count':46},
          { '日期': '1月5日', '成本': 31,'count':36},
          { '日期': '1月6日', '成本': 71,'count':76}
        ]
      }
      this.colors = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
    
    this.height="250px"
    this.chartSettings={
          xAxisType: 'value',
        }
      this.yAxis={
          // nameTextStyle: {
          //   color:'#999'
          // },
          axisLine: {//y轴
                     show: true,
                     lineStyle: {////坐标轴文字样式
                        color: '#666'
                    }

                },
          splitLine: {  //网格
                show: true,  
                lineStyle: {  
                    color: ['#EEE']  
                }  
            }, 
        },
        this.xAxis={
          // name:'time', 
          // nameTextStyle: {
          //   color:'#999'
          // },
          type: "category",
          data: ['1月1日','1月2日','1月3日','1月4日','1月5日'],
          axisLine: {//轴
                    show: true,
                    lineStyle: {
                        color: '#666'
                    }
                },
          splitLine: {   //网格线 
                show: true,  
                lineStyle: {  
                    color: ['#EEE']  
                }  
            }
        }   
    }
  }
</script>