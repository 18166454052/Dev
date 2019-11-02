<template>
<div class="app-container BPY">
    <el-row :gutter="20" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <el-row>
            <div class="card-panel">
                <el-col :span="8">
                <div class="card-panel-description">
                    <div class="card-panel-text">当前加功批次</div>
                    <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num"/>
                </div>
                </el-col>
                <el-col :span="8">
                    <div class="card-panel-description">
                        <div class="card-panel-text">当前加功状态</div>
                        <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num"/>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="card-panel-description">
                        <div class="card-panel-text">当前加功刀号</div>
                        <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num"/>
                    </div>
                </el-col>
            </div>
            
        </el-row>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="db" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">基础数据</div>
          <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="db" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">扩展数据</div>
          <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="db" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">刀具</div>
          <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :span="24">
        <el-card class="box-card">
            <v-line></v-line>
        </el-card>
    </el-col>
    <el-col :span="24" class="m-t">
        <el-card class="box-card">
            <v-histogram></v-histogram>
        </el-card>
    </el-col>
    
  </el-row> 
</div>
 
</template>

<script>
import CountTo from 'vue-count-to'
import Line from './dashCom/line'
import Pie from './dashCom/pie'
import Histogram from './dashCom/histogram'
export default {
  components: {
    CountTo,
    'v-line':Line,
    'v-pie':Pie,
    'v-histogram':Histogram
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 20px rgba(0, 0, 0, .25);
    border-color: rgba(0, 0, 0, .05);
    // &:hover {
    //   .card-panel-icon-wrapper {
    //     color: #fff;
    //   }
    //   .icon-people {
    //      background: #40c9c6;
    //   }
    //   .icon-message {
    //     background: #36a3f7;
    //   }
    //   .icon-money {
    //     background: #f4516c;
    //   }
    //   .icon-shopping {
    //     background: #34bfa3
    //   }
    // }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 3px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>

