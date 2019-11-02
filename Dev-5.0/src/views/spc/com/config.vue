<template>
    <div>

      <div class="spc-header stats_top">
            
            <el-row > 
                <el-col :span="4">
                    <ul >
                        <li>抽样方法</li>
                       
                    </ul>
                </el-col>
                <el-col :span="8">
                    <ul class="no-bg">
                        <li>&nbsp;{{XR[0]}}-{{XR[1]}}</li>
                       
                    </ul>
                </el-col>
                <!-- <el-col :span="4">
                    <ul >
                        <li>xxx</li>
                       
                    </ul>
                </el-col>
                <el-col :span="4">
                    <ul class="no-bg">
                        <li>xxxx</li>
                       
                    </ul>
                </el-col> -->
                <el-col :span="4">
                    <ul >
                        <li>小数位数</li>
                       
                    </ul>
                </el-col>
                <el-col :span="8">
                    <ul class="no-bg">
                        <li>&nbsp;{{configData.decimalDigits}}</li>
                       
                    </ul>
                </el-col>
                <el-col :span="4">
                    <ul  class="spc-li-bg">
                        <li>规格</li>
                        <li>上限USL</li>
                        <li>中心 CL</li>
                        <li>下限LSL</li>
                    </ul>
                </el-col>
                <el-col :span="4">
                    <ul>
                        <li>标准</li>
                        <li>&nbsp;{{ configData.usl }}</li>
                        <li>&nbsp;{{ configData.targetValue }}</li>
                        <li>&nbsp;{{ configData.lsl }}</li>
                    </ul>
                </el-col>
                <el-col :span="4">
                    <ul>
                        <li>子组容量</li>
                      
                            <li>&nbsp;{{configData.groupNum}}</li>
                          <!-- <el-input  type="munber" min="0" v-model="newGroupNum" :disabled="editGroupNum"> 
                             <el-button type="info" slot="append"  size='mini' :loading="loading" @click="changeGroupNum">{{editGroupNum?'编辑':'修改'}}</el-button>
                          </el-input> -->
                        
                        <li class="spc-bg">总组数</li>
                        <li>&nbsp;{{variableStats.numGroup}}</li>
                    </ul>
                </el-col>
                <el-col :span="4">
                    <ul  class="spc-li-bg">
                        <li>管制</li>
                        <li>上限UCL</li>
                        <li>中心 CL</li>
                        <li>下限LCL</li>
                    </ul>
                </el-col>
                <el-col :span="4">
                    <ul>
                        <li>{{XR[0]}}图</li>
                        <li>&nbsp;{{variableStats.ucl_first }}</li>
                        <li>&nbsp;{{variableStats.averageFirst }}</li>
                        <li>&nbsp;{{variableStats.lcl_first}}</li>
                    </ul>
                </el-col>
                <el-col :span="4">
                    <ul>
                        <li>{{XR[1]}}图</li>
                        <li>&nbsp;{{variableStats.ucl_second }}</li>
                        <li>&nbsp;{{variableStats.averageSecond }}</li>
                        <li>&nbsp;{{variableStats.lcl_second }}</li>
                    </ul>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
export default {
    props:["variableStats","configData","XR"],
    data(){
        return {
            loading:false,
            newGroupNum:'',
            editGroupNum:false
        }
    },
    methods:{
        changeGroupNum:function(){}
    },
    mounted:function(){
        console.log('this.$props');
        console.log(this.$props);
    }
}
</script>

