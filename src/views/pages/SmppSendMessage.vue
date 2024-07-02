<template>
  <div class="card">
    <h1>SMPP Connections</h1>
    <DataTable :value="customer1" :paginator="true" :rows="10" dataKey="id" :rowHover="true" v-model:filters="filters1"
      filterDisplay="menu" :loading="loading1" :filters="filters1"
      :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']" showGridlines>
      <template #header>
        <div class="flex justify-content-between flex-column sm:flex-row">
          <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter1()" />
          <IconField iconPosition="left">
            <InputIcon class="pi pi-search" />
            <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%" />
          </IconField>
        </div>
      </template>
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


      <Column header="Date" filterField="date" dataType="date" style="min-width: 10rem">
        <template #body="{ data }">
          {{ formatDate(data.date) }}
        </template>
        <template #filter="{ filterModel }">
          <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
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
        <InputText v-model="version" id="to" type="text" placeholder="Version" />
      </div>



      <div class="field col-12 md:col-5 lg:col-5">
        <ButtonGroup>
          <Button label="Connect"  @click="connectSmpp"/>
          <Button label="Tx-Only" severity="secondary" @click="txonlySmpp" />
          <Button label="Rx-Only" @click="rxonlySmpp" />
          <Button label="Disconnect" severity="secondary" @click="disconnectSmpp" />
      </ButtonGroup>
    </div>
    </div>
    
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
        <Dropdown id="state" v-model="dropdownItem" :options="dropdownItems" optionLabel="name" placeholder="Select One"></Dropdown>
      </div>

      <div class="field col-12">
        <label for="message" class="p-sr-only">Message</label>
        <Textarea v-model="message" id="message" type="text" placeholder="Message" rows="4" />
      </div>
      <div class="field col-2">
      <Button label="Send" @click="sendMessage"></Button>
    </div>
    </div>

    <h1>Logs</h1>
    <DataTable :value="customer1" :paginator="true" :rows="10" dataKey="id" :rowHover="true" v-model:filters="filters1"
      filterDisplay="menu" :loading="loading1" :filters="filters1"
      :globalFilterFields="[]" showGridlines>
      <template #header>
        <div class="flex justify-content-between flex-column sm:flex-row">
          <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter1()" />
          <IconField iconPosition="left">
            <InputIcon class="pi pi-search" />
            <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%" />
          </IconField>
        </div>
      </template>
      <template #empty> No data found. </template>
      <template #loading> Loading customers data. Please wait. </template>
      <Column field="name" header="Source" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.name }}
        </template>
        <template #filter="{ filterModel }">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />
        </template>
      </Column>


      <Column header="Destination" filterField="date" dataType="date" style="min-width: 10rem">
        <template #body="{ data }">
          {{ formatDate(data.date) }}
        </template>
        <template #filter="{ filterModel }">
          <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
        </template>
      </Column>

      <Column field="status" header="Message" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
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
import { sendMessageSMPP,txOnlySMPP,rxOnlySMPP,connectSMPP,disConnectSMPP,getSMPPConnection } from '@/service/smpp/smpp';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { CustomerService } from '@/service/CustomerService';
import { ProductService } from '@/service/ProductService';

// host,port,systemId,password,systemType,version
const toast = useToast(); // Move useToast inside a function
const from = ref('');
const to = ref('');
const host = ref('');
const port = ref('');
const systemId = ref('');
const systemType = ref('');
const password = ref('');
const version = ref('');
const dropdownItem = ref('');
// const message = ref('');
// const to = ref('');
// const message = ref('');

const customer1 = ref(null);
const customer2 = ref(null);
const customer3 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const loading2 = ref(null);
const idFrozen = ref(false);
const products = ref(null);
const expandedRows = ref([]);
const statuses = reactive(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);
const representatives = reactive([
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'XuXue Feng', image: 'xuxuefeng.png' }
]);

const customerService = new CustomerService();
const productService = new ProductService();
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
        case 'down':
            return 'danger';

        case 'up':
            return 'success';

        case 'new':
            return 'info';

        case 'negotiation':
            return 'warning';

        case 'renewal':
            return null;
    }
};

onBeforeMount(() => {
    productService.getProductsWithOrdersSmall().then((data) => (products.value = data));
    customerService.getCustomersLarge().then((data) => {
      console.log(data)
        customer1.value = data;
        loading1.value = false;
        customer1.value.forEach((customer) => (customer.date = new Date(customer.date)));
    });

    
    customerService.getCustomersLarge().then((data) => (customer2.value = data));
    customerService.getCustomersMedium().then((data) => (customer3.value = data));
    loading2.value = false;

    initFilters1();
});

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        // activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
};

const clearFilter1 = () => {
    initFilters1();
};
const expandAll = () => {
    expandedRows.value = products.value.reduce((acc, p) => (acc[p.id] = true) && acc, {});
};
const collapseAll = () => {
    expandedRows.value = null;
};
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const formatDate = (value) => {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
const calculateCustomerTotal = (name) => {
    let total = 0;
    if (customer3.value) {
        for (let customer of customer3.value) {
            if (customer.representative.name === name) {
                total++;
            }
        }
    }

    return total;
};

const sendMessage = async () => {
  try {

    const data =await getSMPPConnection()
    console.log(data)
        await sendMessageSMPP(from.value, to.value,message.value,dropdownItem.value);
        showSuccess();
    } catch (error) {
        showError(`Failed to send message:`,error);
        // console.error('Failed to send message:', error);
    }


};


const connectSmpp = async () => {
  try {
        await connectSMPP(host.value, port.value,systemId.value, password.value,systemType.value,version.value);
       
    } catch (error) {
        showError(`Failed to send message:`,error);
        // console.error('Failed to send message:', error);
    }
};

const disconnectSmpp = async () => {
  try {
        await disConnectSMPP(host.value, port.value,systemId.value, password.value,systemType.value,version.value);
  
    } catch (error) {
        showError(`Failed to send message:`,error);
    
        // console.error('Failed to send message:', error);
    }
};

const txonlySmpp = async () => {
  try {
        await txOnlySMPP(host.value, port.value,systemId.value, password.value,systemType.value,version.value);
     
    } catch (error) {
        showError(`Failed to send message:`,error);
    
        // console.error('Failed to send message:', error);
    }
};

const rxonlySmpp = async () => {
  try {
        await rxOnlySMPP(host.value, port.value,systemId.value, password.value,systemType.value,version.value);
     
    } catch (error) {
        showError(`Failed to send message:`,error);

        // console.error('Failed to send message:', error);
    }
};



const showSuccess = () => {
  toast.add({ severity: 'success', summary: 'Success Message', detail: 'Message Detail', life: 3000 });
};

const showError = (summary, detail) => {
  toast.add({ severity: 'error', summary: 'Error Message', detail: 'Message Detail', life: 3000 });
};

// Define other toast functions here
</script>

<style scoped>
/* Add your styles here */
</style>