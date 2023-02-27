import { createApp } from 'vue'
import router from './router'
import store from './store'
import axios from 'axios'
import 'easymde/dist/easymde.min.css'

axios.defaults.baseURL = 'http://apis.imooc.com/api/'
axios.interceptors.request.use(config => {
    config.params = {
        ...config.params,
        icode: 'FC0014C9F29E5499'
    }
    if (config.data instanceof FormData) {
        config.data.append('icode', 'FC0014C9F29E5499')
      } else {
        config.data = { ...config.data, icode: 'FC0014C9F29E5499' }
      }
    return config
})
axios.interceptors.request.use(config => {
    store.commit('setLoading', true)
    store.commit('setError', { status: false, message: '' })
    return config
})
axios.interceptors.response.use(config => {
    setTimeout(() => {  
        store.commit('setLoading', false)
    }, 1000)
    return config
}, e => {
    const { error } = e.response.data
    store.commit('setError', { status: true, message: error })
    store.commit('setLoading', false)
    return Promise.reject(error)
})

import App from './App.vue'


const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
