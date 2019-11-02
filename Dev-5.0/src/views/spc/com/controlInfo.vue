<template>
    <div v-loading="controlLoading">

        <el-form  class="small-space Form setting-form FormError"  ref="dsForm"  size="mini" label-position="right" label-width="140px">

           
                    <template  v-for="(info,k) in controlInfo"  v-if="Object.keys(info).length>2">
                     <el-form-item  :label="info.comment?info.comment+info.symbol+' :':info.parameter+info.symbol+' :'" :key="k"  :class="{'required':info.required}"> 
                        <el-col :span="24">
                             <el-form  class="small-space Form setting-form FormError"   size="mini" label-position="left">
                                 <el-form-item>
                                    <el-select 
                                        v-show="info.parameterValueType==1 || info.parameterValueType==4"
                                        v-model="info.parameterValue"
                                        placeholder="请选择参数值"
                                        @change="checkSql(info)"
                                        >
                                        <el-option v-for="(val,index) in info.parameterValueArr"
                                        :key="val+'@'+index"
                                        :label="val"
                                        :value="val"
                                        
                                        >
                                        </el-option>

                                </el-select>

                                <el-date-picker
                                    v-show="info.parameterValueType==2"
                                    v-model="info.parameterValue"
                                    type="datetime"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss" 
                                    @change="checkSql(info)"
                                
                                >
                                </el-date-picker>  

                                <el-input 
                                    v-show="info.parameterValueType==3"
                                    v-model="info.parameterValue"
                                    @blur="checkSql(info)"
                                    >
                                </el-input> 
                                <el-date-picker
                                    v-show="info.parameterValueType==5"
                                    v-model="info.parameterValue"
                                    type="date"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    @change="checkSql(info)"
                                
                                >
                                </el-date-picker> 
                             </el-form-item>
                             </el-form>
                           <!-- <el-input v-model="info.parameterValue"></el-input> -->
                               
                           
                        </el-col>
                     </el-form-item>
                    </template>
                    <template v-else>
                        <div v-show="info.start.symbol=='至'">
                            <el-form-item  :label="k +' :'" :key="k" :class="{'required':info.start.required || info.end.required}">
                                <el-col :span="10">
                                <el-select 
                                        v-show="info.start.parameterValueType==1 || info.start.parameterValueType==4"
                                        v-model="info.start.parameterValue"
                                       
                                        allow-create
                                        placeholder="请选择参数值"
                                        @change="checkSql(info.start)"
                                        >
                                        <el-option v-for="(val,index) in info.start.parameterValueArr"
                                        :label="val"
                                        :value="val"
                                        :key="index +'@1_'+ val"
                                        >

                                        </el-option>

                                </el-select>

                                <el-date-picker
                                    v-show="info.start.parameterValueType==2"
                                    v-model="info.start.parameterValue"
                                    type="datetime"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    @change="checkSql(info.start)"
                                
                                >
                                </el-date-picker>  

                                <el-input 
                                    v-show="info.start.parameterValueType==3" 
                                    v-model="info.start.parameterValue" 
                                    @blur="checkSql(info.start)"
                                    >
                                </el-input>
                                 <el-date-picker
                                    v-show="info.start.parameterValueType==5"
                                    v-model="info.start.parameterValue"
                                    type="date"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    @change="checkSql(info.start)"
                                
                                > 
                                 </el-date-picker>
                                </el-col>
                                <el-col :span="4" class="text-center">至</el-col>
                                <el-col :span="10">
                                    <el-select 
                                        v-show="info.off.parameterValueType==1 || info.off.parameterValueType==4"
                                        v-model="info.off.parameterValue"
                                        
                                        placeholder="请输入参数值"
                                        @change="checkSql(info.off)"
                                        >
                                        <el-option v-for="(val,index) in info.off.parameterValueArr"
                                        :label="val"
                                        :value="val"
                                        :key="index +'@2_'+ val"
                                        >

                                        </el-option>

                                    </el-select>

                                    <el-date-picker
                                        v-show="info.off.parameterValueType==2"
                                        v-model="info.off.parameterValue"
                                        type="datetime"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        @change="checkSql(info.off)"
                                    >
                                    </el-date-picker>  

                                    <el-input 
                                        v-show="info.off.parameterValueType==3 || info.off.parameterValueType=='' " 
                                        v-model="info.off.parameterValue" 
                                        @blur="checkSql(info.off)"
                                        >
                                    </el-input>
                                     <el-date-picker
                                        v-show="info.off.parameterValueType==5"
                                        v-model="info.off.parameterValue"
                                        type="date"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        @change="checkSql(info.off)"
                                    >
                                    </el-date-picker>  
                                </el-col>
                            </el-form-item>
                        </div>
                        <div v-if="info.start.symbol!='至'">
                            <el-form-item :label="k+ ' : '" :class="{'required':info.start.required || info.end.required}">
                              
                               
                                <el-col :span="9"> 
                                
                                    <el-select 
                                        v-show="info.start.parameterValueType==1 ||  info.start.parameterValueType==4"
                                        v-model="info.start.parameterValue"
                                        
                                        :placeholder="info.start.parameter"
                                        @blur="checkSql(info.start)"
                                        >
                                        <el-option v-for="(val,index) in info.start.parameterValueArr"
                                        :label="val"
                                        :value="val"
                                        :key="index +'@start_'+ val"
                                        >

                                        </el-option>

                                    </el-select>

                                    <el-date-picker
                                        v-show="info.start.parameterValueType==2"
                                        v-model="info.start.parameterValue"
                                        type="datetime"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        @change="checkSql(info.start)"
                                    
                                    >
                                    </el-date-picker>  

                                    <el-input 
                                        v-show="info.start.parameterValueType==3 || info.start.parameterValueType=='' " 
                                        v-model="info.start.parameterValue" 
                                        :placeholder="info.start.parameter"
                                        @blur="checkSql(info.start)"
                                        >
                                    </el-input> 
                                    <el-date-picker
                                        v-show="info.start.parameterValueType==5"
                                        v-model="info.start.parameterValue"
                                        type="date"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        @change="checkSql(info.start)"
                                    
                                    >
                                    </el-date-picker>
                                </el-col> 
                                <el-col :span="2" class="text-center">{{info.start.symbol.indexOf("=")>=0 ? '=<':'<'}} </el-col>
                                <el-col :span="2" class="text-center"> {{k}} </el-col>
                                <el-col :span="2" class="text-center"> {{info.off.symbol.indexOf("=")>=0 ? '=<':'<'}} </el-col>
                                <el-col :span="9">
                                    <el-select 
                                        v-show="info.off.parameterValueType==1 || info.off.parameterValueType==4"
                                        v-model="info.off.parameterValue"
                                        
                                        :placeholder="info.off.parameter"
                                        @change="checkSql(info.off)"
                                        >
                                        <el-option v-for="(val,index) in info.off.parameterValueArr"
                                        :label="val"
                                        :value="val"
                                        :key="index +'@3_'+ val"
                                        >

                                        </el-option>

                                    </el-select>

                                    <el-date-picker
                                        v-show="info.off.parameterValueType==2"
                                        v-model="info.off.parameterValue"
                                        type="datetime"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        @change="checkSql(info.off)"
                                    >
                                    </el-date-picker>  

                                    <el-input 
                                        v-show="info.off.parameterValueType==3 || info.off.parameterValueType=='' " 
                                        v-model="info.off.parameterValue"
                                        :placeholder="info.off.parameter"
                                        @blur="checkSql(info.off)"
                                         >
                                    </el-input> 
                                     <el-date-picker
                                        v-show="info.off.parameterValueType==5"
                                        v-model="info.off.parameterValue"
                                        type="date"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        @change="checkSql(info.off)"
                                    >
                                    </el-date-picker>  
                                </el-col>
                            </el-form-item>
                        </div>
                    </template>
                    <el-form-item label="小数位数= :">
                         <el-form  class="small-space Form setting-form FormError"   size="mini" label-position="left">
                                <el-form-item >
                                    <el-col :span="24">
                           
                                        <el-select v-model="digit">
                                            <el-option
                                                v-for="digit in [4,5,6,7,8]"
                                                :key="'digit'+digit"
                                                :label="digit"
                                                :value="digit"
                                            ></el-option>
                                        </el-select>
                                    </el-col>
                                 </el-form-item>
                         </el-form>
                        
                    </el-form-item>
                    <el-form-item v-show="show">
                        <el-col class="btnBlock">
                            <el-button size="large" type="primary" @click="submit">分析</el-button>
                        </el-col>
                         
                    </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {dsControlSqlValue} from '@/api/dataSource'
