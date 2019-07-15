<template>
  <v-container fluid>
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
          v-model="date"
          label="Picker in menu"
          prepend-icon="event"
          readonly
          v-on="on"
          color="white"
        ></v-text-field>
      </template>
      <v-date-picker v-model="date" no-title scrollable>
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
        <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
      </v-date-picker>
    </v-menu>
    <v-toolbar flat color="white">
      <v-toolbar-title>Eligibility Service</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>

      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span v-if="req=='update'" class="headline">Update Eligibility Data.</span>
            <span v-else class="headline">Add new Eligibility Data.</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 lg6>
                  <v-text-field v-model="editedItem.primaryInsurance" label="Primary Insurance"></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field v-model="editedItem.secondaryInsurance" label="Seconday Insurance"></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field v-model="editedItem.coPay" type="number" label="CoPay"></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field v-model="editedItem.coInsurance" type="number" label="CoInsurance"></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field v-model="editedItem.deductible" type="number" label="deductible"></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="editedItem.maxOutOfPocket"
                    type="number"
                    label="Max Out Of Pocket"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="editedItem.patientBalance"
                    type="number"
                    label="Patient Balance"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field
                    v-model="editedItem.amountToCollect"
                    type="number"
                    label="Amount To Collect"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field v-model="editedItem.billerNotes" label="Billier Notes"></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field v-model="editedItem.frontDeskNotes" label="Front Desk Notes"></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field v-model="editedItem.adminNotes" label=" Admin Notes"></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-menu
                    ref="menu1"
                    v-model="menu1"
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
                        v-model="editedItem.date"
                        label="Picker in menu"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                        color="white"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="editedItem.date" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="menu1 = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.menu1.save(date)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
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
    <v-data-table :search="search" :headers="headers" :items="eligibility" class="elevation-1">
      <template v-slot:items="props">
        <td>
          <v-icon small class="mr-2 green--text curs" @click="getupdate(props.item)">edit</v-icon>
        </td>
        <td>{{ props.item.patient.firstName }}</td>
        <td>{{ props.item.patient.lastName }}</td>
        <td>{{ props.item.patient.dob.split("T")[0] }}</td>
        <td>{{ props.item.patient.emailAddress }}</td>
        <td>{{ props.item.primaryInsurance }}</td>
        <td>{{ props.item.secondaryInsurance }}</td>
        <td>{{ props.item.coPay }}</td>
        <td>{{ props.item.coInsurance }}</td>
        <td>{{ props.item.deductible }}</td>
        <td>{{ props.item.maxOutOfPocket }}</td>
        <td>{{ props.item.patientBalance }}</td>
        <td>{{ props.item.amountToCollect }}</td>
        <td>{{ props.item.billerNotes }}</td>
        <td>{{ props.item.frontDeskNotes }}</td>
        <td>{{ props.item.adminNotes }}</td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Eligibility',
  data: function() {
    return {
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      menu1: false,
      dialog: false,
      search: '',
      headers: [
        { text: 'Update', value: 'name' },
        { text: 'First name', value: 'patient.firstName' },
        { text: 'Last name', value: 'patient.lastName' },
        { text: 'patient Date', value: 'patient.dob' },
        { text: 'E-mail', value: 'patient.emailAddress' },
        { text: 'Primary Insurance', value: 'primaryInsurance' },
        { text: 'Secondary Insurance', value: 'secondaryInsurance' },
        { text: 'Co Pay', value: 'coPay' },
        { text: 'Co Insurance', value: 'coInsurance' },
        { text: 'Deductible', value: 'deductible' },
        { text: 'Max Out Of Pocket', value: 'maxOutOfPocket' },
        { text: 'Patient Balance', value: 'patientBalance' },
        { text: 'Amount To Collect', value: 'amountToCollect' },
        { text: 'Biller Notes', value: 'billerNotes' },
        { text: 'Front Desk Notes', value: 'frontDeskNotes' },
        { text: 'Admin Notes', value: 'adminNotes' }
      ],
      eligibility: [],
      editedIndex: -1,
      editedItem: {
        id: '',
        patientId: '',
        primaryInsurance: '',
        secondaryInsurance: '',
        coPay: null,
        coInsurance: null,
        deductible: null,
        maxOutOfPocket: null,
        patientBalance: null,
        amountToCollect: null,
        billerNotes: '',
        frontDeskNotes: '',
        adminNotes: '',
        date: new Date().toISOString().slice(0, 19),
        patient: {
          id: '',
          firstName: '',
          lastName: '',
          dob: new Date().toISOString().slice(0, 19),
          emailAddress: ''
        }
      },
      url: 'https://kj3u385k7h.execute-api.us-east-2.amazonaws.com/dev',
      req: 'new'
    }
  },
  methods: {
    load() {
      axios
        .get(this.url, {
          params: {
            date: this.date
          }
        })
        .then(res => {
          this.eligibility = JSON.parse(res.data.body)
        })
    },
    getupdate(item) {
      this.editedIndex = this.eligibility.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.req = 'update'
      this.dialog = true
    },
    update() {
      delete this.editedItem.patient
      if (this.req == 'update') {
        axios
          .post(this.url, this.editedItem, {
            params: {
              date: this.date
            }
          })
          .then(res => {
            this.load()
            this.close()
          })
      } else {
        const data = {
          new: [this.editedItem]
        }
        axios
          .put(this.url, this.editedItem, {
            params: {
              date: this.date
            }
          })
          .then(res => {
            this.load()
            this.close()
          })
      }
    },
    close() {
      this.editedItem = {
        id: '',
        patientId: '',
        primaryInsurance: '',
        secondaryInsurance: '',
        coPay: '',
        coInsurance: 0,
        deductible: '',
        maxOutOfPocket: '',
        patientBalance: '',
        amountToCollect: '',
        billerNotes: '',
        frontDeskNotes: '',
        adminNotes: '',
        date: new Date().toISOString().slice(0, 19),
        patient: {
          id: '',
          firstName: '',
          lastName: '',
          dob: new Date().toISOString().slice(0, 19),
          emailAddress: ''
        }
      }
      this.editedIndex = -1
      this.dialog = false
    }
  },
  created() {
    this.load()
  },
  watch: {
    date() {
      this.load()
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.editedItem.patientId = this.$route.query.id
      this.dialog = true
    }
  }
}
</script>
<style lang="scss" scoped>
.curs {
  cursor: pointer;
}
</style>
