<template>
   <ve-line
    ref="LINE"
    :data="chartData"
    :height='height'
    :legend-visible="false"
    :grid="grid"
    :yAxis="yAxis"
    :data-zoom="dataZoom"
    :extend="extend"
    >
  </ve-line>
</template>

<script>
export default {
  props: ["chartData","HR","WR","show"],
  data() {
    let self=this;
     this.dataZoom = [
        {
          type: 'slider',
          startValue: 0,
          endValue: 50,
          show:self.show
        }
      ]
      this.markLine = {
        data: [
          {
            name: "ucl",
            yAxis:this.chartData.rows[0]["ucl"],
            lineStyle: {
              normal:{
                 color: "#00f"
              }
            },
             label:{
             normal:{
               show:true,
               position:'end',
               formatter:'ucl'
             }
               
            }
          
          },
          {
            name: "lcl",
            yAxis: this.chartData.rows[0]["lcl"],
             lineStyle: {
               normal:{
                 color: "#00f"
               }
                  
                },
             label:{
             normal:{
               show:true,
               position:'end',
               formatter:'lcl'
             }
               
            }
          },
          {
            name: "cl",
            yAxis: this.chartData.rows[0]["cl"],
             lineStyle: {
               normal:{
                  color: 'rgb(254, 201, 0)'
               }
                  
               },
             label:{
             normal:{
               show:true,
               position:'end',
               formatter:'cl'
             }
               
            }
          }
        ]
      };
      this.visualMap = [
     {
      right: 0,
      top: 30,
      pieces: [{
            gt:this.chartData.rows[0]["lcl"],
            lte:this.chartData.rows[0]["cl"],
           // symbolSize:[],
            color: '#096',
           },
            {
            gt: this.chartData.rows[0]["cl"],
            lte: this.chartData.rows[0]["ucl"],
            color: '#ffde33'
        }],
        // inRange: {
        //       color: ['#096', 'ffde33'],
        //         //symbolSize: [30, 100]
        //   }
      }
    ]  
    this.extend = {
      series: {
         type:'line',
         smooth:false,
         showAllSymbol: true,
         symbolSize: [5, 5],
         lineStyle:{  //会覆盖visualMap中的颜色
          normal:{
              color:'rgb(25,212,174)'
          },
        },
        itemStyle : {
          //  color:'#f00',
          // normal : {
          //   color : function(params){
          //      return '#f00'
          //   }
          // }

            normal: {
              borderWidth:1,
              color: function(params) {
                //console.log('*********params****************');
                // if(self.chartData.rows[params.dataIndex].improper.length>0){ 
                //   console.log(self.chartData.rows[params.dataIndex]);
                //       return "#f00";
                // }
                // else{
                //   return 'rgb(25,212,174)';
                // }
                return 'rgb(25,212,174)';
              }
            }
          }

      },
      tooltip:{
            formatter:function(params){//[]
              let data=self.chartData.rows[params[0].dataIndex];
                
                     // return  '<span style="color:rgb(25,212,174)">groupNum</span>:'+ data.groupNum+'<br/>' + '<span style="color:rgb(25,212,174)">svg</span>:'+data.avg +'</br>'+'<span style="color:#C45245">error</span>:'+data.improper.join('<br/>');
                return  'groupNum : '+data.groupNum+'<br/>'+  params[0].marker + 'cumulativeRate : '+ data.cumulativeRate;
               
            }
        },
         xAxis:{
           axisLabel: { 
                //rotate:'90',
                 interval:'auto',
                // formatter : function(params,index){
                //     if (index % 2 != 0) {
                //         //return '\r\n' + params;
                //     }
                //     else {
                //         return params;
                //     }
                // } 
          },
          axisLine: {
            show: true,
            lineStyle: {
             // color: "rgb(102,102,102)"
            }
         }, 
         axisTick: {
            show: true,
            lineStyle: {
              color: "rgb(102,102,102)"
            }
         },  
        }
    }
  

    return {
      yAxis: {
        //max :Number(this.chartData.rows[0]["ucl"].toString().split('.')[0])+10,
       // min :this.chartData.rows[0]["lcl"].toString().split('.')[0],
        //  max: function(value) {
        //     return this.chartData.rows[0]["ucl"].split('.')[0]
        // },
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgb(102,102,102)"
          }
        },
        // splitLine: {
        //   //网格
        //   show: true,
        //   lineStyle: {
        //     color: ["#EEE"]
        //   }
        // }
      },
      grid:{
        top:10,
       
        right:30
      }
    };
  },
  methods: {},
  computed: {
    height:function(){
      return this.HR-80+'px';
    },
    width:function(){
       return this.WR;
    }
  },
  mounted: function() {
    // this.datas = this.chartData;
    // let self = this;
      this.$refs['LINE'].echarts.resize();
    
    
  },
  beforeDestroy:function() {
     this.$refs['LINE'].echarts.clear()
  }
};
</script>