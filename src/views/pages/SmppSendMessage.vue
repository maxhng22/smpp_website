<template>
  <div class="card">
    <h1>Account</h1>
    <div class="p-fluid formgrid grid">
      <div class="field col-12 md:col-2">
        <label for="to" class="p-sr-only">Host</label>
        <InputText v-model="host" id="to" type="text" placeholder="Host" />
      </div>

      <div class="field col-12 md:col-2">
        <label for="to" class="p-sr-only">Port</label>
        <InputText v-model="port" id="to" type="text" placeholder="Port" />
      </div>

      <div class="field col-12 md:col-2">
        <label for="to" class="p-sr-only">System ID</label>
        <InputText v-model="systemId" id="to" type="text" placeholder="System ID" />
      </div>

      <div class="field col-12 md:col-2">
        <label for="to" class="p-sr-only">Password</label>
        <InputText v-model="password" id="to" type="text" placeholder="Password" />
      </div>

      <div class="field col-12 md:col-2">
        <label for="to" class="p-sr-only">System Type</label>
        <InputText v-model="systemType" id="to" type="text" placeholder="System Type" />
      </div>

      <div class="field col-12 md:col-2">
        <label for="to" class="p-sr-only">Version</label>
        <Dropdown id="state" v-model="version" :options="dropdownItemsVersion" optionLabel="name"
          placeholder="Select One Version">
        </Dropdown>
        <!-- <InputText v-model="version" id="to" type="text" placeholder="Version" /> -->
      </div>



      <div class="field col-12 md:col-5 lg:col-5">
        <ButtonGroup>
          <Button label="Connect" @click="connectSmpp" :disabled="connectStatus" />
          <Button label="Tx-Only" severity="secondary" @click="txonlySmpp" />
          <Button label="Rx-Only" @click="rxonlySmpp" />
          <Button label="Disconnect" severity="secondary" @click="disconnectSmpp" :disabled="!connectStatus" />
        </ButtonGroup>
      </div>
    </div>
    <h5>SMPP Connections</h5>
    <DataTable :value="tableData1" :paginator="false" :rows="10" dataKey="id" :rowHover="true" v-model:filters="filters1"
      filterDisplay="menu" :loading="loading1"
      :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']" showGridlines>

      <template #empty> No data found. </template>
      <template #loading> Loading customers data. Please wait. </template>
      <Column field="name" header="Name" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.name }}
        </template>
        <template #filter="{ filterModel }">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />
        </template>
      </Column>

      <Column field="system" header="System ID" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.systemId }}
        </template>
        <template #filter="{ filterModel }">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />
        </template>
      </Column>

      <Column field="version" header="Version" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.version }}
        </template>
        <template #filter="{ filterModel }">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />
        </template>
      </Column>


      <!-- <Column header="Date" filterField="date" dataType="date" style="min-width: 10rem">
        <template #body="{ data }">
          {{ formatDate(data.date) }}
        </template>
        <template #filter="{ filterModel }">
          <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
        </template>
      </Column> -->

      <Column field="status" header="Status" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
        <template #body="{ data }">
          <Tag :severity="getSeverity(data.status)">{{ data.status.toUpperCase() }}</Tag>
        </template>
        <template #filter="{ filterModel }">
          <Dropdown v-model="filterModel.value" :options="statuses" placeholder="Any" class="p-column-filter"
            :showClear="true">
            <template #value="slotProps">
              <Tag :severity="getSeverity(slotProps.value)" v-if="slotProps.value">{{ slotProps.value }} </Tag>
              <span v-else>{{ slotProps.placeholder }}</span>
            </template>
            <template #option="slotProps">
              <Tag :severity="getSeverity(slotProps.option)">{{ slotProps.option.toUpperCase() }}</Tag>
            </template>
          </Dropdown>
        </template>
      </Column>

    </DataTable>



    <h1>Send Message</h1>
    <div class="p-fluid formgrid grid">
      <div class="field col-12 md:col-4">
        <label for="to" class="p-sr-only">Source address</label>
        <InputText v-model="from" id="to" type="text" placeholder="Source address" />
      </div>

      <div class="field col-12 md:col-4">
        <label for="to" class="p-sr-only">Destination address</label>
        <InputText v-model="to" id="to" type="text" placeholder="Destination address" />
      </div>

      <div class="field col-12 md:col-4">
        <label for="to" class="p-sr-only">Registered delivery</label>
        <Dropdown id="state" v-model="dropdownItem" :options="dropdownItems" optionLabel="name"
          placeholder="Select One">
        </Dropdown>
      </div>

      <div class="field col-12">
        <label for="message" class="p-sr-only">Message</label>
        <Textarea v-model="message" id="message" type="text" placeholder="Message" rows="4" />
      </div>
      <div class="field col-2">
        <Button label="Send" @click="sendMessage" :disabled="!connectStatus"></Button>
      </div>
    </div>

    <h1>Logs</h1>
    <DataTable :value="tableData2" :paginator="true" :rows="10" dataKey="id" :rowHover="true" v-model:filters="filters1"
      filterDisplay="menu" :loading="loading1" :filters="filters1" :globalFilterFields="[]" showGridlines>

      <template #empty> No data found. </template>
      <template #loading> Loading customers data. Please wait. </template>

         <Column header="Datetime" filterField="date" dataType="date" style="min-width: 10rem">
        <template #body="{ data }">
          {{ data.datetime }}
        </template>
        <template #filter="{ filterModel }">
          <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
        </template>
      </Column>

      <Column field="name" header="Source" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.source_address }}
        </template>
        <template #filter="{ filterModel }">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />
        </template>
      </Column>

      <Column field="name" header="Destination" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.destination_address }}
        </template>
        <template #filter="{ filterModel }">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />
        </template>
      </Column>

      <Column field="name" header="Message" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.message }}
        </template>
        <template #filter="{ filterModel }">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />
        </template>
      </Column>

   

      <Column field="status" header="Status" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
        <template #body="{ data }">
          <Tag :severity="getSeverity(data.status)">{{ data.status.toUpperCase() }}</Tag>
        </template>
        <template #filter="{ filterModel }">
          <Dropdown v-model="filterModel.value" :options="statuses" placeholder="Any" class="p-column-filter"
            :showClear="true">
            <template #value="slotProps">
              <Tag :severity="getSeverity(slotProps.value)" v-if="slotProps.value">{{ slotProps.value }} </Tag>
              <span v-else>{{ slotProps.placeholder }}</span>
            </template>
            <template #option="slotProps">
              <Tag :severity="getSeverity(slotProps.option)">{{ slotProps.option.toUpperCase() }}</Tag>
            </template>
          </Dropdown>
        </template>
      </Column>

    </DataTable>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, reactive } from 'vue';
