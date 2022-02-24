import { defineComponent, ref, toRefs } from 'vue'
import useSlider from './useSlider'
import './index.scss'

export default defineComponent({
  name: 'Slider',
  props: {
    sliders: {
      type: Array,
      default: () => ([])
    }
  },
  setup (props) {
    const rootRef = ref(null)
    const { sliders } = toRefs(props)
    const { currentPageIndex } = useSlider(rootRef)

    return () => <div class="slider" ref={rootRef}>
      <div class="slider-group">
        {
          sliders.value.map(item => {
            return <div
              class="slider-page"
              key={item.id}
            >
              <a href={item.link}>
                <img src={item.pic} />
              </a>
            </div>
          })
        }
      </div>
      <div class="dots-wrapper">
        {
          sliders.value.map((item, index) => {
            return <span
              class="dot"
              key={item.id}
              className={`dot ${currentPageIndex.value === index ? 'active' : ''}`}>
            </span>
          })
        }
      </div>
    </div>
  }
})
