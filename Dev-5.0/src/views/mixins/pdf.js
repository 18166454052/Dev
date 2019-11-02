import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import html2canvas from 'html2canvas';
import {
  parseTime
} from '@/utils'

export default {
  data() {
    return {
      fonts: {

        msyh: {
          normal: 'msyh.ttf',
          bold: 'msyh.ttf',
          italics: 'msyh.ttf',
          bolditalics: 'msyh.ttf'

        }
      }
    }
  },
  methods: {
    convertCanvasToImage: function (idArr,type,name) {
      let self = this;
      let imgArr = [];
      // let base = ['head', 'img1', 'img2', 'img3'];
      for (let i = 0; i < idArr.length; i++) {
        console.log('---------id------'+ idArr[i]);
        html2canvas(document.getElementById(idArr[i]), {
          allowTaint: true, // 允许污染
          taintTest: true, // 在渲染前测试图片(没整明白有啥用)
          useCORS: true, // 使用跨域(当allowTaint为true时这段代码没什么用,下面解释)
          background: "#fff"
        }).then(function (canvas) {
          let imgBlob = canvas.toDataURL(); // base64 
          imgArr.push(imgBlob);
          toPdf();
          // self.PDF(imgBlob, type);
        }).catch(err=>{
           this.$message.error('出现未知错误,请重新打印');
        });
     }


      function toPdf() {
        if (imgArr.length == idArr.length) {
          self.PDF(imgArr, type, name);
        }
      }
    },
    PDF: function (imgBlob, type, name) {
      let arr = [];
      imgBlob.forEach(blob => {
        arr.push(
          {
            width: 520,
            image: "data:img/png;base64," + blob,
            margin: [0, 20, 0, 0]
          }
        )
      });
      this.CONTENT = {
        pageSize: 'A4', //A1 1600  A4 520
        // header: name,
        header: function(currentPage, pageCount, pageSize) {
          // you can apply any logic and return any valid pdfmake element
       
          return [
            { text: name, alignment: 'center' },
          // { canvas: [ { type: 'rect', x: 170, y: 32, w: 520, h: 40 } ] }
          ]
        },
        footer: function (currentPage, pageCount) {
          return {
            text: currentPage.toString() + ' / ' + pageCount,
            alignment: 'center',
            color: '#ccc'
          }
        },
        content: arr,
        // [{
          
        //   width: 520,
        //   image: 'data:img/png;base64," + imgBlob + '
        // }]
        defaultStyle: {
          font: "msyh"
        }
      };
      pdfMake.fonts = this.fonts;
      if (type == 'd') {
        pdfMake.createPdf(this.CONTENT).download(name + '_' + parseTime(new Date()));
      }
      if (type == 'p') {
        pdfMake.createPdf(this.CONTENT).print();
      }

    }
  },
  mounted: function () {

  }
};
