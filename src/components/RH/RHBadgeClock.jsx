import React, { useState, useEffect, useRef } from 'react';
import { CreditCard, Scan, UserCheck, ArrowLeft, RefreshCw, Hash, AlertCircle, Loader2, CheckCircle2, XCircle, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { registerClockIn, identifyBadge, registerBadge } from '../../services/rhApi';

export default function RHBadgeClock({ onClockIn, employees = [], onBack }) {
    const [mode, setMode] = useState('selection'); // selection, register, clock-in, manual
    const [status, setStatus] = useState('idle'); // idle, scanning, success, error, processing
    const [matricula, setMatricula] = useState('');
    const [error, setError] = useState('');
    const [recognizedEmployee, setRecognizedEmployee] = useState(null);
    const [nfcSupported, setNfcSupported] = useState(true);
    const nfcAbortController = useRef(null);

    // Verificar suporte a NFC ao montar
    useEffect(() => {
        if (!('NDEFReader' in window)) {
            setNfcSupported(false);
            console.warn('Web NFC não é suportado neste navegador.');
        }
    }, []);

    const startNfcScan = async (actionType) => {
        if (!nfcSupported) return;

        try {
            setStatus('scanning');
            setError('');

            if (nfcAbortController.current) {
                nfcAbortController.current.abort();
            }
            nfcAbortController.current = new AbortController();

            const ndef = new window.NDEFReader();
            await ndef.scan({ signal: nfcAbortController.current.signal });

            ndef.onreading = async (event) => {
                const serialNumber = event.serialNumber;
                console.log('NFC Tag detectada:', serialNumber);

                if (actionType === 'identify') {
                    handleIdentifyBadge(serialNumber);
                } else if (actionType === 'register') {
                    handleRegisterBadge(serialNumber);
                }
            };

            ndef.onreadingerror = () => {
                setError('Erro ao ler a tag NFC. Tente novamente.');
                setStatus('error');
            };

        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Erro no NFC:', err);
                setError('Falha ao iniciar sensor NFC. Verifique se está ativo.');
                setStatus('error');
            }
        }
    };

    const stopNfcScan = () => {
        if (nfcAbortController.current) {
            nfcAbortController.current.abort();
            nfcAbortController.current = null;
        }
    };

    const handleIdentifyBadge = async (uid) => {
        setStatus('processing');
        try {
            const result = await identifyBadge(uid);
            if (result.success && result.employee) {
                handleSuccessfulRecognition(result.employee);
            } else {
                setError('Crachá não reconhecido. Peça ao RH para cadastrar seu crachá.');
                setStatus('error');
            }
        } catch (err) {
            setError('Erro na comunicação com o servidor.');
            setStatus('error');
        }
    };

    const handleRegisterBadge = async (uid) => {
        const emp = employees.find(e => String(e.matricula) === String(matricula));
        if (!emp) {
            setError('Matrícula não encontrada.');
            setStatus('error');
            return;
        }

        setStatus('processing');
        try {
            const result = await registerBadge(emp.matricula, emp.nome, uid);
            if (result.status === 'success') {
                setStatus('success');
                setTimeout(() => {
                    setMode('selection');
                    setStatus('idle');
                    setMatricula('');
                }, 2000);
            } else {
                setError('Falha ao vincular crachá.');
                setStatus('error');
            }
        } catch (err) {
            setError('Erro ao salvar crachá.');
            setStatus('error');
        }
    };

    const handleManualSubmit = async () => {
        if (!matricula) return;

        const emp = employees.find(e => String(e.matricula) === String(matricula));
        if (!emp) {
            setError('Matrícula não encontrada.');
            setStatus('error');
            return;
        }

        handleSuccessfulRecognition(emp);
    };

    const playBeep = () => {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.2);
        } catch (e) {
            console.warn('Falha ao tocar bipe:', e);
        }
    };

    const handleSuccessfulRecognition = async (emp) => {
        setStatus('success');
        setRecognizedEmployee(emp);
        playBeep();

        try {
            const result = await registerClockIn({
                matricula: emp.matricula,
                nome: emp.nome,
                setor: emp.setor || 'N/A'
            });

            // Adicionamos o tipo retornado pelo backend ao objeto do colaborador para mostrar na tela
            const updatedEmp = { ...emp, lastType: result.tipo };
            setRecognizedEmployee(updatedEmp);

            if (onClockIn) onClockIn(updatedEmp);

            // FLUXO CONTÍNUO: Aguarda 3 segundos e reseta para o próximo
            setTimeout(() => {
                if (mode === 'clock-in') {
                    // Mantém no modo de leitura NFC para o próximo
                    setStatus('scanning');
                    setRecognizedEmployee(null);
                    setMatricula('');
                    setError('');
                } else {
                    setMode('selection');
                    setStatus('idle');
                    setRecognizedEmployee(null);
                    setMatricula('');
                    setError('');
                }
            }, 3000);
        } catch (err) {
            setError('Erro ao registrar ponto na planilha.');
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-falcao-navy flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="grid grid-cols-6 gap-20 p-20">
                    {Array.from({ length: 24 }).map((_, i) => <Scan key={i} size={80} />)}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    {window.location.hash !== '#/ponto' && (
                        <button
                            onClick={() => {
                                stopNfcScan();
                                if (mode === 'selection') onBack();
                                else setMode('selection');
                                setError('');
                                setStatus('idle');
                            }}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                    )}
                    <div className="text-center flex-1">
                        <h1 className="text-2xl font-bold tracking-tight">REGISTRADOR PONTO</h1>
                        <p className="text-white/60 text-sm">Crachá NFC ou Matrícula</p>
                    </div>
                    {window.location.hash !== '#/ponto' && <div className="w-10" />}
                </div>

                <AnimatePresence mode="wait">
                    {mode === 'selection' && (
                        <motion.div
                            key="selection"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="grid grid-cols-1 gap-4"
                        >
                            <button
                                onClick={() => {
                                    setMode('clock-in');
                                    startNfcScan('identify');
                                }}
                                className="group bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col items-center gap-4 hover:bg-falcao-gold/20 hover:border-falcao-gold/50 transition-all duration-300"
                            >
                                <div className="p-4 bg-falcao-gold/20 rounded-2xl group-hover:scale-110 transition-transform">
                                    <CreditCard size={40} className="text-falcao-gold" />
                                </div>
                                <div className="text-center">
                                    <h2 className="text-xl font-bold">Aproximar Crachá</h2>
                                    <p className="text-white/50 text-sm mt-1">Encoste o crachá atrás do celular</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setMode('manual')}
                                className="group bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
                            >
                                <Keyboard size={20} className="text-white/60" />
                                <span className="font-medium">Digitar Matrícula Manual</span>
                            </button>

                            <button
                                onClick={() => setMode('register')}
                                className="mt-8 text-white/40 hover:text-white/80 text-sm flex items-center justify-center gap-2 transition-colors uppercase tracking-widest font-semibold"
                            >
                                <Hash size={14} />
                                Vincular Novo Crachá
                            </button>
                        </motion.div>
                    )}

                    {(mode === 'clock-in' || mode === 'register') && (
                        <motion.div
                            key="reading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white/5 border border-white/10 p-10 rounded-3xl text-center"
                        >
                            {status === 'scanning' ? (
                                <div className="flex flex-col items-center">
                                    <div className="relative mb-8">
                                        <div className="absolute inset-0 bg-falcao-gold/20 rounded-full blur-3xl animate-pulse" />
                                        <div className="relative w-48 h-48 border-4 border-dashed border-falcao-gold/30 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                                            <CreditCard size={64} className="text-falcao-gold" />
                                        </div>
                                        <div className="absolute top-0 right-0 w-12 h-12 bg-falcao-gold rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                            <Scan size={24} className="text-falcao-navy" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">AGUARDANDO LEITURA</h2>
                                    <p className="text-white/50">Coloque o crachá perto da câmera traseira</p>

                                    {mode === 'register' && (
                                        <div className="mt-6 p-3 bg-white/10 rounded-xl w-full">
                                            <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Vincular para Matrícula:</p>
                                            <input
                                                type="number"
                                                value={matricula}
                                                onChange={(e) => setMatricula(e.target.value)}
                                                placeholder="Digite a matrícula..."
                                                className="bg-transparent text-center text-xl font-bold w-full outline-none text-falcao-gold"
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : status === 'processing' ? (
                                <div className="py-12 flex flex-col items-center">
                                    <Loader2 size={64} className="text-falcao-gold animate-spin mb-4" />
                                    <p className="text-xl font-medium">Validando crachá...</p>
                                </div>
                            ) : status === 'success' ? (
                                <div className="py-12 flex flex-col items-center">
                                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border-2 border-green-500/50">
                                        <CheckCircle2 size={48} className="text-green-500" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-green-500 mb-2 uppercase">Registrado!</h2>
                                    <p className="text-2xl font-bold text-white mb-1">
                                        {recognizedEmployee ? recognizedEmployee.nome.split(' ')[0] : ''}
                                    </p>
                                    {recognizedEmployee?.lastType && (
                                        <div className={`mt-2 px-6 py-2 rounded-full font-black text-xl tracking-widest ${recognizedEmployee.lastType === 'Entrada' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                                            }`}>
                                            {recognizedEmployee.lastType.toUpperCase()}
                                        </div>
                                    )}
                                    <p className="text-white/40 mt-4 animate-pulse">Aguardando próximo...</p>
                                </div>
                            ) : status === 'error' ? (
                                <div className="py-12 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 border-2 border-red-500/50">
                                        <XCircle size={40} className="text-red-500" />
                                    </div>
                                    <h2 className="text-xl font-bold text-red-400 mb-4">{error}</h2>
                                    <button
                                        onClick={() => startNfcScan(mode === 'register' ? 'register' : 'identify')}
                                        className="bg-white/10 px-6 py-3 rounded-xl hover:bg-white/20 transition-all"
                                    >
                                        Tentar Novamente
                                    </button>
                                </div>
                            ) : null}
                        </motion.div>
                    )}

                    {mode === 'manual' && (
                        <motion.div
                            key="manual"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-3xl"
                        >
                            <h2 className="text-xl font-bold mb-6 text-center">Entrada Manual</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2 block">Número da Matrícula</label>
                                    <div className="relative">
                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                                        <input
                                            type="number"
                                            value={matricula}
                                            onChange={(e) => setMatricula(e.target.value)}
                                            placeholder="000000"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-2xl font-bold tracking-widest focus:border-falcao-gold/50 focus:bg-white/10 outline-none transition-all"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleManualSubmit}
                                    disabled={!matricula || status === 'processing'}
                                    className="w-full bg-falcao-gold text-falcao-navy font-bold py-4 rounded-2xl hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {status === 'processing' ? <Loader2 className="animate-spin" /> : <UserCheck size={20} />}
                                    REGISTRAR PONTO
                                </button>
                                {error && (
                                    <div className="flex items-center gap-2 text-red-400 text-sm justify-center p-2 bg-red-400/10 rounded-lg">
                                        <AlertCircle size={14} />
                                        <span>{error}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Info Footer */}
                <div className="mt-12 text-center text-white/30 text-xs">
                    {!nfcSupported && (
                        <p className="text-yellow-500/80 mb-2">⚠️ NFC não ativo ou suportado. Use a entrada manual.</p>
                    )}
                    <p>© 2026 Agrovale - Ponto Digital NFC v2.1</p>
                </div>
            </motion.div>
        </div>
    );
}
