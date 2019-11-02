<template>
<div class="Dialog">
    <el-dialog :title="name" :visible.sync="dialogVisible" 
        width="700px"
        :before-close="close"
    >
        <div id="PDF">
           
            
            <div id="100" class="m-t">
               <slot name="100"></slot>  
            </div>
            <div  v-for="i in 30 " :key="i" :id="i" class="m-t">
               <slot :name="i"></slot>  
            </div>
           
        </div>
        <div class="dialog-footer text-center ">
            <el-button size="mini" @click="cancel">取 消</el-button>
            <el-button size="mini" type="primary" @click="download">下载</el-button>
            <el-button size="mini" type="primary" @click="print">打印</el-button>
        </div>
    </el-dialog>

</div>
</template>
<script>
import PdfJs from '@/views/mixins/pdf';
export default {
    mixins:[PdfJs],
    props:['showPdf',"name","panel"],
    data(){
        return {
            
        }
    },
    methods:{
        close:function(){
            this.$emit('close');
        },
        cancel:function(){
            this.close();
        },
        submit:function(){
            /* 提交代码 */

            //
            this.close();
        },
        download:function(){
            this.convertCanvasToImage(this.selectPanel,"d",this.name,)
        },
        print:function(){
            this.convertCanvasToImage(this.selectPanel,"p",this.name,)
        }
    },
    computed:{
        dialogVisible:function(){
            return this.showPdf;
        },
        selectPanel:function(){
            let arr=[100];
           for(let key in this.panel){
               if(this.panel[key]){
                   arr.push(key);
               }
           }
            return arr;
        }
    },
    beforeDestroy:function(){
        this.$off();
    }
}

</script>
