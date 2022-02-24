import { computed, ref } from 'vue'

export default function useShortcut(props, groupRef) {
  const ANCHOR_HEIGHT = 18
  const scrollRef = ref(null)
  const shortcutList = computed(() => {
    return props.data.map((group) => group.title)
  })

  const touch = {}
  const onShortcutTouchStart = (e) => {
    const anchorIndex = parseInt(e.target.dataset.index)
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex
    scrollTo(anchorIndex)
  }
  const onShortcutTouchMove = (e) => {
    touch.y2 = e.touches[0].pageY
    const delta = Math.floor((touch.y2 - touch.y1) / ANCHOR_HEIGHT)
    const anchorIndex = touch.anchorIndex + delta
    scrollTo(anchorIndex)
  }
  const onShortcutTouchEnd = () => {}

  function scrollTo (index) {
    const targetEl = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    if (targetEl) {
      scroll.scrollToElement(targetEl, 0)
    }
  }

  return {
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove,
    onShortcutTouchEnd,
    scrollRef
  }
}
