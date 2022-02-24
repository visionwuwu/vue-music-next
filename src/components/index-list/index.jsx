import { defineComponent, withModifiers } from 'vue'
import Scroll from '../base/scroll'
import useFixed from './useFixed'
import useShortcut from './useShortcut'
import './index.scss'

export default defineComponent({
  name: 'IndexList',
  props: {
    data: {
      type: Array,
      default: () => ([])
    }
  },
  emits: ['select'],
  setup (props, { emit }) {
    const { groupRef, onScroll, fixedTitle, fixedTitleStyle, currentIndex } = useFixed(props)
    const {
      shortcutList,
      onShortcutTouchStart,
      onShortcutTouchMove,
      onShortcutTouchEnd,
      scrollRef
    } = useShortcut(props, groupRef)

    const handleClickItem = (item) => {
      emit('select', item)
    }

    return () => <Scroll
      className="index-list"
      probeType={3}
      onScroll={onScroll}
      ref={scrollRef}
    >
      <ul ref={groupRef}>
        {
          props.data.map(group => {
            return <li class="group" key={group.title}>
              <h2 class="title">{group.title}</h2>
              <ul>
                {
                  group.list.map(item => {
                    return <li
                      key={item.id}
                      class="item"
                      onClick={() => handleClickItem(item)}
                    >
                      <img class="avatar" v-lazy={item.pic} />
                      <span class="name">{item.name}</span>
                    </li>
                  })
                }
              </ul>
            </li>
          })
        }
      </ul>
      <div
        className="fixed"
        v-show={fixedTitle.value}
        style={fixedTitleStyle.value}
      >
        <div className="fixed-title">
          {fixedTitle.value}
        </div>
      </div>
      <div
        class="shortcut"
        ontouchstart={withModifiers(onShortcutTouchStart, ['stop', 'prevent'])}
        ontouchmove={withModifiers(onShortcutTouchMove, ['stop', 'prevent'])}
        ontouchend={withModifiers(onShortcutTouchEnd, ['stop', 'prevent'])}
      >
        <ul>
          {
            shortcutList.value.map((item, index) => {
              return <li
                key={item}
                data-index={index}
                class={`item ${currentIndex.value === index ? 'current' : ''}`}>
                {item}
              </li>
            })
          }
        </ul>
      </div>
    </Scroll>
  }
})
