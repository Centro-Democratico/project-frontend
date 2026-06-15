<script setup lang="ts">
import { ref } from 'vue';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  FileText, 
  Download, 
  Filter, 
  Code, 
  CheckCircle2, 
  XCircle, 
  X,
  FileSpreadsheet
} from 'lucide-vue-next';
import { HardwareComponent, LogEntry } from '../types';

interface AdminConsolePageProps {
  components: HardwareComponent[];
  logs: LogEntry[];
}

const props = defineProps<AdminConsolePageProps>();

const emit = defineEmits<{
  (e: 'add-component', comp: HardwareComponent): void;
  (e: 'edit-component', comp: HardwareComponent): void;
  (e: 'delete-component', id: string): void;
  (e: 'add-log', message: string, type: 'success' | 'info' | 'warn' | 'error'): void;
}>();

// Modals status
const showAddModal = ref(false);
const showEditModal = ref(false);
const showJsonInspector = ref(false);

const editingComp = ref<HardwareComponent | null>(null);

// Form states for Add/Edit
const formId = ref('');
const formName = ref('');
const formCategory = ref<'GPU' | 'CPU' | 'RAM' | 'SSD' | 'Motherboard'>('GPU');
const formSeries = ref('');
const formSpecs = ref('');
const formWatts = ref(150);
const formPrice = ref(499);

// Switch parameters
const syntheticsRefresh = ref(true);
const leaderboardVisible = ref(true);

// Action triggers
const toggleSynthetics = () => {
  syntheticsRefresh.value = !syntheticsRefresh.value;
  emit('add-log', `Background state 'Global Synthetics Refresh' hot toggled to ${syntheticsRefresh.value ? 'ACTIVE' : 'DISABLED'}.`, 'info');
};

const toggleLeaderboard = () => {
  leaderboardVisible.value = !leaderboardVisible.value;
  emit('add-log', `Telemetry state 'Leaderboard Visibility' hot toggled to ${leaderboardVisible.value ? 'ONLINE' : 'OFFLINE'}.`, 'info');
};

// Handle launch Add component
const triggerAddModal = () => {
  const randomHex = Math.floor(Math.random() * 9000 + 1000).toString();
  formId.value = `#${formCategory.value}-${randomHex}`;
  formName.value = '';
  formSeries.value = '';
  formSpecs.value = '';
  formWatts.value = 150;
  formPrice.value = 499;
  showAddModal.value = true;
};

const handleCreateComponent = () => {
  if (!formName.value.trim()) {
    alert('Por favor ingrese el nombre del modelo.');
    return;
  }

  const newComp: HardwareComponent = {
    id: formId.value,
    name: formName.value,
    category: formCategory.value,
    series: formSeries.value || 'Global series',
    specs: formSpecs.value || 'Calibrated reference spec',
    watts: Number(formWatts.value) || 100,
    userVal: 'N/A',
    avgVal: 'N/A',
    delta: '0.0%',
    isPositiveDelta: true,
    price: Number(formPrice.value) || 299,
  };

  emit('add-component', newComp);
  emit('add-log', `Created and cataloged hardware component ${newComp.id} [${newComp.name}] into local database registry.`, 'success');
  showAddModal.value = false;
};

// Handle Edit components
const triggerEditModal = (comp: HardwareComponent) => {
  editingComp.value = comp;
  formId.value = comp.id;
  formName.value = comp.name;
  formCategory.value = comp.category;
  formSeries.value = comp.series;
  formSpecs.value = comp.specs;
  formWatts.value = comp.watts;
  formPrice.value = comp.price;
  showEditModal.value = true;
};

const handleUpdateComponent = () => {
  if (!editingComp.value) return;

  const updatedComp: HardwareComponent = {
    ...editingComp.value,
    name: formName.value,
    category: formCategory.value,
    series: formSeries.value,
    specs: formSpecs.value,
    watts: Number(formWatts.value),
    price: Number(formPrice.value),
  };

  emit('edit-component', updatedComp);
  emit('add-log', `Updated parameters for component ${formId.value} [${formName.value}] in databases.`, 'success');
  showEditModal.value = false;
  editingComp.value = null;
};

