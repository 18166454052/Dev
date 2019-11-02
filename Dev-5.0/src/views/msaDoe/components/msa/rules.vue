<template>
      <div>
            <el-row>
                <el-col :span="24">
                  
                  <div class="py" style="border-right:1px solid rgb(159,159,159);
                              border-bottom:1px solid rgb(159,159,159)">
                    <p class="spcDetail">判异规则</p>
                     <ul>
                       <li v-for="rule in rules" :key="rule.spcTaskAbnormalRulesId">
                         <el-row>
                          
                           <el-col :span="24">
                                <el-checkbox :checked="rule.enable==1?true:false" disabled style="margin-right:10px"></el-checkbox>
                              {{rule.content.replace('n',rule.n).replace('m',rule.m).replace('k',rule.k)}}
                           </el-col>
                         </el-row>
                        
                         </li>
                         <li v-show="rules.length==0" class="text-center">没有配置判异规则</li>
                     </ul>
                  </div>
                 
                </el-col>
            </el-row>
        </div>
</template>
<script>
export default {
    props:["rules"],
    data(){
        return {
      

        }
    }
}
</script>



