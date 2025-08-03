<template>
  <v-app>
    <v-container>
      <v-tabs>
        <v-tab @click="currentComponent = 'SubscribeTemplate'">模板管理</v-tab>
        <v-tab @click="currentComponent = 'SubscribeUser'">账户管理</v-tab>
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
      currentComponent: 'SubscribeTemplate'
    }
  }
}
</script>
