<template>
  <ve-line 
  :data="newcharData" 
  :legend-visible="false"
  :colors="colors"
  :width="width"
  :height="height"
  :yAxis="yAxis"
  :xAxis="xAxis"
  :settings="chartSettings"
  :series="series"
  :tooltip="tooltip"
  :grid="grid"
  ></ve-line>
</template>

<script>
export default {
  props: ["chartData"],
  data() {
    return {
      width: "100%",
      height: "280px",
       tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#ccc',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    textStyle: {
                        color: '#222'
                    }
                }
            },
            formatter: function (params) {
                console.log('*************params************');
                console.log(params);
                return params[2].name + '<br />' + params[2].value;
            }
        },
      yAxis: {
        axisLine: {
          //y轴
          show: true,
          lineStyle: {
            ////坐标轴文字样式
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
      //colors: ['#19d4ae', '#5ab1ef', '#fa6e86','#ffb980', '#0067a6', '#c4b4e4',], //线的颜色
      colors: ['#EEE', '#EEE','#f00','#f00'],
      grid: {
        show: false,
        right:'30',
        background: "#343B41",
        borderColor: "#343B41"
      },
      chartSettings: {
          itemStyle:{
               smooth:0
            }
      },
       series: [{
            name: 'L',
            type: 'line',
            data: 'add',
            lineStyle: {
                normal: {
                    opacity: 0
                }
            },
            stack: 'confidence-band',
            symbol: 'none'
        }, {
            name: 'U',
            type: 'line',
            data: 'reduce',
            lineStyle: {
                normal: {
                    opacity: 0
                }
            },
            areaStyle: {
                normal: {
                    color: '#ccc'
                }
            },
            stack: 'confidence-band',
            symbol: 'none'
        }, {

            type: 'line',
            data:'mean',
            hoverAnimation: false,
            symbolSize: 6,
            itemStyle: {
                normal: {
                    color: '#c23531'
                }
            },
            showSymbol: false
        }]
    }
  },
  computed: {
    xAxis: function() {
      let obj = {
        type: "category",
        min:'dataMin',
        max:'dataMax',
        axisLine: {onZero:false},
        boundaryGap: false,//x轴元素左边与y轴对齐
        data: [ ],
        axisLine: {
          //轴
          show: false,
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
    },
    newcharData:function(){
        
        let self=this,newcharData;
        newcharData=Object.assign({},self.chartData);
        console.log(self.chartData);//  

        newcharData.rows.forEach(function(item){
            if(item.hasOwnProperty('latency_mean')){
               item.add=Number(item.latency_mean)+Number(item.latency_stddev);
               item.reduce=Number(item.latency_mean)-Number(item.latency_stddev);
            }
            else{
               item.add=Number(item.mean)+Number(item.stdDev);
               item.reduce=Number(item.mean)-Number(item.stdDev);
            }
        });
        let index;
         if(newcharData.columns.indexOf("latency_stddev",0)!==-1){
              index=newcharData.columns.indexOf('latency_stddev',0);
         }
         else{
             index=newcharData.columns.indexOf('stdDev',0);
         }
       
        let add=[],reduce=[],mean=[];
        newcharData.rows.forEach(function(item){
                add.push(item.add);
                reduce.push(item.reduce)
                mean.push(item.mean?item.mean:item.latency_mean);
        });
        self.series[0].data=reduce;
        self.series[1].data=add;//add
        self.series[2].data=mean;
      
        console.log(reduce);
        console.log(add);
        console.log(mean);
        if(index!==-1){
            newcharData.columns.splice(index,1);
        }
        console.log(newcharData);
        return newcharData;


    }
  }

};
</script>