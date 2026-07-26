/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  RefreshCw, 
  Download, 
  Play, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Activity, 
  Usb, 
  FileJson, 
  Settings, 
  Search,
  Power,
  FolderDown,
  Code2,
  Copy,
  Check
} from 'lucide-react';

interface DeviceVariable {
  key: string;
  value: string;
  highlight?: 'orange' | 'emerald' | 'blue' | 'normal';
}

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'INFO' | 'CMD' | 'WARN' | 'SUCCESS';
  message: string;
  detail?: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'modules' | 'firmware'>('diagnostics');
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [selectedPort, setSelectedPort] = useState<string>('COM3 (USB High-Speed)');
  const [activeSession] = useState<string>('#8821-X');
  
  const [deviceVars, setDeviceVars] = useState<DeviceVariable[]>([
    { key: 'sku', value: 'XT2429-1', highlight: 'normal' },
    { key: 'baseband', value: 'M7325_G_23.123', highlight: 'normal' },
    { key: 'bootloader', value: 'LOCKED (0x0)', highlight: 'orange' },
    { key: 'security_patch', value: '2024-05-01', highlight: 'emerald' },
    { key: 'partition', value: 'ranura a/b activa', highlight: 'normal' },
    { key: 'hw_rev', value: 'p2b', highlight: 'normal' },
    { key: 'imei', value: '35628203******', highlight: 'normal' },
    { key: 'cid', value: '0x0032', highlight: 'normal' },
    { key: 'kernel_rev', value: '5.15.148-android14-9-g', highlight: 'normal' },
    { key: 'ram_size', value: '12GB LPDDR4X', highlight: 'blue' }
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: '12:00:01', type: 'INFO', message: 'Iniciando escucha en COM3...' },
    { id: '2', timestamp: '12:00:02', type: 'INFO', message: 'Dispositivo detectado:', detail: 'Motorola Edge 50 Fusion (Cusco)' },
    { id: '3', timestamp: '12:00:03', type: 'CMD', message: 'fastboot getvar all' },
    { id: '4', timestamp: '12:00:04', type: 'INFO', message: '... (bootloader) version-baseband: M7325_G_23.123' },
    { id: '5', timestamp: '12:00:04', type: 'INFO', message: '... (bootloader) slot-active: a' },
    { id: '6', timestamp: '12:00:05', type: 'WARN', message: 'Verificación de seguridad: Modo de diagnóstico estándar activo.' },
    { id: '7', timestamp: '12:00:05', type: 'SUCCESS', message: 'Reporte de diagnóstico generado en /data/audit_logs.json' }
  ]);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const addLog = (type: LogEntry['type'], message: string, detail?: string) => {
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0];
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(2, 9),
      timestamp,
      type,
      message,
      detail
    }]);
  };

  const runServiceTask = (taskName: string, command: string) => {
    if (!isConnected) {
      addLog('WARN', 'No se puede ejecutar la tarea: Dispositivo desconectado del puerto COM.');
      return;
    }
    setIsProcessing(true);
    addLog('CMD', command);
    
    setTimeout(() => {
      if (taskName === 'Identify Device') {
        addLog('INFO', 'Escaneando variables del sistema a través de la interfaz USB...');
        addLog('SUCCESS', 'Se obtuvieron exitosamente 10 parámetros de hardware.');
      } else if (taskName === 'Hardware Audit') {
        addLog('INFO', 'Verificando integridad de particiones y salud de batería...');
        addLog('INFO', '... (bootloader) battery-voltage: 4120mV');
        addLog('INFO', '... (bootloader) storage-health: GOOD (98% de vida restante)');
        addLog('SUCCESS', 'Auditoría de hardware completada sin anomalías.');
      } else if (taskName === 'Fast Reboot') {
        addLog('INFO', 'Enviando señal de reinicio al bootloader secundario...');
        addLog('SUCCESS', 'Dispositivo reiniciando a modo operativo estándar (OS).');
      }
      setIsProcessing(false);
    }, 800);
  };

  const handleExportJSON = () => {
    setShowExportModal(true);
    addLog('SUCCESS', 'Registro de auditoría exportado en formato JSON estructurado.');
  };

  const toggleConnection = () => {
    if (isConnected) {
      setIsConnected(false);
      addLog('WARN', `Interfaz USB desconectada de ${selectedPort}. Nodo fuera de línea.`);
    } else {
      setIsConnected(true);
      addLog('INFO', `Restableciendo conexión en ${selectedPort}...`);
      addLog('SUCCESS', 'Enlace verificado con Motorola Edge 50 Fusion.');
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-[#e5e7eb] font-sans overflow-hidden">
      {/* Sidebar: Navigation & Audit Navigation */}
      <aside className="w-64 border-r border-[#1f1f1f] bg-[#0f0f0f] flex flex-col shrink-0">
        <div className="p-6 flex items-center justify-between border-b border-[#1f1f1f]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/20">
              M
            </div>
            <div>
              <span className="font-semibold tracking-tight text-lg block leading-none">MotoNexus</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Toolkit v1.0.4</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 ml-3">Operaciones Principales</div>
          
          <button 
            onClick={() => setActiveTab('diagnostics')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
              activeTab === 'diagnostics' 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 font-medium' 
                : 'text-gray-400 hover:bg-[#1f1f1f] hover:text-gray-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span className="text-sm">Diagnóstico y Logs</span>
          </button>

          <button 
            onClick={() => setActiveTab('modules')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
              activeTab === 'modules' 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 font-medium' 
                : 'text-gray-400 hover:bg-[#1f1f1f] hover:text-gray-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-sm">Seguridad y Auditoría</span>
          </button>

          <button 
            onClick={() => setActiveTab('firmware')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
              activeTab === 'firmware' 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 font-medium' 
                : 'text-gray-400 hover:bg-[#1f1f1f] hover:text-gray-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span className="text-sm">Especificaciones HW</span>
          </button>

          <div className="pt-6">
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 ml-3">Comunicación USB</div>
            <div className="px-3 py-2 bg-[#141414] rounded-lg border border-[#1f1f1f] space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Usb className="w-3.5 h-3.5 text-blue-400" /> Puerto COM
                </span>
                <select 
                  value={selectedPort}
                  onChange={(e) => setSelectedPort(e.target.value)}
                  className="bg-[#0f0f0f] border border-[#2f2f2f] text-[11px] text-gray-300 rounded px-1.5 py-0.5 outline-none focus:border-blue-500"
                >
                  <option value="COM3 (USB High-Speed)">COM3 (Alta Velocidad)</option>
                  <option value="COM4 (USB 2.0/3.0)">COM4 (USB 3.0)</option>
                  <option value="COM7 (Direct UART)">COM7 (Modo UART)</option>
                </select>
              </div>
              <button 
                onClick={toggleConnection}
                className={`w-full py-1.5 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  isConnected 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                }`}
              >
                <Power className="w-3 h-3" />
                {isConnected ? 'Conexión Activa' : 'Conectar Nodo USB'}
              </button>
            </div>
          </div>
        </nav>

        <div className="mt-auto border-t border-[#1f1f1f] p-4">
          <div className="bg-[#161616] rounded-lg p-3.5 border border-[#222]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Estado del Servicio</span>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
            </div>
            <p className="text-[11px] text-gray-400 leading-tight">
              {isConnected 
                ? `Conectado al nodo local por ${selectedPort.split(' ')[0]}. Puente ADB/Fastboot activo.` 
                : 'Nodo desconectado. Esperando dispositivo en la interfaz objetivo.'}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]">
        {/* Header Bar */}
        <header className="h-16 border-b border-[#1f1f1f] bg-[#0f0f0f]/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Sesión: <span className="text-blue-400 font-mono font-medium">{activeSession}</span></span>
            <div className="h-4 w-[1px] bg-[#1f1f1f]"></div>
            <div className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-blue-500 shadow-sm shadow-blue-500' : 'bg-gray-600'}`}></span>
              <span className="text-sm font-semibold text-gray-200">Motorola Edge 50 Fusion</span>
              <span className="text-xs text-gray-500 font-mono">(Cusco / XT2429)</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowGuideModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600/10 text-blue-400 border border-blue-500/30 rounded-md hover:bg-blue-600/20 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <FolderDown className="w-3.5 h-3.5 text-blue-400" />
              Llevar a Antigravity / Backend Local
            </button>
            <button 
              onClick={handleExportJSON}
              className="px-3.5 py-1.5 text-xs font-medium bg-[#1f1f1f] text-gray-200 border border-[#2f2f2f] rounded-md hover:bg-[#2a2a2a] transition-all flex items-center gap-1.5"
            >
              <FileJson className="w-3.5 h-3.5 text-blue-400" />
              Exportar JSON
            </button>
            <button 
              onClick={() => {
                setIsConnected(false);
                addLog('WARN', 'Proceso abortado manualmente por el usuario. Terminando conexiones activas.');
              }}
              className="px-3.5 py-1.5 text-xs font-medium bg-red-600/10 text-red-400 border border-red-600/20 rounded-md hover:bg-red-600/20 transition-all flex items-center gap-1.5"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Abortar Proceso
            </button>
          </div>
        </header>

        {/* Workspace Grid */}
        <div className="flex-1 p-8 grid grid-cols-12 gap-6 overflow-y-auto">
          {activeTab === 'diagnostics' && (
            <>
              {/* Device Parameters Card */}
              <div className="col-span-12 lg:col-span-4 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl flex flex-col shadow-sm h-[calc(100vh-140px)]">
                <div className="p-4 border-b border-[#1f1f1f] flex justify-between items-center bg-[#121212] rounded-t-xl shrink-0">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-gray-400" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-300">Variables del Sistema</h3>
                  </div>
                  <span className="text-[10px] font-mono font-medium bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                    fastboot all
                  </span>
                </div>
                
                <div className="flex-1 p-5 overflow-y-auto font-mono text-[12px] space-y-3.5">
                  {deviceVars.map((v, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-[#1a1a1a] pb-2 hover:bg-[#141414] px-2 py-1 rounded transition-colors">
                      <span className="text-gray-500">{v.key}:</span>
                      <span className={
                        v.highlight === 'orange' ? 'text-orange-400 font-semibold' :
                        v.highlight === 'emerald' ? 'text-emerald-400 font-semibold' :
                        v.highlight === 'blue' ? 'text-blue-400 font-semibold' :
                        'text-gray-200'
                      }>
                        {v.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-[#1f1f1f] bg-[#121212] rounded-b-xl flex justify-between items-center text-[11px] text-gray-500 shrink-0">
                  <span>Estado: <span className="text-emerald-400">Validado</span></span>
                  <button 
                    onClick={() => runServiceTask('Identify Device', 'fastboot getvar all')}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors font-medium"
                  >
                    <RefreshCw className={`w-3 h-3 ${isProcessing ? 'animate-spin' : ''}`} />
                    Actualizar Vars
                  </button>
                </div>
              </div>

              {/* Main Action Console */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 h-[calc(100vh-140px)]">
                {/* Action Panel */}
                <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-6 shrink-0 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                    <Settings className="w-3.5 h-3.5 text-blue-400" />
                    Tareas de Servicio y Comandos de Diagnóstico
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                      onClick={() => runServiceTask('Identify Device', 'fastboot getvar all')}
                      className="p-4 bg-[#141414] border border-[#1f1f1f] rounded-lg hover:border-blue-500/50 cursor-pointer group transition-all"
                    >
                      <div className="text-blue-500 mb-2 group-hover:scale-110 transition-transform">
                        <Search className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-gray-200">Identificar Dispositivo</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Capturar conjunto de variables y CID</p>
                    </div>

                    <div 
                      onClick={() => runServiceTask('Hardware Audit', 'fastboot oem hardware-audit')}
                      className="p-4 bg-[#141414] border border-[#1f1f1f] rounded-lg hover:border-emerald-500/50 cursor-pointer group transition-all"
                    >
                      <div className="text-emerald-500 mb-2 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-gray-200">Auditoría de Hardware</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Verificar particiones y almacenamiento</p>
                    </div>

                    <div 
                      onClick={() => runServiceTask('Fast Reboot', 'fastboot reboot')}
                      className="p-4 bg-[#141414] border border-[#1f1f1f] rounded-lg hover:border-gray-500 cursor-pointer group transition-all"
                    >
                      <div className="text-gray-400 mb-2 group-hover:scale-110 transition-transform">
                        <RefreshCw className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-gray-200">Reinicio Rápido</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Regresar al modo OS normal</p>
                    </div>
                  </div>
                </div>

                {/* Terminal View */}
                <div className="flex-1 bg-black border border-[#1f1f1f] rounded-xl overflow-hidden flex flex-col shadow-sm min-h-0">
                  <div className="bg-[#0f0f0f] px-4 py-2.5 border-b border-[#1f1f1f] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-[11px] font-mono text-gray-400">core.engine.subprocess_exec (Escucha COM3)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setLogs([])}
                        className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors uppercase font-mono"
                      >
                        Limpiar Consola
                      </button>
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/60"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/60"></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-5 font-mono text-[12px] leading-relaxed text-gray-300 overflow-y-auto space-y-2">
                    {logs.length === 0 && (
                      <div className="text-gray-600 text-center py-12 italic font-sans">
                        Búfer de terminal vacío. Ejecute una tarea de servicio para transmitir registros de hardware.
                      </div>
                    )}
                    {logs.map((log) => (
                      <div key={log.id} className="flex gap-2 items-start font-mono">
                        <span className="text-gray-600 select-none">[{log.timestamp}]</span>
                        <span className={
                          log.type === 'INFO' ? 'text-emerald-400 font-semibold' :
                          log.type === 'CMD' ? 'text-blue-400 font-semibold' :
                          log.type === 'WARN' ? 'text-yellow-400 font-semibold' :
                          'text-emerald-400 font-bold'
                        }>
                          [{log.type}]
                        </span>
                        <span className="text-gray-300 flex-1">
                          {log.message}{' '}
                          {log.detail && <span className="text-blue-400 font-semibold">{log.detail}</span>}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center gap-1 pt-2">
                      <span className="text-blue-500">root@motonexus:~/workspace$</span>
                      <span className="w-2 h-4 bg-gray-400 animate-pulse inline-block"></span>
                    </div>
                  </div>

                  <div className="bg-[#0c0c0c] px-4 py-2 border-t border-[#1f1f1f] text-[11px] font-mono text-gray-500 flex justify-between items-center shrink-0">
                    <span>Objetivo Activo: <span className="text-gray-300">Motorola Edge 50 Fusion (XT2429-1)</span></span>
                    <span>Tamaño del Búfer: <span className="text-gray-300">{logs.length} registros</span></span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'modules' && (
            <div className="col-span-12 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl flex flex-col shadow-sm h-[calc(100vh-140px)]">
              <div className="p-5 border-b border-[#1f1f1f] flex justify-between items-center bg-[#121212] rounded-t-xl shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-200">Repositorio de Registros de Seguridad y Auditoría</h3>
                    <p className="text-xs text-gray-500 font-mono">Persistencia local en JSON (/data/audit_logs.json)</p>
                  </div>
                </div>
                <button 
                  onClick={handleExportJSON}
                  className="px-3.5 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-all flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar Volcado Completo de Auditoría
                </button>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-[#141414] border border-[#1f1f1f] p-4 rounded-lg">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Diagnósticos Totales</span>
                    <p className="text-2xl font-mono font-bold text-gray-200 mt-1">14 Sesiones</p>
                    <span className="text-[11px] text-emerald-400 font-mono">+3 hoy</span>
                  </div>
                  <div className="bg-[#141414] border border-[#1f1f1f] p-4 rounded-lg">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Estado del Bootloader</span>
                    <p className="text-2xl font-mono font-bold text-orange-400 mt-1">LOCKED</p>
                    <span className="text-[11px] text-gray-500 font-mono">Código 0x0000</span>
                  </div>
                  <div className="bg-[#141414] border border-[#1f1f1f] p-4 rounded-lg">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Nivel Parche Seguridad</span>
                    <p className="text-2xl font-mono font-bold text-blue-400 mt-1">2024-05-01</p>
                    <span className="text-[11px] text-gray-500 font-mono">SPL Validado</span>
                  </div>
                  <div className="bg-[#141414] border border-[#1f1f1f] p-4 rounded-lg">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Integridad Almacenamiento</span>
                    <p className="text-2xl font-mono font-bold text-emerald-400 mt-1">100% OK</p>
                    <span className="text-[11px] text-gray-500 font-mono">UFS 2.2 NAND</span>
                  </div>
                </div>

                <div className="border border-[#1f1f1f] rounded-lg overflow-hidden">
                  <div className="bg-[#141414] px-4 py-3 border-b border-[#1f1f1f] flex justify-between items-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <span>Registros de Diagnóstico Recientes</span>
                    <span className="text-[11px] font-mono text-gray-500">Filtrado por: Motorola Edge 50 Fusion</span>
                  </div>
                  <div className="divide-y divide-[#1f1f1f] text-xs font-mono">
                    <div className="p-4 flex items-center justify-between hover:bg-[#121212] transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-gray-400">2026-07-26 12:05:22</span>
                        <span className="text-gray-200 font-sans font-medium">Inspección Completa de Salud de Hardware</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">APROBADO</span>
                    </div>
                    <div className="p-4 flex items-center justify-between hover:bg-[#121212] transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span className="text-gray-400">2026-07-26 11:45:10</span>
                        <span className="text-gray-200 font-sans font-medium">Volcado de Variables Fastboot Getvar All</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">REGISTRADO</span>
                    </div>
                    <div className="p-4 flex items-center justify-between hover:bg-[#121212] transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        <span className="text-gray-400">2026-07-25 18:30:45</span>
                        <span className="text-gray-200 font-sans font-medium">Verificación de Fecha de Parche de Seguridad</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">VERIFICADO</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'firmware' && (
            <div className="col-span-12 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl flex flex-col shadow-sm h-[calc(100vh-140px)]">
              <div className="p-5 border-b border-[#1f1f1f] flex justify-between items-center bg-[#121212] rounded-t-xl shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-200">Especificaciones de Hardware y Arquitectura de Particiones</h3>
                    <p className="text-xs text-gray-500 font-mono">Motorola Edge 50 Fusion (Cusco / XT2429-1)</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                  Ranura A Activa
                </span>
              </div>

              <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-[#1f1f1f] pb-2">
                    Procesador y Procesamiento Principal
                  </h4>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between p-3 bg-[#141414] rounded border border-[#1f1f1f]">
                      <span className="text-gray-500">Sistema en Chip (SoC):</span>
                      <span className="text-gray-200 font-semibold">Qualcomm Snapdragon 7s Gen 2</span>
                    </div>
                    <div className="flex justify-between p-3 bg-[#141414] rounded border border-[#1f1f1f]">
                      <span className="text-gray-500">Configuración de RAM:</span>
                      <span className="text-blue-400 font-semibold">12GB LPDDR4X (4266 MHz)</span>
                    </div>
                    <div className="flex justify-between p-3 bg-[#141414] rounded border border-[#1f1f1f]">
                      <span className="text-gray-500">Almacenamiento Interno:</span>
                      <span className="text-gray-200">256GB UFS 2.2 Flash</span>
                    </div>
                    <div className="flex justify-between p-3 bg-[#141414] rounded border border-[#1f1f1f]">
                      <span className="text-gray-500">Módem de Banda Base:</span>
                      <span className="text-gray-300">M7325_G_23.123.01.69R</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-[#1f1f1f] pb-2">
                    Estructura de Partición y Firmware
                  </h4>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between p-3 bg-[#141414] rounded border border-[#1f1f1f]">
                      <span className="text-gray-500">Ranura de Arranque Activa:</span>
                      <span className="text-emerald-400 font-semibold">Ranura A (_a)</span>
                    </div>
                    <div className="flex justify-between p-3 bg-[#141414] rounded border border-[#1f1f1f]">
                      <span className="text-gray-500">Estado SELinux:</span>
                      <span className="text-gray-200">Enforcing (0x1)</span>
                    </div>
                    <div className="flex justify-between p-3 bg-[#141414] rounded border border-[#1f1f1f]">
                      <span className="text-gray-500">Versión del Kernel:</span>
                      <span className="text-gray-300">5.15.148-android14-9-g</span>
                    </div>
                    <div className="flex justify-between p-3 bg-[#141414] rounded border border-[#1f1f1f]">
                      <span className="text-gray-500">Compilación de Firmware:</span>
                      <span className="text-blue-400">U2UQ34.22-30-2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Status Bar */}
        <footer className="h-10 bg-[#0f0f0f] border-t border-[#1f1f1f] px-8 flex items-center justify-between text-[11px] text-gray-500 shrink-0">
          <div className="flex gap-6">
            <span>Ruta de Binario: <span className="text-gray-300 font-mono">/bin/adb.exe</span></span>
            <span>Motor: <span className="text-gray-300 font-mono">Antigravity-v2</span></span>
            <span>Modo: <span className="text-blue-400 font-medium">Inspección de Diagnóstico</span></span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span>Registro JSON Activo</span>
            </div>
            <span className="font-mono text-gray-400">v1.0.4-PRO</span>
          </div>
        </footer>
      </main>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-[#0f0f0f] border border-[#2f2f2f] rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-[#1f1f1f]">
              <div className="flex items-center gap-2 text-gray-200 font-semibold">
                <FileJson className="w-5 h-5 text-blue-400" />
                <span>Reporte de Auditoría Exportado (/data/audit_logs.json)</span>
              </div>
              <button 
                onClick={() => setShowExportModal(false)}
                className="text-gray-500 hover:text-gray-300 text-sm font-mono"
              >
                ✕
              </button>
            </div>
            
            <div className="py-4">
              <p className="text-xs text-gray-400 mb-3">
                Las variables de la sesión actual y los registros de diagnóstico se han estructurado en el siguiente formato JSON:
              </p>
              <pre className="bg-black p-4 rounded-lg border border-[#1f1f1f] text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-60">
                {JSON.stringify({
                  timestamp: new Date().toISOString(),
                  session: activeSession,
                  device: "Motorola Edge 50 Fusion",
                  sku: "XT2429-1",
                  bootloader: "LOCKED (0x0)",
                  security_patch: "2024-05-01",
                  logs_count: logs.length
                }, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#1f1f1f]">
              <button 
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-md transition-colors shadow-lg shadow-blue-600/20"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Local Antigravity Integration Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-[#0f0f0f] border border-[#2f2f2f] rounded-xl max-w-2xl w-full p-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center pb-4 border-b border-[#1f1f1f]">
              <div className="flex items-center gap-2.5 text-gray-100 font-bold text-base">
                <Code2 className="w-5 h-5 text-blue-400" />
                <span>Pasos para migrar a Antigravity & Backend Local</span>
              </div>
              <button 
                onClick={() => setShowGuideModal(false)}
                className="text-gray-500 hover:text-gray-300 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div className="py-4 overflow-y-auto space-y-5 text-xs text-gray-300 leading-relaxed pr-2">
              <div className="bg-[#141414] border border-[#222] p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-400">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[11px]">1</span>
                  <span>Descargar el Código Fuente</span>
                </div>
                <p className="text-gray-400 pl-7">
                  Usa el menú de opciones de <strong>AI Studio</strong> (esquina superior / menú de ajustes) y selecciona <span className="text-gray-200 font-semibold">Descargar ZIP</span> o <span className="text-gray-200 font-semibold">Exportar a GitHub</span>. Descomprímelo en tu carpeta de proyecto en Antigravity.
                </p>
              </div>

              <div className="bg-[#141414] border border-[#222] p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px]">2</span>
                  <span>Iniciar Frontend en Antigravity</span>
                </div>
                <p className="text-gray-400 pl-7">
                  Abre la terminal de tu entorno Antigravity y ejecuta:
                </p>
                <div className="pl-7 pt-1">
                  <pre className="bg-black p-3 rounded border border-[#262626] font-mono text-[11px] text-emerald-400">
npm install
npm run dev
                  </pre>
                </div>
              </div>

              <div className="bg-[#141414] border border-[#222] p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 font-bold text-purple-400">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[11px]">3</span>
                    <span>Backend Local Python (para ADB / Fastboot real)</span>
                  </div>
                  <button 
                    onClick={() => {
                      const pythonCode = `from fastapi import FastAPI
import subprocess

app = FastAPI()

@app.get("/api/adb/devices")
def get_devices():
    res = subprocess.run(["adb", "devices"], capture_output=True, text=True)
    return {"output": res.stdout}

@app.get("/api/fastboot/getvar")
def get_vars():
    res = subprocess.run(["fastboot", "getvar", "all"], capture_output=True, text=True)
    return {"raw_output": res.stderr}`;
                      navigator.clipboard.writeText(pythonCode);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="px-2.5 py-1 bg-[#1f1f1f] hover:bg-[#2f2f2f] text-gray-300 rounded text-[11px] font-mono flex items-center gap-1 transition-colors"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedCode ? 'Copiado' : 'Copiar Código Python'}
                  </button>
                </div>
                <p className="text-gray-400 pl-7">
                  Crea un archivo <code className="text-purple-300 bg-black px-1 py-0.5 rounded">server.py</code> en tu proyecto local para conectar el frontend con tus comandos reales de consola:
                </p>
                <div className="pl-7 pt-1">
                  <pre className="bg-black p-3 rounded border border-[#262626] font-mono text-[11px] text-purple-300 overflow-x-auto">
{`from fastapi import FastAPI
import subprocess

app = FastAPI()

@app.get("/api/adb/devices")
def get_devices():
    res = subprocess.run(["adb", "devices"], capture_output=True, text=True)
    return {"output": res.stdout}

@app.get("/api/fastboot/getvar")
def get_vars():
    res = subprocess.run(["fastboot", "getvar", "all"], capture_output=True, text=True)
    return {"raw_output": res.stderr}`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#1f1f1f] shrink-0">
              <span className="text-[11px] text-gray-500 font-mono">
                README.md generado con documentación detallada en el proyecto
              </span>
              <button 
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-md transition-colors shadow-lg shadow-blue-600/20"
              >
                Entendido, ¡Listo para Llevar!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

