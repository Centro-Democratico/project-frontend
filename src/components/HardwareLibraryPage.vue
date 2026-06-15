<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  TrendingUp, 
  Search, 
  ExternalLink, 
  X,
  Zap,
  DollarSign,
  Cpu,
  BookmarkCheck,
  Award
} from 'lucide-vue-next';
import { HardwareComponent } from '../types';

interface HardwareLibraryPageProps {
  components: HardwareComponent[];
  onAddLog: (message: string, type: 'success' | 'info' | 'warn' | 'error') => void;
}

const props = defineProps<HardwareLibraryPageProps>();

const currentGpu = ref('RTX 3060 Ti');
const budgetLimit = ref<number>(1200);
const comparingItems = ref<string[]>(['RTX 4090', 'i9-14900K']);

// Current GPU upgrades offset mapping to simulate live predictions
const gpuOffsets: { [key: string]: number } = {
  'RTX 3060 Ti': 0,
  'RTX 2060': 25,
  'GTX 1080 Ti': 45,
  'RTX 4060': -10
};

const offset = computed(() => {
  return gpuOffsets[currentGpu.value] ?? 0;
});

// Filter components that fit into the selected budget
const filteredComponents = computed(() => {
  return props.components.filter(comp => comp.price <= budgetLimit.value);
});

const handleBuyNow = (name: string, price: number) => {
  props.onAddLog(`Redirecting to vendor portal for ${name} at $${price}.`, 'info');
  alert(`Redirigiendo a tienda certificada para adquirir: \n- Componente: ${name}\n- Precio estimado: $${price}\n- Descuento ENGINE_CORE aplicado: 5%`);
};

const handleRemoveCompare = (item: string) => {
  comparingItems.value = comparingItems.value.filter(i => i !== item);
  props.onAddLog(`Component [${item}] removed from comparative analysis matrix.`, 'info');
};

const handleClearCompare = () => {
  comparingItems.value = [];
  props.onAddLog(`Cleared comparative analysis matrix.`, 'info');
};

const onGpuChange = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  const nGpu = target.value;
  currentGpu.value = nGpu;
  props.onAddLog(`Reference benchmark profile changed to ${nGpu}. Recalculating FPS delta gains.`, 'info');
};
</script>

