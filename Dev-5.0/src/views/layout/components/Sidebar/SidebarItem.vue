<template>
<!-- <el-menu
      :default-active="activeIndex"
      unique-opened
      menu-trigger="click"
     
      @open="Open"
      @close="Close"
      @select="active"
      active-text-color="#1AB394"
      text-color="#000"
      >
      <el-submenu index="1">
         <template slot="title">
           质量管控
          <i class="el-icon-arrow-down"></i> 
          </template>
           <el-menu-item index="1-4" ><router-link to="/timedTask/dashboard">Dashboard</router-link></el-menu-item> 
           <el-menu-item index="1-1" ><router-link to='/spc' >SPC</router-link></el-menu-item>
           <el-menu-item index="1-3"  v-if="hasMenu('msa')" > <router-link to='/msa' >MSA</router-link></el-menu-item> 
           <el-menu-item index="1-2" v-if="hasMenu('scheduleTask')" ><router-link to='/timedTask'>质量预警</router-link> </el-menu-item> 
         
      </el-submenu>
        <el-submenu index="7" v-if="hasMenu('spclevel')">
        <template slot="title">
          数据配置
        <i class="el-icon-arrow-down"></i> 
      
        </template>
          <el-menu-item index="7-2"><router-link to='/configure/datasourceConfig'>数据库配置</router-link></el-menu-item>
          <el-menu-item index="7-3" v-if="hasMenu('datasource')"><router-link to='/dataSource/index'>数据源配置</router-link> </el-menu-item>
          <el-menu-item index="7-1"><router-link to='/configure/fields'>数据字段配置</router-link></el-menu-item> 
      </el-submenu>

      <el-submenu index="8" v-if="hasMenu('user') || hasMenu('role')" >
        <template slot="title">
          系统管理
          <i class="el-icon-arrow-down"></i> 
         
          </template>
        <el-menu-item index="8-1" v-if="hasMenu('user')"> <router-link to='/configure/user'  >用户</router-link></el-menu-item>
        <el-menu-item index="8-2" v-if="hasMenu('role')"> <router-link to='/configure/role' >角色</router-link></el-menu-item>
        <el-menu-item index="8-4" v-if="hasMenu('userlog')"> <router-link to='/logger/index'>日志
        </router-link></el-menu-item>
        <el-menu-item index="8-5" ><router-link to='/monitor'>系统监控</router-link></el-menu-item>
        <el-menu-item index="8-3" v-if="hasMenu('menu')"><router-link to='/configure/operation'>功能菜单</router-link></el-menu-item>
      </el-submenu>
 </el-menu> -->
