<template>
  <div style="min-height:100%">
    <!--<transition name="fade" mode="out-in">-->
     

        <router-view  :key="key" ></router-view>
    <!--</transition>-->
  </div>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
         key() {
             return this.$route.name !== 'Configuration' ? this.$route.name + +new Date() : ''
         }
  }
}
</script>
