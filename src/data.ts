import { HardwareComponent, LogEntry, UserStats } from './types';

export const INITIAL_COMPONENTS: HardwareComponent[] = [
  {
    id: '#GPU-4090',
    name: 'GeForce RTX 4090',
    category: 'GPU',
    series: 'Ada Lovelace',
    specs: '24GB GDDR6X • DLSS 3.0 • Ray Tracing Cores 3rd Gen',
    watts: 450,
    userVal: '36,842',
    avgVal: '34,120',
    delta: '+8.0%',
    isPositiveDelta: true,
    fpsGain: 110,
    price: 1599.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUeQoLTPoMVZEuYks_KvyNQuAu0a5K7WMttfZ3dvsmLxo_Br1HWdhx8TYQjnxoOAugo5GyvdYX5cCEj_2WyLqAi8b4Yh6iFhrNx4EmCrA8zq_42tWmAX22VdS34FD82Hxq6ai2xo3OpTUjdtBaIjlMwVYLpe1Y34VwjIfny_WHpklkUlmtNFeL1GV--6_3AvnV08IZ6zURi5FDmeREP1iArjyHatSdm7kMGPRHuKTXJ964MFjksYF6EzvSlkipEk489houiGT71pA'
  },
  {
    id: '#CPU-1390',
    name: 'Core i9-13900K',
    category: 'CPU',
    series: 'Raptor Lake',
    specs: '24 Cores, 32 Threads, 5.8GHz Max Boost',
    watts: 253,
    userVal: '39,411',
    avgVal: '40,012',
    delta: '-1.5%',
    isPositiveDelta: false,
    fpsGain: 48,
    price: 529.99,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrSx23xB2m6muX02rMRAe2bsHRUvQbPFeLVD0Uu5N1BYq5Q4Sv1DmRzkC1I7O3x771lyllGf9PjeFqbPo2_ljEZF9HgzUMHwlq_tLSqY8fB-3D-QS8fUu9wY81O5VHZzQMNsjancsGEnpp40m2ThSVKuzAKlawuG-YbnXDVUwfQ5rvF86ZA6n1Zt3hOJckwY_gQ6Y1Jm_UCcUOHVXM1ebQSsgm4sJ-DhpkP8mrx6G3fOWRSBqk9s_mv8SgtV4licmq_5Sdyz3iQfU'
  },
  {
    id: '#GPU-7900',
    name: 'Radeon RX 7900 XTX',
    category: 'GPU',
    series: 'RDNA 3',
    specs: '24GB GDDR6, 384-bit memory bus',
    watts: 355,
    userVal: '31,220',
    avgVal: '31,800',
    delta: '-1.8%',
    isPositiveDelta: false,
    fpsGain: 85,
    price: 949.99,
  },
  {
    id: '#CPU-7950',
    name: 'Ryzen 9 7950X',
    category: 'CPU',
    series: 'Zen 4',
    specs: '16 Cores, 32 Threads, 5.7GHz Max Boost',
    watts: 170,
    userVal: '38,211',
    avgVal: '37,120',
    delta: '+2.9%',
    isPositiveDelta: true,
    fpsGain: 50,
    price: 549.00,
  },
  {
    id: '#RAM-DDR5',
    name: 'Corsair Vengeance DDR5',
    category: 'RAM',
    series: 'Vengeance Series',
    specs: '64GB (2x32GB) DDR5 6000MHz CL30',
    watts: 15,
    userVal: '58.4ns',
    avgVal: '62.1ns',
    delta: '+6.3%',
    isPositiveDelta: true,
    fpsGain: 15,
    price: 209.99,
  },
  {
    id: '#SSD-990P',
    name: 'Samsung 990 Pro 2TB',
    category: 'SSD',
    series: '990 PRO Series',
    specs: 'M.2 NVMe PCIe Gen 4, 7450 MB/s Read',
    watts: 9,
    userVal: '7.1GB/s',
    avgVal: '6.8GB/s',
    delta: '+4.4%',
    isPositiveDelta: true,
    fpsGain: 4,
    price: 169.99,
  },
  {
    id: '#MB-Z790',
    name: 'Z790 Steel Legend',
    category: 'Motherboard',
    series: 'Steel Legend',
    specs: 'ATX Form Factor, LGA1700, DDR5 support',
    watts: 80,
    userVal: 'Stable link',
    avgVal: 'Stable link',
    delta: '0.0%',
    isPositiveDelta: true,
    price: 239.99
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-06-14 22:30:11',
    message: 'Thermal integrity verification: stable baseline reached.',
    type: 'success'
  },
  {
    id: 'log-2',
    timestamp: '2026-06-14 22:15:44',
    message: 'PCId Gen4 link established and operating at full bandwidth.',
    type: 'info'
  },
  {
    id: 'log-3',
    timestamp: '2026-06-14 21:54:12',
    message: 'Synthetics sync completed for Node #4. Leaderboards updated.',
    type: 'success'
  },
  {
    id: 'log-4',
    timestamp: '2026-06-14 21:10:05',
    message: 'Fan curve configuration #3: optimization threshold warning. Low headroom.',
    type: 'warn'
  }
];

export const INITIAL_STATS: UserStats = {
  globalRanking: 124,
  globalEfficiency: 72,
  thermalHeadroom: 44,
  realTimeFps: 144.2,
  cpuTemp: 62,
  gpuTemp: 68,
  systemHealth: 98.4
};