<div>
<el-menu :default-active="activeIndex" 
class="el-menu-vertical-demo" 
:collapse="true">
  <el-submenu index="1"  v-if="$store.getters.userRole<4?true:false">
    <template slot="title">
      <i class="el-icon-plus"></i>
      <span slot="title">创建</span>
    </template>
    <el-menu-item-group>
      <span slot="title">创建</span>
      <el-menu-item index="1-1" ><router-link to="/tb/folder">文件夹</router-link></el-menu-item>
      <el-menu-item index="1-2" ><router-link to="/spc/task">项目-批次分析</router-link></el-menu-item> 
      <!-- <el-menu-item index="1-3" ><router-link to="/msa/task">MSA</router-link></el-menu-item>   -->
      <el-menu-item index="1-4" ><router-link to="/piping/gateway/cep/program">项目-实时分析</router-link></el-menu-item>  
    </el-menu-item-group>
  </el-submenu>
   <el-submenu index="2">
    <template slot="title">
      <router-link to="/tb/user/folder"><i class="el-icon-menu"></i></router-link>
    </template>
    <!-- <el-menu-item-group>
      <span slot="title">Dashboards</span>
      <el-menu-item index="2-1" ><router-link to="/tb/user/folder">Home</router-link></el-menu-item> -->
      <!--<el-menu-item index="2-2" ><router-link to="/bpy/daoju">CNC数字孪生</router-link></el-menu-item> 
      <el-menu-item index="2-4" ><router-link to="/cncReal">刀具感知分析</router-link></el-menu-item> 
      <el-menu-item index="2-5" ><router-link to="/cncHistory">刀具控制分析</router-link></el-menu-item> 
       <el-menu-item index="2-6" ><router-link to="/cncList">历史叠加</router-link></el-menu-item> 
      <el-menu-item index="2-3" ><router-link to="/cnc">历史查看</router-link></el-menu-item> 
     -->
    <!-- </el-menu-item-group> -->
    
  </el-submenu> 
  <el-submenu index="3" v-if="$store.getters.userRole==2?true:false">
    <template slot="title">
      <i class="el-icon-setting"></i>
      <span slot="title">配置</span>
    </template>
    <el-menu-item-group>
      <span slot="title">配置创建</span>
      
      <el-menu-item index="3-1" ><router-link to="/config/datasource">数据源配置</router-link></el-menu-item>
      <el-menu-item index="3-2" ><router-link to="/config/dataanalysis">SPC数据配置</router-link></el-menu-item>
       <!-- <el-menu-item index="3-3" ><router-link to="/config/dataanalysisMsa">MSA数据配置</router-link></el-menu-item> -->
       <el-menu-item index="3-5" ><router-link to="/config/gateway">网关</router-link></el-menu-item> 
    </el-menu-item-group>
     <el-menu-item-group>
      <span slot="title">系统</span>
         <el-menu-item index="3-4" ><router-link to="/config/user">用户</router-link></el-menu-item> 
          <el-menu-item index="3-9" ><router-link to="/config/department">组织管理</router-link></el-menu-item> 
       <el-menu-item index="3-6" ><router-link to="/log">日志</router-link></el-menu-item> 
        <el-menu-item index="3-7" ><router-link to="/overview">分析监控</router-link></el-menu-item>  
        <el-menu-item index="3-8" ><router-link to="/email">邮件</router-link></el-menu-item>  
     </el-menu-item-group>
    
  </el-submenu>
</el-menu>

<el-menu
 class="text-center"
 style="position:fixed;bottom:0px"
>
  <el-menu-item index="4-1-1">
    <el-tooltip effect="dark" content="全屏" placement="right" style="position:relative;cursor:pointer" >
            <screen-full style="position:relative;top:20px"></screen-full>
    </el-tooltip>
  </el-menu-item>
  <el-menu-item index="4-1-3">
    <el-tooltip effect="dark" content="主题" placement="right"  style="position:relative;cursor:pointer">
      <theme-picker style="width:22px;position:relative;left:-8px"></theme-picker>
    </el-tooltip>
  </el-menu-item>
  <el-menu-item index="4-1-2">
    <el-tooltip  effect="dark" content="退出" placement="right" style="position:relative;cursor:pointer" >
              <img :src="logOut"  @click="logout">
    </el-tooltip>   
  </el-menu-item>
</el-menu>
 </div>
</template>
<script>
import logOut from "@/img/log-out.svg"
import { getActive, setActive, getUserRole, removeSessionId , removeUserRole} from "@/utils/auth";
import { mapGetters } from "vuex";
import Screenfull from '@/components/Screenfull'
import ThemePicker from '@/components/ThemePicker'
export default {
  components: {
    'screen-full':Screenfull,
    'theme-picker':ThemePicker
  },
  data() {
    return {
      // activeIndex:'1-1',
      type: "close",
      index: "1",
      logOut:logOut
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
    },
    logout() {
      // removeSessionId();
      // removeUserRole();
      // this.$router.push('/login');
      // location.reload();
     
      let self = this;
      this.$store.dispatch('LogOut').then((res) => {

        //location.reload()// In order to re-instantiate the vue-router object to avoid bugs
        this.$router.replace('/login');
      }).catch(function(err){
          self.$message.error(err.message);
      });
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
