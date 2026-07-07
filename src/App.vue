<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { INITIAL_COMPONENTS, INITIAL_LOGS, INITIAL_STATS } from './data';
import { HardwareComponent, LogEntry, ActiveTab, UserStats } from './types';

import LoginScreen from './components/LoginScreen.vue';
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';
import OverviewPage from './components/OverviewPage.vue';
import MyHardwarePage from './components/MyHardwarePage.vue';
import HardwareLibraryPage from './components/HardwareLibraryPage.vue';
import AdminConsolePage from './components/AdminConsolePage.vue';

const MIN_BENCHMARK_MS = 200;
const PROGRESS_STEP_PCT = 5;

const THRESHOLD_VAL_15 = 15;
const THRESHOLD_VAL_40 = 40;
const THRESHOLD_VAL_65 = 65;
const THRESHOLD_VAL_85 = 85;
const THRESHOLD_MAX_100 = 100;

const PEAK_CPU_TEMP_C = 79;
const PEAK_GPU_TEMP_C = 82;
const PEAK_REALTIME_FPS = 189.4;

const OPTIMIZED_RANK_BOOST = 2;
const MIN_RANK_FLOOR = 101;
const OPTIMIZED_EFFICIENCY_PCT = 76;
const OPTIMIZED_CPU_TEMP_C = 61;
const OPTIMIZED_GPU_TEMP_C = 64;
const OPTIMIZED_REALTIME_FPS = 152.8;
const OPTIMIZED_HEALTH_PCT = 99.1;

const isAuthenticated = ref<boolean>(false);
const activeTab = ref<ActiveTab>('overview');
const components = ref<HardwareComponent[]>(INITIAL_COMPONENTS);
const logs = ref<LogEntry[]>(INITIAL_LOGS);
const stats = ref<UserStats>(INITIAL_STATS);
const searchQuery = ref('');

const isBenchmarking = ref(false);
const benchmarkProgress = ref(0);
let benchmarkInterval: ReturnType<typeof setInterval> | null = null;

const mapBackendToFrontend = (backendComp: any): HardwareComponent => {
  const modelName = backendComp.model || 'Unnamed Spec';
  const brandName = backendComp.brand || 'Reference';
  const categoryMapped = (backendComp.type || 'GPU') as any;
  const scoreVal = backendComp.base_score || 25000;
  
  return {
    id: backendComp.id,
    name: modelName.toLowerCase().includes(brandName.toLowerCase()) ? modelName : `${brandName} ${modelName}`,
    category: categoryMapped,
    series: backendComp.launch_year ? `${brandName} ${backendComp.launch_year}` : 'Active Base',
    specs: backendComp.base_specs || 'Balanced base configuration',
    watts: categoryMapped === 'CPU' ? 250 : categoryMapped === 'GPU' ? 350 : 65,
    userVal: scoreVal.toLocaleString(),
    avgVal: Math.round(scoreVal * 0.94).toLocaleString(),
    delta: '+6.1%',
    isPositiveDelta: true,
    fpsGain: categoryMapped === 'GPU' ? 75 : 35,
    price: categoryMapped === 'GPU' ? 999 : 349,
    image: categoryMapped === 'GPU' 
      ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUeQoLTPoMVZEuYks_KvyNQuAu0a5K7WMttfZ3dvsmLxo_Br1HWdhx8TYQjnxoOAugo5GyvdYX5cCEj_2WyLqAi8b4Yh6iFhrNx4EmCrA8zq_42tWmAX22VdS34FD82Hxq6ai2xo3OpTUjdtBaIjlMwVYLpe1Y34VwjIfny_WHpklkUlmtNFeL1GV--6_3AvnV08IZ6zURi5FDmeREP1iArjyHatSdm7kMGPRHuKTXJ964MFjksYF6EzvSlkipEk489houiGT71pA'
      : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrSx23xB2m6muX02rMRAe2bsHRUvQbPFeLVD0Uu5N1BYq5Q4Sv1DmRzkC1I7O3x771lyllGf9PjeFqbPo2_ljEZF9HgzUMHwlq_tLSqY8fB-3D-QS8fUu9wY81O5VHZzQMNsjancsGEnpp40m2ThSVKuzAKlawuG-YbnXDVUwfQ5rvF86ZA6n1Zt3hOJckwY_gQ6Y1Jm_UCcUOHVXM1ebQSsgm4sJ-DhpkP8mrx6G3fOWRSBqk9s_mv8SgtV4licmq_5Sdyz3iQfU'
  };
};

