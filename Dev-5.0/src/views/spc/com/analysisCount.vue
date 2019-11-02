<template>
     <div class="stats_top" style="border-right:1px solid rgb(159,159,159);
                              border-bottom:1px solid rgb(159,159,159)">
                    <!-- <div>
                        <p>合计</p>
                        <el-row>
                            <el-col :span="8">
                                <ul>
                                    <li>∑X=</li>
                                    <li>∑R=</li>
                                </ul>
                            </el-col>
                            <el-col :span="16">
                                <ul class="noBorder">
                                    <li>&nbsp;</li>
                                    <li>&nbsp;</li>
                                </ul>
                            </el-col> 
                        </el-row>
                    </div> -->
                    <div>
                        <p class="spcDetail">平均</p>
                        <el-row>
                           <el-col :span="12">
                                <ul>
                                    <li  class="spc-bg-content">每组平均抽样数</li>
                                    <li  class="spc-bg-content">每组平均不良率</li>
                                </ul>
                            </el-col>
                            <el-col :span="12">
                                <ul>
                                    <li>&nbsp;{{xrStats.avgN }}</li>
                                    <li>&nbsp;{{xrStats.avgP }}</li>
                                   
                                </ul>
                            </el-col> 
                        </el-row>
                    </div>
                    <div v-show="(TYPE=='p' ||TYPE=='np' )"> 
                        <el-row   >
                          <el-col :span="12">
                              <p class="spcDetail spc-bg" >&nbsp;</p>
                          </el-col>
                          <el-col :span="6">
                              <p class="spcDetail spc-bg">期望下限</p>
                          </el-col>
                          <el-col :span="6">
                             <p class="spcDetail spc-bg">期望上限</p>
                          </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <ul>
                                    <li  class="spc-bg-content">不良率(%)</li>
                                    <li  class="spc-bg-content">百万件不良率</li>
                                    <li  class="spc-bg-content">zBench</li>
                                </ul>
                            </el-col>
                            <el-col :span="6">
                                <ul>
                                    <li>&nbsp;{{xrStats.percentDefective}}</li>
                                    <li>&nbsp;{{xrStats.dpmo  }}</li>
                                    <li>&nbsp;{{xrStats.zBench }}</li>
                                   
                                </ul>
                            </el-col> 
                            <el-col :span="6">
                                <ul>
                                    <li>&nbsp;{{xrStats.defectiveLower}}</li>
                                    <li>&nbsp;{{xrStats.dpmoLower }}</li>
                                    <li>&nbsp;{{xrStats.zBenchLower }}</li>
                                </ul>
                            </el-col>
                            <el-col :span="6">
                                <ul>
                                    <li>&nbsp;{{xrStats.defectiveUpper }}</li>
                                    <li>&nbsp;{{xrStats.dpmoUpper }}</li>
                                    <li>&nbsp;{{xrStats.zBenchUpper }}</li>
                                   
                                </ul>
                            </el-col> 
                        </el-row>
                       
                    </div>
                    <div v-show="(TYPE=='c' ||TYPE=='u' )"> 
                        <el-row   >
                          <el-col :span="12">
                              <p class="spcDetail spc-bg">&nbsp;</p>
                          </el-col>
                          <el-col :span="6">
                              <p class="spcDetail spc-bg">期望下限</p>
                          </el-col>
                          <el-col :span="6">
                             <p class="spcDetail spc-bg">期望上限</p>
                          </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <ul>
                                    <li  class="spc-bg-content">DPU</li>
                                    <li  class="spc-bg-content">zBench</li>
                                </ul>
                            </el-col>
                            <el-col :span="6">
                                <ul>
                                    <li>&nbsp;{{xrStats.dpu }}</li>
                                    <li>&nbsp;{{xrStats.zBench  }}</li>
                                   
                                </ul>
                            </el-col> 
                            <el-col :span="6">
                                <ul>
                                    <li>&nbsp;{{xrStats.dpuLower }}</li>
                                    <li>&nbsp;{{xrStats.zBenchLower }}</li>
                                </ul>
                            </el-col>
                            <el-col :span="6">
                                <ul>
                                    <li>&nbsp;{{xrStats.dpuUpper }}</li>
                                    <li>&nbsp;{{xrStats.zBenchUpper}}</li>
                                   
                                </ul>
                            </el-col> 
                        </el-row>
                    </div>
                    <el-row>
                            <el-col :span="12">
                                 <ul>
                                    <li  class="spc-bg-content">西格玛水平</li>
                                </ul>
                            </el-col>
                             <el-col :span="12">
                                  <ul>
                                    <li >&nbsp;{{xrStats.sigmaLevel}}</li>
                                </ul>
                             </el-col>
                        </el-row>
                  </div>
</template>
<script>
export default {
    props:["xrStats","configData","TYPE"],
    data(){
        return {
        }
    }
}
</script>

