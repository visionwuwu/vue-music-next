import { defineComponent, ref, watch, computed, withModifiers } from 'vue'
import { useStore } from 'vuex'
import { useState, useGetters } from '@/hooks/useMapper'
import useChangeMode from './useChangeMode'
import useFavorite from './useFavorite'
import useLyric from './useLyric'
import useCD from './useCD'
import useMiddleInteractive from './useMiddleInteractive'
import ProcessBar from './processBar'
import Scroll from '../base/scroll'
import { formatTime } from '@/assets/js/util'
import { PLAY_MODE } from '@/assets/js/constant'
import './index.scss'

export default defineComponent({
  name: 'Player',
  setup () {
    // data
    const audioRef = ref(null)
    const songReady = ref(false)
    const currentTime = ref(0)
    let progressChanging = false

    // vuex
    const store = useStore()
    const { currentIndex, playing, fullScreen, playList, playMode } = useState(
      ['playing', 'currentIndex', 'fullScreen', 'playList', 'playMode']
    )
    const { currentSong } = useGetters(['currentSong'])

    // hooks
    const { modeIcon, changeMode } = useChangeMode()
    const { toggleFavorite, getFavoriteIcon } = useFavorite(currentSong)
    const { cdCls, cdRef, cdImgRef } = useCD()
    const {
      currentLyric,
      currentLineNum,
      pureMusicLyric,
      playingLyric,
      lyricScrollRef,
      lyricListRef,
      playLyric,
      stopLyric
    } = useLyric({
      songReady,
      currentTime
    })
    const {
      currentShow,
      // currentView,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd
    } = useMiddleInteractive()

    // computed
    const playIcon = computed(() => {
      return playing.value ? 'icon-pause' : 'icon-play'
    })

    const disableCls = computed(() => {
      return songReady.value ? '' : 'disable'
    })

    const progress = computed(() => {
      return currentTime.value / currentSong.value.duration
    })

    // watch
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) return
      const audioEl = audioRef.value
      songReady.value = false
      audioEl.src = newSong.url
      audioEl.play()
      store.commit('setPlayingState', true)
    })

    watch(playing, (newPlaying) => {
      if (!songReady.value) {
        return
      }
      const audioEl = audioRef.value
      if (newPlaying) {
        audioEl.play()
        playLyric()
      } else {
        audioEl.pause()
        stopLyric()
      }
    })

    // methods
    const goBack = () => {
      store.commit('setFullScreen', false)
    }

    const togglePlay = () => {
      const list = playList.value
      if (!songReady.value || !list.length) {
        return
      }
      if (list.length === 1) {
        return loop()
      }
      store.commit('setPlayingState', !playing.value)
    }

    const prev = () => {
      const list = playList.value
      if (!songReady.value || !list.length) {
        return
      }
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value - 1
        if (index < 0) {
          index = list.length - 1
        }
        store.commit('setCurrentIndex', index)
      }
    }

    const next = () => {
      const list = playList.value
      if (!songReady.value || !list.length) {
        return
      }
      let index = currentIndex.value + 1
      if (index === list.length) {
        index = 0
      }
      store.commit('setCurrentIndex', index)
    }

    const ready = () => {
      if (songReady.value) {
        return
      }
      songReady.value = true
      playLyric()
    }

    const loop = () => {
      const audioEl = audioRef.value
      audioEl.currentTime = 0
      audioEl.play()
      store.commit('setPlayingState', true)
    }

    const timeUpdate = (e) => {
      if (!progressChanging) {
        currentTime.value = e.target.currentTime
        progressChanging = false
      }
    }

    const error = () => {
      songReady.value = true
    }

    const ended = () => {
      currentTime.value = 0
      if (playMode.value === PLAY_MODE.loop) {
        loop()
      } else {
        next()
      }
    }

    const onProgressChanging = (percent) => {
      progressChanging = true
      currentTime.value = percent * currentSong.value.duration
      playLyric()
      stopLyric()
    }

    const onProgressChanged = (percent) => {
      if (songReady.value) {
        audioRef.value.currentTime = percent * currentSong.value.duration
        audioRef.value.play()
        store.commit('setPlayingState', true)
        progressChanging = false
        playLyric()
      }
    }

    return () => <div
      className="player"
      vShow={playList.value.length}
    >
      <div
        class="normal-player"
        v-show={fullScreen.value}
      >
        <div class="background">
          <img src={currentSong.value.pic} />
        </div>
        <div class="top">
          <div
            class="back"
            onClick={goBack}
          >
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{ currentSong.value.name }</h1>
          <h2 class="subtitle">{ currentSong.value.singer }</h2>
        </div>
        <div
          class="middle"
          ontouchstart={withModifiers(onMiddleTouchStart, ['prevent'])}
          ontouchmove={withModifiers(onMiddleTouchMove, ['prevent'])}
          ontouchend={withModifiers(onMiddleTouchEnd, ['prevent'])}
        >
          <div
            class="middle-l"
            style={middleLStyle.value}
          >
            <div
              ref="cdWrapperRef"
              class="cd-wrapper"
            >
              <div
                ref={cdRef}
                class="cd"
              >
                <img
                  ref={cdImgRef}
                  class="image"
                  class={cdCls.value}
                  src={currentSong.value.pic} />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{playingLyric.value}</div>
            </div>
          </div>
          <Scroll
            class="middle-r"
            ref={lyricScrollRef}
            style={middleRStyle.value}
          >
            <div class="lyric-wrapper">
              {
                currentLyric.value && <div ref={lyricListRef}>
                  {
                    currentLyric.value.lines.map((line, index) => {
                      return <p
                        class={`text ${currentLineNum.value === index ? 'current' : ''}`}
                        key={line.num}
                      >
                        {line.txt}
                      </p>
                    })
                  }
                </div>
              }
              <div class="pure-music" vShow="pureMusicLyric">
                <p>{pureMusicLyric.value}</p>
              </div>
            </div>
          </Scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" class={ currentShow.value === 'cd' ? 'active' : '' }></span>
            <span class="dot" class={ currentShow.value === 'lyric' ? 'active' : ''}></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{formatTime(currentTime.value)}</span>
            <div class="progress-bar-wrapper">
              <ProcessBar
                ref="barRef"
                progress={progress.value}
                onProgressChanging={onProgressChanging}
                onProgressChanged={onProgressChanged}
              ></ProcessBar>
            </div>
            <span class="time time-r">{formatTime(currentSong.value.duration)}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i onClick={changeMode} className={modeIcon.value}></i>
            </div>
            <div className={`icon i-left ${disableCls.value}`}>
              <i onClick={prev} class="icon-prev"></i>
            </div>
            <div className={`icon i-center ${disableCls.value}`}>
              <i onClick={togglePlay} className={playIcon.value}></i>
            </div>
            <div className={`icon i-right ${disableCls.value}`}>
              <i onClick={next} class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i onClick={toggleFavorite} className={getFavoriteIcon()}></i>
            </div>
          </div>
        </div>
      </div>
      {/* 迷你播放器 */}
      <audio
        ref={audioRef}
        oncanplay={ready}
        ontimeupdate={timeUpdate}
        onerror={error}
        onended={ended}
      ></audio>
    </div>
  }
})
