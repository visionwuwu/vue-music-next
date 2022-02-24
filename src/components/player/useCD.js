import { watch, ref, computed } from 'vue'
import { useState } from '@/hooks/useMapper'

export default function useCD() {
  const { playing } = useState(['playing'])
  const cdRef = ref(null)
  const cdImgRef = ref(null)

  const cdCls = computed(() => {
    return playing.value ? 'playing' : ''
  })

  watch(playing, (newPlaying) => {
    if (!newPlaying) {
      syncTransformRotate()
    }
  })

  function syncTransformRotate() {
    const wrapTransform = getComputedStyle(cdRef.value).transform
    const innerTransform = getComputedStyle(cdImgRef.value).transform
    cdRef.value.style.transform = wrapTransform === 'none' ? innerTransform : innerTransform.concat(' ', wrapTransform)
  }

  return {
    cdCls,
    cdRef,
    cdImgRef
  }
}
