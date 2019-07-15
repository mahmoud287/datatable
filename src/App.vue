<template>
  <v-app>
    <nav class="mb-4">
      <router-link class="mr-4" to="/Patients">Patients</router-link>
      <router-link to="/Eligibility">Eligibility</router-link>
    </nav>
    <router-view></router-view>
  </v-app>
</template>

<script>
import Eligibility from './components/Eligibility'
import Patient from './components/Patient'

export default {
  name: 'app',
  components: {
    Patient,
    Eligibility
  },
  data() {
    return {
      //
    }
  }
}
</script>
<style lang="scss" scoped>
#app {
  height: 100vh;
}
</style>

