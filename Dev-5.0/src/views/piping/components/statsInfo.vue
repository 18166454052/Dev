<template>
    
</template>
<script>
import {cepStreamStats} from "@/api/piping/stream";
import {cepSourceStats} from "@/api/piping/source";
import {cepSinkStats} from "@/api/piping/sink";
import {cepJobStats} from "@/api/piping/job";
export default {
  data(){
      return {
          statsInfo:[]
      }
  },
  methods:{
      getStreamStats:function(streamId){
          let self=this;
           cepStreamStats({cep_stream_id:streamId}).then(function(res){
               if(res.resCode==0){

               }
               else{
                self.$message({
                    message:res.msg,
                    type:'error'
                });
               }
           });
      },
      getSourceStats:function(sourceId){
          let self=this;
           cepSourceStats({cep_source_id:sourceId}).then(function(res){
               if(res.resCode==0){

               }
               else{
                self.$message({
                    message:res.msg,
                    type:'error'
                });
               }
           });
      },
      getSinkStats:function(sinkId){
          let self=this;
           cepSinkStats({cep_sink_id:sinkId}).then(function(res){
               if(res.resCode==0){

               }
               else{
                self.$message({
                    message:res.msg,
                    type:'error'
                });
               }
           });
      },
       getJobStats:function(jobId){
          let self=this;
           cepJobStats({cep_job_id:jobId}).then(function(res){
               if(res.resCode==0){

               }
               else{
                self.$message({
                    message:res.msg,
                    type:'error'
                });
               }
           });
      }
  },
  mounted(){
      let self=this;
      self.$on('stream',function(streamId){
            self.getStreamStats(streamId);
      });
      self.$on('source',function(sourceId){
            self.getSourceStats(sourceId);
      });
      self.$on('sink',function(sinkId){
            self.getSinkStats(sinkId);
      });
      self.$on('job',function(jobId){
            self.getJobStats(jobId);
      });
  }

}
</script>
<style scoped>
</style>


