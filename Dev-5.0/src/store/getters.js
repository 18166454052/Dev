const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  addRouters: state => state.permission.addRouters,
  // page: state => state.app.page,
  // page_size: state => state.app.page_size,
  project_id: state => state.app.project_id,
  activeIndex: state => state.app.activeIndex,
  nickname: state => state.user.nickname,
  userId: state => state.user.userId,
  userRole: state => state.user.userRole,
  showFolderTask: state => state.app.showFolderTask
}
export default getters
