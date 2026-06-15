<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  Play, 
  Cpu, 
  Gauge, 
  Thermometer, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  X 
} from 'lucide-vue-next';
import { HardwareComponent, LogEntry, UserStats } from '../types';

interface OverviewPageProps {
  stats: UserStats;
  logs: LogEntry[];
  components: HardwareComponent[];
  isBenchmarking: boolean;
  benchmarkProgress: number;
}

const props = defineProps<OverviewPageProps>();

const emit = defineEmits<{
  (e: 'run-benchmark'): void;
}>();

const timeFilter = ref<'1H' | '24H' | '7D'>('24H');
const activeTags = ref(['RTX 4090', 'i9-13900K', 'DDR5_64GB']);

// Reset tags helper
const handleResetTags = () => {
  activeTags.value = ['RTX 4095', 'i9-13900K', 'DDR5_64GB'];
};

const removeTag = (tag: string) => {
  activeTags.value = activeTags.value.filter(t => t !== tag);
};

// Svg Chart data based on time filters
const chartData = {
  '1H': [45, 52, 60, 48, 70, 65, 50, 58, 62, 75, 80, 78],
  '24H': [60, 75, 70, 90, 85, 65, 80, 88, 72, 85, 95, 90],
  '7D': [75, 60, 78, 62, 85, 80, 70, 72, 68, 80, 85, 82]
};

const activePoints = computed(() => {
  return chartData[timeFilter.value];
});
</script>

