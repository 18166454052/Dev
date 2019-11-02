<template>
  <div>
   <div ref="plato" :style="{height:height,width:width}"></div>
  </div>
</template>

<script>
export default {
  props: ["paretoData","HZ","WZ"],
  data() {
    return {
      myChart:''
    };
  },
  methods: {
    drawLine: function() {
      let self = this;
     self.myChart = self.$echarts.init(self.$refs.plato);
     self.myChart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: 'cross'
          },
          padding:[5,10],
          formatter:function(params){
            let index =params[0].dataIndex;
            console.log(params);
            /*
              badName:[],
              badNum:[],
              count:[],
              rate:[]
            */
             return  self.paretoData.badName[index]+"<br/>"
                  +  params[0].marker  +"badNum : "+self.paretoData.badNum[index]+"<br/>"
                  +  params[1].marker  +"count :  "+self.paretoData.count[index]+"<br/>"
                  +  params[0].marker  +"rate :  "+self.paretoData.rate[index]*100 +"%"
 
          }
        },
        grid:{
          top:10,
          left:50,
          right:60,
          bottom:50
        },
        xAxis: [
          {
            type: "category",
            data: self.paretoData.badName,
            // axisPointer: {
            //   type: "shadow"
            // }
          }
        ],
        yAxis: [
          {
            type: "value",
            //max:36,
            max:self.paretoData.count.slice(-1)[0],
            axisLabel: {
              formatter: "{value}"
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "rgb(102,102,102)"
              }
          },
          
          },
          {
            type: "value",
            min: 0,
            max: 100,
            axisLabel: {
              formatter: "{value} %"
            },
            axisLine: {
                  show: true,
                  lineStyle: {
                    color: "rgb(102,102,102)"
                  }
            },
          }
        ],
        series: [
          {
            name: "badNum",
            type: "bar",
            barCategoryGap: 0,
            label: { show: true, position: "top" },
            data: self.paretoData.badNum,
            itemStyle: {
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
            }
          },
          {
            name: "count",
            type: "line",
            barCategoryGap: 0,
            data: self.paretoData.count,
            symbolSize:[5,5],
            itemStyle:{
              normal:{
                 borderWidth: 1
              }
            }
            
          }
        ]
      });
    }
  },
  computed:{
    height:function(){
      return this.HZ-50+'px';
    },
    width:function(){
      return this.WZ;
    }
  },
  watch:{
    HZ:function(){
      this.myChart.resize();
    },
    WZ:function(){
      this.myChart.resize();
    }
  },
  mounted: function() {
    this.drawLine();
  },
  beforeDestroy:function() {
    this.myChart.clear()
  }
};
</script>