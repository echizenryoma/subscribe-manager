<template>
  <v-app>
    <v-container>
      <v-tabs>
        <v-tab @click="currentComponent = 'SubscribeUser'">账户管理</v-tab>
      </v-tabs>

      <component :is="currentComponent"></component>
    </v-container>
  </v-app>
</template>

<script>
import SubscribeUser from '../components/SubscribeUser.vue'

export default {
  components: {
    SubscribeUser
  },
  data() {
    return {
      currentComponent: 'SubscribeUser'
    }
  }
}
</script>