export default {
    props:["controlInfo","show",'recentInfo',"hasParameterForSql","controlLoading"],
    data(){
        return {
           
           //controlInfo:this.controlInfo,
            recentGroupListBegin:[20,50,100],
            recentGroupListEnd:[20,50,100],
            // viewGroupRangeBegin:this.recentInfo?this.recentInfo.viewGroupRangeBegin:'',
            // viewGroupRangeEnd:this.recentInfo?this.recentInfo.viewGroupRangeEnd:'',
            digit:this.recentInfo?this.recentInfo.digit:4,
            sqlParamter:{

            },
            //loading:this.controlLoading
    
            
            
        }
    },
    methods:{
        submit:function(){
            // 参数 判断
            if(Object.keys(this.controlInfo).length>0){
                for(let key in this.controlInfo){
                    let info=this.controlInfo[key];
                    if(Object.keys(info).length>2){  //    
                       if(info.required && !info.parameterValue){
                            let label=info.comment?info.comment:info.parameter;
                            this.$message.warning(label+'是必填项');
                            return false;
                       }
                    }
                    else{
                        if(info.start.required && !info.start.parameterValue){
                            let label=info.start.comment?info.start.comment:info.start.parameter;
                            this.$message.warning(label+'开始范围是必填项');
                            return false;
                        }
                        if(info.off.required && !info.off.parameterValue){
                            let label=info.off.comment?info.off.comment:info.off.parameter;
                            this.$message.warning(label+'结束范围是必填项');
                            return false;
                        }
                        //obj.analysisParms[this.controlInfo[key].start.parameter]=this.controlInfo[key].start.parameterValue;
                        //obj.analysisParms[this.controlInfo[key].off.parameter]=this.controlInfo[key].off.parameterValue;
                    }
                }
            }




            //
            let obj={
                analysisParms:{}
            };
            // if(this.viewGroupRangeBegin){
            //     obj.viewGroupRangeBegin=this.viewGroupRangeBegin
            // }
            // if(this.viewGroupRangeEnd){
            //     obj.viewGroupRangeEnd=this.viewGroupRangeEnd
            // }
            if(this.digit){
                obj.digit=this.digit
            }
            if(Object.keys(this.controlInfo).length>0){
                for(let key in this.controlInfo){
                    
                    if(Object.keys(this.controlInfo[key]).length>2){
                        obj.analysisParms[this.controlInfo[key].parameter]=this.controlInfo[key].parameterValue;
                    }
                    else{
                        obj.analysisParms[this.controlInfo[key].start.parameter]=this.controlInfo[key].start.parameterValue;
                        obj.analysisParms[this.controlInfo[key].off.parameter]=this.controlInfo[key].off.parameterValue;
                    }
                }
               
            }
            this.$emit("view",obj);
        },
        cacheBegin:function(info){
            console.log(info);
            if(!this.recentGroupListBegin.includes(info)){
                this.recentGroupListBegin.push(info);
            }
         
        },
        cacheEnd:function(info){
            console.log(info);
            if(!this.recentGroupListEnd.includes(info)){
                this.recentGroupListEnd.push(info);
            }
         
        },
        checkSql:function(info){
            //1 判断是不是被依赖的参数
            if(Object.keys(this.hasParameterForSql).length>0){
                for(let key in this.hasParameterForSql){
                    let item=this.hasParameterForSql[key];
                
                    if(item.source.includes(info.parameter)){
                        this.sqlParamter[info.parameter]=info.parameterValue;
                        let res=item.source.every(par=>this.sqlParamter[par]);
                        if(res){// 所有参数都已经选择
                          // 调用api  查询数据
                          // console.log("全部选中");
                          let sql=item.target.sql+"";
                          item.source.forEach(item=>{
                              sql=sql.replace(item,`'${this.sqlParamter[item]}'`)
                          });
                           this.$emit('Loading',true);
                           dsControlSqlValue({
                                configDataanalysisId:info.configDataanalysisId,
                                querySql:sql,
                            }).then(res=>{
                              this.$emit('Loading',false);
                                if(res.code==200){
                                    console.log('------------------------');
                                    console.log(res.data);
                                    //this.controlInfo[key].parameterValueArr=res.data;
                                    this.$emit("changevalue",{key:item.target.sectionValue,data:res.data});
                               }
                               else{
                                    this.$message.error(res.message);
                               }
                           });
                          
                        }


                       
                    }
                }
            }

            //2  判断是不是所有依赖的参数中最后一个被赋值的
        }
    },
    // computed:{
    //     loading:{
    //         get:function(){
    //             return this.controlLoading;
    //         },
    //         set:function(bool){
    //             this.controlLoading=bool;
    //         }
            
    //     }
    // }
    
  
    
}
</script>

