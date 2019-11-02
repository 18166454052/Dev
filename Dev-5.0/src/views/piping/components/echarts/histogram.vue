<template>
  <ve-histogram 
  :data="chartData" 
  :legend-visible="false"
  :width="width"
  :height="height"
  :yAxis="yAxis"
  :xAxis="xAxis"
  :settings="chartSettings"
  ></ve-histogram >
</template>

<script>
export default {
  props: ["chartData"],
  data() {
    return {
      width: "100%",
      height: "280px",
      yAxis: {
        // nameTextStyle: {
        //   color:'#999'
        // },
        axisLine: {
          //y轴
          show: true,
          lineStyle: {
            color: "#666"
          }
        },
        splitLine: {
          //网格
          show: true,
          lineStyle: {
            color: ["#EEE"]
          }
        }
      },
      colors: ['#19d4ae', '#5ab1ef', '#fa6e86','#ffb980', '#0067a6', '#c4b4e4',], //线的颜色
      grid: {
        show: false,
        right:'30px',//canvas  左右边的间距
        background: "#343B41",
        borderColor: "#343B41"
      },
      chartSettings: {
        metrics: ["min","s50thPercentile","s75thPercentile","s95thPercentile","s98thPercentile","s99thPercentile","s999thPercentile","max"],
        stack: { '单价': ["min","s50thPercentile","s75thPercentile","s95thPercentile","s98thPercentile","s99thPercentile","s999thPercentile","max"] }

        /*
            "日期"
            "min","s50thPercentile","s75thPercentile","s95thPercentile","s98thPercentile","s99thPercentile","s999thPercentile","max"
        */
      }
    };
  },
  methods:{
     
  },
  computed: {
    xAxis: function() {
      let obj = {
        type: "category",
        min:'dataMin',
        max:'dataMax',
       // boundaryGap: false,//x轴元素左边与y轴对齐
        data: [ ],
        axisLine: {
          //轴
          show: true,
          lineStyle: {
            color: "#666"
          }
        },
        splitLine: {
          //网格线
          show: true,
          lineStyle: {
            color: ["#EEE"]
          }
        },
        axisLabel: { 
              fontSize:10,
              //padding:[0,25,0,0],
              rotate:0, 
              interval:'auto',  
              formatter:function(value,index)  
              {  
                  return value.split(' ')[1]; 
              }  
        } 
      }
      let arr=[];
       this.chartData.rows.forEach(function(item){
              arr.push(item['日期']);
        });
        obj.data=arr;
        return obj;
    }
  }

};
</script>