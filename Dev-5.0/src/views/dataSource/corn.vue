<template>
<div class="Corn">
   <el-tabs v-model="activeName" type="card">
    <el-tab-pane label="秒" name="second">
       <v-corn-content :count="60" type="s"
       @label1="label1"
       @label2="label2"
       @label3="label3"
       @label4="label4"
       ></v-corn-content>
    </el-tab-pane>
    <el-tab-pane label="分钟" name="minute">
         <v-corn-content :count="60" type="M"
           @label1="label1"
           @label2="label2"
           @label3="label3"
           @label4="label4"
         ></v-corn-content>
    </el-tab-pane>
    <el-tab-pane label="小时" name="hour">
         <v-corn-content :count="24" type="h"
            @label1="label1"
            @label2="label2"
            @label3="label3"
            @label4="label4"
         ></v-corn-content>
    </el-tab-pane>
    <el-tab-pane label="日" name="date" >
         <v-corn-content :count="31" type="d"
            @label1="label1"
            @label2="label2"
            @label3="label3"
            @label4="label4"
            @label5="label5"
            @label6="label6"
            @label7="label7"
         ></v-corn-content>
    </el-tab-pane>
     <el-tab-pane label="月" name="month">
          <v-corn-content :count="12" type="m"
            @label1="label1"
            @label2="label2"
            @label3="label3"
            @label4="label4"
             @label5="label5"
          ></v-corn-content>
     </el-tab-pane>
    <el-tab-pane label="周" name="wekend">
         <v-corn-content :count="7" type="w"
           @label1="label1"
           @label2="label2"
           @label3="label3"
           @label4="label4"
           @label5="label5"
           @label6="label6"
         ></v-corn-content>
    </el-tab-pane>
    <el-tab-pane label="年" name="year">
         <v-corn-content :count="60" type="y"
            @label1="label1"
            @label2="label2"
            @label3="label3"
            @label4="label4"
             @label5="label5"
         ></v-corn-content>
    </el-tab-pane>
  </el-tabs>
  <div class="result">
      <span class="title">表达式</span>
       <el-row>
           <el-col :span="3" :offset="3" class="text-center">秒</el-col>
           <el-col :span="3" class="text-center">分钟</el-col>
           <el-col :span="3" class="text-center">小时</el-col>
           <el-col :span="3" class="text-center">日</el-col>
           <el-col :span="3" class="text-center">月</el-col>
           <el-col :span="3" class="text-center">星期</el-col>
           <el-col :span="3" class="text-center">年</el-col>


       </el-row>
        <el-row class="resList">
           <el-col :span="3" class="text-right">表达式字段 : </el-col>
           <el-col :span="3"><el-input v-model="s"></el-input><div class="cms"></div></el-col>
           <el-col :span="3"><el-input v-model="M"></el-input><div class="cms"></div></el-col>
           <el-col :span="3"><el-input v-model="h"></el-input><div class="cms"></div></el-col>
           <el-col :span="3"><el-input v-model="d"></el-input><div class="cms"></div></el-col>
           <el-col :span="3"><el-input v-model="m"></el-input><div class="cms"></div></el-col>
           <el-col :span="3"><el-input v-model="w"></el-input><div class="cms"></div></el-col>
           <el-col :span="3"><el-input v-model="y"></el-input><div class="cms"></div></el-col>


       </el-row>
       <div class="example">
         <p>最近5次运行时间:</p>
         <div >
         2018-12-27 17:13:66
         </div>
         <div>
         2018-12-27 17:13:66
         </div>
       </div>
  </div>
</div>
</template>
<script>
/*
1  通配符
2  from  to
3  start  circle
4  指定
5  不指定/每年
6 （日） 本月最后一天   （周） 本周最后一个星期
7 （日） 每月x号最近的工作日


*/
import CornConent from './cornContent'
export default {
    components:{
        'v-corn-content':CornConent
    },
    data(){
        return {
            activeName:'second',
            s:'',
            M:'',
            h:'',
            d:'',
            m:'',
            w:'',
            y:''
           
        }
    },
    methods:{
        label1:function(info){
            this[info.type]='*';  
            if(info.type=='y'){
                if(this.s=='*' && this.M=='*' && this.h=='*' && this.d=='*' && this.m=='*' && this.w=='*'){
                     this.y='';
                     this.w='?';
                     this.s=this.M=this.h=this.d=this.m=0;
                }
               
            }
           
          
        },
        label2:function(info){
            this[info.type]=info.val;
        },
        label3:function(info){
            this[info.type]=info.val;
        },
        label4:function(info){
            this[info.type]=info.val;
        },
        label5:function(info){
            this[info.type]=info.val;
            
        },
        label6:function(info){
            this[info.type]=info.val;
        },
        label7:function(info){
            this[info.type]=info.val;
        }
    }
}
</script>
<style scoped>
.Corn{
    border:1px solid #ddd;
    border-radius:5px;
}
.result{
    border:1px solid #999;
    border-radius:5px;
    margin:50px 10px 10px;
    position:relative;
    padding-bottom:10px;
 
  
}
.result .title{
    position:absolute;
    font-size:14px;
    padding:0 8px;
    background:#fff;
    top:-20px;
    left:20px;
}
.resList .el-col{
     padding:0 5px;
     position:relative;

}
.cms{
    position:absolute;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background:#fff;
    opacity:0;
}
.example{
    margin-left:30px;
}
.example div{
    font-size:12px;
    color:#999;
    line-height:20px;
}
</style>

