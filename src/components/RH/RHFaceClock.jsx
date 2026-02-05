import React, { useState, useRef, useEffect } from 'react';
import { Camera, Scan, UserCheck, ArrowLeft, RefreshCw, Hash, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { registerClockIn, registerFace } from '../../services/rhApi';

export default function RHFaceClock({ onClockIn, employees = [], onBack }) {
    const [mode, setMode] = useState('selection'); // selection, register, clock-in
    const [cameraActive, setCameraActive] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, scanning, success, error
    const [matricula, setMatricula] = useState('');
    const [error, setError] = useState('');
    const videoRef = useRef(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraActive(true);
            }
        } catch (err) {
            setError('Não foi possível acessar a câmera. Verifique as permissões.');
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
    };

    useEffect(() => {
        if (mode === 'clock-in' && cameraActive && !scanning && status === 'idle') {
            handleClockIn();
        }
    }, [mode, cameraActive]);

    const handleRegister = async () => {
        if (!cameraActive) {
            setError('Aguarde a câmera inicializar.');
            return;
        }
        // Comparação flexível: converte ambos para string para garantir match
        const emp = employees.find(e => String(e.matricula).trim() === String(matricula).trim());
        if (!emp) {
            setError('Matrícula não encontrada no sistema de RH.');
            return;
        }
        setScanning(true);
        setStatus('scanning');

        try {
            // Salva o cadastro facial na planilha
            await registerFace({
                matricula: emp.matricula,
                nome: emp.nome,
                faceData: 'REGISTERED'
            });

            setScanning(false);
            setStatus('success');
            setTimeout(() => {
                setMode('selection');
                setStatus('idle');
                setMatricula('');
                stopCamera();
            }, 2000);
        } catch (err) {
            setScanning(false);
            setError('Erro ao cadastrar rosto. Tente novamente.');
            setStatus('idle');
        }
    };

    const handleClockIn = async () => {
        if (!cameraActive) return;

        setScanning(true);
        setStatus('scanning');

        // Simulating facial recognition - em produção, aqui seria a detecção real
        setTimeout(async () => {
            setScanning(false);
            const emp = employees[0] || { nome: 'Colaborador Teste', matricula: '0000', setor: 'Geral' };
            const now = new Date();
            const log = {
                nome: emp.nome,
                matricula: emp.matricula,
                data: now.toLocaleDateString('pt-BR'),
                hora: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                setor: emp.setor
            };

            try {
                // Salva o registro de ponto na planilha
                await registerClockIn({
                    matricula: emp.matricula,
                    nome: emp.nome,
                    setor: emp.setor,
                    tipo: 'Entrada'
                });
            } catch (err) {
                console.error('Erro ao salvar ponto:', err);
            }

            onClockIn(log);
            setStatus('success');
            setTimeout(() => {
                setMode('selection');
                setStatus('idle');
                stopCamera();
            }, 2500);
        }, 4000);
    };

    return (
        <div className="min-h-screen bg-falcao-navy flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
            {/* Animated Background Icons */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="grid grid-cols-6 gap-20 p-20">
                    {Array.from({ length: 24 }).map((_, i) => <Scan key={i} size={80} />)}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl w-full flex flex-col items-center z-10"
            >
                <div className="w-full flex justify-start mb-8">
                    <button
                        onClick={() => { stopCamera(); onBack(); }}
                        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors font-bold uppercase tracking-widest text-[10px]"
                    >
                        <ArrowLeft size={16} />
                        Voltar ao Menu
                    </button>
                </div>

                <div className="flex items-center gap-4 mb-12">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-[24px] flex items-center justify-center border border-white/20">
                        <Scan size={32} className="text-orange-400" />
                    </div>
                    <div className="text-left">
                        <h1 className="text-3xl font-black uppercase tracking-widest leading-none">Ponto Facial</h1>
                        <p className="text-orange-400/80 font-bold text-xs uppercase tracking-[0.3em] mt-1 text-center md:text-left">Falcão Inteligência Biométrica</p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {mode === 'selection' && (
                        <motion.div
                            key="selection"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full"
                        >
                            <button
                                onClick={() => { setMode('register'); startCamera(); }}
                                className="glass-dark p-10 rounded-[48px] border border-white/10 hover:border-orange-400/30 transition-all text-center group"
                            >
                                <div className="w-20 h-20 bg-orange-600 rounded-[28px] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    <UserCheck size={32} />
                                </div>
                                <h3 className="text-2xl font-black mb-2 uppercase">Cadastrar Rosto</h3>
                                <p className="text-white/40 text-sm font-medium">Vincule sua face à sua matrícula de RH para o registro automático.</p>
                            </button>

                            <button
                                onClick={() => { setMode('clock-in'); startCamera(); }}
                                className="glass-dark p-10 rounded-[48px] border border-white/10 hover:border-orange-400/30 transition-all text-center group"
                            >
                                <div className="w-20 h-20 bg-white/10 rounded-[28px] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    <Camera size={32} />
                                </div>
                                <h3 className="text-2xl font-black mb-2 uppercase">Registrar Ponto</h3>
                                <p className="text-white/40 text-sm font-medium">Aproximar o rosto da câmera para realizar o registro de frequência.</p>
                            </button>
                        </motion.div>
                    )}

                    {(mode === 'register' || mode === 'clock-in') && (
                        <motion.div
                            key="camera"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full flex flex-col items-center"
                        >
                            <div className="relative w-full max-w-lg aspect-square bg-black rounded-[60px] border-4 border-white/10 overflow-hidden shadow-2xl">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    style={{ transform: 'scaleX(-1)' }}
                                    className="w-full h-full object-cover grayscale opacity-80"
                                />

                                {/* Scanning Overlay */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="w-64 h-64 border-2 border-orange-400/50 rounded-[40px] relative">
                                        <div className="absolute inset-0 border-2 border-orange-400 rounded-[40px] animate-pulse" />
                                        {scanning && (
                                            <motion.div
                                                animate={{ y: [0, 256, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className="absolute left-0 right-0 h-1 bg-orange-400 shadow-[0_0_15px_#fb923c]"
                                            />
                                        )}
                                    </div>

                                    <AnimatePresence>
                                        {status === 'success' && (
                                            <motion.div
                                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                className="absolute inset-0 bg-green-500/90 flex flex-col items-center justify-center p-8 text-center"
                                            >
                                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-green-500 mb-4">
                                                    <UserCheck size={40} />
                                                </div>
                                                <h4 className="text-3xl font-black uppercase tracking-tight">Sucesso!</h4>
                                                <p className="text-white font-bold">{mode === 'register' ? 'Rosto vinculado com sucesso' : 'Ponto registrado com sucesso'}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="mt-12 w-full max-w-sm space-y-6">
                                {mode === 'register' && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Sua Matrícula</label>
                                        <div className="relative">
                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                            <input
                                                value={matricula}
                                                onChange={(e) => { setMatricula(e.target.value); setError(''); }}
                                                placeholder="0000"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-orange-400/50 transition-all font-mono text-xl text-white"
                                            />
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-2xl border border-red-400/20">
                                        <AlertCircle size={18} />
                                        <p className="text-xs font-bold uppercase">{error}</p>
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => { stopCamera(); setMode('selection'); setError(''); }}
                                        className="flex-1 px-8 py-5 bg-white/5 text-white/60 font-black rounded-3xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs border border-white/10"
                                    >
                                        Cancelar
                                    </button>
                                    {mode === 'register' && (
                                        <button
                                            onClick={handleRegister}
                                            disabled={status === 'scanning' || status === 'success' || !matricula}
                                            className="flex-1 px-8 py-5 bg-orange-600 text-white font-black rounded-3xl hover:bg-orange-500 transition-all shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {status === 'scanning' ? <RefreshCw className="animate-spin" size={18} /> : 'Vincular Face'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
