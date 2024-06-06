<template>
    <div className="card">
      <h1>SMPP Connections</h1>
      <ul>
        <li v-for="connection in connections" :key="connection.id">
          {{ connection.name }} - {{ connection.status }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  // import axios from 'axios';
  
  export default {
    data() {
      return {
        connections: []
      };
    },
    created() {
      // this.fetchConnections();
    },
    methods: {
      async fetchConnections() {
        // try {
        //   const response = await axios.get('/api/smpp/connections');
        //   this.connections = response.data;
        // } catch (error) {
        //   console.error('Failed to fetch connections:', error);
        // }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  