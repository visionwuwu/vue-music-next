import { defineComponent, withModifiers } from 'vue'
import { useStore } from 'vuex'
import { useState, useGetters } from '@/hooks/useMapper'
import ProgressCircle from './progress-circle'
import './miniPlayer.scss'

export default defineComponent({
  name: 'MiniPlayer',
  setup () {
    const store = useStore()
    const { fullScreen } = useState(['currentSong'])
    const { currentSong } = useGetters(['currentSong'])

    const showNormalPlayer = () => {
      store.commit('setFullScreen', true)
    }

    const togglePlay = () => {}

    return () => <transition name="mini">
      <div
        class="mini-player"
        vShow={!fullScreen.value}
        onClick={showNormalPlayer}
      >
        <div class="cd-wrapper">
          <div
            ref="cdRef"
            class="cd"
          >
            <img
              ref="cdImageRef"
              width="40"
              height="40"
              src={currentSong.value.pic}
              class="cdCls"
            />
          </div>
        </div>
        <div class="control">
          <ProgressCircle
            radius="32"
            progress="progress"
          >
            <i
              class="icon-mini"
              class="miniPlayIcon"
              onClick={withModifiers(togglePlay, ['stop'])}
            ></i>
          </ProgressCircle>
        </div>
      </div>
    </transition>
  }
})
