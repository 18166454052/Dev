<template>
  <ve-histogram 
  ref="histogram"
  :data="charData"
  :height="height"
  :width="width"
  :yAxis="yAxis"
  :legend-visible="false"
  :extend="extend"
  :grid="grid"
   ></ve-histogram>
</template>

<script>
export default {
  props:['charData',"H8","W8"],
  data() {
    this.extend = {
      series: {
         label: { show: true, position: "top" },
       // barWidth:'50%',
        itemStyle: {
          /*
          normal: {
            color: function(params) {
              var colorList = [
                "#C33531",
                "#EFE42A",
                "#64BD3D",
                "#EE9201",
                "#29AAE3",
                "#B74AE5",
                "#0AAF9F",
                "#E89589",
                "#16A085",
                "#4A235A",
                "#C39BD3 ",
                "#F9E79F",
                "#BA4A00",
                "#ECF0F1",
                "#616A6B",
                "#EAF2F8",
                "#4A235A",
                "#3498DB"
              ];
              return colorList[params.dataIndex];
            }
          }
          */
        },
        xAxis: {
          axisLabel: {
            //rotate:'90',
            //interval: "auto"
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
               color: "rgb(102,102,102)"
            }
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: "rgb(102,102,102)"
            }
          }
        }
      },
    };

    return {
      yAxis: {
        /*
        max:function(value){
           return self.MAX>value.max?self.MAX:Number(value.max.toString('.')[0]*1.1)
        },
        min:self.MIN,
        */
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgb(102,102,102)"
          }
        }
      },
      grid: {
        top:20,
        right: 20,
        bottom:50
       
      }
     
    };
  },
  computed:{
   height:function(){
     return this.H8-50+'px';
   },
   width:function(){
     return this.W8;
   }
  },
  created:function(){
     this.$refs.histogram.echarts.resize();
  }
};
</script>