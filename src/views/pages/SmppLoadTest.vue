<template>
  <div class="card">
    <h1>SMPP Account</h1>
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



    </div>

    <h1>Configure submit_sm</h1>
    <div class="p-fluid formgrid grid">
      <div class="field col-12 md:col-2">
        <label for="to" class="p-sr-only">Source address</label>
        <InputText v-model="from" id="to" type="text" placeholder="Source address" />
      </div>

      <div class="field col-12 md:col-2">
        <label for="to" class="p-sr-only">Destination address</label>
        <InputText v-model="to" id="to" type="text" placeholder="Destination address" />
      </div>


      <div class="field col-6">
        <label for="message" class="p-sr-only">Message</label>
        <Textarea v-model="message" id="message" type="text" placeholder="Message" rows="3" />
      </div>
      <div class="field col-12">
        <div class="p-fluid formgrid grid">
          <span class="ml-4 flex flex-column">
            <span class="text-900 lg:text-xl font-medium mb-0 block">1 SMS</span>
            <span class="text-600 lg:text-xl">SMS per message</span>
          </span>
          <span class="ml-7 flex flex-column">
            <span class="text-900 lg:text-xl font-medium mb-0 block">12 chars (84 bits)</span>
            <span class="text-600 lg:text-xl">Message size</span>
          </span>
          <span class="ml-7 flex flex-column">
            <span class="text-900 lg:text-xl font-medium mb-0 block">GSM7</span>
            <span class="text-600 lg:text-xl">Character set (suggested)</span>
          </span>
        </div>
      </div>
    </div>

    <h1>Configure test run</h1>
    <div class="p-fluid formgrid grid">
      <div class="field col-12 md:col-2">
        <label for="to" class="p-sr-only">Messages</label>
        <InputText v-model="testMessages" id="to" type="text" placeholder="Messages" />
      </div>

      <div class="field col-12 md:col-2">
        <label for="to" class="p-sr-only">TPS</label>
        <InputText v-model="tps" id="to" type="text" placeholder="TPS" />
      </div>

      <div class="field col-12 md:col-2">
        <label for="to" class="p-sr-only">Binds</label>
        <InputText v-model="binds" id="to" type="text" placeholder="Binds" />
      </div>

      <div class="field col-12 md:col-2">
        <label for="to" class="p-sr-only">Submit window</label>
        <InputText v-model="submitWindow" id="to" type="number" placeholder="Submit window" />
      </div>

      <div class="field col-12 md:col-2">
        <Button class="mb-4" label="Run Load Test" @click="loadTest"></Button>
        <Button label="Abort" disabled=false @click="abort"></Button>
      </div>
    </div>
    <h2>Test results</h2>
    <div class="p-fluid formgrid grid">
      <div class="field col-12 md:col-6">

        <h5>SubmitSm TPS</h5>
        <Chart type="line" :data="lineData" :options="lineOptions" />
      </div>

      <div class="field col-12 md:col-6">

        <div class="card">
          <h5>SubmitSmResp Lantency(ms)</h5>
          <Chart type="line" :data="lineData" :options="lineOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, reactive, watch } from 'vue';
import { sendMessageSMPP, txOnlySMPP, rxOnlySMPP, connectSMPP, loadTest as loadTestSMPP, getSMPPConnection } from '@/service/smpp/smpp';
import { useToast } from 'primevue/usetoast';

import { useLayout } from '@/layout/composables/layout';

const { isDarkTheme } = useLayout();

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
const testMessages = ref('');
const tps = ref('');
const binds = ref('');
const submitWindow = ref('');
const lineOptions = ref(null);



const applyDarkTheme = () => {
  lineOptions.value = {
    plugins: {
      decimation: {
        enabled: true,
        algorithm: 'lttb', // Uses 'Largest Triangle Three Buckets' algorithm
        samples: 500 // Number of samples to display
      },
      legend: {
        labels: {
          color: '#ebedef'
        }
      }
    },
    scales: {
      x: {
        display: false,
        ticks: {
          color: '#ebedef'
        },
        grid: {
          color: 'rgba(160, 167, 181, .3)'
        }
      },
      y: {
        ticks: {
          color: '#ebedef'
        },
        grid: {
          color: 'rgba(160, 167, 181, .3)'
        }
      }
    }
  };
};

const applyLightTheme = () => {
  lineOptions.value = {
    plugins: {
      decimation: {
        enabled: true,
        algorithm: 'lttb', // Uses 'Largest Triangle Three Buckets' algorithm
        samples: 500 // Number of samples to display
      },
      legend: {
        labels: {
          color: '#495057'
        }
      }
    },
    scales: {
      x: {
        display: false, // Hide x-axis labels,
        // ticks: {
        //   color: '#495057'
        // },
        // grid: {
        //   color: '#ebedef'
        // }
      },
      y: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      }
    }
  };
};


watch(
  isDarkTheme,
  (val) => {
    if (val) {
      applyDarkTheme();
    } else {
      applyLightTheme();
    }
  },
  { immediate: true }
);

onBeforeMount(() => {

});

const lineData = reactive({
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      backgroundColor: '#2f4860',
      borderColor: '#2f4860',
      tension: 0.4,
      cubicInterpolationMode: 'monotone',
      pointRadius: 0
    },
    // {
    //   label: 'Second Dataset',
    //   data: [28, 48, 40, 19, 86, 27, 90],
    //   fill: false,
    //   backgroundColor: '#00bb7e',
    //   borderColor: '#00bb7e',
    //   tension: 0.4
    // }
  ]
});


const updateChartData = (latencyArray) => {
  lineData.labels = latencyArray.map((_, index) => index + 1); // Create labels based on the index of each latency value
  lineData.datasets[0].data = latencyArray;
};

const loadTest = async () => {
  try {
    const result = await loadTestSMPP(host.value, port.value, systemId.value, password.value, systemType.value, version.value);
    console.log(result)
    updateChartData(result.data.message.latencyArray);
  } catch (error) {
    console.log(error)
    showError(`Failed to send message:`, error);
    // console.error('Failed to send message:', error);
  }
};

const abort = async () => {
  try {

    const data = await getSMPPConnection()
    console.log(data)
    await sendMessageSMPP(from.value, to.value, message.value, dropdownItem.value);
    showSuccess();
  } catch (error) {
    showError(`Failed to send message:`, error);
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