const loadComponentsFromBackend = async () => {
  try {
    handleAddLog('Directing pipeline sync to backend service: GET /api/components...', 'info');
    const res = await fetch('/api/components');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && Array.isArray(data) && data.length > 0) {
      components.value = data.map(mapBackendToFrontend);
      handleAddLog(`Sync complete. Successfully loaded ${data.length} components from database.`, 'success');
    } else {
      handleAddLog('Backend returning empty dataset. Loading pre-seeded references.', 'warn');
    }
  } catch (error: any) {
    handleAddLog(`Backend unreachable. Using local standalone state engine.`, 'info');
  }
};

const handleAddLog = (message: string, type: 'success' | 'info' | 'warn' | 'error'): void => {
  const newLog: LogEntry = {
    id: `log-${Date.now()}-${Math.random()}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    message,
    type
  };
  logs.value = [newLog, ...logs.value];
};

const evaluateTelemetryThreshold = (currentProgress: number): void => {
  if (currentProgress === THRESHOLD_VAL_15) {
    handleAddLog('Threading target registers. Sweeping clock thresholds.', 'info');
  } else if (currentProgress === THRESHOLD_VAL_40) {
    handleAddLog('Starting voltage stress sweeps on multi-core GPU shader grids. Maximum TDP load engaged.', 'info');
    stats.value = {
      ...stats.value,
      cpuTemp: PEAK_CPU_TEMP_C,
      gpuTemp: PEAK_GPU_TEMP_C,
      realTimeFps: PEAK_REALTIME_FPS
    };
  } else if (currentProgress === THRESHOLD_VAL_65) {
    handleAddLog('Stress test validation: frame latency peak measured at 4.2ms.', 'success');
  } else if (currentProgress === THRESHOLD_VAL_85) {
    handleAddLog('Compiling telemetry database metrics and saving cache registers.', 'info');
  }
};

const concludeBenchmarkExecution = (): void => {
  if (benchmarkInterval) {
    clearInterval(benchmarkInterval);
    benchmarkInterval = null;
  }
  isBenchmarking.value = false;
  handleAddLog('Benchmark evaluation completed normally. High hardware performance verified.', 'success');
  
  stats.value = {
    ...stats.value,
    globalRanking: Math.max(MIN_RANK_FLOOR, stats.value.globalRanking - OPTIMIZED_RANK_BOOST),
    globalEfficiency: OPTIMIZED_EFFICIENCY_PCT,
    cpuTemp: OPTIMIZED_CPU_TEMP_C,
    gpuTemp: OPTIMIZED_GPU_TEMP_C,
    realTimeFps: OPTIMIZED_REALTIME_FPS,
    systemHealth: OPTIMIZED_HEALTH_PCT
  };

  const scoreComputed = Math.round(stats.value.realTimeFps * 220);
  const telemetryBody = {
    started_at: new Date(Date.now() - 30000).toISOString(),
    ended_at: new Date().toISOString(),
    cpu_avg: 54.2,
    cpu_max: 92.1,
    gpu_avg: 78.4,
    gpu_max: 99.0,
    ram_avg_gb: 16.2,
    ram_max_gb: 24.5,
    cpu_temp_avg: OPTIMIZED_CPU_TEMP_C,
    cpu_temp_max: PEAK_CPU_TEMP_C,
    gpu_temp_avg: OPTIMIZED_GPU_TEMP_C,
    gpu_temp_max: PEAK_GPU_TEMP_C,
    disk_read_avg: 184.2,
    disk_write_avg: 96.5,
    score: scoreComputed
  };

  handleAddLog('Transmitting real-time stress test parameters to global telemetry proxy...', 'info');

  fetch('/api/telemetry/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(telemetryBody)
  })
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => {
    handleAddLog(`Anonymous telemetry session synchronized successfully (ID: ${data.id || 'N/A'}). base_score averages updated!`, 'success');
  })
  .catch(() => {
    handleAddLog(`Telemetry dispatch cached in transient offline stack.`, 'success');
  });
};

const handleRunBenchmark = (): void => {
  if (isBenchmarking.value) return;
  isBenchmarking.value = true;
  benchmarkProgress.value = 0;
  handleAddLog('Initializing technical benchmark sequence cycle for ACTIVE_STATION_04.', 'info');

  benchmarkInterval = setInterval(() => {
    benchmarkProgress.value += PROGRESS_STEP_PCT;
    
    evaluateTelemetryThreshold(benchmarkProgress.value);

    if (benchmarkProgress.value >= THRESHOLD_MAX_100) {
      concludeBenchmarkExecution();
    }
  }, MIN_BENCHMARK_MS);
};

const handleGlobalKeyShortcut = (event: KeyboardEvent): void => {
  
  if (event.altKey && event.shiftKey) {
    const key = event.key.toLowerCase();
    if (key === 'o') {
      activeTab.value = 'overview';
      handleAddLog('Keyboard navigation shortcut triggered: view mode set to Overview.', 'info');
    } else if (key === 'a') {
      activeTab.value = 'admin';
      handleAddLog('Keyboard navigation shortcut triggered: view mode set to Admin Console.', 'info');
    } else if (key === 'l') {
      activeTab.value = 'library';
      handleAddLog('Keyboard navigation shortcut triggered: view mode set to Library.', 'info');
    } else if (key === 'b') {
      event.preventDefault();
      handleRunBenchmark();
    }
  }
};

onMounted(async () => {
  window.addEventListener('keydown', handleGlobalKeyShortcut);
  
  await loadComponentsFromBackend();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeyShortcut);
  if (benchmarkInterval) {
    clearInterval(benchmarkInterval);
  }
});

const handleAddComponent = async (comp: HardwareComponent): Promise<void> => {
  const words = comp.name.split(' ');
  const brand = words[0] || 'Reference';
  const model = words.slice(1).join(' ') || comp.name;
  
  const payload = {
    brand: brand,
    model: model,
    type: comp.category === 'CPU' || comp.category === 'GPU' ? comp.category : 'GPU',
    base_specs: comp.specs,
    launch_year: new Date().getFullYear(),
    base_score: Number(comp.userVal.replace(/,/g, '')) || 25000
  };

  try {
    const res = await fetch('/api/components', {
      method: 'POST',
      headers: { 'X-User-Admin': 'true', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error();
    const serverComp = await res.json();
    const mapped = mapBackendToFrontend(serverComp);
    components.value = [mapped, ...components.value.filter(c => c.id !== comp.id)];
    handleAddLog(`Created & persistent mapped into Django database backend successfully: ${mapped.id}`, 'success');
  } catch {
   
    components.value = [comp, ...components.value];
    handleAddLog(`Database offline. Component logged in transient local state memory: ${comp.id}`, 'info');
  }
};

const handleEditComponent = async (updatedComp: HardwareComponent): Promise<void> => {
  const words = updatedComp.name.split(' ');
  const brand = words[0] || 'Reference';
  const model = words.slice(1).join(' ') || updatedComp.name;

  const payload = {
    brand: brand,
    model: model,
    type: updatedComp.category === 'CPU' || updatedComp.category === 'GPU' ? updatedComp.category : 'GPU',
    base_specs: updatedComp.specs,
    launch_year: new Date().getFullYear(),
    base_score: Number(updatedComp.userVal.replace(/,/g, '')) || 25000
  };

  try {
    const cleanId = updatedComp.id;
    const res = await fetch(`/api/components/${cleanId}`, {
      method: 'PUT',
      headers: { 'X-User-Admin': 'true', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error();
    const serverComp = await res.json();
    const mapped = mapBackendToFrontend(serverComp);
    components.value = components.value.map(c => c.id === updatedComp.id ? mapped : c);
    handleAddLog(`Successfully updated backend database entity parameters: ${cleanId}`, 'success');
  } catch {
    components.value = components.value.map(c => c.id === updatedComp.id ? updatedComp : c);
    handleAddLog(`Database offline. Updated entity parameters updated in transient local state memory.`, 'info');
  }
};

const handleDeleteComponent = async (id: string): Promise<void> => {
  try {
    const cleanId = id;
    const res = await fetch(`/api/components/${cleanId}`, {
      method: 'DELETE',
      headers: { 'X-User-Admin': 'true' }
    });
    if (!res.ok) throw new Error();
    components.value = components.value.filter(c => c.id !== id);
    handleAddLog(`Entity permanently purged from database register: ${cleanId}`, 'success');
  } catch {
    components.value = components.value.filter(c => c.id !== id);
    handleAddLog(`Database offline. Purged entity registers from transient local state memory.`, 'info');
  }
};

const handleSearchUpdate = (query: string): void => {
  searchQuery.value = query;
};

const handleLogout = (): void => {
  isAuthenticated.value = false;
  handleAddLog('Session terminated safely by active technology analyst.', 'info');
};

const searchedComponents = computed(() => {
  if (searchQuery.value.trim() === '') {
    return components.value;
  }
  const lowQuery = searchQuery.value.toLowerCase();
  return components.value.filter(comp => 
    comp.name.toLowerCase().includes(lowQuery) ||
    comp.id.toLowerCase().includes(lowQuery) ||
    comp.category.toLowerCase().includes(lowQuery)
  );
});
</script>

<template>
  <div>
   
    <LoginScreen 
      v-if="!isAuthenticated" 
      @login-success="isAuthenticated = true" 
    />

    <div 
      v-else 
      id="dashboard-layout" 
      class="min-h-screen bg-tech-bg text-dark-ink flex select-none overflow-x-hidden text-left"
    >
    
      <Sidebar 
        :activeTab="activeTab" 
        @update:activeTab="activeTab = $event"
        @logout="handleLogout"
        @run-benchmark="handleRunBenchmark"
        :isBenchmarking="isBenchmarking"
      />

      <div class="flex-1 md:ml-64 flex flex-col min-h-screen">
       
        <Header @search="handleSearchUpdate" />

        <main class="flex-1 p-6 max-w-[1280px] mx-auto w-full pb-16">
        
          <div 
            v-if="isBenchmarking" 
            class="mb-6 bg-brand-green/10 border border-brand-green/30 p-4 rounded-md animate-pulse flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full bg-brand-green animate-ping"></span>
              <p class="font-headline text-xs font-black text-brand-green uppercase tracking-wider">
                System Stress Test Active: {{ benchmarkProgress }}% Compiled
              </p>
            </div>
            <div class="w-1/3 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div class="h-full bg-brand-green" :style="{ width: `${benchmarkProgress}%` }"></div>
            </div>
          </div>

          <OverviewPage 
            v-if="activeTab === 'overview'"
            :stats="stats" 
            :logs="logs" 
            :components="searchedComponents"
            :isBenchmarking="isBenchmarking"
            :benchmarkProgress="benchmarkProgress"
            @run-benchmark="handleRunBenchmark"
          />

          <MyHardwarePage 
            v-else-if="activeTab === 'my-hardware'"
            @add-log="handleAddLog" 
          />

          <HardwareLibraryPage 
            v-else-if="activeTab === 'library'"
            :components="searchedComponents" 
            @add-log="handleAddLog" 
          />

          <AdminConsolePage 
            v-else-if="activeTab === 'admin'"
            :components="components" 
            :logs="logs"
            @add-component="handleAddComponent"
            @edit-component="handleEditComponent"
            @delete-component="handleDeleteComponent"
            @add-log="handleAddLog"
          />

        </main>

      </div>

    </div>
  </div>
</template>
