import { defineComponent, ref, watch, computed } from 'vue'
import './processBar.scss'
const PROCESS_BTN_WIDTH = 16
export default defineComponent({
  name: 'ProcessBar',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  emits: [
    'progress-changing',
    'progress-changed'
  ],
  setup (props, { emit }) {
    const offset = ref(0)
    const progressBarRef = ref(null)
    const progressRef = ref(null)
    const touch = {}

    const btnStyle = computed(() => {
      return {
        transform: `translate3d(${offset.value}px, 0, 0)`
      }
    })

    watch(() => props.progress, (newProgress) => {
      const processBarWidth = progressBarRef.value.clientWidth
      // 可偏移的最大宽度
      const offsetWith = processBarWidth - PROCESS_BTN_WIDTH
      offset.value = offsetWith * newProgress
      progressRef.value.style.width = processBarWidth * newProgress + 'px'
    })

    const touchStart = (e) => {
      const { pageX } = e.touches[0]
      touch.startPageX = pageX
      touch.startOffset = offset.value
    }

    const touchMove = (e) => {
      const { pageX } = e.touches[0]
      const { clientWidth } = progressBarRef.value
      const moveX = pageX - touch.startPageX
      const offsetX = Math.min(Math.max(moveX + touch.startOffset, 0), clientWidth - PROCESS_BTN_WIDTH)
      const procgress = offsetX / (clientWidth - PROCESS_BTN_WIDTH)
      progressRef.value.style.width = clientWidth * procgress + 'px'
      offset.value = offsetX
      emit('progress-changing', procgress)
    }

    const touchEnd = () => {
      const barWidth = progressBarRef.value.clientWidth - PROCESS_BTN_WIDTH
      const procgress = progressRef.value.clientWidth / barWidth
      emit('progress-changed', procgress)
    }

    const onClick = (e) => {
      const { offsetLeft, clientWidth } = progressBarRef.value
      const procgress = (e.pageX - offsetLeft) / clientWidth
      offset.value = (clientWidth - PROCESS_BTN_WIDTH) * procgress
      progressRef.value.style.width = clientWidth * procgress + 'px'
      emit('progress-changed', procgress)
    }

    return () => <div
      class="progress-bar"
      ref={progressBarRef}
      onClick={onClick}
    >
      <div class="bar-inner">
        <div
          class="progress"
          ref={progressRef}
        ></div>
        <div
          class="progress-btn-wrapper"
          style={btnStyle.value}
          ontouchstart={touchStart}
          ontouchmove={touchMove}
          ontouchend={touchEnd}
        >
          <div class="progress-btn"></div>
        </div>
      </div>
    </div>
  }
})
