import { useStore } from 'vuex'
import { useState } from '@/hooks/useMapper'
import { save, remove } from '@/assets/js/array-storage'
import { KEY_FAVORITE } from '@/assets/js/constant'

export default function useFavorite(song) {
  const store = useStore()
  const { favoriteList } = useState(['favoriteList'])

  const toggleFavorite = () => {
    if (!isFavorite(song)) {
      const list = save(song.value, KEY_FAVORITE, compare)
      store.commit('setFavoriteList', list)
    } else {
      const list = remove(KEY_FAVORITE, compare)
      store.commit('setFavoriteList', list)
    }
  }

  const compare = (list) => {
    return list.findIndex(item => item.id === song.value.id)
  }

  const getFavoriteIcon = () => {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  const isFavorite = (song) => {
    return favoriteList.value.findIndex(item => item.id === song.value.id) > -1
  }

  return {
    toggleFavorite,
    getFavoriteIcon
  }
}
