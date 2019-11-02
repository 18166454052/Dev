<template>
  <ve-line 
  :data="chartDatas" 
  :legend-visible="false"
  :width="width"
  :height="height"
  :grid="grid"
  >
   <div class="data-empty">{{type.type}}</div>
  </ve-line>
</template>

<script>
 import 'v-charts/lib/style.css'
export default {
  props: ["chartData"],
  data() {

    return {
      type:'insert',
      width: "100%",
      height: "280px",
     
      grid: {
        show: false,
        right:'30px',//canvas  左右边的间距
        background: "#343B41",
        borderColor: "#343B41"
      },
    };
  },
  computed: {
      chartDatas:function(){
          this.type=Object.assign({},this.chartData.rows[0]);
          this.chartData.rows=[];
          return this.chartData;
      } 
  }

};
</script>
<style scoped>
.data-empty {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, .7);
  color: #888;
  font-size: 20px;
}
</style>