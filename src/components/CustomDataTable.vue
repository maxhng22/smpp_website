<template>
    <DataTable 
      :value="data" 
      :paginator="true" 
      :rows="rows" 
      dataKey="id" 
      :rowHover="true" 
      v-model:filters="filters"
      filterDisplay="menu" 
      :loading="loading" 
      :globalFilterFields="globalFilterFields" 
      showGridlines>
      
      <template #header>
        <div class="flex justify-content-between flex-column sm:flex-row">
          <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
          <IconField iconPosition="left">
            <InputIcon class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" style="width: 100%" />
          </IconField>
        </div>
      </template>
      
      <template #empty> No data found. </template>
      <template #loading> Loading data. Please wait. </template>
  
      <Column 
        v-for="col in columns" 
        :key="col.field" 
        :field="col.field" 
        :header="col.header" 
        :style="col.style" 
        :dataType="col.dataType"
        :filterField="col.filterField"
        :filterMenuStyle="col.filterMenuStyle">
        
        <template v-slot:body="slotProps">
          <component 
            :is="col.bodyComponent" 
            v-bind="slotProps.data" 
            v-if="col.bodyComponent">
          </component>
          <span v-else>{{ slotProps.data[col.field] }}</span>
        </template>
        
        <template v-slot:filter="slotProps">
          <component 
            :is="col.filterComponent" 
            v-model="slotProps.filterModel.value" 
            v-bind="col.filterProps" 
            v-if="col.filterComponent">
          </component>
          <InputText 
            v-else 
            v-model="slotProps.filterModel.value" 
            class="p-column-filter" 
            :placeholder="`Search by ${col.header}`" />
        </template>
      </Column>
    </DataTable>
  </template>
  
  <script setup>
  import { ref } from 'vue';
// Adjust the import path
  
  const props = defineProps({
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    rows: {
      type: Number,
      default: 10
    },
    globalFilterFields: {
      type: Array,
      default: () => []
    }
  });
  
  const filters = ref({});
  const clearFilter = () => {
    filters.value = {};
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  