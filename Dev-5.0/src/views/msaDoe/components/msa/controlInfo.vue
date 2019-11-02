<template>
    <div>
        <el-form  class="small-space Form setting-form FormError" 
        :model="Form" :rules="rule"
         ref="dsForm" size="mini" label-position="right" label-width="80px">
            <el-form-item  v-for="info in controlInfo" :key="info.key" :label="info.label+' :'">
                <el-select v-model="info.value"
                :multiple="info.key=='controlIndex'?false:true"
                collapse-tags
                >
                     <el-option
                      v-for="val in info.valueArr"
                      :key="info.key+'_'+val"
                      :label="val"
                      :value="val"
                     >

                     </el-option>
                </el-select>

            </el-form-item>
            <!-- <el-form-item  label="最近组数 :">
                <el-col :span="10">
                    <el-select 
                            @change="cacheBegin"
                            v-model="Form.viewGroupRangeBegin"
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
                            v-model="Form.viewGroupRangeEnd"
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
                    <el-form-item label="小数位数 :">
                        <el-col :span="24">
                            <el-input v-model="Form.digit" placeholder="1-6的整数"></el-input>
                        </el-col>
                    </el-form-item>
             <el-form-item  label="子组容量 :" prop="measureNumber">
                          <el-col :span="24">
                             
                              <el-input v-model.number="Form.measureNumber" placeholder="请输入2-25之间的数字"></el-input>
                          </el-col>
                    </el-form-item>
            <el-form-item class="m-t">
                <el-col :span="24" class="btnBlock" v-show="show">
                        <el-button @click="analysis" type="primary" size="large">分析</el-button>
                </el-col>
               
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    props:["controlInfo","show",'recentInfo'],
    data(){
        return {
            recentGroupListBegin:[20,50,100],
            recentGroupListEnd:[20,50,100],
            
            Form:{
                // viewGroupRangeBegin:this.recentInfo?this.recentInfo.viewGroupRangeBegin:'',
                // viewGroupRangeEnd:this.recentInfo?this.recentInfo.viewGroupRangeEnd:'',
                digit:this.recentInfo?this.recentInfo.digit:'',
                measureNumber:this.recentInfo?this.recentInfo.measureNumber:'',
            },
            rule:{
               measureNumber:[
                   {type:'number',min:2,max:25,message:'子组容量只能在2-25之间',trigger:"change,blur"}
               ] 
            },
          
            measureNumberList:[],
        }
    },
    methods:{
        analysis:function(){
            let obj={
               analysisParms:{}
            }
            // if(this.Form.viewGroupRangeBegin){
            //     obj.viewGroupRangeBegin=this.Form.viewGroupRangeBegin
            // }
            // if(this.Form.viewGroupRangeEnd){
            //     obj.viewGroupRangeEnd=this.Form.viewGroupRangeEnd
            // }
            if(this.Form.digit){
                obj.digit=this.Form.digit
            }
            if(this.Form.measureNumber){
                obj.measureNumber=this.Form.measureNumber

            }
          if(this.controlInfo.length>0){
              this.controlInfo.forEach(item=>{
                  if(item.key=='controlIndex'){
                       obj.analysisParms[item.key]=item.value[0]
                  }
                  else{
                       obj.analysisParms[item.key]=item.value.join(';')
                  }
                 
              });
          }
          this.$emit('view',obj);
        },
        cacheBegin:function(info){
            if(!this.recentGroupListBegin.includes(info)){
                this.recentGroupListBegin.push(info);
            }
         
        },
        cacheEnd:function(info){
            if(!this.recentGroupListEnd.includes(info)){
                this.recentGroupListEnd.push(info);
            }
         
        }
    }
}
</script>

