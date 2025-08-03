<template>
  <v-app>
    <v-container>
      <v-tabs>
        <v-tab href="#tpl" @click="currentComponent = 'SubscribeTemplate'">模板管理</v-tab>
        <v-tab href="#user" @click="currentComponent = 'SubscribeUser'">账户管理</v-tab>
      </v-tabs>

      <component :is="currentComponent"></component>
    </v-container>
  </v-app>
</template>

<script>
import SubscribeTemplate from '../components/SubscribeTemplate.vue'
import SubscribeUser from '../components/SubscribeUser.vue'

export default {
  components: {
    SubscribeTemplate,
    SubscribeUser
  },
  data() {
    return {
      // 存当前 tab 对应的 hash，v-tabs/v-model 会自动和 href="#..." 联动
      activeHash: window.location.hash || '#tpl'
    }
  },
  computed: {
    // 根据 hash 决定要加载哪个组件
    currentComponent() {
      switch (this.activeHash) {
        case '#user':
          return 'SubscribeUser'
        case '#tpl':
        default:
          return 'SubscribeTemplate'
      }
    }
  },
  watch: {
    // hash 变化就改 window.location.hash
    activeHash(newHash) {
      if (window.location.hash !== newHash) {
        window.location.hash = newHash
      }
    }
  },
  mounted() {
    this.syncHash()
    window.addEventListener('hashchange', this.syncHash)
  },
  beforeDestroy() {
    window.removeEventListener('hashchange', this.syncHash)
  },
  methods: {
    syncHash() {
      const h = window.location.hash || '#tpl'
      if (h !== this.activeHash) {
        this.activeHash = h
      }
    }
  }
}
</script>