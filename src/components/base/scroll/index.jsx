import { defineComponent, ref } from 'vue'
import useScroll from './useScroll'

export default defineComponent({
  name: 'Scroll',
  props: {
    click: {
      type: Boolean,
      default: true
    },
    probeType: {
      type: Number,
      default: 0
    }
  },
  emits: ['scroll'],
  setup (props, { slots, emit, expose }) {
    const rootRef = ref(null)
    const scroll = useScroll(rootRef, props, emit)
    expose({
      scroll
    })

    return () => <div ref={rootRef}>
      {slots.default()}
    </div>
  }
})
