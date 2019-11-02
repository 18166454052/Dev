<template>
<div class="Dialog">
    <el-dialog title="辅助及原因追查" :visible.sync="dialogVisible" 
        width="700px"
        :before-close="close"
    >
        <el-form  class=" Form setting-form FormError"  ref="attach"  
             size="small" label-position="right" label-width="80px">
             <el-form-item label="制造部门 :">
                 <el-input v-model="Form.aa"></el-input>
             </el-form-item>
             <el-form-item label="制造部门 :">
                 <el-input v-model="Form.aa"></el-input>
             </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer text-center">
            <el-button size="mini" @click="cancel">取 消</el-button>
            <el-button size="mini" type="primary" @click="submit">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>
<script>
export default {
    props:["visible"],
    data(){
        return {
            
            Form:{
                aa:""
            }
        }
    },
    methods:{
        close:function(){
            this.$emit('close');
        },
        cancel:function(){
            this.$refs.attach.resetFields();
            this.close();
        },
        submit:function(){
            /* 提交代码 */

            //
            this.close();
        }
    },
    computed:{
        dialogVisible:function(){
            return this.visible;
        }
    },
    beforeDestroy:function(){
        this.$off();
    }
}
</script>
