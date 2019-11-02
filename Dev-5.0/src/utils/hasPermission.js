import store from '../store'

export function hasPermission(permission) {  // 控制按钮
  let myPermissions = store.getters.permissions;
  return myPermissions.indexOf(permission) > -1;
}

export function hasMenus(menu) {  // 控制导航菜单
  let  menuList = store.getters.menus ;
  return menuList.indexOf(menu) > -1 ;
}
