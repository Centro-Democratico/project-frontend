<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { 
  Play, 
  Cpu, 
  Gauge, 
  Activity, 
  TrendingUp, 
  CheckCircle, 
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
const activeTags = ref(['BENCHMARK', 'TELEMETRY', 'PYTHON_ENGINE']);

// --- INICIO CÓDIGO DE INTEGRACIÓN REAL ---
const realFpsScore = ref<number | null>(null);
const realCpuAvg = ref<number | null>(null);
const realRamAvg = ref<number | null>(null);
const realSessionId = ref<string>('');
const isLive = ref<boolean>(false);
let pollInterval: ReturnType<typeof setInterval>;

const fetchRealTelemetry = async () => {
  try {
    const response = await fetch('/api/sessions/');
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        // Tomamos la sesión más reciente (el último test que hiciste en Python)
        const latestSession = data[0]; 
        
        // Mapeamos TODAS las métricas de tu JSON a la vista de Vue
        realFpsScore.value = latestSession.score || latestSession.fps_avg || 0;
        realCpuAvg.value = latestSession.cpu_avg || 0;
        realRamAvg.value = latestSession.ram_avg_gb || 0;
        realSessionId.value = latestSession.id || latestSession.session_id || 'ID_DESCONOCIDO';
        
        isLive.value = true;
      }
    }
  } catch (error) {
    console.error("Esperando a que Django despierte...", error);
    isLive.value = false;
  }
};

onMounted(() => {
  fetchRealTelemetry(); // Consulta inicial al abrir la página
  // Pregunta silenciosamente a Django cada 3 segundos si hay datos nuevos
  pollInterval = setInterval(fetchRealTelemetry, 3000);
});

onUnmounted(() => {
  clearInterval(pollInterval);
});

// Helpers para decidir qué mostrar (Mentira vs Verdad)
const displayFps = computed(() => isLive.value && realFpsScore.value !== null ? realFpsScore.value : props.stats.realTimeFps);
const displayCpu = computed(() => isLive.value && realCpuAvg.value !== null ? realCpuAvg.value : 45); // 45 es un mock
const displayRam = computed(() => isLive.value && realRamAvg.value !== null ? realRamAvg.value : 16); // 16 es un mock
// --- FIN CÓDIGO DE INTEGRACIÓN REAL ---

const removeTag = (tag: string) => {
  activeTags.value = activeTags.value.filter(t => t !== tag);
};

const chartData = {
  '1H': [45, 52, 60, 48, 70, 65, 50, 58, 62, 75, 80, 78],
  '24H': [60, 75, 70, 90, 85, 65, 80, 88, 72, 85, 95, 90],
  '7D': [75, 60, 78, 62, 85, 80, 70, 72, 68, 80, 85, 82]
};

const activePoints = computed(() => chartData[timeFilter.value]);
</script>

