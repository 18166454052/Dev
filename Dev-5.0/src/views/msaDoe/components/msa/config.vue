<template>
    <div class="spc-header  stats_top ">
            <el-row>
              <!-- <el-col :span="3">
                    <ul >
                        <li class="spc-bg">&nbsp;</li>
                        <li>&nbsp;</li>
                        <li class="spc-bg">小数位数</li>
                        <li>&nbsp;{{configData.decimalDigits}}</li>
                    </ul>
                </el-col> -->
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
                        <li>&nbsp;{{configData.usl }}</li>
                        <li>&nbsp;{{configData.target_value}}</li>
                        <li>&nbsp;{{configData.lsl }}</li>
                    </ul>
                </el-col>
                <el-col :span="4">
                    <ul>
                        <li>样本总数</li>
                           <li>&nbsp;{{personLen*partLen*rowLen}}</li>
                        <li class="spc-bg">人数/零件数/测试次数</li>
                        <li>&nbsp;{{personLen +' / '+partLen+' / '+ rowLen/personLen}}</li>
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
                        <li>X图</li>
                        <li>&nbsp;{{msaStat.ucl_x }}</li>
                        <li>&nbsp;{{msaStat.xPart}}</li>
                        <li>&nbsp;{{msaStat.lcl_x }}</li>
                    </ul>
                </el-col>
                <el-col :span="4">
                    <ul>
                        <li>R图</li>
                        <li>&nbsp;{{msaStat.ucl_r}}</li>
                        <li>&nbsp;{{msaStat.rPart }}</li>
                        <li>&nbsp;{{msaStat.lcl_r }}</li>
                    </ul>
                </el-col>
                
            </el-row>
        </div>
</template>
<script>
export default {
    props:["msaStat","configData","personLen","partLen","rowLen"],
    data(){
        return {
           
        }
    }
}
</script>

