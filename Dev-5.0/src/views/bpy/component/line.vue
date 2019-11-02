<template>
  <div>
   <div ref='step' :style="{height:height,width:width}"></div>
  </div>
</template>

<script>
export default {
    props:["chartData","name","height","setColor"],
  data() {
    let self=this;
    return {
     // height:'600px',
      width:'100%',
      myChart:'',
      color:['#c23531', "#4575b4","#74add1","#abd9e9", "#e0f3f8",'#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
      option :{
            dataZoom: [
               {
                    type: "slider",
                    // startValue:'',
                    // endValue:'',
                    start:0,
                    end:100,
                    zoomOnMouseWheel:true,  
                    //rangeMode:['percent','percent']
               }
            ],
            // color:['#c23531',"#4575b4", "#74add1","#abd9e9"],
                color:['#c23531', "#4575b4","#74add1","#abd9e9", "#e0f3f8",'#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
            grid: {
                left:60,
                right: 50,
                bottom: 60,
                top:50
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
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
                //min:"dataMin"
            
            },
            // tooltip:{
            //            formatter: '{b0} : {c0}'
            // },
            yAxis: {
                type: 'value',
                name:self.name,
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
            },
            series: [
            
            ]
        }
    };
  },
  methods: {
    drawLine: function() {
      let self = this;
      self.myChart = self.$echarts.init(self.$refs.step,'shine');
      /************* */
        if(this.chartData.length>0){

            this.chartData.forEach((item,index)=>{
                if(item.length>0){
                    let obj=
                    {
                        smooth:true,
                        type:'line',
                        data:item,
                        itemStyle:{
                           opacity:0
                        },
                        z:index==0?5:2,
                        lineStyle:{

                        }
                    }
                    if(this.setColor){
                        let flag=Math.ceil(this.chartData.length/10);
                        if(index==0){
                            obj.lineStyle.color=this.color[0]
                           
                        }
                        else{
                            let Index=Math.ceil(index/flag);
                           
                            obj.lineStyle.color=this.color[Index];
                            
                        }
                        
                    }
                    this.option.series.push(obj); 
                   
                  
                }
                
            });
            /************* */
           
           self.myChart.setOption(
            self.option,true   // true:值的替换    false:默认，值的合并
           );    
        }
       
    }
  },
  watch:{
    chartData:function(){
        this.option.series=[];
      
        this.drawLine();
    },
   
    // width:function(){
    //    this.myChart.resize();
    // },
    // height:function(){
    //     this.myChart.resize();
    // }
 
  },
  computed:{
    //   Width:function(){
    //       return this.width;
    //   },
    //   Height:function(){
    //       return this.height + "px";
    //   }
  },
  mounted: function() {
     this.drawLine();
  },
  beforeDestroy:function() {
    this.myChart.clear()
  }
};
</script>