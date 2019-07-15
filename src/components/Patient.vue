<template>
  <v-container fluid>
    <v-toolbar flat color="white">
      <v-toolbar-title>Patient Service</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      <v-spacer></v-spacer>
      <v-btn color="blue" @click="dialog=true" class="white--text">Add new</v-btn>
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span v-if="req=='update'" class="headline">Update Patient Data.</span>
            <span v-else class="headline">Add new Patient Data.</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field v-model="editedItem.firstName" label="First name"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="editedItem.lastName" label="Last name"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="date"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="editedItem.dob"
                        label="Picker in menu"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                        color="white"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="editedItem.dob" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="editedItem.emailAddress" label="E-mail"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" flat @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click="update">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table :search="search" :headers="headers" :items="patients" class="elevation-1">
      <template v-slot:items="props">
        <td>{{props.index}}</td>
        <td>{{ props.item.firstName }}</td>
        <td>{{ props.item.lastName }}</td>
        <td>{{ props.item.dob.split("T")[0] }}</td>
        <td>{{ props.item.emailAddress }}</td>
        <td>
          <v-icon small class="mr-2 green--text curs" @click="getupdate(props.item)">edit</v-icon>
        </td>
        <td>
          <v-icon small class="mr-2 green--text curs" @click="eli(props.item)">note_add</v-icon>
        </td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from 'axios'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

export default {
  name: 'patients',
  components: {
    UploadExcelComponent
  },
  data: function() {
    return {
      dialog: false,
      search: '',
      headers: [
        {
          text: 'id',
          align: 'left',
          value: 'index'
        },
        {
          text: 'First name',
          value: 'firstName'
        },
        { text: 'Last name', value: 'lastName' },
        { text: 'Date Of Birth', value: 'dob' },
        { text: 'E-mail', value: 'emailAddress' },
        { text: 'Update', value: 'name', sortable: false },
        { text: 'New Eligibility', value: 'name', sortable: false }
      ],
      patients: [],
      editedIndex: -1,
      editedItem: {
        firstName: '',
        lastName: '',
        dob: new Date().toISOString().slice(0, 19),
        emailAddress: ''
      },
      url:
        'https://qs9ttftwp7.execute-api.us-east-2.amazonaws.com/dev/patientservice',
      req: 'new'
    }
  },
  methods: {
    load() {
      axios.get(this.url).then(res => {
        this.patients = JSON.parse(res.data.body)
      })
    },
    getupdate(item) {
      this.editedIndex = this.patients.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.req = 'update'
      this.dialog = true
    },
    update() {
      if (this.req == 'update') {
        axios.post(this.url, this.editedItem).then(res => {
          this.load()
          this.close()
        })
      } else {
        const data = {
          new: [this.editedItem]
        }
        axios.put(this.url, data.new).then(res => {
          this.load()
          this.close()
        })
      }
    },
    close() {
      this.editedItem = {
        firstName: '',
        lastName: '',
        dob: new Date().toISOString().slice(0, 19),
        emailAddress: ''
      }
      this.editedIndex = -1
      this.dialog = false
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      axios.put(this.url, results).then(res => {
        this.load()
      })
    },
    eli(item) {
      console.log('OUTPUT IS: new -> item', item)
      this.$router.push({ path: '/Eligibility', query: { id: item.id } })
    }
  },
  created() {
    this.load()
  }
}
</script>
<style lang="scss" scoped>
.curs {
  cursor: pointer;
}
</style>