<template>
  <div class="space-y-6 select-none animate-fade-in">
    
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white p-5 rounded-lg border border-tech-border flex flex-col md:flex-row gap-5" :class="isLive ? 'border-brand-green/50 shadow-sm' : ''">
        <div class="w-full md:w-40 h-40 shrink-0 bg-slate-950 rounded-sm overflow-hidden border border-tech-border/50 relative flex items-center justify-center">
          <Activity class="w-16 h-16" :class="isLive ? 'text-brand-green animate-pulse' : 'text-slate-700'" />
        </div>

        <div class="flex-1 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="font-headline text-lg font-black tracking-tight text-dark-ink">
                  ESTACIÓN DE PRUEBA LOCAL
                </h2>
                <p class="text-xs font-semibold mt-0.5" :class="isLive ? 'text-brand-green' : 'text-slate-500'">
                  {{ isLive ? 'Conectado a la API de Django (Python)' : 'Esperando datos de telemetría...' }}
                </p>
              </div>
              <span 
                class="shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-sm border tracking-wider"
                :class="isLive ? 'bg-brand-green/20 text-brand-green border-brand-green/30' : 'bg-rose-500/20 text-rose-600 border-rose-500/30'"
              >
                {{ isLive ? 'LIVE DATA' : 'OFFLINE' }}
              </span>
            </div>

            <div class="flex flex-wrap gap-1.5 pt-2">
              <span 
                v-for="tag in activeTags"
                :key="tag" 
                class="bg-slate-100 border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-sm text-[10px] font-bold text-slate-600 uppercase flex items-center gap-1"
              >
                <span>{{ tag }}</span>
              </span>
            </div>
          </div>
          <p class="text-[11px] font-mono italic pt-3 font-semibold border-t border-slate-100" :class="isLive ? 'text-slate-600' : 'text-slate-400'">
            * ID de Sesión (UUID): {{ realSessionId || 'Ninguna sesión activa' }}
          </p>
        </div>
      </div>

      <div class="bg-brand-green p-6 rounded-lg border border-tech-border flex flex-col justify-between items-center text-center relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
        <div class="space-y-1">
          <span class="font-headline text-[10px] font-black tracking-[0.2em] text-dark-ink/70 uppercase">
            ESTADO DEL MOTOR
          </span>
          <div class="font-headline text-4xl font-black text-dark-ink tracking-tighter mt-2">
            {{ isLive ? 'ACTIVO' : 'INACTIVO' }}
          </div>
        </div>
        <button 
          @click="fetchRealTelemetry"
          class="w-full mt-4 py-3 bg-dark-ink hover:bg-dark-ink/90 text-white font-headline text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="isLive ? 'text-brand-green' : 'text-white'" />
          <span>FORZAR SINCRONIZACIÓN</span>
        </button>
      </div>
    </section>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <div class="bg-white p-5 rounded-lg border-2 relative overflow-hidden transition-colors" :class="isLive ? 'border-brand-green shadow-lg shadow-brand-green/10' : 'border-tech-border'">
        <div class="flex justify-between items-start mb-3">
          <span class="font-headline text-[10px] font-black tracking-wider uppercase" :class="isLive ? 'text-brand-green' : 'text-[#456179]'">
            FPS PROMEDIO
          </span>
          <Gauge class="w-4 h-4" :class="isLive ? 'text-brand-green' : 'text-[#456179]'" />
        </div>
        <div class="font-headline text-3xl font-black text-dark-ink tracking-tight">
          {{ displayFps.toFixed(1) }}
        </div>
        <div class="mt-2 text-[11px] font-bold flex items-center gap-1" :class="isLive ? 'text-brand-green' : 'text-slate-400'">
          <TrendingUp class="w-3 h-3" v-if="isLive" />
          <span>{{ isLive ? 'Capturado desde tu .exe' : 'Usando datos simulados' }}</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-lg border-2 relative overflow-hidden transition-colors" :class="isLive ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-tech-border'">
        <div class="flex justify-between items-start mb-3">
          <span class="font-headline text-[10px] font-black tracking-wider uppercase" :class="isLive ? 'text-blue-500' : 'text-[#456179]'">
            USO DE CPU (AVG)
          </span>
          <Cpu class="w-4 h-4" :class="isLive ? 'text-blue-500' : 'text-[#456179]'" />
        </div>
        <div class="font-headline text-3xl font-black text-dark-ink tracking-tight">
          {{ displayCpu }}%
        </div>
        <div class="mt-2 text-[11px] font-bold flex items-center gap-1" :class="isLive ? 'text-blue-500' : 'text-slate-400'">
          <Activity class="w-3 h-3" />
          <span>{{ isLive ? 'Métrica del procesador' : 'Sin conexión' }}</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-lg border-2 relative overflow-hidden transition-colors" :class="isLive ? 'border-purple-500 shadow-lg shadow-purple-500/10' : 'border-tech-border'">
        <div class="flex justify-between items-start mb-3">
          <span class="font-headline text-[10px] font-black tracking-wider uppercase" :class="isLive ? 'text-purple-500' : 'text-[#456179]'">
            USO DE RAM (AVG)
          </span>
          <Activity class="w-4 h-4" :class="isLive ? 'text-purple-500' : 'text-[#456179]'" />
        </div>
        <div class="font-headline text-3xl font-black text-dark-ink tracking-tight">
          {{ displayRam }} GB
        </div>
        <div class="mt-2 text-[11px] font-bold flex items-center gap-1" :class="isLive ? 'text-purple-500' : 'text-slate-400'">
          <TrendingUp class="w-3 h-3" />
          <span>{{ isLive ? 'Memoria en uso' : 'Sin conexión' }}</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-lg border border-tech-border relative overflow-hidden">
        <div class="flex justify-between items-start mb-3">
          <span class="font-headline text-[10px] font-black tracking-wider text-[#456179] uppercase">
            SISTEMA
          </span>
          <CheckCircle class="w-4 h-4" :class="isLive ? 'text-brand-green' : 'text-slate-400'" />
        </div>
        <div class="font-headline text-3xl font-black text-dark-ink tracking-tight">
          OK
        </div>
        <div class="mt-2 text-[11px] font-bold text-slate-400 tracking-wider">
          {{ isLive ? 'DATOS GUARDADOS EN DB' : 'MODO STANDBY' }}
        </div>
      </div>

    </section>

    <section class="grid grid-cols-1 xl:grid-cols-5 gap-6">
      <div class="xl:col-span-5 bg-white p-5 rounded-lg border border-tech-border flex flex-col justify-center items-center h-[200px]">
        <h3 class="font-headline text-sm font-black tracking-wider text-dark-ink uppercase mb-2">
          PANEL DE PRESENTACIÓN LISTO
        </h3>
        <p class="text-sm text-slate-500 text-center">
          Inicia tu aplicación de escritorio (telemetry.exe), graba unos segundos de rendimiento y presiona STOP.<br>
          Esta pantalla detectará automáticamente los datos de la Base de Datos.
        </p>
      </div>
    </section>

  </div>
</template>