<template>
  <div class="space-y-6 select-none animate-fade-in">
    
    <!-- User Info Header Area -->
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Active Workstation Showcase -->
      <div class="lg:col-span-2 bg-white p-5 rounded-lg border border-tech-border flex flex-col md:flex-row gap-5">
        <div class="w-full md:w-40 h-40 shrink-0 bg-slate-950 rounded-sm overflow-hidden border border-tech-border/50 relative">
          <img 
            alt="Active workstation custom setup"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrSx23xB2m6muX02rMRAe2bsHRUvQbPFeLVD0Uu5N1BYq5Q4Sv1DmRzkC1I7O3x771lyllGf9PjeFqbPo2_ljEZF9HgzUMHwlq_tLSqY8fB-3D-QS8fUu9wY81O5VHZzQMNsjancsGEnpp40m2ThSVKuzAKlawuG-YbnXDVUwfQ5rvF86ZA6n1Zt3hOJckwY_gQ6Y1Jm_UCcUOHVXM1ebQSsgm4sJ-DhpkP8mrx6G3fOWRSBqk9s_mv8SgtV4licmq_5Sdyz3iQfU" 
            class="w-full h-full object-cover opacity-90"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-dark-ink/50 to-transparent pointer-events-none"></div>
        </div>

        <div class="flex-1 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="font-headline text-lg font-black tracking-tight text-dark-ink">
                  ACTIVE_STATION_04
                </h2>
                <p class="text-xs font-semibold text-slate-500 mt-0.5">
                  Intel Core i9-13900K • NVIDIA RTX 4090 • 64GB DDR5 6000MHz
                </p>
              </div>
              <span class="shrink-0 px-2 py-0.5 bg-brand-green/20 text-brand-green text-[10px] font-bold rounded-sm border border-brand-green/30 tracking-wider">
                ONLINE
              </span>
            </div>

            <!-- Editable Tags -->
            <div class="flex flex-wrap gap-1.5 pt-2">
              <span 
                v-for="tag in activeTags"
                :key="tag" 
                class="bg-slate-100 border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-sm text-[10px] font-bold text-slate-600 uppercase flex items-center gap-1 hover:border-brand-green/50 transition-colors"
              >
                <span>{{ tag }}</span>
                <button 
                  @click="removeTag(tag)"
                  class="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <X class="w-3 h-3" />
                </button>
              </span>
              <button 
                v-if="activeTags.length === 0"
                @click="handleResetTags" 
                class="text-slate-400 hover:text-brand-green text-[10px] font-bold underline cursor-pointer"
              >
                + Reset Hardware Tags
              </button>
            </div>
          </div>

          <p class="text-[11px] text-slate-400 italic pt-3 font-semibold border-t border-slate-100">
            * Active profile initialized under diagnostics container v4.95
          </p>
        </div>
      </div>

      <!-- Global Ranking Action Center -->
      <div class="bg-brand-green p-6 rounded-lg border border-tech-border flex flex-col justify-between items-center text-center relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
        
        <div class="space-y-1">
          <span class="font-headline text-[10px] font-black tracking-[0.2em] text-dark-ink/70 uppercase">
            GLOBAL RANKING
          </span>
          <div class="font-headline text-5xl font-black text-dark-ink tracking-tighter">
            #{{ stats.globalRanking }}
          </div>
          <p class="text-[10px] uppercase font-bold text-dark-ink/60">
            Percentile: Top 1.2% worldwide
          </p>
        </div>

        <button 
          :disabled="isBenchmarking"
          @click="emit('run-benchmark')"
          class="w-full mt-4 py-3 bg-dark-ink hover:bg-dark-ink/90 text-white font-headline text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98] disabled:opacity-75 cursor-pointer"
        >
          <Play class="w-3.5 h-3.5 fill-brand-green text-brand-green" />
          <span>{{ isBenchmarking ? `EJECUTANDO... ${benchmarkProgress}%` : 'EJECUTAR BENCHMARK' }}</span>
        </button>
      </div>

    </section>

    <!-- Stats Counter Grid -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- Stat 1: REAL-TIME FPS -->
      <div class="bg-white p-5 rounded-lg border border-tech-border relative overflow-hidden">
        <div class="flex justify-between items-start mb-3">
          <span class="font-headline text-[10px] font-black tracking-wider text-[#456179] uppercase">
            REAL-TIME FPS
          </span>
          <Gauge class="w-4 h-4 text-[#456179]" />
        </div>
        <div class="font-headline text-3xl font-black text-dark-ink tracking-tight">
          {{ isBenchmarking 
            ? (stats.realTimeFps * (1 + (benchmarkProgress % 10) / 75)).toFixed(1) 
            : stats.realTimeFps.toFixed(1)
          }}
        </div>
        <div class="mt-2 text-[11px] font-bold text-brand-green flex items-center gap-1">
          <TrendingUp class="w-3 h-3" />
          <span>+12.4% vs AVG</span>
        </div>
      </div>

      <!-- Stat 2: CPU TEMPERATURE -->
      <div class="bg-white p-5 rounded-lg border border-tech-border relative overflow-hidden">
        <div class="flex justify-between items-start mb-3">
          <span class="font-headline text-[10px] font-black tracking-wider text-[#456179] uppercase">
            CPU TEMPERATURE
          </span>
          <Thermometer class="w-4 h-4 text-rose-500" />
        </div>
        <div class="font-headline text-3xl font-black text-dark-ink tracking-tight">
          {{ isBenchmarking 
            ? Math.floor(stats.cpuTemp + (benchmarkProgress / 6)) 
            : stats.cpuTemp
          }}°C
        </div>
        <div class="mt-2 text-[11px] font-bold flex items-center gap-1" :class="isBenchmarking ? 'text-rose-600 animate-pulse' : 'text-rose-500'">
          <TrendingUp class="w-3 h-3" />
          <span>{{ isBenchmarking ? `+${Math.floor(benchmarkProgress / 6)}°C (MUTING)` : '+3°C (PEAK)' }}</span>
        </div>
      </div>

      <!-- Stat 3: GPU TEMPERATURE -->
      <div class="bg-white p-5 rounded-lg border border-tech-border relative overflow-hidden">
        <div class="flex justify-between items-start mb-3">
          <span class="font-headline text-[10px] font-black tracking-wider text-[#456179] uppercase">
            GPU TEMPERATURE
          </span>
          <Thermometer class="w-4 h-4 text-brand-green" />
        </div>
        <div class="font-headline text-3xl font-black text-dark-ink tracking-tight">
          {{ isBenchmarking 
            ? Math.floor(stats.gpuTemp + (benchmarkProgress / 10)) 
            : stats.gpuTemp
          }}°C
        </div>
        <div class="mt-2 text-[11px] font-bold text-brand-green flex items-center gap-1">
          <TrendingDown class="w-3 h-3" />
          <span>-2°C (STABLE)</span>
        </div>
      </div>

      <!-- Stat 4: SYSTEM HEALTH -->
      <div class="bg-white p-5 rounded-lg border border-tech-border relative overflow-hidden">
        <div class="flex justify-between items-start mb-3">
          <span class="font-headline text-[10px] font-black tracking-wider text-[#456179] uppercase">
            SYSTEM HEALTH
          </span>
          <CheckCircle class="w-4 h-4 text-brand-green" />
        </div>
        <div class="font-headline text-3xl font-black text-dark-ink tracking-tight">
          {{ stats.systemHealth }}%
        </div>
        <div class="mt-2 text-[11px] font-bold text-slate-400 tracking-wider">
          NO ERRORS DETECTED
        </div>
      </div>

    </section>

    <!-- Analytics & Table Layout -->
    <section class="grid grid-cols-1 xl:grid-cols-5 gap-6">
      
      <!-- Performance stability visualization bar representation -->
      <div class="xl:col-span-3 bg-white p-5 rounded-lg border border-tech-border flex flex-col justify-between h-[380px]">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="font-headline text-xs font-black tracking-wider text-dark-ink uppercase">
              PERFORMANCE_STABILITY_OVER_TIME
            </h3>
            <p class="text-[10px] font-semibold text-slate-400">
              Voltage & core frequency stability indexing (Current: {{ timeFilter }})
            </p>
          </div>
          <div class="flex gap-1.5">
            <button
              v-for="filter in (['1H', '24H', '7D'] as const)"
              :key="filter"
              @click="timeFilter = filter"
              class="px-3 py-1 font-headline text-[10px] font-black rounded-sm transition-all duration-150 cursor-pointer"
              :class="timeFilter === filter 
                ? 'bg-[#00D166] text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              {{ filter }}
            </button>
          </div>
        </div>

        <!-- Interactive SVG Render for stability data -->
        <div class="flex-1 flex flex-col justify-end relative">
          <div class="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
            <RefreshCw class="w-32 h-32 text-[#d5e0ec] animate-spin" style="animation-duration: 40s" />
          </div>

          <!-- Svg Canvas rendering custom bars -->
          <div class="w-full h-48 flex items-end justify-between px-2 gap-2 border-b border-tech-border pb-2">
            <div 
              v-for="(val, idx) in activePoints"
              :key="idx" 
              class="w-full flex flex-col justify-end group cursor-pointer relative"
              style="height: 100%"
            >
              <!-- Tooltip on hover -->
              <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-brand-green text-[9px] font-headline font-bold py-1 px-1.5 rounded-sm whitespace-nowrap transition-opacity pointer-events-none z-10 border border-brand-green/30">
                {{ val }}% index
              </div>
              
              <!-- Visual Bar representation -->
              <div 
                class="w-full bg-[#00D166]/20 border-t-2 border-[#00D166] transition-all duration-500 hover:bg-[#00D166]/40"
                :style="{ height: `${val}%` }"
              ></div>
            </div>
          </div>

          <!-- Timestamps indicators underneath -->
          <div class="flex justify-between mt-2 font-mono text-[9px] font-semibold text-slate-400">
            <span>00:00</span>
            <span>04:00</span>
            <span>08:00</span>
            <span>12:00</span>
            <span>16:00</span>
            <span>20:00</span>
            <span>23:59</span>
          </div>
        </div>
      </div>

      <!-- Detailed Hardware comparison tables from image 1 -->
      <div class="xl:col-span-2 bg-white p-5 rounded-lg border border-tech-border flex flex-col justify-between">
        <div>
          <h3 class="font-headline text-xs font-black tracking-wider text-dark-ink uppercase mb-3 text-left">
            MARKET_COMPARISON
          </h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-slate-50 border-b border-tech-border font-headline text-[9px] font-bold text-slate-400 tracking-wider">
                  <th class="p-3">COMPONENT</th>
                  <th class="p-3 text-right">USER_VAL</th>
                  <th class="p-3 text-right">AVG_VAL</th>
                  <th class="p-3 text-center">DELTA</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-xs">
                <tr v-for="comp in components.slice(0, 5)" :key="comp.id" class="hover:bg-slate-50/50 transition-colors">
                  <td class="p-3 font-semibold text-dark-ink text-left">{{ comp.category }} Score</td>
                  <td class="p-3 text-right font-mono text-[11px] font-bold text-slate-700">{{ comp.userVal }}</td>
                  <td class="p-3 text-right font-mono text-[11px] text-slate-400">{{ comp.avgVal }}</td>
                  <td class="p-3 text-center font-mono text-[11px] font-bold" :class="comp.isPositiveDelta ? 'text-brand-green' : 'text-rose-600'">
                    {{ comp.delta }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-medium text-left">
          * Ratings calibrated using 1440p DX12 technical profiles.
        </div>
      </div>

    </section>

    <!-- Diagnostics Logs Terminal Console Box & Progress Trackers -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Terminal display log -->
      <div class="md:col-span-1 bg-dark-ink p-5 rounded-lg border border-tech-border font-mono text-white flex flex-col justify-between h-[180px]">
        <div class="flex justify-between items-center pb-2 border-b border-slate-800">
          <span class="font-headline text-[9px] font-black tracking-wider text-slate-500 uppercase">
            LATEST_LOG_ENTRY
          </span>
          <div class="flex gap-1">
            <span class="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse"></span>
            <span class="w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar text-[10px] text-left leading-relaxed pt-2 space-y-1">
          <div v-for="log in logs.slice(0, 4)" :key="log.id" class="transition-all duration-300">
            <span class="font-bold" :class="log.type === 'success' ? 'text-brand-green' : log.type === 'warn' ? 'text-amber-400' : log.type === 'error' ? 'text-rose-400' : 'text-slate-300'">
              [{{ log.type.toUpperCase() }}]
            </span>
            <span class="text-slate-500">({{ log.timestamp.slice(11, 19) }})</span>
            <span class="text-slate-200"> {{ log.message }}</span>
          </div>
        </div>
      </div>

      <!-- Systems Diagnostics Efficiency Progress sliders -->
      <div class="md:col-span-2 bg-slate-100 p-6 rounded-lg border border-tech-border flex flex-col justify-center gap-6">
        
        <!-- Progress 1 -->
        <div class="space-y-2 text-left">
          <div class="flex justify-between text-[10px] font-headline font-black tracking-wider text-[#456179] uppercase">
            <span>GLOBAL_EFFICIENCY RATIO</span>
            <span class="text-brand-green font-mono font-bold">{{ stats.globalEfficiency }}%</span>
          </div>
          <div class="h-2 bg-slate-200 rounded-full overflow-hidden relative">
            <div 
              class="h-full bg-[#00D166] transition-all duration-1000 ease-out" 
              :style="{ width: `${stats.globalEfficiency}%` }"
            ></div>
          </div>
        </div>

        <!-- Progress 2 -->
        <div class="space-y-2 text-left">
          <div class="flex justify-between text-[10px] font-headline font-black tracking-wider text-[#456179] uppercase">
            <span>THERMAL_HEADROOM RATIO</span>
            <span class="text-rose-500 font-mono font-bold">
              {{ isBenchmarking 
                ? Math.max(10, Math.floor(stats.thermalHeadroom - (benchmarkProgress / 4))) 
                : stats.thermalHeadroom
              }}%
            </span>
          </div>
          <div class="h-2 bg-slate-200 rounded-full overflow-hidden relative">
            <div 
              class="h-full bg-rose-500 transition-all duration-1000 ease-out" 
              :style="{ 
                width: `${isBenchmarking 
                  ? Math.max(10, Math.floor(stats.thermalHeadroom - (benchmarkProgress / 4))) 
                  : stats.thermalHeadroom
                }%` 
              }"
            ></div>
          </div>
        </div>

      </div>

    </section>

  </div>
</template>
