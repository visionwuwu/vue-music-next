import { defineComponent, ref } from 'vue'
import './index.scss'

export default defineComponent({
  name: 'Tab',
  setup () {
    const tabList = ref([
      { name: '推荐', path: '/recommend' },
      { name: '歌手', path: '/singer' },
      { name: '排行', path: '/top-list' },
      { name: '搜索', path: '/search' }
    ])
    return () => <div className="tab">
      {
        tabList.value.map(tab => <div className="tab-item">
          <router-link
            key={tab.path}
            to={tab.path}
            tag="div"
          >
            <span className="tab-link">
              { tab.name }
            </span>
          </router-link>
        </div>)
      }
    </div>
  }
})
