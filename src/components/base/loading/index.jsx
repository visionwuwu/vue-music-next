import { defineComponent } from 'vue'
import loading from './loading.gif'
import './index.scss'

export default defineComponent({
  name: 'Loading',
  data () {
    return {
      title: '正在载入...'
    }
  },
  render() {
    return <div class="loading">
      <div class="loading-content">
        <img width="24" height="24" src={loading} />
        <p class="desc">{this.title}</p>
      </div>
    </div>
  },
  methods: {
    setTitle (title) {
      this.title = title
    }
  }
})
