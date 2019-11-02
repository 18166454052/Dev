<template>
    <div v-loading="controlLoading">

        <el-form  class="small-space Form setting-form FormError"  ref="dsForm" size="mini" label-position="right" label-width="140px">
                <template v-for=" (info,key,index) in controlInfo"  v-if="Object.keys(info).length>2">
                     <el-form-item  :label="info.comment?info.comment+info.symbol+' :':info.parameter+info.symbol+' :'" 
                     :key="'info'+index"
                     :class="{'required':info.required}"
                     >
                        
                    <el-col :span="24">
                            <el-form  class="small-space Form setting-form FormError"   size="mini" label-position="left">
                                <el-form-item >
                                <el-select 
                                    v-show="info.parameterValueType==1 || info.parameterValueType==4"
                                    v-model="info.parameterValue"
                                    placeholder="请选择参数值"
                                    @change="dataChange();checkSql(info)"
                                    clearable
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
                                    @change="dataChange();checkSql(info)"
                                >
                                </el-date-picker>  

                                <el-input 
                                    v-show="info.parameterValueType==3"
                                    v-model="info.parameterValue"
                                    @input="dataChange"
                                    @blur="checkSql(info)"
                                >
                                </el-input> 
                                 <el-date-picker
                                    v-show="info.parameterValueType==5"
                                    v-model="info.parameterValue"
                                    type="date"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd" 
                                    @change="dataChange();checkSql(info)"
                                >
                                </el-date-picker> 
                            </el-form-item>
                            </el-form>
                        <!-- <el-input v-model="info.parameterValue"></el-input> -->
                            
                        
                    </el-col>
                    </el-form-item>
                    </template>
                    <template v-else>
                        <div v-show="info.start.symbol=='至'" :key="'info1'+index">
                            <el-form-item  :label="key +' :'" :key="key"  :class="{'required':info.start.required || info.off.required}">
                                <el-col :span="10">
                                <el-select 
                                        v-show="info.start.parameterValueType==1 || info.start.parameterValueType==4"
                                        v-model="info.start.parameterValue"
                                       
                                        allow-create
                                        placeholder="请选择参数值"
                                        @change="dataChange();checkSql(info.start)"
                                        
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
                                    @change="dataChange();checkSql(info.start)"
                                
                                >
                                </el-date-picker>  

                                <el-input 
                                    v-show="info.start.parameterValueType==3" 
                                    v-model="info.start.parameterValue" 
                                    @input="dataChange"
                                    @blur="checkSql(info.start)"
                                >
                                </el-input> 
                                 <el-date-picker
                                    v-show="info.start.parameterValueType==5"
                                    v-model="info.start.parameterValue"
                                    type="date"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd" 
                                    @change="dataChange();checkSql(info.start)"
                                
                                >
                                </el-date-picker>
                                </el-col>
                                <el-col :span="4" class="text-center">至</el-col>
                                <el-col :span="10">
                                    <el-select 
                                        v-show="info.off.parameterValueType==1 || info.off.parameterValueType==4"
                                        v-model="info.off.parameterValue"
                                        placeholder="请输入参数值"
                                        @change="dataChange();checkSql(info.off)"
                                       
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
                                        @change="dataChange();checkSql(info.off)"
                                    >
                                    </el-date-picker>  

                                    <el-input 
                                        v-show="info.off.parameterValueType==3 || info.off.parameterValueType=='' " 
                                        v-model="info.off.parameterValue"
                                        :placeholder="info.off.parameter"
                                        @input="dataChange"
                                        @blur="checkSql(info.off)"
                                         >
                                    </el-input>
                                    <el-date-picker
                                        v-show="info.off.parameterValueType==5"
                                        v-model="info.off.parameterValue"
                                        type="date"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd" 
                                        @change="dataChange();checkSql(info.off)"
                                    >
                                    </el-date-picker>  
                                </el-col>
                            </el-form-item>
                        </div>
                        <div v-if="info.start.symbol!='至'"><!--@b1<b<@b2-->
                            <el-form-item  :label="key +' : '"  :class="{'required':info.start.required || info.off.required}">
                                <el-col :span="9">
                                    <el-select 
                                        v-show="info.start.parameterValueType==1 || info.start.parameterValueType==4"
                                        v-model="info.start.parameterValue"
                                        :placeholder="info.start.parameter"
                                        @change="dataChange();checkSql(info.start)"
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
                                        @change="dataChange();checkSql(info.start)"
                                    >
                                    </el-date-picker>  

                                    <el-input 
                                        v-show="info.start.parameterValueType==3 || info.start.parameterValueType=='' " 
                                        v-model="info.start.parameterValue"
                                        :placeholder="info.start.parameter"
                                         @input="dataChange"
                                         @blur="checkSql(info.start)"
                                         >
                                    </el-input> 
                                      <el-date-picker
                                        v-show="info.start.parameterValueType==5"
                                        v-model="info.start.parameterValue"
                                        type="date"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd" 
                                        @change="dataChange();checkSql(info.start)"
                                    >
                                    </el-date-picker>  
                                </el-col>
                                <el-col :span="2" class="text-center">{{info.start.symbol.indexOf("=")>=0 ? '=<':'<'}} </el-col>
                                <el-col :span="2" class="text-center"> {{key}} </el-col>
                                <el-col :span="2" class="text-center"> {{info.off.symbol.indexOf("=")>=0 ? '=<':'<'}} </el-col>
                                <el-col :span="9">
                                    <el-select 
                                        v-show="info.off.parameterValueType==1 || info.off.parameterValueType==4"
                                        v-model="info.off.parameterValue"
                                        :placeholder="info.off.parameter"
                                         @change="dataChange();checkSql(info.off)"
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
                                        @change="dataChange();checkSql(info.off)"
                                    >
                                    </el-date-picker>  

                                    <el-input 
                                        v-show="info.off.parameterValueType==3 || info.off.parameterValueType=='' " 
                                        v-model="info.off.parameterValue"
                                        :placeholder="info.off.parameter"
                                         @input="dataChange"
                                         @blur="checkSql(info.off)"
                                         >
                                    </el-input>
                                     <el-date-picker
                                        v-show="info.off.parameterValueType==5"
                                        v-model="info.off.parameterValue"
                                        type="date"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd" 
                                        @change="dataChange();checkSql(info.off)"
                                    >
                                    </el-date-picker> 
                                </el-col>
                            </el-form-item>
                        </div>
                    </template>
               
                    <!-- <el-form-item  label="最近组数 :">
                          <el-col :span="10">
                              <el-select 
                                       @change="cacheBegin"
                                        v-model="viewGroupRangeBegin"
                                        filterable
                                        allow-create
                                        collapse-tags
  
                                        placeholder="从列表选择/直接输入"
                                    >
                                    <el-option v-for="(val,index) in recentGroupListBegin"
                                    :label="val"
                                    :value="val"
                                    :key="index +'@_'+ val"
                                    >

                                    </el-option>

                                </el-select>
                             
                          </el-col>
                          <el-col :span="4" class="text-center">-</el-col>
                           <el-col :span="10">
                              <el-select 
                                       @change="cacheEnd"
                                        v-model="viewGroupRangeEnd"
                                        filterable
                                        allow-create
                                        collapse-tags
  
                                        placeholder="从列表选择/直接输入"
                                    >
                                    <el-option v-for="(val,index) in recentGroupListEnd"
                                    :label="val"
                                    :value="val"
                                    :key="index +'@_'+ val"
                                    >

                                    </el-option>

                                </el-select>
                            
                          </el-col>
                    </el-form-item> -->
                    <el-form-item label="小数位数= :">
                        <el-form  class="small-space Form setting-form FormError"   size="mini" label-position="left">
                                <el-form-item >
                                    <el-col :span="24">
                            <!-- <el-input v-model="digit" placeholder="1-6的整数"></el-input> -->
                                        <el-select v-model="digit"
                                          @change="dataChange"
                                        >
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
                        <!-- <el-col :span="24">
                            <el-input v-model="digit" placeholder="1-6的整数"
                             @input="dataChange"
                            ></el-input>
                        </el-col> -->
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
import { dsControlSqlValue } from '@/api/dataSource'
export default {
    props:["controlInfo","show",'recentInfo',"change","hasParameterForSql","controlLoading"],
    data(){
        return {
           
           //controlInfo:this.controlInfo,
            recentGroupListBegin:[20,50,100],
            recentGroupListEnd:[20,50,100],
            // viewGroupRangeBegin:this.recentInfo?this.recentInfo.viewGroupRangeBegin:'',
            // viewGroupRangeEnd:this.recentInfo?this.recentInfo.viewGroupRangeEnd:'',
            digit:this.recent?this.recent.digit:4,
            sqlParamter:{}
        }
    },
    methods:{
        submit:function(){
         let obj=this.getInfo();
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
        dataChange:function(){
            console.log('--------------');
            if(this.change){
                let obj=this.getInfo();
                this.$emit('change',obj);
            }
        },
        getInfo:function(){
            let obj={
                analysisParms:{}
            };
           
            if(this.digit){
                obj.digit=this.digit
            }
            if(Object.keys(this.controlInfo).length>0){
               for(let k in this.controlInfo){
                    //obj.analysisParms[k]={};
                    let info=this.controlInfo[k];
                    let index=k;
                    if(Object.keys(info).length>0){
                        
                            
                            if(Object.keys(info).length>2){
                                obj.analysisParms[info.parameter]=info.parameterValue;
                            }
                            else{
                                obj.analysisParms[info.start.parameter]=info.start.parameterValue;
                                obj.analysisParms[info.off.parameter]=info.off.parameterValue;
                            }
                        
                    }
                }
            }
            return obj;
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
    computed:{
        recent:function(){
            return this.recentInfo;
        }
    }
}
</script>
<style>
.processTitle{
    font-size:14px;
    font-weight:bold;
    padding-left:20px;
}
</style>

