<template>
    <div class="app-container">
        <div>
            <div class="title">
               执行配置
            </div>
            <ul>
                <li>执行模式</li>
                <li>{{config["execution-config"]["execution-mode"]}}</li>
                <li>最大执行重试次数</li>
                <li>{{config["execution-config"]["restart-strategy"]}}</li>
                <li>工作并行</li>
                <li>auto</li>
                <li>对象重用模式</li>
                <li>{{config["execution-config"]["object-reuse-mode"]}}</li>
            </ul>
        </div>

        <div class="m-t">
            <div class="title " >
               用户配置
            </div>
            <ul>
                <!-- <li>执行模式</li>
                <li>{{config["execution-config"]["execution-mode"]}}</li>
                <li>最大执行重试次数</li>
                <li>{{config["execution-config"]["restart-strategy"]}}</li>
                <li>工作并行</li>
                <li>auto</li>
                <li>对象重用模式</li>
                <li>{{config["execution-config"]["object-reuse-mode"]}}</li> -->
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    props:["config"],
    data(){
        return {
            
        }
    }
}
</script>
<style scoped>
.title{
    padding: 8px;
    line-height: 1.428em;
    border-bottom:2px solid #ddd;
    font-size:16px
}
ul li{
    float:left;
    width:50%;
    border-bottom:1px solid #ccc;
    line-height:30px;
}
ul:after{
    content:'';
    display:table;
    clear:both;
}
</style>


