<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { register } from '@/service/auth/login';
const router = useRouter();
const toast = useToast();

const { layoutConfig } = useLayout();
const email = ref('');
const password = ref('');
const checked = ref(false);

const logoUrl = computed(() => {
    return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const login = async () => {
    // showError(`Failed to send message:${error}`);
    try {
        await register(email.value, password.value);
        router.push('/');
    } catch (error) {
        showError(`Failed to send message:`, error);
        // router.push('/pages/Access');
        // console.error('Failed to send message:', error);
    }
}

const signUp = async () => {
    // showError(`Failed to send message:${error}`);
    router.push('/');

}

const showError = (summary, detail) => {
    toast.add({ severity: 'error', summary: summary, detail: detail, life: 3000 });
};
</script>

<template>
    <div
        class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <Toast />
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <!-- <div class="text-center mb-5">
                        <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" />
                        <div class="text-900 text-3xl font-medium mb-3">Welcome, Isabel!</div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div> -->

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email or Username</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5"
                            style="padding: 1rem" v-model="email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true"
                            class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>


                        <Button label="Sign Up" class="w-full p-3 text-xl" @click="login"></Button>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">

                                <label for="rememberme1">Already have an account,</label>
                                <a class="font-medium no-underline ml-2 text-right cursor-pointer" @click="signUp"
                                    style="color: var(--primary-color)">sign in?</a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
