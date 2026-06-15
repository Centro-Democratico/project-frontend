<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { INITIAL_COMPONENTS, INITIAL_LOGS, INITIAL_STATS } from './data';
import { HardwareComponent, LogEntry, ActiveTab, UserStats } from './types';

// Importing Vue subcomponents
import LoginScreen from './components/LoginScreen.vue';
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';
import OverviewPage from './components/OverviewPage.vue';
import MyHardwarePage from './components/MyHardwarePage.vue';
import HardwareLibraryPage from './components/HardwareLibraryPage.vue';
import AdminConsolePage from './components/AdminConsolePage.vue';

// --- SYSTEM SEMANTIC CONSTANTS (Erasing Magic Numbers) ---
const MIN_BENCHMARK_MS = 200;
const PROGRESS_STEP_PCT = 5;

// Milestone values
const THRESHOLD_VAL_15 = 15;
const THRESHOLD_VAL_40 = 40;
const THRESHOLD_VAL_65 = 65;
const THRESHOLD_VAL_85 = 85;
const THRESHOLD_MAX_100 = 100;

// High Load State Temps & Performance
const PEAK_CPU_TEMP_C = 79;
const PEAK_GPU_TEMP_C = 82;
const PEAK_REALTIME_FPS = 189.4;

// Optimal Cooldown Targets
const OPTIMIZED_RANK_BOOST = 2;
const MIN_RANK_FLOOR = 101;
const OPTIMIZED_EFFICIENCY_PCT = 76;
const OPTIMIZED_CPU_TEMP_C = 61;
const OPTIMIZED_GPU_TEMP_C = 64;
const OPTIMIZED_REALTIME_FPS = 152.8;
const OPTIMIZED_HEALTH_PCT = 99.1;

// --- STATE MANAGEMENT ---
const isAuthenticated = ref<boolean>(false);
const activeTab = ref<ActiveTab>('overview');
const components = ref<HardwareComponent[]>(INITIAL_COMPONENTS);
const logs = ref<LogEntry[]>(INITIAL_LOGS);
const stats = ref<UserStats>(INITIAL_STATS);
const searchQuery = ref('');

// Benchmark engine states
const isBenchmarking = ref(false);
const benchmarkProgress = ref(0);
let benchmarkInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Appends a new timestamped technical diagnostic entry to the global logger.
 * @param {string} message - Human readable technical statement.
 * @param {'success' | 'info' | 'warn' | 'error'} type - Message categorization type.
 * @returns {void}
 */
const handleAddLog = (message: string, type: 'success' | 'info' | 'warn' | 'error'): void => {
  const newLog: LogEntry = {
    id: `log-${Date.now()}-${Math.random()}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    message,
    type
  };
  logs.value = [newLog, ...logs.value];
};

/**
 * Dispatches diagnostic reports and updates physical state depending on progress thresholds.
 * @param {number} currentProgress - Computed percentage of simulation.
 * @returns {void}
 */
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

/**
 * Performs cleanup of active polling loops and locks updated score profiles.
 * @returns {void}
 */
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
};

/**
 * Initiates the asynchronous synthetic performance benchmarking routines.
 * @returns {void}
 */
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

/**
 * Keydown handler callback supporting RF_2 (Keyboard shortcuts for navigation and action triggers).
 * @param {KeyboardEvent} event - System domestic keyboard event args.
 * @returns {void}
 */
const handleGlobalKeyShortcut = (event: KeyboardEvent): void => {
  // Navigation shortcuts: Alt + Shift + O (Overview), Alt + Shift + A (Admin console), Alt + Shift + L (Library)
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

// Hook keys and release on unmount
onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeyShortcut);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeyShortcut);
  if (benchmarkInterval) {
    clearInterval(benchmarkInterval);
  }
});

/**
 * Inserts a new hardware component model into the general listings.
 * @param {HardwareComponent} comp - Deserialized item data structure.
 * @returns {void}
 */
const handleAddComponent = (comp: HardwareComponent): void => {
  components.value = [comp, ...components.value];
};

/**
 * Overwrites state details for an matching hardware component record.
 * @param {HardwareComponent} updatedComp - Changed target item schema.
 * @returns {void}
 */
const handleEditComponent = (updatedComp: HardwareComponent): void => {
  components.value = components.value.map(c => c.id === updatedComp.id ? updatedComp : c);
};

/**
 * Truncates an item out of cache listings based on exact key.
 * @param {string} id - Selected element serial tag.
 * @returns {void}
 */
const handleDeleteComponent = (id: string): void => {
  components.value = components.value.filter(c => c.id !== id);
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
    <!-- Render Login flow if not validated yet -->
    <LoginScreen 
      v-if="!isAuthenticated" 
      @login-success="isAuthenticated = true" 
    />

    <!-- Main authenticated application shell -->
    <div 
      v-else 
      id="dashboard-layout" 
      class="min-h-screen bg-tech-bg text-dark-ink flex select-none overflow-x-hidden text-left"
    >
      
      <!-- Side navigation rail -->
      <Sidebar 
        :activeTab="activeTab" 
        @update:activeTab="activeTab = $event"
        @logout="handleLogout"
        @run-benchmark="handleRunBenchmark"
        :isBenchmarking="isBenchmarking"
      />

      <!-- Main layout column -->
      <div class="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        <!-- Top search & profile header -->
        <Header @search="handleSearchUpdate" />

        <!-- Dynamic page placement region -->
        <main class="flex-1 p-6 max-w-[1280px] mx-auto w-full pb-16">
          
          <!-- Stress Test notification strip -->
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

          <!-- Component page switches -->
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
