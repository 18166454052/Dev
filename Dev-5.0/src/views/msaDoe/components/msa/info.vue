<template>
<div>
    <el-form  class="small-space Form setting-form FormError"  
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

    </el-form>
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
