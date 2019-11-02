<template>
<div>
    <span v-for="(val,key,index) in tasks" :key="key+index+val"
    :style="{background:color[key]}"
    >
                   {{val}}
                </span>
</div>
</template>
<script>
export default {
    props:["tasks"],
    data(){
        return {
            color:{ 
                FAILED: '#F56C6C',
                SCHEDULED: "#C0C4CC",
                CREATED: "#C0C4CC",
                CANCELING:"#C0C4CC",
                CANCELED: "#E6A23C",
                FINISHED: "#67C23A",
                RECONCILING: "#C0C4CC",
                RUNNING: '#409EFF',
                DEPLOYING: "#C0C4CC"
            }
           
        }
    }
}
</script>
<style scoped>
div{
    display:inline-block;
    margin:0;
    padding:0;
}
span{
    color:#fff;
    margin-left:2px;
    text-align:center;
    
}
</style>

