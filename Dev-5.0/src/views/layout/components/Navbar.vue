<template>
<el-menu
      :default-active="activeIndex"
      unique-opened
      menu-trigger="click"
      mode="horizontal"
      @open="Open"
      @close="Close"
      @select="active"
      active-text-color="#1AB394"
      text-color="#000"
      >
      <el-submenu index="1">
         <template slot="title">
           质量管控
          
          </template>
           <el-menu-item index="1-4" ><router-link to="/timedTask/dashboard">Dashboard</router-link></el-menu-item> 
           <el-menu-item index="1-1" ><router-link to='/spc' >SPC</router-link></el-menu-item>
           <el-menu-item index="1-3"  v-if="hasMenu('msa')" > <router-link to='/msa' >MSA</router-link></el-menu-item> 
           <el-menu-item index="1-2" v-if="hasMenu('scheduleTask')" ><router-link to='/timedTask'>质量预警</router-link> </el-menu-item> 
         
      </el-submenu>
        <el-submenu index="7" v-if="hasMenu('spclevel')">
        <template slot="title">
          数据配置
       
      
        </template>
          <el-menu-item index="7-2"><router-link to='/configure/datasourceConfig'>数据库配置</router-link></el-menu-item>
          <el-menu-item index="7-3" v-if="hasMenu('datasource')"><router-link to='/dataSource/index'>数据源配置</router-link> </el-menu-item>
          <el-menu-item index="7-1"><router-link to='/configure/fields'>数据字段配置</router-link></el-menu-item> 
      </el-submenu>

      <el-submenu index="8" v-if="hasMenu('user') || hasMenu('role')" >
        <template slot="title">
          系统管理
         
         
          </template>
        <el-menu-item index="8-1" v-if="hasMenu('user')"> <router-link to='/configure/user'  >用户</router-link></el-menu-item>
        <el-menu-item index="8-2" v-if="hasMenu('role')"> <router-link to='/configure/role' >角色</router-link></el-menu-item>
        <el-menu-item index="8-4" v-if="hasMenu('userlog')"> <router-link to='/logger/index'>日志
        </router-link></el-menu-item>
        <el-menu-item index="8-5" ><router-link to='/monitor'>系统监控</router-link></el-menu-item>
        <el-menu-item index="8-3" v-if="hasMenu('menu')"><router-link to='/configure/operation'>功能菜单</router-link></el-menu-item>
      </el-submenu>
 </el-menu>

 
</template>
<script>
import { getActive, setActive } from "@/utils/auth";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      // activeIndex:'1-1',
      type: "close",
      index: "1"
    };
  },
  methods: {
    Open: function(key, keyPath) {
      console.log("open---" + key);
      this.type = "open";
      //this.index=key;
    },
    Close: function(key, keyPath) {
      console.log("close---" + key);
      this.type = "close";
      //this.index=key;
    },
    active: function(index, indexPath) {
      console.log("active----" + index);
      this.index = index.toString().slice(0, 1);
      if (index.toString().indexOf("-") >= 0) {
        this.type = "close";
      }
      this.$store.commit("SET_ACTIVEINDEX", index);
    }
  },
  mounted() {
    //  if(getActive()){
    //     this.activeIndex=getActive();
    // }
  },
  computed: {
    ...mapGetters(["activeIndex"])
  }
};
</script>
<style scoped>
</style>
