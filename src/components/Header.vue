<script setup lang="ts">
import { ref, watch } from 'vue';
import { Search, Bell, Cpu, ExternalLink } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'search', query: string): void;
}>();

const query = ref('');

watch(query, (newVal) => {
  emit('search', newVal);
});

const handleToggleNotifications = () => {
  alert('Se han silenciado los registros de baja prioridad. No hay alertas críticas vigentes.');
};

const handleProfileClick = () => {
  alert('Analista de Hardware: Laura Sophia S.\nNivel de Autorización: Nivel 3 - Laboratorio Principal');
};
</script>

<template>
  <header class="h-16 border-b border-tech-border bg-[#f8fafc] flex items-center justify-between px-8 z-30 select-none">
    
    <!-- Real-time Hardware Search Engine Pin -->
    <div class="relative w-80">
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <Search class="w-4 h-4" />
      </span>
      <input
        type="text"
        v-model="query"
        placeholder="Buscar hardware por nombre, ID o tipo..."
        class="w-full bg-white border border-slate-300 focus:border-brand-green focus:ring-1 focus:ring-brand-green rounded-[4px] py-1.5 pl-10 pr-4 text-xs font-sans outline-none transition-all placeholder:text-slate-400 text-dark-ink"
      />
    </div>

    <!-- Active Right Header Badges and Avatar -->
    <div class="flex items-center gap-4">
      
      <!-- System Heartbeat Indicator -->
      <div class="flex items-center gap-2 px-3 py-1 bg-slate-200/50 rounded-sm border border-slate-300/30">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
        </span>
        <span class="font-headline text-[9px] font-bold tracking-widest text-[#55606a] uppercase">
          STATION: #04_ONLINE
        </span>
      </div>

      <!-- Alerts Trigger button -->
      <button 
        @click="handleToggleNotifications"
        class="p-2 text-slate-400 hover:text-dark-ink hover:bg-slate-200/50 rounded-full transition-colors relative cursor-pointer"
        title="Alertas & Mensajes de Sistema"
      >
        <Bell class="w-4 h-4 stroke-[2.2]" />
        <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-green rounded-full"></span>
      </button>

      <!-- Vertical spacer divider -->
      <div class="w-px h-6 bg-slate-200"></div>

      <!-- User/Analyst Profile Badge -->
      <button 
        @click="handleProfileClick"
        class="flex items-center gap-2.5 hover:bg-slate-200/50 p-1.5 rounded-sm transition-all duration-150 cursor-pointer"
        title="Configuración de analista"
      >
        <div class="text-right">
          <p class="text-[10px] font-black text-dark-ink uppercase leading-none font-headline">
            Sophia L.
          </p>
          <p class="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
            Lab Analyst
          </p>
        </div>
        <div class="w-7 h-7 bg-brand-green text-dark-ink border border-brand-green/30 rounded-sm font-headline text-xs font-black flex items-center justify-center">
          SL
        </div>
      </button>

    </div>

  </header>
</template>
