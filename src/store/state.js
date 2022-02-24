import { load } from '@/assets/js/array-storage'
import { PLAY_MODE, KEY_FAVORITE } from '@/assets/js/constant'

const state = {
  sequenceList: [],
  playList: [],
  playing: false,
  playMode: PLAY_MODE.sequence,
  currentIndex: 0,
  fullScreen: false,
  favoriteList: load(KEY_FAVORITE) || []
}

export default state
