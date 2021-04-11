import dict from '../config/dict' //引入dict字典
export default function (Vue) { //把字典放到vue原型上
  Vue.prototype.$dict = dict
}
