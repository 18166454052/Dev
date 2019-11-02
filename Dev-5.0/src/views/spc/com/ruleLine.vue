<template>
  <div>
   <div ref='step' :style="{height: height,width:width}"></div>
  </div>
</template>

<script>
/* 在配置页面   判异规则的图表说明 */
import { firstBy } from "thenby";
export default {
  props:["ruleNumber","content","n","m"],
  data() {
    let self = this;
    return {
      // height:'600px',
      width: "100%",
      height: "400px",
      data:[],
      myChart: "",
      color: [
        "#c23531",
        "#4575b4",
        "#74add1",
        "#abd9e9",
        "#e0f3f8",
        "#91c7ae",
        "#749f83",
        "#ca8622",
        "#bda29a",
        "#6e7074",
        "#546570",
        "#c4ccd3"
      ],
    
    };
  },
  methods: {
    drawLine: function() {
      let self = this;
    
      /************* */
      self.myChart.setOption(
       {
        grid: {
          left: 40,
          right:20,
          bottom: 60,
          top: 50
        },
        xAxis: {
          min:0,
          type: "category",
          boundaryGap: false,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#999",
              width: 2
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
         
        },

        yAxis: {
          type: "value",
          min:-5,
          max:5,
          axisLine: {
            show: true,
            lineStyle: {
              color: "#999",
              width: 2
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        series: [
            {
                type: "line",
                data: self.data,
                silent: true,
                symbolSize:[8,8],
                lineStyle:{
                    color:'rgb(27,233,191)',
                },
                itemStyle:{
                     color:'rgb(27,233,191)',
                },
                markLine: {
                    symbol: "none",
                    lineStyle: {
                        type: "solid",
                        color: "#333"
                    },
                    data: [
                        {
                        name: "ucl",
                        yAxis: 3,
                        label: {
                            normal: {
                            position: "start",
                            formatter: function(params) {
                                return "UCL";
                            }
                            }
                        },
                        lineStyle: {
                            type: "dashed",
                            color: "#333"
                        }
                        },
                        {
                        name: "lcl",
                        yAxis: -3,
                        label: {
                            normal: {
                            position: "start",
                            formatter: function(params) {
                                return "LCL";
                            }
                            }
                        },
                        lineStyle: {
                            type: "dashed",
                            color: "#333"
                        }
                        },
                        {
                        name: "X",
                        yAxis: 0,
                        label: {
                            normal: {
                            position: "start",
                            formatter: function(params) {
                                return "X";
                            }
                            }
                        }
                        }
                    ]
                },
                markArea: {
                    label:{
                        show:true,
                        position:'left',
                        offset:[25,-8],
                        color:'#333',
                        fontWeight:500
                    },
                    itemStyle: {
                        normal: {
                            borderColor:'#888',
                            borderWidth: 1.2,
                            borderType: 'solid'
                        }
                    },
                    data: [ 
                        [
                            {
                                yAxis: "1",
                            },
                            {
                                yAxis: '1',
                                name:'C',
                                label:{
                                    show:true,
                                    position:'left',
                                    offset:[25,8],
                                    color:'#333'
                                },
                            }
                        ],
                        [
                            {
                                yAxis: "-1",
                            },
                            {
                                yAxis: '-1',
                                name:'C',
                                
                            }
                        ],
                        [
                            {
                                yAxis: "2",
                            },
                            {
                                yAxis: '2',
                                name:'B',
                                label:{
                                    show:true,
                                    position:'left',
                                    offset:[25,8],
                                    color:'#333'
                                },
                            }
                        ],
                        [
                            {
                                yAxis: "-2",
                            },
                            {
                                yAxis: '-2',
                                name:'B',
                            }
                        ],
                        [
                            {
                                yAxis: "3",
                            },
                            {
                                yAxis: '3',
                                name:'A',
                                label:{
                                    show:true,
                                    position:'left',
                                    offset:[25,8],
                                    color:'#333'
                                },
                            }
                        ],
                        [
                            {
                                yAxis: "-3",
                            },
                            {
                                yAxis: '-3',
                                name:'A',
                                
                                
                                
                            }
                        ]
                    ]
                },
                markPoint: { 
                    label:{
                        color:'#fff',
                        formatter:self.pointFormatter,
                        padding:[5,50],
                    },
                    symbolSize:function(value,params){
                        return [self.pointFormatter.length*20,80]
                        //console.log(params);
                       // return [value.length*12,30];
                        
                    },
                    symbolOffset: [-120, 0],

                    itemStyle:{
                        color:'#f00'
                    },
                    data: [
                         {type: 'max'}
                        //{type: 'average'},
                        // {type: 'min', name: '最小值'}
                    ]
            },
            
            }
        ]
      },
        true // true:值的替换    false:默认，值的合并
      );
    },
    setPoint:function(){
         let data=[];
        if(this.ruleNumber==1){
            data=[[1,1],[2,2]];
            let count=Number(this.n)+2;
            for(let i=3;i<=count;i++){
               data.push([i,4]);
            }

        }
        else if(this.ruleNumber==2){//
        //0-3 
            let count=this.n;
            for(let i=1;i<this.n+1;i++){
                let y=(Math.random()*3);
                data.push([i,y]);
            }
        }else if(this.ruleNumber==3){
           let arr=[];
           if(Math.random()<=0.5){
                for(let i=0;i<this.n;i++){
                    arr.push((Math.random()*3));
                }
           }
           else{
                for(let i=0;i<this.n;i++){
                    arr.push((Math.random()*-3));
                }
           }
           
            arr.sort(
                firstBy(function (v) { return v})
            )
           for(let i=1;i<this.n+1;i++){
              data.push([i,arr[i-1]]);
           }
        }
        else if(this.ruleNumber==4){
            for(let i=0;i<this.n;i++){
                if(i%2==0){
                    data.push([i,(Math.random()*3)]);
                }
                else{
                    data.push([i,(Math.random()*-3)]);
                }
            }
            
        }
        else if(this.ruleNumber==5){
            let arr=[];
            for(let i=0;i<this.m;i++){// -3 -2
                arr.push(Math.random()-3);
            }
            for(let i=0;i<this.n-this.m;i++){ // -2 3(-1--3)
                arr.push(Math.random()*4-1);
            }
            arr.sort((a,b)=>{
                return Math.random()>.5 ? -1 : 1;
            })
            for(let i=0;i<this.n;i++){
                data.push([i,arr[i]]);
            }
        }
        else if(this.ruleNumber==6){
            let arr=[];
            for(let i=0;i<this.m;i++){// -3 -1
                arr.push((Math.random()*2)-3);
            }
            for(let i=0;i<this.n-this.m;i++){ // -1 3(0-3)
                arr.push(Math.random()*3);
            }
            arr.sort((a,b)=>{
                return Math.random()>.5 ? -1 : 1;
            })
            for(let i=0;i<this.n;i++){
                data.push([i,arr[i]]);
            }
        }
        else if( this.ruleNumber==7){
            for(let i=0;i<this.n;i++){
                data.push([i,(Math.random()*2).toFixed(3)-1]);
            }
           
        }
        else if(this.ruleNumber==8){
            for(let i=0;i<this.n;i++){
                 if(i%2==0){//
                     data.push([i,(Number(Math.random()*2))+1]);
                 }
                 else{
                      data.push([i,(Math.random()*2)-3]);
                 }
            }

        }
        this.data=data;
    }
  },
  computed:{
      pointFormatter:function(){
          return this.content;
      }
  },
  watch:{
    content:function(){
          this.drawLine();
    },
    ruleNumber:function(){// C=1 B=2 A=3
        this.setPoint();
        this.drawLine();
    },
    n:function(){
        this.setPoint();
        this.drawLine();
    },
    m:function(){
        this.setPoint();
        this.drawLine();
    }
  },

  mounted: function() {
    this.myChart = this.$echarts.init(this.$refs.step, "shine");
    this.drawLine();
  },
  beforeDestroy: function() {
    this.myChart.clear();
  }
};
</script>