import { sendMessageSMPP, txOnlySMPP, rxOnlySMPP, connectSMPP, disConnectSMPP, getSMPPConnection } from '@/service/smpp/smpp';
import { getLog } from '@/service/log/log';
import { useToast } from 'primevue/usetoast';

// host,port,systemId,password,systemType,version
const toast = useToast(); // Move useToast inside a function
const from = ref('');
const to = ref('');
const host = ref('');
const port = ref('');
const systemId = ref('');
const systemType = ref('');
const password = ref('');
const version = ref({ name: 'v3.4 (0x34)', code: 2 });
const dropdownItem = ref('');
let connectStatus = ref(false)
// const message = ref('');
// const to = ref('');
// const message = ref('');

const tableData1 = ref(null);
const tableData2 = ref(null);

const filters1 = ref(null);
const loading1 = ref(null);

const statuses = reactive(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);


const dropdownItems = ref([
  { name: 'MC Delivery Receipt', code: 1 },
  { name: 'No MC Delivery Receipt', code: 0 },
  { name: 'MC Delivery Receipt on fail', code: 2 },
  { name: 'MC Delivery Receipt on success', code: 3 },
  { name: 'Intermediate notification', code: 16 },
  { name: 'Intermediate + MC Delivery Receipt', code: 17 },
  { name: 'Intermediate + MC Delivery Receipt on fail', code: 18 },
  { name: 'Intermediate + MC Delivery Receipt on success', code: 19 }
]);
// Default (0x00),v3.3 (0x33),v3.4 (0x34),v5 (0x50)
const dropdownItemsVersion = ref([
  { name: 'Default (0x00)', code: 1 },
  { name: 'v3.3 (0x33)', code: 0 },
  { name: 'v3.4 (0x34)', code: 2 },
  { name: 'v5 (0x50)', code: 3 },
]);


