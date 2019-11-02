<template>
    <div>
         <div class="spc-header stats_top ">
            <el-row>
                <el-col :span="4">
                    <ul>
                        <li class="spc-li-bg">小数位数</li>
                        <li>&nbsp;{{ configData.decimalDigits }}</li>
                    </ul>
                </el-col> 
                <el-col :span="5">
                    <ul >
                        <li class="spc-li-bg" >目标不良率</li>
                        
                        <li>&nbsp;{{ xrStats.target }}</li>
                    </ul>
                </el-col> 
                <el-col :span="5">
                    <ul >
                        <li class="spc-li-bg" >总组数</li>
                        
                        <li>&nbsp;{{ xrStats.numGroup }}</li>
                    </ul>
                </el-col> 
                <el-col :span="5">
                    <ul >
                        <li class="spc-li-bg" >抽样总数</li>
                        
                        <li>&nbsp;{{ xrStats.numTotal }}</li>
                    </ul>
                </el-col> 
                <el-col :span="5">
                    <ul >
                        <li class="spc-li-bg" >不良总数</li>
                        
                        <li>&nbsp;{{ xrStats.numDefective }}</li>
                    </ul>
                </el-col>  
            </el-row>
        </div>
    </div>
</template>
<script>
export default {
    props:["configData","xrStats"],
    data(){
        return {
        }
       
    }
}
</script>

