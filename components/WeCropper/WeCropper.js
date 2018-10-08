// let WeCropper = require('we-cropper')

// let _wecropper

// Component({
//   /**
//    * 组件的属性列表
//    */
//   properties: {
//     option: {
//       type: Object,
//       value: {},
//       observer: function(newVal, oldVal, changedPath) {
//         // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
//         // 通常 newVal 就是新设置的数据， oldVal 是旧数据
//         console.log('_observer_option', newVal, oldVal, changedPath)
//      }
//     }
//   },

//  /*  computed: {
//     _canvasId () {
//       return this.option.id
//     },
//     _width () {
//       return this.option.width
//     },
//     _height () {
//       return this.option.height
//     }
//   }, */
 
//   data: {
//     _canvasId: null,
//     _width: null,
//     _height: null
//   },


//   lifetimes: {
//     // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
//     attached () {
//       if (!this.data.option) {
//         return console.warn('[mpvue-cropper] 请传入option参数\n参数配置见文档：https://we-plugin.github.io/we-cropper/#/api')
//       }
//       this.init()
//     },
//     moved: function () { },
//     detached: function () { },
//   },
  
//   methods: {
//     touchstart (e) {
//       _wecropper.touchStart(e)
//     },
//     touchmove (e) {
//       _wecropper.touchMove(e)
//     },
//     touchend (e) {
//       _wecropper.touchEnd(e)
//     },
//     pushOrigin (src) {
//       _wecropper.pushOrign(src)
//     },
//     updateCanvas () {
//       _wecropper.updateCanvas()
//     },
//     getCropperBase64 () {
//       return new Promise((resolve, reject) => {
//         _wecropper.getCropperImage(src => {
//           src ? resolve(src) : reject()
//         })
//       })
//     },
//     getCropperImage () {
//       return new Promise((resolve, reject) => {
//         _wecropper.getCropperImage(src => {
//           src ? resolve(src) : reject()
//         })
//       })
//     },
//     init () {
//       _wecropper = new WeCropper(Object.assign(this.data.option, {
//         id: this.data._canvasId
//       }))
//       .on('ready', (...args) => {
//         this.triggerEvent('ready', ...args)
//       })
//       .on('beforeImageLoad', (...args) => {
//         this.triggerEvent('beforeImageLoad', ...args)
//       })
//       .on('imageLoad', (...args) => {
//         this.triggerEvent('imageLoad', ...args)
//       })
//       .on('beforeDraw', (...args) => {
//         this.triggerEvent('beforeDraw', ...args)
//       })
//       .updateCanvas()
//     }
//   }
// })