// Simulated raw CSV file compiler
const handleExportCSV = () => {
  const headers = 'ID,Name,Category,Series,Watts,Price\n';
  const rows = props.components.map(c => `"${c.id}","${c.name}","${c.category}","${c.series}",${c.watts},${c.price}`).join('\n');
  const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
  
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", csvContent);
  downloadAnchor.setAttribute("download", `KM_hardware_registry_${Date.now()}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  emit('add-log', 'Raw CSV spreadsheet exported to local download directory successfully.', 'success');
};

const handleCategoryChange = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  const cat = target.value as any;
  formCategory.value = cat;
  const randomHex = Math.floor(Math.random() * 9000 + 1000).toString();
  formId.value = `#${cat}-${randomHex}`;
};
</script>

<template>
  <div class="space-y-6 select-none animate-fade-in">
    
    <!-- Header telemetry info -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="bg-brand-green text-dark-ink text-[10px] font-black px-2 py-0.5 tracking-tighter uppercase font-headline">
            LIVE DATA
          </span>
          <span class="text-[#90adc7] font-headline text-[10px] font-bold uppercase tracking-widest">
            Station ID: ADMIN_DIAG_01
          </span>
        </div>
        <h1 class="font-headline text-2xl font-black uppercase tracking-tight text-dark-ink">
          Admin Console
        </h1>
        <p class="text-slate-500 text-sm max-w-2xl">
          Authorized administrative access for technical diagnostics and data integrity management.
        </p>
      </div>

      <div>
        <button 
          @click="triggerAddModal"
          class="bg-brand-green hover:bg-brand-green-hover text-dark-ink px-6 py-3 font-headline font-bold uppercase text-xs tracking-widest flex items-center gap-2 rounded-sm shadow-sm transition-transform active:scale-[0.98] cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>Add Component</span>
        </button>
      </div>
    </div>

    <!-- Main Grid: Management, Controls, Activity logs -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Database Management Card -->
      <section class="col-span-12 lg:col-span-8 bg-white border border-[#90adc7]/30 rounded-lg p-5">
        <div class="flex justify-between items-center mb-4">
          <h2 class="font-headline text-[10px] font-black uppercase tracking-widest text-[#90adc7]">
            Database Management
          </h2>
          <button 
            @click="alert(`Cataloged elements: ${components.length} components. Filter system: Idle.`)"
            class="flex items-center gap-1 text-[10px] font-bold text-[#55606a] uppercase hover:text-brand-green transition-colors cursor-pointer"
          >
            <Filter class="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-slate-50 border-b border-tech-border font-headline text-[9px] font-bold text-[#55606a] uppercase tracking-wider">
                <th class="p-3.5">ID</th>
                <th class="p-3.5">Component Model</th>
                <th class="p-3.5">Series Architecture</th>
                <th class="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-mono text-xs">
              <tr v-for="comp in components" :key="comp.id" class="hover:bg-brand-green/5 transition-colors">
                <td class="p-3.5 font-bold text-brand-green text-left">{{ comp.id }}</td>
                <td class="p-3.5 text-dark-ink font-bold font-sans text-left">{{ comp.name }}</td>
                <td class="p-3.5 text-slate-500 text-left">{{ comp.series }}</td>
                <td class="p-3.5 text-right flex items-center justify-end gap-1">
                  <button 
                    @click="triggerEditModal(comp)"
                    class="p-1.5 hover:text-brand-green hover:bg-slate-50 rounded transition-colors cursor-pointer"
                    title="Modificar Componente"
                  >
                    <Edit3 class="w-4 h-4 text-slate-500" />
                  </button>
                  <button 
                    @click="() => {
                      if (confirm(`Confirmar eliminación del componente ${comp.id} (${comp.name})?`)) {
                        emit('delete-component', comp.id);
                        emit('add-log', `Deleted component ${comp.id} from local cache database registries.`, 'warn');
                      }
                    }"
                    class="p-1.5 hover:text-rose-600 hover:bg-slate-50 rounded transition-colors cursor-pointer"
                    title="Eliminar de la Base de Datos"
                  >
                    <Trash2 class="w-4 h-4 text-slate-500" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Right Admin Controls and activity Logs side panels -->
      <section class="col-span-12 lg:col-span-4 space-y-6">
        
        <!-- Controls Toggles -->
        <div class="bg-white border border-[#90adc7]/30 rounded-lg p-5">
          <h2 class="font-headline text-[10px] font-black uppercase tracking-widest text-[#90adc7] mb-4 text-left">
            System Controls
          </h2>
          <div class="space-y-3">
            
            <!-- Switch 1 -->
            <div class="flex items-center justify-between p-3.5 border border-slate-100 bg-slate-50/50 rounded-sm">
              <div class="text-left">
                <span class="font-headline font-bold text-xs uppercase text-slate-700 block text-left">
                  Global Synthetics Refresh
                </span>
                <span class="text-[10px] text-slate-400 italic font-semibold text-left">
                  * Interactive background loop
                </span>
              </div>
              <button 
                @click="toggleSynthetics"
                class="w-10 h-6 px-1 rounded-full flex items-center transition-colors cursor-pointer"
                :class="syntheticsRefresh ? 'bg-brand-green' : 'bg-slate-200'"
              >
                <span class="w-4 h-4 bg-white rounded-full shadow-sm transition-transform" :class="syntheticsRefresh ? 'translate-x-4' : 'translate-x-0'"></span>
              </button>
            </div>

            <!-- Switch 2 -->
            <div class="flex items-center justify-between p-3.5 border border-slate-100 bg-slate-50/50 rounded-sm">
              <div class="text-left">
                <span class="font-headline font-bold text-xs uppercase text-slate-700 block text-left">
                  Leaderboard Visibility
                </span>
                <span class="text-[10px] text-slate-400 italic font-semibold text-left">
                  * Worldwide telemetry access
                </span>
              </div>
              <button 
                @click="toggleLeaderboard"
                class="w-10 h-6 px-1 rounded-full flex items-center transition-colors cursor-pointer"
                :class="leaderboardVisible ? 'bg-brand-green' : 'bg-slate-200'"
              >
                <span class="w-4 h-4 bg-white rounded-full shadow-sm transition-transform" :class="leaderboardVisible ? 'translate-x-4' : 'translate-x-0'"></span>
              </button>
            </div>

          </div>
        </div>

        <!-- Activity Logs inside administrator -->
        <div class="bg-white border border-[#90adc7]/30 rounded-lg p-5">
          <h2 class="font-headline text-[10px] font-black uppercase tracking-widest text-[#90adc7] mb-4 text-left">
            Recent Activity Logs
          </h2>
          <div class="space-y-3.5 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
            <div 
              v-for="log in logs" 
              :key="log.id" 
              class="border-l-4 p-3 rounded-sm text-left" 
              :class="log.type === 'error' ? 'border-rose-500 bg-rose-50/30' : 'border-brand-green bg-emerald-50/20'"
            >
              <p class="text-[9px] font-mono text-slate-400 mt-0">{{ log.timestamp }}</p>
              <p class="font-headline text-[11px] font-bold text-slate-800 uppercase mt-0.5 leading-tight">
                {{ log.message }}
              </p>
              <div class="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-slate-500 mt-1.5">
                <CheckCircle2 class="w-3 h-3 text-brand-green" />
                <span>{{ log.type }}</span>
              </div>
            </div>
          </div>
        </div>

      </section>

    </div>

    <!-- Serialization formats section -->
    <section class="bg-white border border-[#90adc7]/30 rounded-lg p-5">
      <h2 class="font-headline text-[10px] font-black uppercase tracking-widest text-[#90adc7] mb-4 text-left">
        Data Serialization &amp; Actions
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        
        <!-- Action 1 -->
        <div 
          @click="handleExportCSV"
          class="p-4 border border-slate-200 bg-white rounded-sm flex items-center gap-4 hover:bg-brand-green/5 transition-all cursor-pointer group"
        >
          <div class="w-12 h-12 bg-slate-50 flex items-center justify-center border border-slate-100 rounded">
            <FileSpreadsheet class="w-6 h-6 text-[#55606a]" />
          </div>
          <div>
            <h3 class="font-headline text-xs font-bold uppercase text-[#0f1029] group-hover:text-brand-green transition-colors">
              Export to CSV
            </h3>
            <p class="text-[9px] text-slate-400 font-bold uppercase tracking-wide">
              Raw analysis database
            </p>
          </div>
        </div>

        <!-- Action 2 -->
        <div 
          @click="() => {
            window.print();
            emit('add-log', 'Initiated browser print/export tool for system snapshot.', 'success');
          }"
          class="p-4 border border-slate-200 bg-white rounded-sm flex items-center gap-4 hover:bg-brand-green/5 transition-all cursor-pointer group"
        >
          <div class="w-12 h-12 bg-slate-50 flex items-center justify-center border border-slate-100 rounded">
            <FileText class="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h3 class="font-headline text-xs font-bold uppercase text-[#0f1029] group-hover:text-brand-green transition-colors">
              Export to PDF
            </h3>
            <p class="text-[9px] text-slate-400 font-bold uppercase tracking-wide">
              Technical report layout
            </p>
          </div>
        </div>

        <!-- Action 3 -->
        <div 
          @click="showJsonInspector = true"
          class="p-4 border border-slate-200 bg-white rounded-sm flex items-center gap-4 hover:bg-brand-green/5 transition-all cursor-pointer group"
        >
          <div class="w-12 h-12 bg-slate-50 flex items-center justify-center border border-slate-100 rounded">
            <Code class="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 class="font-headline text-xs font-bold uppercase text-[#0f1029] group-hover:text-brand-green transition-colors">
              JSON Payload
            </h3>
            <p class="text-[9px] text-slate-400 font-bold uppercase tracking-wide">
              API endpoint snapshot
            </p>
          </div>
        </div>

        <!-- Counter block -->
        <div class="bg-slate-50 rounded-sm border border-slate-200 p-4 flex flex-col justify-center items-center text-center">
          <p class="font-headline text-[9px] text-[#90adc7] uppercase tracking-wider font-bold mb-0.5">
            LAST DATA SYNC STATUS
          </p>
          <p class="font-mono text-sm font-black text-[#0f1029] uppercase">
            6 MIN AGO (ACTIVE)
          </p>
        </div>

      </div>
    </section>

    <!-- JSON INSPECTOR MODAL -->
    <div v-if="showJsonInspector" class="fixed inset-0 bg-dark-ink/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div class="bg-[#f8fafc] rounded-lg border border-slate-300 w-full max-w-xl shadow-xl flex flex-col overflow-hidden max-h-[80vh]">
        <header class="bg-dark-ink text-white p-4 flex justify-between items-center border-b border-slate-800">
          <h3 class="font-headline text-xs font-black tracking-widest uppercase text-brand-green">
            API Endpoint Snapshot Inspect
          </h3>
          <button @click="showJsonInspector = false" class="text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </header>
        <div class="p-4 overflow-y-auto font-mono text-[10px] bg-slate-900 text-slate-200 flex-1 text-left">
          <pre>{{ JSON.stringify(components, null, 2) }}</pre>
        </div>
        <footer class="bg-slate-50 p-3 flex justify-end border-t border-slate-200">
          <button 
            @click="() => {
              navigator.clipboard.writeText(JSON.stringify(components, null, 2));
              alert('JSON copiado al portapapeles!');
            }"
            class="bg-brand-green text-dark-ink px-4 py-2 text-xs font-headline font-bold uppercase rounded-[2px] cursor-pointer"
          >
            Copiar JSON
          </button>
        </footer>
      </div>
    </div>

    <!-- ADD COMPONENT MODAL -->
    <div v-if="showAddModal" class="fixed inset-0 bg-dark-ink/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg border border-slate-300 w-full max-w-md shadow-2xl overflow-hidden animate-zoomIn text-left">
        <header class="bg-[#f8fafc] p-4 flex justify-between items-center border-b border-slate-100">
          <h3 class="font-headline text-sm font-bold text-dark-ink uppercase">
            Add Hardware Component
          </h3>
          <button @click="showAddModal = false" class="text-slate-400 hover:text-dark-ink transition-colors cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </header>
        <form @submit.prevent="handleCreateComponent" class="p-5 space-y-4">
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase font-headline">Unique Serial ID</label>
            <input type="text" :value="formId" disabled class="w-full bg-slate-50 text-slate-500 font-mono text-xs border border-slate-200 rounded p-2.5 mt-1 cursor-not-allowed" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase font-headline">Category</label>
              <select 
                :value="formCategory" 
                @change="handleCategoryChange"
                class="w-full bg-white text-xs border border-slate-200 rounded p-2.5 mt-1 font-sans text-dark-ink outline-none"
              >
                <option value="GPU">GPU</option>
                <option value="CPU">CPU</option>
                <option value="RAM">RAM</option>
                <option value="SSD">SSD</option>
                <option value="Motherboard">Motherboard</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase font-headline">Series Architecture</label>
              <input type="text" v-model="formSeries" placeholder="e.g. Raptor Lake" class="w-full bg-white text-xs border border-slate-200 rounded p-2.5 mt-1 font-sans text-dark-ink focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none" />
            </div>
          </div>

          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase font-headline">Component Model Name</label>
            <input type="text" v-model="formName" placeholder="e.g. Core i7-14700K" class="w-full bg-white text-xs border border-slate-200 rounded p-2.5 mt-1 font-sans text-dark-ink focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none" />
          </div>

          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase font-headline">Technical Specifications Summary</label>
            <input type="text" v-model="formSpecs" placeholder="e.g. 20 Cores, 28 Threads, 5.6GHz Match" class="w-full bg-white text-xs border border-slate-100 rounded p-2.5 mt-1 font-sans text-dark-ink focus:border-brand-green focus:ring-1" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase font-headline">Power drawn (Watts)</label>
              <input type="number" min="0" v-model.number="formWatts" class="w-full bg-white text-xs border border-slate-200 rounded p-2.5 mt-1 font-mono text-dark-ink focus:border-brand-green focus:ring-1" />
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase font-headline">Price Catalog ($)</label>
              <input type="number" min="0" v-model.number="formPrice" class="w-full bg-white text-xs border border-slate-200 rounded p-2.5 mt-1 font-mono text-dark-ink focus:border-brand-green focus:ring-1" />
            </div>
          </div>

          <div class="flex justify-end gap-2.5 pt-3">
            <button type="button" @click="showAddModal = false" class="px-4 py-2 border border-slate-200 text-slate-600 rounded text-xs uppercase font-headline font-bold cursor-pointer">
              Cancelar
            </button>
            <button type="submit" class="bg-brand-green hover:bg-brand-green-hover text-dark-ink px-5 py-2 rounded text-xs uppercase font-headline font-bold cursor-pointer">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- EDIT COMPONENT MODAL -->
    <div v-if="showEditModal" class="fixed inset-0 bg-dark-ink/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg border border-slate-300 w-full max-w-md shadow-2xl overflow-hidden animate-zoomIn text-left">
        <header class="bg-[#f8fafc] p-4 flex justify-between items-center border-b border-slate-100">
          <h3 class="font-headline text-sm font-bold text-dark-ink uppercase">
            Edit Component Parameters
          </h3>
          <button @click="showEditModal = false" class="text-slate-400 hover:text-dark-ink transition-colors cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </header>
        <form @submit.prevent="handleUpdateComponent" class="p-5 space-y-4">
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase font-headline">Unique Serial ID</label>
            <input type="text" :value="formId" disabled class="w-full bg-slate-50 text-slate-500 font-mono text-xs border border-slate-200 rounded p-2.5 mt-1 cursor-not-allowed" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase font-headline">Category</label>
              <select 
                v-model="formCategory" 
                class="w-full bg-white text-xs border border-slate-200 rounded p-2.5 mt-1 font-sans text-dark-ink outlines-none"
              >
                <option value="GPU">GPU</option>
                <option value="CPU">CPU</option>
                <option value="RAM">RAM</option>
                <option value="SSD">SSD</option>
                <option value="Motherboard">Motherboard</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase font-headline">Series Architecture</label>
              <input type="text" v-model="formSeries" placeholder="e.g. Raptor Lake" class="w-full bg-white text-xs border border-slate-200 rounded p-2.5 mt-1 font-sans text-dark-ink focus:border-brand-green focus:ring-1 outline-none" />
            </div>
          </div>

          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase font-headline">Component Model Name</label>
            <input type="text" v-model="formName" placeholder="e.g. Core i7-14700K" class="w-full bg-white text-xs border border-slate-200 rounded p-2.5 mt-1 font-sans text-dark-ink focus:border-brand-green focus:ring-1 outline-none" />
          </div>

          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase font-headline">Technical Specifications Summary</label>
            <input type="text" v-model="formSpecs" placeholder="e.g. 20 Cores, 28 Threads, 5.6GHz Match" class="w-full bg-white text-xs border border-slate-200 rounded p-2.5 mt-1 font-sans text-dark-ink focus:border-brand-green focus:ring-1 outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase font-headline">Power drawn (Watts)</label>
              <input type="number" min="0" v-model.number="formWatts" class="w-full bg-white text-xs border border-slate-200 rounded p-2.5 mt-1 font-mono text-dark-ink focus:border-brand-green focus:ring-1 outline-none" />
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase font-headline">Price Catalog ($)</label>
              <input type="number" min="0" v-model.number="formPrice" class="w-full bg-white text-xs border border-slate-200 rounded p-2.5 mt-1 font-mono text-dark-ink focus:border-brand-green focus:ring-1 outline-none" />
            </div>
          </div>

          <div class="flex justify-end gap-2.5 pt-3">
            <button type="button" @click="showEditModal = false" class="px-4 py-2 border border-slate-200 text-slate-600 rounded text-xs uppercase font-headline font-bold cursor-pointer">
              Cancelar
            </button>
            <button type="submit" class="bg-brand-green hover:bg-brand-green-hover text-dark-ink px-5 py-2 rounded text-xs uppercase font-headline font-bold cursor-pointer">
              Actualizar Parameters
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>
