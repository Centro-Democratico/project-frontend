<script setup lang="ts">
import { 
  LayoutDashboard, 
  Cpu, 
  Settings, 
  Database, 
  HelpCircle, 
  LifeBuoy, 
  Play, 
  LogOut 
} from 'lucide-vue-next';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  isBenchmarking: boolean;
}

defineProps<SidebarProps>();

const emit = defineEmits<{
  (e: 'update:activeTab', tab: ActiveTab): void;
  (e: 'logout'): void;
  (e: 'run-benchmark'): void;
}>();

const menuItems = [
  {
    id: 'overview' as ActiveTab,
    label: 'System Overview',
    icon: LayoutDashboard,
  },
  {
    id: 'library' as ActiveTab,
    label: 'Hardware Library',
    icon: HelpCircle,
  },
  {
    id: 'my-hardware' as ActiveTab,
    label: 'My Hardware',
    icon: Cpu,
  },
  {
    id: 'admin' as ActiveTab,
    label: 'Admin Console',
    icon: Database,
  }
];

const handleDocAlert = () => {
  alert('Manual de usuario, fórmulas de cálculo de TDP y documentación de benchmarks cargada localmente.');
};

const handleSupportAlert = () => {
  alert('Sistema conectado con soporte técnico central de ENGINE_CORE.');
};
</script>

<template>
  <aside class="w-64 border-r fixed left-0 top-0 bottom-0 bg-[#f8fafc] border-tech-border z-40 flex flex-col justify-between py-6 px-4 select-none">
    
    <!-- Sidebar Header/Brand -->
    <div class="flex flex-col gap-6">
      <div class="flex items-center gap-2.5 px-2">
        <div class="w-8 h-8 bg-brand-green flex items-center justify-center rounded-sm shadow-md">
          <Cpu class="w-5 h-5 text-dark-ink stroke-[2.5]" />
        </div>
        <div>
          <h1 class="text-sm font-black text-dark-ink font-headline uppercase leading-none tracking-tight">
            Know your marks
          </h1>
          <p class="text-[9px] uppercase font-bold text-slate-500 tracking-wider mt-1">
            Analyst Mode Active
          </p>
        </div>
      </div>

      <!-- Navigation Core Links -->
      <nav class="space-y-1.5 pt-2">
        <button
          v-for="item in menuItems"
          :key="item.id"
          @click="emit('update:activeTab', item.id)"
          class="w-full flex items-center px-4 py-3 rounded-sm font-headline text-xs font-bold uppercase tracking-wider transition-all duration-150 hover:translate-x-1 text-left cursor-pointer"
          :class="activeTab === item.id 
            ? 'bg-brand-green text-dark-ink shadow-sm' 
            : 'text-[#55606a] hover:bg-slate-200/50 hover:text-dark-ink'"
        >
          <component 
            :is="item.icon" 
            class="w-4 h-4 mr-3 stroke-[2.5]" 
            :class="activeTab === item.id ? 'text-dark-ink' : 'text-slate-400'" 
          />
          <span>{{ item.label }}</span>
        </button>
      </nav>
    </div>

    <!-- Sidebar Footer Section -->
    <div class="space-y-5">
      
      <!-- Helper info links -->
      <div class="pt-4 border-t border-[#90adc7]/20 space-y-1.5">
        <button 
          @click="handleDocAlert"
          class="w-full flex items-center px-3 py-1.5 text-xs font-bold text-[#55606a] hover:text-dark-ink uppercase tracking-wide hover:translate-x-0.5 transition-transform text-left cursor-pointer"
        >
          <HelpCircle class="w-4 h-4 mr-3 text-slate-400" />
          <span>Documentation</span>
        </button>
        
        <button 
          @click="handleSupportAlert"
          class="w-full flex items-center px-3 py-1.5 text-xs font-bold text-[#55606a] hover:text-dark-ink uppercase tracking-wide hover:translate-x-0.5 transition-transform text-left cursor-pointer"
        >
          <LifeBuoy class="w-4 h-4 mr-3 text-slate-400" />
          <span>Support</span>
        </button>
      </div>

      <!-- Live Run Benchmark Module -->
      <div class="space-y-2">
        <button
          @click="emit('run-benchmark')"
          :disabled="isBenchmarking"
          class="w-full py-3 bg-brand-green text-dark-ink font-headline text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          :class="{ 'animate-pulse': isBenchmarking }"
        >
          <Play class="w-4 h-4 fill-dark-ink text-dark-ink" />
          <span>{{ isBenchmarking ? 'Benchmarking...' : 'Run Benchmark' }}</span>
        </button>

        <button
          @click="emit('logout')"
          class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-dark-ink transition-colors font-headline text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 rounded-sm cursor-pointer"
        >
          <LogOut class="w-3.5 h-3.5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

    </div>

  </aside>
</template>
