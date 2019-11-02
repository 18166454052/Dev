<template>
    <ul>
            <li>
                <el-radio v-model="second.radio" label="1" @change="checkRadio">&nbsp;</el-radio>
                <div class="inline">{{typeMap[TYPE]}} 允许的通配符
                    <span v-show="TYPE!='d' && TYPE!='w'">[, - * /]</span>
                    <span v-show="TYPE=='d'">[, - * / L W]</span> 
                    <span  v-show="TYPE=='w'">[, - * / L #]</span>
                    <span v-show="type=='y'">非必填</span></div>
            </li>
            <li v-show="TYPE=='y'">
                <el-radio v-model="second.radio" label="5"  @change="checkRadio">&nbsp;</el-radio>
                <div class="inline">每年
                    
                </div>
            </li>
            <li v-show="TYPE=='d' || TYPE=='m' ||  TYPE=='w'">
                <el-radio v-model="second.radio" label="5"  @change="checkRadio">&nbsp;</el-radio>
                <div class="inline">不指定
                    
                </div>
            </li>
            <li>
                <el-radio v-model="second.radio" label="2"  @change="checkRadio">&nbsp;</el-radio>
                <div class="inline">周期从<span v-show="TYPE=='w'">星期</span>
                    <div ><el-input  type="number" min="1" v-model="second.from" size="mini" @input="fromTo"></el-input> </div> -
                    <div><el-input  type="number" min="2" v-model="second.to" size="mini" @input="fromTo"></el-input> </div> <span v-show="TYPE!='w' && TYPE!='y'">{{typeMap[TYPE]}}</span>
                </div>
            </li>

            <li v-show="TYPE!='w' && type!='y'">
                <el-radio v-model="second.radio" label="3"  @change="checkRadio">&nbsp;</el-radio>
                <div class="inline">从
                    <div><el-input  type="number" :min="(type=='d'|| type=='m')?1:0" v-model="second.start" size="mini"  @input="start"></el-input></div> {{TYPE=='m'?'日':typeMap[TYPE]}}开始,每
                    <div><el-input  type="number" min="1" v-model="second.circle" size="mini" @input="start" ></el-input > </div> {{typeMap[TYPE]}}执行一次
                </div>
            </li>
            <li v-show="TYPE=='w'">
                <el-radio v-model="second.radio" label="3"  @change="checkRadio">&nbsp;</el-radio>
                <div class="inline">第
                    <div><el-input  type="number" min="1" v-model="second.start" size="mini"></el-input></div> 周的星期
                    <div><el-input  type="number" min="1" v-model="second.circle" size="mini"></el-input> </div>
                </div>
            </li>
            <li v-show="TYPE=='w'">
                <el-radio v-model="second.radio" label="6"  @change="checkRadio">&nbsp;</el-radio>
                <div class="inline">本月最后一个星期
                     <div ><el-input  type="number" min="1" v-model="second.lastWeekend" size="mini"
                     @input="last"
                     ></el-input> </div>
                </div>
            </li>
            <li v-show="TYPE=='d'">
                <el-radio v-model="second.radio" label="7"  @change="checkRadio">&nbsp;</el-radio>
                <div class="inline">每月
                     <div ><el-input  type="number" min="1" v-model="second.latest" size="mini"
                     @input="latest"
                     ></el-input> </div> 号最近的那个工作日
                </div>
            </li>
            <li v-show="TYPE=='d'">
                <el-radio v-model="second.radio" label="6"  @change="checkRadio">&nbsp;</el-radio>
                <div class="inline">本月最后一天
                    
                </div>
            </li>
            <li v-show="TYPE!='y'">
                <el-radio v-model="second.radio" label="4"  @change="checkRadio">&nbsp;</el-radio>
                <div class="inline">指定</div>
                <div class="setUnit" v-show="TYPE!='h' && TYPE!='d' && TYPE!='m' && TYPE!='w' ">
                      <span v-for="(unit,index) in second.unit" :key="unit+'second'">
                           <el-checkbox  v-model="second.checked[index]" :label="index>=10?index:'0'+index"
                               @change="checkbox"
                               ></el-checkbox> 
                      </span>
                </div>
                <div  class="setUnit" v-show="TYPE=='h'">
                       <span class="timeTitle">AM: </span> <span v-for="(unit,index) in 12" :key="unit+'hour'">
                           <el-checkbox   @change="checkbox"  v-model="second.checked[index]" :label="index>=10?index:'0'+index"></el-checkbox> 
                      </span><br/>
                      <span  class="timeTitle" >PM: </span> <span v-for="(unit,index) in [12,13,14,15,16,17,18,19,20,21,22,23]" :key="unit+'second'">
                           <el-checkbox   @change="checkbox"  v-model="second.checked[unit]" :label="unit"></el-checkbox> 
                      </span>
                </div>
                <div class="setUnit" v-show="TYPE=='d' || TYPE=='m' ||  TYPE=='w'">
                      <span v-for="(unit,index) in second.unit" :key="unit+'date'">
                           <el-checkbox   @change="checkbox"  v-model="second.checked[index]" :label="unit"></el-checkbox> 
                      </span>
                </div>
                 
            </li>
            
        </ul>
</template>
<script>
export default {
    props:["count","type"],
    data(){
        return {
            TYPE:this.type,
            second:{
                radio:'',
                from:this.type=='h'?0:this.type=='y'?2018:1,
                to:this.type=='y'?2019:'2',
                start:(this.type=='d'|| this.type=='m'||  this.type=='w')?1:0,
                circle:'1',
                unit:this.count,
                checked:[],
                latest:'1',
                lastWeekend:'1',
            },
            typeMap:{
                s:'秒',
                M:'分钟',
                h:'小时',
                d:'日',
                m:'月',
                w:'周',
                y:'不指定'
            }
        }
    },
    methods:{
        checkRadio:function(label){
            if(label==1){
                //
                this.$emit("label1",{type:this.TYPE});
            }
            else if(label==2){
                this.$emit("label2",{type:this.TYPE,val:this.second.from+'-'+this.second.to});
            }
            else if(label==3){
                let val='';
                if(this.TYPE=='w'){
                    val=this.second.start+'#'+this.second.circle
                }
                else{
                      val=this.second.start+'-'+this.second.circle
                }
                this.$emit("label3",{type:this.TYPE,val:val});
            }
            else if(label==4){
                let arr=[];
                this.second.checked.forEach((checkbox,index)=>{
                    if(checkbox){
                        arr.push(index);
                    }
                });
                this.$emit("label4",{type:this.TYPE,val:arr.length>0?arr.join(','):'?'});
            }
            else if(label==5){  // 
                let val=''
                if(this.TYPE=='y'){
                    val='*'
                }
                else{
                    val="?"
                }
                this.$emit("label5",{type:this.TYPE,val:val});
            }
            else if(label==6){
               let val="";
                if(this.TYPE=='d'){
                   val='L'
                }
                else{
                    val=this.second.lastWeekend+'L';
                }
                this.$emit("label6",{type:this.TYPE,val:val});
            }
            else if(label==7){
                this.$emit("label7",{type:this.TYPE,val:this.second.latest+'W'});
            }
        },
        fromTo:function(){
            if(this.second.radio==2){
                this.$emit("label2",{type:this.TYPE,val:this.second.from+'-'+this.second.to});
            }
             
        },
        start:function(){
            if(this.second.radio==3){
                this.$emit("label3",{type:this.TYPE,val:this.second.start+'-'+this.second.circle});
            }
             
        },
        checkbox:function(){
            if(this.second.radio==4){
                let arr=[];
                this.second.checked.forEach((checkbox,index)=>{
                    if(checkbox){
                        arr.push(index);
                    }
                });
                this.$emit("label4",{type:this.TYPE,val:arr.length>0?arr.join(','):'?'}); 
            }
           
        },
        last:function(){
            if(this.second.radio==6){
                 this.$emit("label6",{type:this.TYPE,val:this.second.lastWeekend+'L'});
            }
           
        },
        latest:function(){
            if(this.second.radio==7){
                 this.$emit("label7",{type:this.TYPE,val:this.second.latest+'W'});
            }
           
        }
    },
    beforeDestroy:function(){
        this.$off();
    }
}
</script>
<style scoped>
ul{
    padding-left:20px;
}
 div.inline{
    display:inline-block;
    margin-left:0px;
    margin-right:0px;
    
}
div.inline div{
    display:inline-block;
}
.inline{
    color: #333;
    font-size: 12px;
    border-top:none;
}

.setUnit{
    margin-left:30px;
    position:relative;
    top:-5px;
}
.setUnit .el-checkbox{
    height:15px;
}
.setUnit .el-checkbox__label{
    padding-left:0px;
}
.timeTitle{
  color:#666;
  margin-right:5px;
}
</style>


