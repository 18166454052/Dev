
const management = {
  state: {
    gatewayData: [],
    deviceData: [],
    topicData: [],
    projectKey: '',
    type: '', /* 存储 1--devive  2--gateway  topic使用 */
    typeName: '', /* 存储具体的一个 deviceName/gatewayName */
    projectDetail: {}

  },
  mutations: {
    setGatewayData: (state, data) => {
      state.gatewayData = data
    },
    setDeviceData: (state, data) => {
      state.deviceData = data
    },
    setTopicData: (state, data) => {
      state.topicData = data
    },
    setProjectkey: (state, str) => {
      state.projectKey = str
    },
    setProjectDetail: (state, obj) => {
      state.projectDetail = obj
    },
    setType: (state, type) => {
      state.type = type
    },
    setTypeName: (state, typeName) => {
      state.typeName = typeName
    }

  }
}

export default management
