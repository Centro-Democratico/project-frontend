export type ActiveTab = 'overview' | 'my-hardware' | 'library' | 'admin';

export interface HardwareComponent {
  id: string; 
  name: string;
  category: 'GPU' | 'CPU' | 'RAM' | 'SSD' | 'Motherboard';
  series: string;
  specs: string;
  watts: number;
  userVal: string;
  avgVal: string;
  delta: string;
  isPositiveDelta: boolean;
  fpsGain?: number;
  price: number;
  image?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'success' | 'info' | 'warn' | 'error';
}

export interface UserStats {
  globalRanking: number;
  globalEfficiency: number;
  thermalHeadroom: number;
  realTimeFps: number;
  cpuTemp: number;
  gpuTemp: number;
  systemHealth: number;
}
