<template>
  <div class="app-container">

         <el-row>
             <el-col :xs="{span:20,offset:2}" :sm="{span:18,offset:3}"
                 :md="{span:16,offset:4}" :lg="{span:16,offset:4}" :xl="{span:16,offset:4}">
                 <el-tabs v-model="activeName" type="border-card" @tab-click="tabClick">
                    <el-tab-pane  name="datasource">
                        <span slot="label"><i class="el-icon-menu m-r-5" ></i>数据源</span>
                        <v-database class="m-t" ref="database"
                        :activename="activeName"
                        ></v-database>
                    </el-tab-pane>
                    <el-tab-pane  name="dataanalysis">
                        <span slot="label"> 
                           <svg-icon  icon-class="chart"></svg-icon>
                            SPC数据配置</span>
                        <v-datasource class="m-t" ref="datasource"
                        :activename="activeName"
                        ></v-datasource>
                    </el-tab-pane>
                    <!-- <el-tab-pane  name="dataanalysisMsa">
                        <span slot="label"> 
                           <svg-icon  icon-class="chart"></svg-icon>
                            MSA数据配置</span>
                        <v-datasource-msa class="m-t" ref="datasourceMsa"
                        :activename="activeName"
                        ></v-datasource-msa>
                    </el-tab-pane> -->
                    <el-tab-pane  name="gateway">
                         <span slot="label">
                              <svg-icon  icon-class="gateway"></svg-icon>
                            网关</span>
                   
                        <v-gateway class="m-t" ref="gateway"
                        :activename="activeName"
                        ></v-gateway>
                    </el-tab-pane>
                    <el-tab-pane  name="department">
                         <span slot="label">
                              <svg-icon  icon-class="user"></svg-icon>
                            组织管理</span>
                        <v-department  class="m-t"  ref="department"></v-department>
                    </el-tab-pane>
                     <el-tab-pane  name="user">
                         <span slot="label">
                              <svg-icon  icon-class="user"></svg-icon>
                            用户</span>
                   
                        <v-user class="m-t"  ref="user"
                        :activename="activeName"
                        ></v-user>
                    </el-tab-pane>
                </el-tabs>
             </el-col>    
         </el-row>
  </div>
</template>
<script>
import Database from "@/views/configure/database/create"
import User from "@/views/configure/user/create"
import Department from "@/views/configure/department/create"
import Datasource from "@/views/datasource/create"
import DatasourceMsa from "@/views/datasource/msaCreate"
import Gateway from "@/views/piping/gateway"
export default {
    components:{
      'v-database':Database,
      'v-datasource':Datasource,
      'v-datasource-msa':DatasourceMsa,
      'v-user':User,
      'v-gateway':Gateway,
      'v-department':Department
    },
    data(){
        return {
            activeName:'datasource',
           // user:user
        
        }
    },
    methods:{
        tabClick:function(tab, event){
            if(tab.name=="user"){
                this.$refs.user.$emit('init');
            }
            if(tab.name=="datasource"){
                this.$refs.database.$emit('init');
            }
            if(tab.name=="dataanalysisMsa"){
                this.$refs.datasourceMsa.$emit('init');
            }
            if(tab.name=="dataanalysis"){
                this.$refs.datasource.$emit('init');
            }
            if(tab.name=="gateway"){
                this.$refs.gateway.$emit('init');
            }
            if(tab.name=="department"){
                this.$refs.department.$emit('init');
            }
            this.$router.push("/config/"+tab.name);


        }
    },
    created:function(){
        this.activeName=this.$route.params.type?this.$route.params.type:'datasource';
    },
    watch:{
        $route(){
        this.activeName = this.$route.params.type;
      },
    }
   
}
</script>
<style scope>
 .m-t-10{
     margin-top:10px;
 }
  .m-t-5{
     margin-top:5px;
 }
 .m-r-5{
     margin-right:5px;
 }
 .el-icon-user{
     
      
 }
</style>
