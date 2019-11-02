import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: true
    },
    language: Cookies.get('language') || 'zh',
    // language: 'zh',
    page: 1,
    page_size: 10,
    showDeleteDialog: false,
    loadingDeleteDialog: false,
    project_id: 0,
    activeIndex: '2-1',
    pdfConfig: '',
    pdfVariable: '',
    pdfbar: '',
    showFolderTask: false
  },
  mutations: {
    SET_TASK: (state, bool) => {
      state.showFolderTask = bool
    },
    T_PAGE: (state, page1) => {
      state.page = page1
    },
    SET_PAGESIZE: (state, page) => {
      state.page_size = page
    },
    SET_ACTIVEINDEX: (state, index) => {
      state.activeIndex = index
    },
    SET_PROJECTID: (state, projectId) => {
      state.project_id = projectId
    },
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      Cookies.set('language', language)
    },
    setDeleteDialog: (state, type) => {
      state.showDeleteDialog = type
    },
    setLoadingDelete: (state, type) => {
      state.loadingDeleteDialog = type
    },
    SET_PDF: (state, pdfInfo) => {
      console.log(pdfInfo)
      console.log(state)
      console.log(typeof pdfInfo)
      if (pdfInfo.pdfConfig) {
        console.log('pdfconfig')
        state.pdfConfig = pdfInfo.pdfConfig
      }
      if (pdfInfo.pdfVariable) {
        console.log('pdfVariable')
        state.pdfVariable = pdfInfo.pdfVariable
      }
      if (pdfInfo.pdfbar) {
        console.log('pdfbar')
        state.pdfbar = pdfInfo.pdfbar
      }
    }
  },
  actions: {
    toggleSideBar({
      commit
    }) {
      commit('TOGGLE_SIDEBAR')
    },
    setLanguage({
      commit
    }, language) {
      commit('SET_LANGUAGE', language)
    }
  }
}

export default app
