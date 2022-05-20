<template>
  <div>
    <div>
      <div>Path</div>
      <input v-model="commandData.path">
      <br><br>
    </div>

    <div>
      <div>Domain</div>
      <input v-model="commandData.domain">
      <br><br>
    </div>

    <div>
      <div>Email</div>
      <input v-model="commandData.email">
      <br><br>
    </div>

    <div>
      <label>SSL</label>
      <input type="checkbox" v-model="commandData.ssl">
      <br><br>
    </div>

    <div>
      <label>SPA(Vue)</label>
      <input type="checkbox" v-model="commandData.spa">
      <br><br>
    </div>

    <div v-html="nl2br(command)"></div>
  </div>
</template>

<script lang="babel" type="text/babel">
export default {
  data: () => ({
    commandData: {
      path: '/path',
      domain: 'foobar.com',
      email: 'foobar@gmail.com',
      ssl: true,
      spa: false,
    },
  }),
  methods: {
    nl2br(data) {
      const result = String(data).replace(/(?:\r\n|\r|\n)/g, '<br>')
      if(!result) return ''
      if(result == 'null') return ''
      return result
    },
  },
  computed: {
    command() {
      let command = `hyper-rocket nginx:site \\
&nbsp;&nbsp;&nbsp;&nbsp; --filename ${this.commandData.domain} \\
&nbsp;&nbsp;&nbsp;&nbsp; --path ${this.commandData.path} \\
`
      if(this.commandData.ssl === true) {
        command += `&nbsp;&nbsp;&nbsp;&nbsp; --ssl \\
`
      }

      if(this.commandData.spa === true) {
        command += `&nbsp;&nbsp;&nbsp;&nbsp; --spa \\
`
      }

      command += `&nbsp;&nbsp;&nbsp;&nbsp; --domain ${this.commandData.domain} \\
&nbsp;&nbsp;&nbsp;&nbsp; --email ${this.commandData.email}`

      return command
    },
  },
}
</script>

<style scoped>
</style>
