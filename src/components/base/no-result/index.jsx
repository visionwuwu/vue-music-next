import { defineComponent, ref } from 'vue'
import './index.scss'

export default defineComponent({
  name: 'NoResult',
  setup (props, { expose }) {
    const title = ref('暂无数据')
    const setTitle = (title) => {
      title.value = title
    }
    expose({
      setTitle
    })

    return () => <div class="no-result">
      <div class="no-result-content">
        <div class="icon"></div>
        <p class="text">{title.value}</p>
      </div>
    </div>
  }
})