<template>
  <div class="space-y-6 select-none animate-fade-in">
    
    <!-- Page Header -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
      <div class="space-y-2">
        <h1 class="font-headline text-2xl font-black text-dark-ink uppercase">
          Hardware Library
        </h1>
        <p class="text-slate-500 text-sm max-w-2xl">
          Analyze potential hardware upgrades based on your current performance profile. Recommendations are calibrated for competitive gaming benchmarks at 1440p resolution.
        </p>
      </div>

      <!-- Top filter parameters tools -->
      <div class="flex flex-wrap gap-2.5">
        <div class="px-3 py-2 bg-slate-50 border border-tech-border rounded-sm flex items-center gap-2">
          <span class="text-[9px] font-bold text-slate-400 uppercase font-headline">Current GPU:</span>
          <select 
            :value="currentGpu"
            @change="onGpuChange"
            class="text-xs font-bold text-slate-700 bg-transparent border-none py-0 focus:ring-0 cursor-pointer outline-none"
          >
            <option value="RTX 3060 Ti">RTX 3060 Ti</option>
            <option value="RTX 2060">RTX 2060 (Legacy)</option>
            <option value="GTX 1080 Ti">GTX 1080 Ti (Retro)</option>
            <option value="RTX 4060">RTX 4060 (Active)</option>
          </select>
        </div>

        <div class="px-3 py-2 bg-slate-50 border border-tech-border rounded-sm flex flex-col justify-center min-w-[150px]">
          <div class="flex justify-between items-center mb-1">
            <span class="text-[9px] font-bold text-slate-400 uppercase font-headline">Max Budget:</span>
            <span class="text-xs font-bold text-slate-700">${{ budgetLimit }}</span>
          </div>
          <input 
            type="range" 
            min="150" 
            max="1600" 
            step="50" 
            v-model.number="budgetLimit" 
            class="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-green"
          />
        </div>
      </div>
    </header>

    <!-- Grid containing Recommendation listings and Prediction console -->
    <section class="space-y-5">
      
      <!-- List status label -->
      <div class="flex items-center justify-between border-b border-[#90adc7]/30 pb-2">
        <h2 class="font-headline text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
          <TrendingUp class="w-4 h-4 text-brand-green" />
          <span>Recomendaciones de Mejora (Sorted by FPS Delta)</span>
        </h2>
        <div class="flex items-center gap-3">
          <span class="text-[9px] font-bold text-slate-400 uppercase">Live Analysis Active</span>
          <span class="w-2.5 h-2.5 rounded-full bg-brand-green animate-ping"></span>
        </div>
      </div>

      <!-- Cards Bento Split container -->
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 text-left">
        
        <!-- Top Upgrade recommendation block -->
        <div class="xl:col-span-8 bg-white border border-tech-border p-6 rounded-lg flex flex-col md:flex-row gap-6 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-1 h-full bg-brand-green"></div>
          
          <div class="w-full md:w-1/3 aspect-video bg-slate-50 flex items-center justify-center border border-slate-200 rounded-sm overflow-hidden shrink-0">
            <img 
              alt="RTX 4080 graphics hardware look"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUeQoLTPoMVZEuYks_KvyNQuAu0a5K7WMttfZ3dvsmLxo_Br1HWdhx8TYQjnxoOAugo5GyvdYX5cCEj_2WyLqAi8b4Yh6iFhrNx4EmCrA8zq_42tWmAX22VdS34FD82Hxq6ai2xo3OpTUjdtBaIjlMwVYLpe1Y34VwjIfny_WHpklkUlmtNFeL1GV--6_3AvnV08IZ6zURi5FDmeREP1iArjyHatSdm7kMGPRHuKTXJ964MFjksYF6EzvSlkipEk489houiGT71pA" 
              class="max-h-full object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div class="flex-1 flex flex-col justify-between">
            <div class="space-y-3">
              <div class="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <span class="inline-block px-2.5 py-0.5 bg-brand-green/20 text-[9px] font-headline font-black text-brand-green uppercase rounded-sm mb-1.5 border border-brand-green/30">
                    High Impact Recommendation
                  </span>
                  <h3 class="font-headline text-lg font-black text-dark-ink leading-tight">
                    NVIDIA GeForce RTX 4080
                  </h3>
                  <p class="text-xs text-slate-500 font-semibold mt-1">
                    16GB GDDR6X • DLSS 3.0 • Ray Tracing Cores 3rd Gen
                  </p>
                </div>

                <div class="text-right">
                  <p class="font-headline text-[9px] text-slate-400 font-black uppercase tracking-wider">
                    Est. Price
                  </p>
                  <p class="font-headline text-lg font-black text-dark-ink">
                    $1,199.00
                  </p>
                </div>
              </div>

              <!-- Performance stats prediction row -->
              <div class="mt-4 flex items-center gap-10 border-t border-slate-100 pt-4">
                <div class="flex flex-col">
                  <span class="font-headline text-[9px] text-slate-400 font-black uppercase tracking-wider">
                    FPS Gain
                  </span>
                  <div class="flex items-baseline gap-1 text-brand-green font-bold">
                    <span class="text-3xl font-headline font-black tracking-tight font-headline">
                      +{{ 72 + offset }}
                    </span>
                    <span class="text-[10px] uppercase font-sans font-bold">Avg FPS</span>
                  </div>
                </div>

                <div class="flex flex-col">
                  <span class="font-headline text-[9px] text-slate-400 font-black uppercase tracking-wider mb-1.5">
                    Impact Level
                  </span>
                  <div class="flex items-center gap-1.5">
                    <div class="h-1.5 w-6 bg-brand-green rounded-full"></div>
                    <div class="h-1.5 w-6 bg-brand-green rounded-full"></div>
                    <div class="h-1.5 w-6 bg-brand-green rounded-full"></div>
                    <span class="text-[10px] font-bold text-brand-green uppercase ml-1 font-headline">
                      Ultra
                    </span>
                  </div>
                </div>
              </div>

            </div>

            <!-- Action Triggers -->
            <div class="mt-5 flex gap-2.5">
              <button 
                @click="handleBuyNow('NVIDIA GeForce RTX 4080', 1199.00)"
                class="flex-1 bg-brand-green hover:bg-brand-green-hover text-dark-ink font-headline text-xs font-bold py-3 uppercase tracking-widest rounded-sm transition-all border border-brand-green shadow-sm active:scale-[0.99] cursor-pointer"
              >
                Comprar ahora
              </button>
              <button 
                @click="() => {
                  if (comparingItems.includes('RTX 4080')) return;
                  comparingItems.push('RTX 4080');
                  props.onAddLog('NVIDIA RTX 4080 added to comparative analysis matrix.', 'info');
                }"
                class="px-4 border border-slate-300 text-slate-600 hover:border-brand-green hover:text-brand-green hover:bg-brand-green/5 transition-colors rounded-sm cursor-pointer"
                title="Añadir a Comparación"
              >
                <BookmarkCheck class="w-4 h-4 text-slate-500 hover:text-brand-green" />
              </button>
            </div>

          </div>
        </div>

        <!-- Side Predictive telemetry console -->
        <div class="xl:col-span-4 bg-slate-900 p-6 rounded-lg flex flex-col justify-between items-center text-center text-white border border-slate-800">
          <div class="flex flex-col items-center gap-2">
            <Award class="w-10 h-10 text-brand-green stroke-[1.5]" />
            <h4 class="font-headline text-xs font-black uppercase tracking-wider">
              Engine Prediction
            </h4>
            <p class="text-slate-400 text-xs font-sans leading-relaxed px-4">
              Upgrading to an RTX 40-series GPU will resolve the current 'System Bottleneck' detected during your last Warzone 2.0 benchmark.
            </p>
          </div>

          <div class="w-full bg-slate-800/80 p-4 rounded-sm border border-slate-700/60 mt-4 text-left">
            <div class="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
              <span>Bottleneck Risk</span>
              <span class="text-brand-green font-mono font-bold font-headline">8% (Optimal)</span>
            </div>
            <div class="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div class="h-full bg-brand-green w-[8%]"></div>
            </div>
          </div>
        </div>

      </div>

      <!-- Detailed upgrades spec sheets table -->
      <div class="bg-white border border-tech-border rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-tech-border font-headline text-[9.5px] font-bold text-[#55606a] uppercase tracking-wider">
                <th class="px-6 py-4">Hardware Component</th>
                <th class="px-6 py-4">Specifications</th>
                <th class="px-6 py-4 text-right">FPS Increase</th>
                <th class="px-6 py-4 text-center">Impact</th>
                <th class="px-6 py-4 text-right">Price</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-xs">
              <tr v-for="comp in filteredComponents" :key="comp.id" class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-6 py-4 text-left">
                  <div class="flex items-center gap-3">
                    <Cpu class="w-4 h-4 text-slate-400 group-hover:text-brand-green transition-colors" />
                    <div>
                      <p class="font-bold text-slate-900 leading-tight">{{ comp.name }}</p>
                      <p class="text-[9px] font-headline font-black text-slate-400 uppercase tracking-wider mt-0.5">
                        {{ comp.category }} • {{ comp.series || 'Active Base' }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 text-xs text-slate-500 font-semibold text-left">
                  {{ comp.specs }}
                </td>

                <td class="px-6 py-4 text-right font-mono text-[11px] font-bold text-brand-green">
                  {{ comp.fpsGain ? `+${Math.max(2, comp.fpsGain + offset)} FPS` : 'N/A' }}
                </td>

                <td class="px-6 py-4 text-center">
                  <span 
                    class="inline-block px-2.5 py-0.5 text-[9px] font-black uppercase rounded-full"
                    :class="comp.fpsGain && (comp.fpsGain + offset) > 50 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : comp.fpsGain && (comp.fpsGain + offset) > 15 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-slate-100 text-slate-600'"
                  >
                    {{ comp.fpsGain && (comp.fpsGain + offset) > 50 ? 'High' : comp.fpsGain && (comp.fpsGain + offset) > 15 ? 'Med' : 'Low' }}
                  </span>
                </td>

                <td class="px-6 py-4 text-right font-mono text-[11px] font-bold text-dark-ink">
                  ${{ comp.price.toFixed(2) }}
                </td>

                <td class="px-6 py-4 text-right">
                  <button 
                    @click="handleBuyNow(comp.name, comp.price)"
                    class="inline-flex items-center gap-1 text-[10px] font-bold text-brand-green uppercase hover:underline cursor-pointer"
                  >
                    <span>Comprar ahora</span>
                    <ExternalLink class="w-3 h-3" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </section>

    <!-- Comparison Drawer toolbar footer element -->
    <div v-if="comparingItems.length > 0" class="flex flex-wrap items-center gap-3 py-4 bg-slate-50 px-5 rounded-lg border border-tech-border animate-slide-up text-left">
      <span class="font-headline text-[9.5px] font-black text-slate-400 uppercase tracking-widest">
        Comparing Matrix:
      </span>
      <div 
        v-for="item in comparingItems"
        :key="item" 
        class="px-3 py-1 bg-[#90adc7]/20 text-[#456179] text-[10px] font-bold rounded-full flex items-center gap-1.5 border border-[#90adc7]/30"
      >
        <span>{{ item }}</span>
        <button 
          @click="handleRemoveCompare(item)"
          class="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <X class="w-3 h-3" />
        </button>
      </div>
      <button 
        @click="handleClearCompare"
        class="text-xs font-bold text-brand-green hover:underline ml-auto cursor-pointer"
      >
        Clear All
      </button>
    </div>

  </div>
</template>
