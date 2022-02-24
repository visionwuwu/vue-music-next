import { defineComponent } from 'vue'
import './index.scss'

export default defineComponent({
  name: 'm-header',
  setup () {
    return () => <div class="header">
      <span class="icon"></span>
      <h1 class="text">Chicken Music</h1>
      <router-link class="mine" to="/user">
        <i class="icon-mine"></i>
      </router-link>
    </div>
  }
})
