import React, { useState, useRef, useEffect } from 'react';
import { Camera, Scan, UserCheck, ArrowLeft, RefreshCw, Hash, AlertCircle, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { registerClockIn, registerFace, fetchFaceEmbeddings, identifyFaceOnCloud } from '../../services/rhApi';
import { loadFaceModels, detectFaceFromVideo, findMatchingFace, descriptorToArray, areModelsLoaded } from '../../services/faceRecognition';

export default function RHFaceClock({ onClockIn, employees = [], attendanceLogs = [], onBack }) {
    const [mode, setMode] = useState('selection'); // selection, register, clock-in
    const [cameraActive, setCameraActive] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, loading-models, scanning, success, error, not-recognized
    const [matricula, setMatricula] = useState('');
    const [error, setError] = useState('');
    const [modelsReady, setModelsReady] = useState(false);
    const [recognizedEmployee, setRecognizedEmployee] = useState(null);
    const [bestDistance, setBestDistance] = useState(null);
    const [faceEmbeddings, setFaceEmbeddings] = useState([]);
    const videoRef = useRef(null);
    const scanIntervalRef = useRef(null);

    // Carregar modelos de IA ao montar o componente
    useEffect(() => {
        const initModels = async () => {
            setStatus('loading-models');
            try {
                await loadFaceModels();
                setModelsReady(true);
                setStatus('idle');
            } catch (err) {
                console.error('Erro ao carregar modelos:', err);
                setError('Erro ao carregar modelos de IA. Recarregue a página.');
                setStatus('error');
            }
        };
        initModels();

        return () => {
            if (scanIntervalRef.current) {
                clearInterval(scanIntervalRef.current);
            }
        };
    }, []);

    // Carregar embeddings cadastrados
    useEffect(() => {
        const loadEmbeddings = async () => {
            try {
                const embeddings = await fetchFaceEmbeddings();
                setFaceEmbeddings(embeddings);
            } catch (err) {
                console.error('Erro ao carregar embeddings:', err);
            }
        };
        loadEmbeddings();
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraActive(true);
            }
        } catch (err) {
            setError('Não foi possível acessar a câmera. Verifique as permissões.');
        }
    };

    const stopCamera = () => {
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
            scanIntervalRef.current = null;
        }
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
    };

    // Iniciar detecção contínua no modo clock-in
    useEffect(() => {
        if (mode === 'clock-in' && cameraActive && modelsReady && !scanning && status === 'idle') {
            startContinuousDetection();
        }
        return () => {
            if (scanIntervalRef.current) {
                clearInterval(scanIntervalRef.current);
            }
        };
    }, [mode, cameraActive, modelsReady, status]);

    const captureFrame = () => {
        if (!videoRef.current) return null;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1); // Espelhar de volta para salvar normal
        ctx.drawImage(videoRef.current, 0, 0);
        return canvas.toDataURL('image/jpeg', 0.5); // Qualidade reduzida para upload mais rápido
    };

    const startContinuousDetection = () => {
        if (!videoRef.current) return;

        setScanning(true);
        setStatus('scanning');

        // Identificação via Nuvem (Google Vision)
        const cloudIdentify = async () => {
            if (mode !== 'clock-in') return;

            try {
                const image = captureFrame();
                if (!image) return;

                const result = await identifyFaceOnCloud(image);

                if (result.success && result.employee) {
                    clearInterval(scanIntervalRef.current);
                    setBestDistance(null);
                    if (result.confidence) {
                        setStatus('success'); // Para mostrar o checkmark
                        // Pequeno delay para o usuário ver o check antes de processar tudo
                        setTimeout(() => handleSuccessfulRecognition(result.employee), 500);
                    } else {
                        await handleSuccessfulRecognition(result.employee);
                    }
                    return;
                } else if (result.bestDistance) {
                    // Se a IA detectou mas não reconheceu, mostramos a distância para o usuário
                    setBestDistance(parseFloat(result.bestDistance));
                } else {
                    setBestDistance(null);
                }
            } catch (err) {
                console.error('Erro na identificação em nuvem:', err);
            }
        };

        // Enviar para nuvem a cada 2 segundos (para não estourar a API)
        scanIntervalRef.current = setInterval(cloudIdentify, 2000);
        // Primeira tentativa imediata
        cloudIdentify();
    };

    const handleSuccessfulRecognition = async (matchedEmployee) => {
        setScanning(false);

        // Buscar dados completos do colaborador
        if (!employees || !matchedEmployee) {
            setStatus('error');
            setError('Falha na comunicação com o banco de dados.');
            return;
        }

        const emp = employees.find(e =>
            e && e.matricula && String(e.matricula).trim() === String(matchedEmployee.matricula).trim()
        );

        if (!emp) {
            setStatus('error');
            setError(`Colaborador (Matrícula ${matchedEmployee.matricula}) não encontrado.`);
            return;
        }

        setRecognizedEmployee(emp);

        const now = new Date();
        const today = now.toLocaleDateString('pt-BR');

        // Determinar Entrada ou Saída
        const todayLogs = attendanceLogs.filter(log => {
            const logMatricula = String(log.matricula).trim();
            const empMatricula = String(emp.matricula).trim();
            return logMatricula === empMatricula && log.data === today;
        });
        const nextType = todayLogs.length % 2 === 0 ? 'Entrada' : 'Saída';

        const log = {
            nome: emp.nome,
            matricula: emp.matricula,
            data: today,
            hora: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            setor: emp.setor,
            tipo: nextType
        };

        try {
            await registerClockIn({
                matricula: emp.matricula,
                nome: emp.nome || 'Sem Nome',
                setor: emp.setor || 'Geral',
                tipo: nextType
            });

            onClockIn(log);
            setStatus('success');

            setTimeout(() => {
                setMode('selection');
                setStatus('idle');
                setRecognizedEmployee(null);
                stopCamera();
            }, 3000);
        } catch (err) {
            console.error('Erro ao registrar ponto:', err);
            setStatus('error');
            setError('Erro ao registrar ponto.');
        }
    };

    const handleRegister = async () => {
        if (!cameraActive) {
            setError('Aguarde a câmera inicializar.');
            return;
        }

        const emp = employees.find(e => String(e.matricula).trim() === String(matricula).trim());
        if (!emp) {
            setError('Matrícula não encontrada no sistema de RH.');
            return;
        }

        setScanning(true);
        setStatus('scanning');
        setError('');

        try {
            const image = captureFrame();
            if (!image) {
                throw new Error('Falha ao capturar imagem da câmera.');
            }

            await registerFace({
                matricula: emp.matricula,
                nome: emp.nome,
                image: image
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
            console.error('Erro no cadastro facial:', err);
            setError('Erro ao cadastrar rosto na nuvem. Verifique sua conexão e tente novamente.');
            setStatus('error');
        } finally {
            setScanning(false);
        }
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
                className="relative z-10 w-full max-w-xl"
            >
                {/* Loading Models State */}
                {status === 'loading-models' && (
                    <div className="text-center py-20">
                        <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-cyan-400" />
                        <h2 className="text-2xl font-bold mb-2">Carregando IA...</h2>
                        <p className="text-gray-400">Modelos de reconhecimento facial</p>
                    </div>
                )}

                {/* Selection Mode */}
                {mode === 'selection' && status !== 'loading-models' && (
                    <div className="text-center">
                        <motion.div
                            className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Scan size={56} />
                        </motion.div>

                        <h1 className="text-4xl font-black mb-2 uppercase">Ponto Facial</h1>
                        <p className="text-gray-400 mb-10">Sistema de Reconhecimento Biométrico</p>

                        {modelsReady && (
                            <div className="flex items-center justify-center gap-2 mb-6 text-green-400 text-sm">
                                <CheckCircle2 size={16} />
                                <span>IA pronta para reconhecimento</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <button
                                onClick={() => { setMode('clock-in'); setError(''); startCamera(); }}
                                disabled={!modelsReady}
                                className="w-full py-5 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-black text-xl uppercase tracking-wider hover:scale-105 transition-transform shadow-xl shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Camera className="inline mr-3" size={24} />
                                Registrar Ponto
                            </button>

                            <button
                                onClick={() => { setMode('register'); setError(''); startCamera(); }}
                                disabled={!modelsReady}
                                className="w-full py-4 px-8 bg-white/10 border border-white/20 rounded-2xl font-bold text-lg uppercase tracking-wider hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <UserCheck className="inline mr-3" size={20} />
                                Cadastrar Rosto
                            </button>
                        </div>

                        <button
                            onClick={onBack}
                            className="mt-8 text-gray-400 hover:text-white transition-colors flex items-center gap-2 mx-auto"
                        >
                            <ArrowLeft size={18} />
                            Voltar ao Menu
                        </button>
                    </div>
                )}

                {/* Register Mode */}
                {mode === 'register' && (
                    <div className="text-center">
                        <h2 className="text-2xl font-black mb-6">CADASTRO FACIAL</h2>

                        <div className="relative rounded-[40px] overflow-hidden mb-8 bg-black aspect-square shadow-2xl border-4 border-white/10 max-w-[400px] mx-auto">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                                style={{ transform: 'scaleX(-1) scale(1.1)' }}
                            />

                            {scanning && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <motion.div
                                        className="w-48 h-48 border-4 border-cyan-400 rounded-3xl"
                                        animate={{ scale: [1, 1.1, 1], opacity: [1, 0.5, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                </div>
                            )}

                            {status === 'success' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-green-500/90">
                                    <CheckCircle2 size={80} className="text-white" />
                                </div>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
                                Matrícula do Colaborador
                            </label>
                            <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="text"
                                    value={matricula}
                                    onChange={(e) => { setMatricula(e.target.value); setError(''); }}
                                    placeholder="Digite a matrícula..."
                                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-500 font-mono text-xl text-center focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-2 text-red-300">
                                <AlertCircle size={18} />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={() => { setMode('selection'); stopCamera(); setError(''); setMatricula(''); }}
                                className="flex-1 py-4 bg-white/10 rounded-2xl font-bold hover:bg-white/20 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleRegister}
                                disabled={!matricula || scanning}
                                className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {scanning ? <Loader2 className="inline animate-spin" /> : 'Cadastrar'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Clock-in Mode */}
                {mode === 'clock-in' && (
                    <div className="text-center">
                        <h2 className="text-2xl font-black mb-6">REGISTRAR PONTO</h2>

                        <div className="relative rounded-[40px] overflow-hidden mb-8 bg-black aspect-square shadow-2xl border-4 border-white/10 max-w-[400px] mx-auto">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                                style={{ transform: 'scaleX(-1) scale(1.1)' }}
                            />

                            {scanning && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        className="w-48 h-48 border-4 border-cyan-400 rounded-3xl"
                                        animate={{ scale: [1, 1.1, 1], opacity: [1, 0.5, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                    <div className="absolute bottom-4 left-0 right-0 text-center flex flex-col items-center">
                                        <span className="bg-black/70 px-4 py-2 rounded-full text-sm">
                                            <Loader2 className="inline mr-2 animate-spin" size={14} />
                                            Identificando rosto...
                                        </span>
                                        {bestDistance && (
                                            <span className="text-[10px] text-white/50 mt-1 bg-black/40 px-2 py-0.5 rounded-full">
                                                Precisão: {((1 - (bestDistance / 0.15)) * 100).toFixed(0)}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {status === 'success' && recognizedEmployee && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-500/90">
                                    <CheckCircle2 size={60} className="text-white mb-4" />
                                    <p className="text-xl font-bold">{recognizedEmployee.nome}</p>
                                    <p className="text-lg opacity-80">Ponto registrado!</p>
                                </div>
                            )}

                            {status === 'not-recognized' && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/90">
                                    <XCircle size={60} className="text-white mb-4" />
                                    <p className="text-xl font-bold">Rosto não reconhecido</p>
                                    <p className="text-sm opacity-80">Certifique-se de estar cadastrado</p>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-2 text-red-300">
                                <AlertCircle size={18} />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                setMode('selection');
                                stopCamera();
                                setError('');
                                setStatus('idle');
                                setRecognizedEmployee(null);
                            }}
                            className="w-full py-4 bg-white/10 rounded-2xl font-bold hover:bg-white/20 transition-all"
                        >
                            <ArrowLeft className="inline mr-2" size={18} />
                            Voltar
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
