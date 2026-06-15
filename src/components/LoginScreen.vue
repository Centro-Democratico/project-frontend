<script setup lang="ts">
import { ref } from 'vue';
import { Eye, EyeOff, Lock, User, Terminal, Verified, Shield, Activity } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'login-success'): void;
}>();

const email = ref('admin@engine_core.io');
const password = ref('••••••••');
const showPassword = ref(false);
const error = ref<string | null>(null);
const isDemoLoading = ref(false);

const handleSubmit = () => {
  if (!email.value.trim()) {
    error.value = 'Por favor ingrese su usuario o correo.';
    return;
  }
  
  isDemoLoading.value = true;
  error.value = null;
  
  // Simulate verification
  setTimeout(() => {
    isDemoLoading.value = false;
    emit('login-success');
  }, 850);
};

const handleQuickAccess = () => {
  isDemoLoading.value = true;
  setTimeout(() => {
    isDemoLoading.value = false;
    emit('login-success');
  }, 500);
};

const handleForgotPassword = () => {
  alert('Para restablecer su contraseña, póngase en contacto con el administrador de ENGINE_CORE.');
};

const handleCreateAccount = () => {
  alert('Registro restringido a ingenieros autorizados por ENGINE_CORE.');
};
</script>

<template>
  <div id="login-container" class="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-tech-bg selection:bg-brand-green/30 select-none">
    
    <!-- Background Decorative blueprint/semiconductor diagrams -->
    <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
      <div class="absolute -top-[10%] -right-[5%] w-[600px]. h-[600px]">
        <svg viewBox="0 0 100 100" class="w-full h-full stroke-dark-ink stroke-[0.2] fill-none">
          <rect x="10" y="10" width="80" height="80" rx="2" />
          <path d="M50 0 V100 M0 50 H100" />
          <circle cx="50" cy="50" r="30" />
          <circle cx="50" cy="50" r="10" />
          <path d="M20 20 L80 80 M80 20 L20 80" />
        </svg>
      </div>
      <div class="absolute -bottom-[10%] -left-[5%] w-[500px] h-[500px]">
        <svg viewBox="0 0 100 100" class="w-full h-full stroke-dark-ink stroke-[0.1] fill-none">
          <circle cx="10" cy="10" r="5" />
          <circle cx="90" cy="90" r="8" />
          <path d="M10 15 L90 82 M20 10 H80" />
        </svg>
      </div>
    </div>

    <main class="w-full max-w-[440px] flex flex-col gap-6 z-10 animate-fade-in">
      
      <!-- Branding Header -->
      <div class="flex flex-col items-center text-center">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-9 h-9 bg-brand-green rounded-sm flex items-center justify-center shadow-lg transition-transform hover:rotate-12 duration-300">
            <Terminal class="w-5 h-5 text-dark-ink stroke-[2.5]" />
          </div>
          <h1 class="font-headline text-2xl font-black tracking-widest text-[#0f1029] uppercase">
            Know your marks
          </h1>
        </div>
        <p class="font-headline text-xs font-bold tracking-[0.25em] text-[#456179] uppercase">
          AUTHORIZED PERSONNEL ONLY
        </p>
      </div>

      <!-- Login Card -->
      <div class="bg-[#f8fafc] rounded-lg p-8 shadow-sm border border-tech-border relative">
        
        <header class="mb-6">
          <h2 class="font-headline text-xl font-bold text-dark-ink">Inicie sesión</h2>
          <div class="h-1 w-12 bg-brand-green mt-2 rounded-[1px]"></div>
        </header>

        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
          
          <!-- Username Field -->
          <div class="flex flex-col gap-1.5">
            <label htmlFor="identity" class="font-headline text-[10px] font-bold tracking-wider text-[#456179] uppercase">
              USERNAME/EMAIL
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <User class="w-4 h-4" />
              </span>
              <input
                id="identity"
                type="text"
                v-model="email"
                class="w-full bg-white border border-slate-300 focus:border-brand-green focus:ring-1 focus:ring-brand-green rounded-[4px] py-3 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 font-sans text-dark-ink"
                placeholder="admin@engine_core.io"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div class="flex flex-col gap-1.5">
            <label htmlFor="password" class="font-headline text-[10px] font-bold tracking-wider text-[#456179] uppercase">
              PASSWORD
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock class="w-4 h-4" />
              </span>
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                class="w-full bg-white border border-slate-300 focus:border-brand-green focus:ring-1 focus:ring-brand-green rounded-[4px] py-3 pl-10 pr-12 text-sm outline-none transition-all placeholder:text-slate-400 font-sans text-dark-ink"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-dark-ink transition-colors"
              >
                <EyeOff v-if="showPassword" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Remember Me & Recover Row -->
          <div class="flex justify-between items-center mt-1">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked
                class="w-4 h-4 border-slate-300 rounded focus:ring-brand-green text-brand-green"
              />
              <span class="text-xs text-[#55606a] group-hover:text-dark-ink transition-colors font-medium">
                Remember device
              </span>
            </label>
            <button
              type="button"
              @click="handleForgotPassword"
              class="text-xs text-[#0f1029] font-bold hover:underline decoration-brand-green decoration-2 underline-offset-4 transition-all"
            >
              Forgot Password
            </button>
          </div>

          <p v-if="error" class="text-rose-600 text-xs font-semibold bg-rose-50 p-2 rounded border border-rose-200 animate-pulse">
            {{ error }}
          </p>

          <!-- Primary Submit Button -->
          <button
            type="submit"
            :disabled="isDemoLoading"
            class="w-full bg-brand-green hover:bg-brand-green-hover text-dark-ink font-headline text-xs font-bold py-4 rounded-[4px] flex items-center justify-center gap-2 transition-all uppercase shadow-md active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            <span v-if="isDemoLoading">Verificando...</span>
            <template v-else>
              <span>ACCEDER AL LABORATORIO</span>
              <Terminal class="w-4 h-4 stroke-[2.5]" />
            </template>
          </button>

          <!-- Quick Bypass Button for easy evaluation -->
          <button
            type="button"
            @click="handleQuickAccess"
            class="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-headline text-[10px] font-bold py-2 rounded-[4px] transition-all uppercase cursor-pointer"
          >
            Acceso Rápido (Invitado)
          </button>
        </form>

        <!-- Card Footer -->
        <footer class="mt-6 pt-6 border-t border-slate-200 text-center">
          <p class="text-xs text-[#55606a]">
            No account registered?
            <button
              @click="handleCreateAccount"
              class="text-[#0f1029] font-bold hover:text-brand-green transition-colors cursor-pointer"
            >
              Create Account
            </button>
          </p>
        </footer>
      </div>

      <!-- Security Badges Footer Row -->
      <div class="flex items-center justify-center gap-6 opacity-60">
        <div class="flex items-center gap-1">
          <Verified class="w-3.5 h-3.5 text-brand-green" />
          <span class="font-headline text-[9px] uppercase tracking-wider font-bold">Encrypted Session</span>
        </div>
        <div class="flex items-center gap-1">
          <Shield class="w-3.5 h-3.5 text-[#456179]" />
          <span class="font-headline text-[9px] uppercase tracking-wider font-bold">Active Firewall</span>
        </div>
        <div class="flex items-center gap-1">
          <Activity class="w-3.5 h-3.5 text-brand-green" />
          <span class="font-headline text-[9px] uppercase tracking-wider font-bold">System Online</span>
        </div>
      </div>

    </main>
  </div>
</template>
