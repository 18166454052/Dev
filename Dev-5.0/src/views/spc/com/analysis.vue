<template>
      <div>
            <el-row>
                <el-col :span="24">
                  <div>
                  <div class="stats_top" style="border-right:1px solid rgb(159,159,159);
                              border-bottom:1px solid rgb(159,159,159)">
                    <div>
                        <p class="spcDetail">合计</p>
                        <el-row>
                            <el-col :span="8">
                                <ul>
                                    <li>{{XR[0]}} 平均值 = </li>
                                    <li>{{XR[1]}} 平均值 = </li>
                                </ul>
                            </el-col>
                            <el-col :span="16">
                                <ul class="noBorder">
                                    <li>&nbsp;{{variableStats.averageFirst }}</li>
                                    <li>&nbsp;{{variableStats.averageSecond }}</li>
                                </ul>
                            </el-col> 
                        </el-row>
                    </div>
                    <div>
                        <p class="spcDetail">制程能力分析</p>
                        <!-- <el-row>
                          <el-col :span="12">
                              <p class="spc-bg-content">CA</p>
                          </el-col>
                          <el-col :span="12">
                             <ul>
                                <li>&nbsp;{{variableStats.ca | effectiveDigits(configData.decimalDigits)}}</li>
                              </ul>
                          </el-col>
                        </el-row>   -->
                        <el-row>
                          <el-col :span="12">
                              <p class="spcDetail spc-bg">短期</p>
                          </el-col>
                          <el-col :span="12">
                             <p class="spcDetail spc-bg">长期</p>
                          </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <ul>
                                    <li  class="spc-bg-content">stdDevShort</li>
                                    <li  class="spc-bg-content">CP</li>
                                    <li  class="spc-bg-content">CPK</li>
                                    <li  class="spc-bg-content">CPM</li>
                                    <li  class="spc-bg-content">CPMK</li>
                                    <li  class="spc-bg-content">dpmoShort</li>
                                    <li  class="spc-bg-content">zBenchShort</li>
                                    <li  class="spc-bg-content">sigmaShort</li>
                                </ul>
                            </el-col>
                            <el-col :span="6">
                                <ul>
                                    <li>&nbsp;{{variableStats.stdDevShort }}</li>
                                    <li>&nbsp;{{variableStats.cp }}</li>
                                    <li>&nbsp;{{variableStats.cpk }}</li>
                                    <li>&nbsp;{{variableStats.cpm }}</li>
                                    <li>&nbsp;{{variableStats.cpmk }}</li>
                                    <li>&nbsp;{{variableStats.dpmoShort }}</li>
                                    <li>&nbsp;{{variableStats.zBenchShort }}</li>
                                    <li>&nbsp;{{variableStats.sigmaShort }}</li>
                                   
                                </ul>
                            </el-col> 
                            <el-col :span="6">
                                <ul>
                                    <li  class="spc-bg-content">stdDevLong</li>
                                    <li  class="spc-bg-content">PP</li>
                                    <li  class="spc-bg-content">PPK</li>
                                    <li  class="spc-bg-content">PPM</li>
                                    <li  class="spc-bg-content">PPMK</li>
                                      <li  class="spc-bg-content">dpmoLong</li>
                                    <li  class="spc-bg-content">zBenchLong</li>
                                    <li  class="spc-bg-content">sigmaLong</li>
                                </ul>
                            </el-col>
                            <el-col :span="6">
                                <ul>
                                    <li>&nbsp;{{variableStats.stdDevLong}}</li>
                                    <li>&nbsp;{{variableStats.pp }}</li>
                                    <li>&nbsp;{{variableStats.ppk }}</li>
                                    <li>&nbsp;{{variableStats.ppm }}</li>
                                    <li>&nbsp;{{variableStats.ppmk }}</li>
                                    <li>&nbsp;{{variableStats.dpmoLong }}</li>
                                    <li>&nbsp;{{variableStats.zBenchLong }}</li>
                                    <li>&nbsp;{{variableStats.sigmaLong }}</li>
                                </ul>
                            </el-col> 
                        </el-row>
                    </div>
                    <el-row>
                         <el-col :span="12">
                            <ul>
                                <li  class="spc-bg-content">sigma</li>
                                <li  class="spc-bg-content">CA</li>
                               
                            </ul>
                          </el-col>
                          <el-col :span="12">
                              <ul>
                                <li>&nbsp;{{variableStats.sigma }}</li>
                                <li>&nbsp;{{variableStats.ca }}</li>
                               </ul>
                          </el-col>
                    </el-row> 
                   

                  </div>
                  <!---->
                
                  </div>
                </el-col>
               
            </el-row>
        </div>
</template>
<script>
export default {
    props:["configData","variableStats","XR"],
    data(){
        return {
            
        }
    }
}
</script>

