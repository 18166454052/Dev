<template>
  <div>
   <div ref="box" :style="{width:width,height: height}"></div>
  </div>
</template>

<script>
import  dataTool from "dataTool.min.js";
console.log(dataTool);
export default {
  props: ["boxObj",'H11',"W11"],
  data() {
    return {
       box:'',
       myChart:''
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
     },
    drawLine: function() {
      let self = this;
      this.myChart = self.$echarts.init(self.$refs.box);
       self.box=JSON.parse(JSON.stringify(self.boxObj));
       self.box.values=dataTool.prepareBoxplotData(self.box.values.slice(0));
       console.log(self.box);
      this.myChart.setOption({
        tooltip: {
          trigger: "item",
          // axisPointer: {
          //   type: "shadow"
          // }
        },
        grid: {
          top:10,
           right: 30,
           left:40,
           bottom:50
        },
        xAxis: {
          type: "category",
          data: self.box.personName,
          boundaryGap: true,
          nameGap: 30,
          // splitArea: {
          //   show: false
          // },
          axisLabel: {
            formatter: "{value}"
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          max:function(value){
          let range=value.max-value.min;
          let max= value.max+ range/8;
          return  max.toString().slice(0,self.getFixed(max)+3);
         
        },
        min:function(value){
           let range=value.max-value.min;
           let min= value.min - range/8;
          return  min.toString().slice(0,self.getFixed(min)+3);
           
        },
        },
        series: [
          {
            name: "boxplot",
            type: "boxplot",
            data: self.box.values.boxData,
            tooltip: {
                  formatter: function (param) {
                   
                      return [
                          param.name ,
                          'max: ' + param.data[5],
                          'Q3: ' + param.data[4],
                          'median: ' + param.data[3],
                          'Q1: ' + param.data[2],
                          'min: ' + param.data[1]
                      ].join('<br/>')
                  }
              }
          },
          {
            name: 'outlier',
            type: 'scatter',
            data: self.box.values.outliers
          },
          {
            name: 'average',
            type: 'line',
            data: self.box.average,
            symbolSize:8,
            lineStyle: {
              normal: {
                color:"rgb(25,212,174)"
                //width
            },
           
          }, 
          tooltip:{
              formatter:function(param){
                 let name=param.name,
                    value=param.value,
                     marker=param.marker;
                 return  name + "<br/>"
                         + marker + 'average ：'+ value;
              }
            },
           itemStyle:{
             normal:{
                 color:"rgb(25,212,174)"
             }
           },
           z:10
          }
        ]
      });
    }
  },
  computed:{
    height:function(){
      return this.H11-50+'px'
    },
    width:function(){
      return this.W11;
    }
  },
  mounted: function() {
    this.drawLine();
  },
  watch:{
    boxObj:function(){
      //this.box=JSON.parse(JSON.stringify(this.boxObj));
      this.drawLine();
    },
    H11:function(){
       this.myChart.resize();
    },
    W11:function(){
       this.myChart.resize();
    }
  }
  
};
</script>