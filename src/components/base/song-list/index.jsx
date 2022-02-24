import { defineComponent } from 'vue'
import './index.scss'

export default defineComponent({
  name: 'SongList',
  props: {
    songs: {
      type: Array,
      default: () => ([])
    }
  },
  emits: ['select'],
  setup (props, { emit }) {
    const getDesc = (song) => {
      return `${song.singer}·${song.album}`
    }

    const selectItem = (song, index) => {
      emit('select', { song, index })
    }

    return () => <ul class="song-list">
      {props.songs.map((song, index) => {
        return <li
          class="item"
          key={song.id}
          onClick={() => selectItem(song, index)}
        >
          <div class="content">
            <h2 class="name">{song.name}</h2>
            <p class="desc">{getDesc(song)}</p>
          </div>
        </li>
      })}
    </ul>
  }
})