const getBadgeSeverity = (inventoryStatus) => {
  switch (inventoryStatus.toLowerCase()) {
    case 'instock':
      return 'success';
    case 'lowstock':
      return 'warning';
    case 'outofstock':
      return 'danger';
    default:
      return 'info';
  }
};
const getSeverity = (status) => {
  switch (status) {
    case 'error':
      return 'danger';

    case 'connected':
      return 'success';

    case 'failed_to_connect':
      return 'info';

    case 'disconnected':
      return 'warning';

    case 'renewal':
      return null;
  }
};

onBeforeMount(async () => {
  const data = await getLog()
  tableData2.value = data.data;

});



const clearFilter1 = () => {
  initFilters1();
};

const formatDate = (value) => {
  return value.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};


const sendMessage = async () => {
  try {

    await sendMessageSMPP(from.value, to.value, message.value, dropdownItem.value.name);
    const data = await getLog()
    tableData2.value = data.data;
    showSuccess();
  } catch (error) {
    showError(`Failed to send message:`, error);
    // console.error('Failed to send message:', error);
  }


};


const connectSmpp = async () => {

  try {
    await connectSMPP(host.value, port.value, systemId.value, password.value, systemType.value, version.value.name);
    // smpppConnection()
    showSuccess();
  } catch (error) {
    showError(`Failed to send message:`, error);
    // console.error('Failed to send message:', error);
  }
  const data = await getSMPPConnection()
  tableData1.value = data.data;
  if (data.data[0].status === "connected") {
    connectStatus.value = true;
  } else {
    connectStatus.value = false;
  }

};

const disconnectSmpp = async () => {
  try {
    await disConnectSMPP(host.value, port.value, systemId.value, password.value, systemType.value, version.value.name);

  } catch (error) {
    showError(`Failed to send message:`, error);

    // console.error('Failed to send message:', error);
  }

  const data = await getSMPPConnection()
  tableData1.value = data.data;
  if (data.data[0].status === "connected") {
    connectStatus.value = true;
  } else {
    connectStatus.value = false;
  }
};

const txonlySmpp = async () => {
  try {
    await txOnlySMPP(host.value, port.value, systemId.value, password.value, systemType.value, version.value.name);

  } catch (error) {
    showError(`Failed to send message:`, error);

    // console.error('Failed to send message:', error);
  }
};

const rxonlySmpp = async () => {
  try {
    await rxOnlySMPP(host.value, port.value, systemId.value, password.value, systemType.value, version.value.name);

  } catch (error) {
    showError(`Failed to send message:`, error);

    // console.error('Failed to send message:', error);
  }
};



const showSuccess = (detail) => {
  toast.add({ severity: 'success', summary: 'Success Message', detail: detail||'Operation success', life: 3000 });
};

const showError = (summary, detail) => {
  toast.add({ severity: 'error', summary: 'Error Message', detail: detail||'Please try again later', life: 3000 });
};

// Define other toast functions here
</script>

<style scoped>
/* Add your styles here */
</style>