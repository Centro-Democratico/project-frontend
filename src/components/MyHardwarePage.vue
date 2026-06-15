<script setup lang="ts">
import { ref, computed } from 'vue';
import { Save, Flame, Monitor, Zap, CheckCircle } from 'lucide-vue-next';

interface MyHardwarePageProps {
  onAddLog: (message: string, type: 'success' | 'info' | 'warn' | 'error') => void;
}

const props = defineProps<MyHardwarePageProps>();

const watts = ref<number>(850);
const saveSuccess = ref(false);

const systemBaseTdp = 612;

const loadPercentage = computed(() => {
  const w = watts.value || 1;
  return ((systemBaseTdp / w) * 100).toFixed(1);
});

// Risk calculation reactive engine
const risk = computed(() => {
  const num = Number(loadPercentage.value);
  if (!watts.value || watts.value < systemBaseTdp) {
    return { label: 'CRITICAL - OVERLOAD', color: 'text-rose-600', bg: 'bg-rose-50' };
  }
  if (num > 85) {
    return { label: 'HIGH - Caution', color: 'text-amber-500', bg: 'bg-amber-50' };
  }
  return { label: 'LOW - Stable', color: 'text-brand-green', bg: 'bg-emerald-50' };
});

const handlePresetSelect = (value: number) => {
  watts.value = value;
  props.onAddLog(`PSU capacity updated to ${value}W preset chip configuration.`, 'info');
};

const handleSave = () => {
  saveSuccess.value = true;
  props.onAddLog(`System parameters saved. Configured Power Supply: ${watts.value}W. Current load index: ${loadPercentage.value}%.`, 'success');
  setTimeout(() => {
    saveSuccess.value = false;
  }, 3000);
};

const handleEfficiencyLogTrigger = () => {
  props.onAddLog(`PSU dynamic efficiency log query requested. Real-time certification: 80 PLUS GOLD.`, 'info');
  alert('Log de eficiencia copiado en el panel de diagnostics inferiores.');
};

const presetChips = [450, 600, 750, 850, 1000, 1200];
</script>

