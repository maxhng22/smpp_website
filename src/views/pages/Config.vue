<template>
    <div className="card">
        <h1>Update Configuration</h1>
        <Button label="Update" class="mr-2 mb-2" @click="update"></Button>
        <h3>Configuration content</h3>
        <Button label="Refresh" class="mr-2 mb-2" @click="refresh"></Button>
        <pre>{{ config }}</pre>
        <!-- <input type="file" @change="onFileChange" /> -->
        <!-- <button @click="uploadFile">Upload</button> -->
    </div>
</template>

<script>
import axios from 'axios';
import jsYaml from 'js-yaml';

export default {
    data() {
        return {
            file: null,
            config: {},
        };
    },
    async mounted() {
        try {
            const response = await fetch('../src/config/config.yaml'); // Replace with your YAML file path
            const yamlContent = await response.text();
            this.config = jsYaml.load(yamlContent);
            console.log(this.config)
            // this.loading = false;
        } catch (error) {
            console.error('Error loading configuration:', error);
        }
    },
    methods: {
        onFileChange(e) {
            console.log(1)
            this.file = e.target.files[0];
        },
        async refresh() {
            try {
            const response = await fetch('../src/config/config.yaml'); // Replace with your YAML file path
            const yamlContent = await response.text();
            this.config = jsYaml.load(yamlContent);
            console.log(this.config)
            // this.loading = false;
        } catch (error) {
            console.error('Error loading configuration:', error);
        }

        },
        async update() {
            try {
                await axios.post('http://localhost:3000/api/updateconfiguration', 
                    
                this.config);
                alert('Message sent successfully');
            } catch (error) {
                console.error('Failed to send message:', error);
            }

        },
        async uploadFile() {
            if (this.file) {
                const formData = new FormData();
                formData.append('config', this.file);

                try {
                    await axios.post('http://your-backend-url/upload', formData);
                    alert('File uploaded successfully');
                } catch (error) {
                    console.error('Error uploading file:', error);
                    alert('Failed to upload file');
                }
            } else {
                alert('Please select a file first');
            }
        }
    }
};
</script>