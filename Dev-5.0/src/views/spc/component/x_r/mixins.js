export default {
  data() {
    return {
      selRule: [],
      /*
      color: ['#fdeff2','#e9dfe5','#f6bfbc','#f5b199','#f2a0a1',
      '#eaf4fc','#eaedf7','#e8ecef','#ebf6f7','#c1e4e9','#a2d7dd','#a0d8ef','#89c3eb','#84a2d4','#83ccd2',
      '#f9c89b','#f4dda5','#e0c38c','#f3bf88','#eb9b6f','#df7163']
      */
      color:['#1BE9BF','#63C2FF','#FF7993','#FFCB8C','#0071B6','#D7C6FA','#61a0a8','#FF00FF'],
    }
  },
  methods: {
    clickNode: function () {},
    aboutColor: function (rule) {
      if (this.selRule.indexOf(rule) >= 0) {
        return this.color[rule - 1];

      } else {
        return "#ddd";
      }
    },
    selectRule: function (rule) {
      if (this.selRule.length == 0) {
        this.selRule.push(rule);
      } else {
        let Index = -1;
        this.selRule.forEach((item, index) => {
          if (item == rule) {
            Index = index; //存在
          }
        });
        if (Index >= 0) {
          //删除
          this.selRule.splice(Index, 1);
        } else {
          this.selRule.push(rule);
        }
      }
    },
  },
  computed: {
    datas: function () {

      if (this.selRule.length == 0) { //没有过滤
        return this.chartData;
      } else { //有过滤
        let filterGroup = {
          columns: this.chartData.columns,
          rows: []
        };
        console.log(this.selRule);
        this.chartData.rows.forEach(group => {
          if (group.improper.length > 0) { // 是错误点
            let flag = false;
            this.selRule.forEach(rule => { // [6,7]
              group.ruleNumber.forEach(rule1 => { // [5,6]
                if (rule == rule1) {
                  flag = true
                }
              });
            })
            if (flag) { // 符合筛选条件
              filterGroup.rows.push(Object.assign({}, group));
            }

          }
        });
        console.log(filterGroup);
        return filterGroup;
      }



    }
  }
}
