import { computed } from 'vue'
import { useStore } from 'vuex'
import { useState, useGetters } from '@/hooks/useMapper'
import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

export default function useChangeMode() {
  const { playMode, playList } = useState(['playMode', 'playList'])
  const { currentSong } = useGetters(['currentSong'])
  const store = useStore()

  const modeIcon = computed(() => {
    const mode = playMode.value
    return mode === PLAY_MODE.sequence ? 'icon-sequence' : mode === PLAY_MODE.loop ? 'icon-loop' : 'icon-random'
  })

  const toggleMode = () => {
    // 改变播放模式
    const mode = (playMode.value + 1) % 3
    store.commit('setPlayMode', mode)
  }

  const changeMode = () => {
    toggleMode()
    // 重新洗牌
    const id = currentSong.value.id
    const list = shuffle(playList.value)
    const index = list.findIndex(item => item.id === id)
    store.commit('setPlayList', list)
    store.commit('setCurrentIndex', index)
  }

  return {
    modeIcon,
    changeMode
  }
}
