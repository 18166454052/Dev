<template>
    <div>
         <el-card shadow="never" class="m-t">
            <div slot="header" class="clearfix">
                <span>预警信息</span>
                
            </div> 
            <el-form class="Form" label-width="100px" label-position="right">
                <el-row>
                    <el-col :span="8" v-for="(condition,index) in data.warningCondition" :key="'warningCondition'+index"> 
                        <el-form-item v-for="(val,key) in condition" :key="key" :label="key+' : '">
                                {{val}}
                        </el-form-item>
                    </el-col>
                </el-row>
                
            </el-form>
        </el-card>
         <el-card shadow="never" class="m-t">
            <div slot="header" class="clearfix">
                <span>预警相关数据</span>
                
            </div> 
            <v-line></v-line>
        </el-card>
         <el-card shadow="never" class="m-t">
            <div slot="header" class="clearfix">
                <span>处理信息</span>
                
            </div> 
        </el-card>
         <el-card shadow="never" class="m-t">
            <div slot="header" class="clearfix">
                <span>厂商反馈</span>
                
            </div> 
        </el-card>
    </div>
</template>
<script>
import Line from './line';
export default {
    components:{
        "v-line":Line
    },
    data(){
        return {
             data:{
               
                warningCondition:[
                    {
                        "条件1":"内容"
                    }
                ]
            }
        }
    }
}
</script>

