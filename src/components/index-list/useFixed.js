import { ref, watch, nextTick, computed } from 'vue'
const TITLE_HEIGHT = 30
export default function useFixed(props) {
  const groupRef = ref(null)
  const listHeights = ref([])
  const scrollY = ref(0)
  const currentIndex = ref(0)
  const distance = ref(0)

  const fixedTitle = computed(() => {
    if (scrollY.value < 0) return ''
    const item = props.data[currentIndex.value]
    return item ? item.title : ''
  })

  const fixedTitleStyle = computed(() => {
    const distanceVal = distance.value
    let diff = 0
    if (distanceVal > 0 && distanceVal < TITLE_HEIGHT) {
      diff = distanceVal - TITLE_HEIGHT
    }
    return {
      transform: `translate3d(0, ${diff}px, 0)`
    }
  })

  watch(() => props.data, async () => {
    await nextTick()
    calculate()
  })

  watch(scrollY, (newY) => {
    for (let i = 0; i < listHeights.value.length - 1; i++) {
      const topHeight = listHeights.value[i]
      const bottomHeight = listHeights.value[i + 1]
      if (newY >= topHeight && newY <= bottomHeight) {
        currentIndex.value = i
        distance.value = bottomHeight - newY
      }
    }
  })

  const calculate = () => {
    const list = groupRef.value.children
    const listHeightsVal = listHeights.value
    let height = 0
    listHeightsVal.length = 0
    listHeightsVal.push(height)

    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeightsVal.push(height)
    }
  }

  const onScroll = (pos) => {
    scrollY.value = -pos.y
  }

  return {
    groupRef,
    onScroll,
    fixedTitle,
    currentIndex,
    fixedTitleStyle
  }
}
