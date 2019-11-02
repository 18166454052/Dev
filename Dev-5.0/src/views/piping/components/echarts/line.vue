<template>
  <ve-line 
  :data="chartData" 
  :legend-visible="false"
  :colors="colors"
  :width="width"
  :height="height"
  :xAxis="xAxis"
  :yAxis='yAxis'
  :grid="grid"
  :chartSettings="chartSettings"
  :extend="extend"
  >
  </ve-line>
</template>

<script>
 import 'v-charts/lib/style.css'
export default {
  props: ["chartData"],

  data() {
    let self=this;
    this.extend={
      series:{
        type: "line",
        smooth: false,
       // showAllSymbol: true,
        //symbolSize: [6, 6],
      },
      yAxis:{ 
      
        max:function(value){
          let range=value.max-value.min;
          let max= Number(value.max)+ Number((range/8));
          return  max.toFixed(2);
         
        },
        min:function(value){
           let range=value.max-value.min;
           let min= Number(value.min)- Number((range/8));
          return  min.toFixed(2);
           
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgb(102,102,102)"
          }
        }
      }
    }

    return {
      width: "100%",
      height: "280px",
      dataEmpty:true,
      colors: ['#19d4ae', '#5ab1ef', '#fa6e86','#ffb980', '#0067a6', '#c4b4e4',], //线的颜色
      /*
      ['#19d4ae', '#5ab1ef', '#fa6e86',
      '#ffb980', '#0067a6', '#c4b4e4',
      '#d87a80', '#9cbbff', '#d9d0c7',
      '#87a997', '#d49ea2', '#5b4947']
       */
      grid: {
        show: false,
        right:'30px',//canvas  左右边的间距
        background: "#343B41",
        borderColor: "#343B41"
      },
      yAxis:{},
      //  series: [
      //     {
      //         id: 'a',
      //         type: 'line',
      //         smooth:true,
      //         symbolSize: 5,   
      //     }
      // ],
      chartSettings: {
       xAxisType: 'time'
      }
      //   chartData: {
      //       columns: ['time','num'],
      //       rows: [
      //         { 'num':500, 'time': '1月' }
      //       ]
      // }
    };
  },
   methods: {
     getFixed:function(number){
       if(typeof number =='string'){
          return number.search(/[1-9]/);
       }
       else{
           return number.toString().search(/[1-9]/);
       }
       
        //    this.getFixed(0.000123);===5
     }
  },
  computed: {
    xAxis: function() {
      let obj = {
          type: "category",
          min:'dataMin',
          max:'dataMax',
          boundaryGap: false,  //x轴元素左边与y轴对齐
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
                interval:'auto',    //控制x轴隔m个值显示一个
                //showMinLabel:false,
                formatter:function(value,index)  
                {  
                  
                    return value.toString().split(' ')[1]; 
                }  
          } 
      }
      let arr=[];
       
      let self=this;
        this.chartData.rows.forEach(function(item,index){
            arr.push(item['日期']);
        });
        obj.data=arr;
       // self.series[0].data=arr;
        return obj;
    }
  }

};
</script>