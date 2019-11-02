<template>
<div>
    <!-- <el-form  class="small-space Form setting-form FormError"  
    ref="dsForm" size="mini" label-position="right" label-width="80px">
        <el-form-item label="制品名称 :">
            <el-input v-model="Form.aa">

            </el-input>
        </el-form-item>
        <el-form-item label="管制项目 :">
            <el-input v-model="Form.aa">

            </el-input>
        </el-form-item>
        <el-form-item label="测量单位 :">
            <el-input v-model="Form.aa">

            </el-input>
        </el-form-item>
        <el-form-item label="制造部门 :">
            <el-input v-model="Form.aa">

            </el-input>
        </el-form-item>
        <el-form-item label="级别 :">
            <el-input v-model="Form.aa">

            </el-input>
        </el-form-item>
       
        <el-form-item label="抽样方法 :">
            <el-input v-model="Form.aa">

            </el-input>
        </el-form-item> 
        <el-form-item label="测定者 :">
            <el-input v-model="Form.aa">

            </el-input>
        </el-form-item>
        <el-form-item label="日期 :">
            <el-input v-model="Form.aa">

            </el-input>
        </el-form-item>
        <el-form-item label="辅助及原因 :">
            <el-input  type="textarea" autosize  v-model="Form.aa">
                        
            </el-input>
        </el-form-item>

    </el-form> -->
   

       <div class="stats_top" style="border-bottom:1px solid #999;border-right:1px solid #999">
            
            <el-row > 
                <el-col :span="4">
                    <ul  class="spc-li-bg">
                        
                        <li>制品名称</li>
                        <li>管制项目</li>
                        <li>测量单位</li>
                    </ul>
                </el-col>
                <el-col :span="4">
                    <ul>
                       
                        <li><el-input placeholder="请填写管制名称"/></li>
                        <li><el-input /></li>
                        <li><el-input /></li>
                    </ul>
                </el-col>
                <el-col :span="4">
                    <ul  class="spc-li-bg">
                        
                        <li>制造部门</li>
                        <li>级别</li>
                        <li>测定者</li>
                    </ul>
                </el-col>
                <el-col :span="4">
                    <ul>
                       
                        <li><el-input /></li>
                        <li><el-input /></li>
                        <li><el-input /></li>
                    </ul>
                </el-col>
                <el-col :span="4">
                    <ul  class="spc-li-bg">
                        
                        <li>期</li>
                        <li>抽样方法</li>
                        <li>日期</li>
                    </ul>
                </el-col>
                <el-col :span="4">
                    <ul>
                        <li><el-input /></li>
                        <li><el-input /></li>
                        <li><el-input /></li>
                    </ul>
                </el-col>
                
              
               
                
            </el-row>
            <el-row>
                 <el-col :span="8">
                    <ul  class="spc-li-bg">
                        
                        <li>辅助及原因追查</li>
                       
                    </ul>
                </el-col>
                <el-col :span="16">
                    <ul>
                        <li><el-input /></li>
                        
                    </ul>
                </el-col>
            </el-row>
        </div> 
  
</div>
</template>
<script>
export default {

    data(){
        return {
           Form:{
              aa:"" 
           }
        }
    }
}
</script>