<template>
  <div class="space-y-6 select-none animate-fade-in">
    
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2">
        <span class="bg-brand-green text-dark-ink text-[10px] font-black px-2 py-0.5 tracking-tighter uppercase font-headline">
          LIVE DATA
        </span>
        <span class="text-[#90adc7] font-headline text-[10px] font-bold uppercase tracking-widest">
          Station ID: ANALYST_490
        </span>
      </div>
      <h1 class="font-headline text-2xl font-black uppercase text-dark-ink tracking-tight text-left">
        MY HARDWARE - COMPONENT CONFIGURATION
      </h1>
      <p class="text-slate-500 text-sm max-w-2xl text-left">
        Manage the technical details of your workstation to optimize performance calculations.
      </p>
    </div>

    <!-- Primary configuration columns -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Left Column: Power Supply Card -->
      <div class="bg-white border border-[#90adc7]/30 p-6 rounded-lg flex flex-col justify-between">
        <div>
          
          <!-- Action Card header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-slate-100 flex items-center justify-center border border-slate-200 rounded-sm">
                <Zap class="w-6 h-6 text-[#55606a]" />
              </div>
              <div class="text-left">
                <h3 class="font-headline text-sm font-black text-dark-ink uppercase">
                  POWER SUPPLY UNIT
                </h3>
                <p class="font-headline text-[10px] text-[#90adc7] font-bold uppercase tracking-wider">
                  Power Supply Unit (PSU)
                </p>
              </div>
            </div>

            <button 
              @click="handleEfficiencyLogTrigger"
              class="text-xs font-bold font-headline text-brand-green hover:underline cursor-pointer"
            >
              + Efficiency Log
            </button>
          </div>

          <!-- PSU Parameters Section -->
          <div class="space-y-6">
            
            <div class="space-y-2 text-left">
              <label class="font-headline text-[10px] font-black text-slate-500 uppercase tracking-wider">
                POWER CAPACITY (WATTS)
              </label>
              <div class="relative">
                <input 
                  type="number" 
                  v-model.number="watts"
                  class="w-full bg-white border border-slate-300 rounded-[3px] h-14 px-4 pr-12 text-lg font-mono font-bold text-dark-ink focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none"
                  placeholder="e.g. 750"
                />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 font-headline text-lg font-bold text-slate-300">
                  W
                </span>
              </div>

              <!-- Chips Grid Selection Row -->
              <div class="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
                <button
                  v-for="val in presetChips"
                  :key="val"
                  @click="handlePresetSelect(val)"
                  class="py-2 text-center rounded-[2px] font-mono text-[11px] font-bold transition-all cursor-pointer"
                  :class="watts === val 
                    ? 'bg-brand-green/20 border border-brand-green text-brand-green' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-green/50'"
                >
                  {{ val }}W
                </button>
              </div>
            </div>

            <!-- Reactive Math summary details -->
            <div class="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 text-left">
              <div class="space-y-1">
                <span class="font-headline text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  LOAD CALCULATION
                </span>
                <p class="font-mono text-sm font-bold text-dark-ink">
                  {{ loadPercentage }}% {{ Number(loadPercentage) <= 85 && watts >= systemBaseTdp ? '(Optimized)' : '(Heavy load)' }}
                </p>
              </div>

              <div class="space-y-1">
                <span class="font-headline text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  THERMAL RISK
                </span>
                <div class="font-mono text-sm font-bold flex items-center gap-1.5" :class="risk.color">
                  <Flame class="w-4 h-4" />
                  <span>{{ risk.label }}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        <!-- Action trigger footer -->
        <div class="mt-8 pt-5 border-t border-slate-100 flex justify-between items-center">
          <span v-if="saveSuccess" class="text-xs font-bold text-brand-green flex items-center gap-1.5 animate-bounce">
            <CheckCircle class="w-4 h-4" />
            <span>Configuración guardada con éxito!</span>
          </span>
          <span v-else class="text-xs text-slate-400 font-medium text-left">
            * Click save to deploy PSU config onto current profile
          </span>
          
          <button
            @click="handleSave"
            class="bg-brand-green hover:bg-brand-green-hover text-dark-ink px-6 py-3 font-headline font-bold text-xs uppercase tracking-widest flex items-center gap-2 rounded-[2px] transition-transform active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <Save class="w-4 h-4 stroke-[2.5]" />
            <span>SAVE CHANGES</span>
          </button>
        </div>

      </div>

      <!-- Right Column: Dynamic efficiency projection panel -->
      <div class="space-y-6">
        <div class="bg-white border border-[#90adc7]/30 p-6 rounded-lg flex flex-col justify-between h-full">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-headline text-xs font-black tracking-wider text-dark-ink uppercase">
                EFFICIENCY PROJECTION
              </h3>
              <Monitor class="w-4 h-4 text-slate-400" />
            </div>

            <!-- High-quality technology image container -->
            <div class="aspect-video relative overflow-hidden bg-slate-950 rounded-sm border border-slate-200">
              <img 
                alt="3D technical performance chart grid"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBN2stJ3XwNlg68MymzyfipJbXOkARA1FRPOchcaydRBtrK2YWJrxd2iJyQrHNFYtwmrba-Mw_B9uiJOuTOYAc__nkU_KtZX1Ljdni0oRTduKRwkKhOY5ono1DmO6NoB9842W2ui6hbwOqyjWL5d0EQyBK2OXFqTuMNKtq2xBE5zPlkfouf1ikpLcPS0D5N-qcc__rZT4dnxz_eBmtYegeUMBOAlNaNvgHudV5w4ErvDU_w5jkiDTVKsxsAvqAlCJnZQ9_U48EWENQ" 
                class="w-full h-full object-cover opacity-80"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-dark-ink/50 to-transparent"></div>
              
              <div class="absolute bottom-4 left-4">
                <p class="font-mono text-white text-xs font-bold bg-dark-ink/75 px-2 py-1 rounded-[2px] border border-brand-green/30">
                  +12.4% Voltage Stability Registered
                </p>
              </div>
            </div>

            <!-- Data parameters specs -->
            <div class="mt-5 space-y-3 text-left">
              <div class="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span class="text-slate-500 text-xs font-medium">Estimated Certification</span>
                <span class="font-mono font-bold text-dark-ink text-sm">80 PLUS GOLD</span>
              </div>
              <div class="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span class="text-slate-500 text-xs font-medium">Accumulated TDP load</span>
                <span class="font-mono font-bold text-dark-ink text-sm">642W Max</span>
              </div>
            </div>
          </div>

          <p class="text-[10px] text-slate-400 mt-4 leading-relaxed font-semibold text-left">
            * Calculations derived from system stats. Efficiency reduces slightly peak workloads exceeding 90%.
          </p>
        </div>
      </div>

    </div>

    <!-- Primary specs row summarized -->
    <section class="space-y-3 pt-4">
      <h3 class="font-headline text-[10px] font-black text-[#90adc7] uppercase tracking-wider text-left">
        SYSTEM SUMMARY
      </h3>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        
        <div class="bg-white p-4 rounded-md border border-slate-200">
          <span class="text-[9px] font-headline font-black text-slate-400 uppercase block mb-1">CPU</span>
          <p class="font-headline text-sm font-bold text-dark-ink">Core i9 14900K</p>
          <span class="font-mono text-[10px] text-brand-green mt-1.5 block">253W TDP</span>
        </div>

        <div class="bg-white p-4 rounded-md border border-slate-200">
          <span class="text-[9px] font-headline font-black text-slate-400 uppercase block mb-1">GPU</span>
          <p class="font-headline text-sm font-bold text-dark-ink">RTX 4090 24GB</p>
          <span class="font-mono text-[10px] text-rose-500 mt-1.5 block">450W TDP</span>
        </div>

        <div class="bg-white p-4 rounded-md border border-slate-200">
          <span class="text-[9px] font-headline font-black text-slate-400 uppercase block mb-1">RAM</span>
          <p class="font-headline text-sm font-bold text-dark-ink">64GB DDR5 6000MHz</p>
          <span class="font-mono text-[10px] text-brand-green mt-1.5 block">32GB x 2 modules</span>
        </div>

        <div class="bg-white p-4 rounded-md border border-slate-200">
          <span class="text-[9px] font-headline font-black text-slate-400 uppercase block mb-1">MOTHERBOARD</span>
          <p class="font-headline text-sm font-bold text-dark-ink">Z790 Steel Legend</p>
          <span class="font-mono text-[10px] text-slate-400 mt-1.5 block">ATX Form Factor</span>
        </div>

      </div>
    </section>

  </div>
</template>
