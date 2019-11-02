<template>
     <div class="stats_top" style="border-right:1px solid rgb(159,159,159);
                              border-bottom:1px solid rgb(159,159,159)">
                    <div>
                        <p class="spcDetail">合计</p>
                        <el-row>
                            <el-col :span="12">
                                <ul>
                                     <li  class="spc-bg-content">零件X均值</li>
                                     <li  class="spc-bg-content">零件R均值</li>
                                     <li  class="spc-bg-content">人员极差均值</li>
                                     <li  class="spc-bg-content">人员均值极差</li>
                                </ul>
                            </el-col>
                            <el-col :span="12">
                                <ul >
                                    <li>&nbsp;{{msaStat.xPart }}</li>
                                    <li>&nbsp;{{msaStat.rPart}}</li>
                                     <li>&nbsp;{{msaStat.xDiff}}</li>
                                    <li>&nbsp;{{msaStat.r}}</li>
                                </ul>
                            </el-col> 
                        </el-row>
                    </div>
                    <div>
                        <p class="spcDetail">量具评估</p>
                        <el-row>
                            <el-col :span="6">
                                <ul>
                                     <li class="spc-bg">来源</li>
                                    <li  class="spc-bg-content">重复性</li>
                                    <li  class="spc-bg-content">再现性</li>
                                    <li  class="spc-bg-content">合计量具R&R</li>
                                    <li  class="spc-bg-content">部件间</li>
                                     <li  class="spc-bg-content">合计变异</li>
                                </ul>
                            </el-col>
                            <el-col :span="6">
                                <ul>
                                    <li class="spc-bg">方差贡献率</li>
                                    <li>&nbsp;{{msaStat.pev }}%</li>
                                   <li>&nbsp;{{msaStat.pav}}%</li>
                                    <li>&nbsp;{{msaStat.prr }}%</li>
                                    <li>&nbsp;{{msaStat.ppv}}%</li>
                                     <li>&nbsp;100%</li>
                                   
                                </ul>
                            </el-col> 
                            <el-col :span="6">
                                <ul>
                                   <li class="spc-bg">研究变异</li>
                                    <li>&nbsp;{{msaStat.psvEV}}%</li>
                                   <li>&nbsp;{{msaStat.psvAV  }}%</li>
                                    <li>&nbsp;{{msaStat.psvRR}}%</li>
                                    <li>&nbsp;{{msaStat.psvPV }}%</li>
                                    <li>&nbsp;100%</li>
                                </ul>
                            </el-col> 
                            <el-col :span="6">
                                <ul>
                                   <li class="spc-bg">公差</li>
                                    <li>&nbsp;{{msaStat.pTEV}}%</li>
                                   <li>&nbsp;{{msaStat.pTAV  }}%</li>
                                    <li>&nbsp;{{msaStat.pTRR }}%</li>
                                    <li>&nbsp;{{msaStat.pTPV }}%</li>
                                    <li>&nbsp;{{msaStat.pTTV }}%</li>
                                </ul>
                            </el-col> 
                        </el-row>
                    </div>
                   <div>
                      <el-row>
                        <el-col :span="24">
                              <ul>
                                 <li>pTRR 公差百分比 {{TRR.TRR[0]}} 测量系统{{TRR.TRR[1]}}</li>
                                 <li >prr 方差贡献率 {{TRR.prr[0]}} 测量系统{{TRR.prr[1]}} </li>
                              </ul>
                        </el-col>
                      </el-row>

                   </div>
                    <div>
                        <el-row>
                            <el-col :span="12">
                                <ul>
                             <li  class="spc-bg-content">有效分辨率</li>
                         </ul>
                            </el-col>
                             <el-col :span="12">
                                 <ul>
                                <li>&nbsp;{{msaStat.ndc }}</li>
                         </ul>
                             </el-col>
                        </el-row>
                         
                    </div>

                  </div>
</template>
<script>
export default {
    props:["msaStat","TRR"],
    data(){
        return {
            
        }
    }
}
</script>

