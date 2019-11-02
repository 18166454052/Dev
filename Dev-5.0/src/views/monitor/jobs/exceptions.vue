<template>
    <div>
        <div class="box" v-if="Object.keys(exception).length>0">
            <div class="title1">根异常</div>
            <div class="title2"><span  class="title3">时间戳 : </span>{{exception.timestamp | unixTime(true)}}</div>
            <div class="content">{{exception['root-exception']}}</div>
        </div>
        <div class="box m-t" v-for="e in exception['all-exceptions']" :key='e.timestamp'>
            <div class="title1">{{e.task}}</div>
            <div class="title2">
                <div><span  class="title3">时间戳 : </span>{{e.timestamp | unixTime(true)}}</div>
                <div><span  class="title3">地址 : </span>{{e.location}}</div>
            </div>
            <div class="content">
                {{e.exception}}
            </div>
        </div>
       <div class="content" v-if="Object.keys(exception).length==0">
           没有错误数据
       </div>
    </div>
</template>
<script>
export default {
  props: ["exception"],
  data() {
    return {};
  }
};
</script>
<style scoped>
.box {
  border: 1px solid #ddd;
  border-radius: 4px;
}
.title1 {
  color: #333;
  font-size: 18px;
  padding: 12px 20px 13px 10px;
  color: #333;
  background-color: #f5f5f5;
      border-bottom: 1px solid #ddd;
    border-top-right-radius: 3px;
    border-top-left-radius: 3px;
}
.title2 {
  font-size: 13px;
  padding: 12px;
  color: #999;
  border-right: 1px solid #e7e7e7;
  overflow: hidden;
  background-color: #f5f5f5;
   border-bottom: 1px solid #ddd;
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
}
.title2 div{
  display: inline-block;
  border-left:1px solid #ddd;
  margin-left:10px;
  padding-left:10px;
    
}
.title2 div:first-child{
   
  border-left:none;
  margin-left:0;
  padding-left:0;
    
}

.title3{
 font-size: 14px;
 font-weight:600;
  color: #666;
}
.content {
  padding: 10px;
  background-color: #fdfdfd;
  color: #333;
  font-size: 13px;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
  font-family: Menlo,Monaco,Consolas,"Courier New",monospace;
  line-height: 1.42857143em
    
}
</style>


