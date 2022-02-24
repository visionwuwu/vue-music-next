import { defineComponent, ref, computed } from 'vue'
import { getRecommend } from '@/service/recommend'
import Slider from '@/components/base/slider'
import Scroll from '@/components/base/scroll'
import './index.scss'

export default defineComponent({
  name: 'Recommand',
  setup () {
    const sliders = ref([])
    const albums = ref([])
    const loadingText = ref('正在载入...')
    const loading = computed(() => (sliders.value.length === 0 && albums.value.length === 0))

    async function fetchData () {
      const data = await getRecommend()
      setTimeout(() => {
        sliders.value = data.sliders
        albums.value = data.albums
      }, 100)
    }
    fetchData()

    return () => <div className="recommend" vLoading={[loading.value, loadingText.value]}>
      <Scroll className="recommend-content">
        <div>
          <div className="slider-wrapper">
            <div className="slider-content">
              {
                sliders.value.length > 0 && <Slider sliders={sliders.value}></Slider>
              }
            </div>
          </div>
          <div class="recommend-list">
            <h1 class="list-title" vShow={!loading.value}>热门歌单推荐</h1>
            <ul>
              {
                albums.value.map((item) => {
                  return <li
                    class="item"
                    key={item.id}
                  >
                    <div class="icon">
                      <img width="60" height="60" vLazy={item.pic} />
                    </div>
                    <div class="text">
                      <h2 class="name">
                        { item.username }
                      </h2>
                      <p class="title">
                        {item.title}
                      </p>
                    </div>
                  </li>
                })
              }
            </ul>
          </div>
        </div>
      </Scroll>
    </div>
  }
})
