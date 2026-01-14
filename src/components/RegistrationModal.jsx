import React, { useState, useRef, useCallback } from 'react'
import { X, Camera, Upload, Check, RefreshCw } from 'lucide-react'
import Webcam from 'react-webcam'

const RegistrationModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1) // 1: Info, 2: Photo
    const [photo, setPhoto] = useState(null)
    const [useCamera, setUseCamera] = useState(false)
    const webcamRef = useRef(null)

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot()
        setPhoto(imageSrc)
        setUseCamera(false)
    }, [webcamRef])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
                    <div>
                        <h2 className="text-xl font-black text-agro-text">Adicionar Aprendiz</h2>
                        <p className="text-xs text-gray-400 font-medium tracking-wide">Preencha os dados do novo colaborador</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 max-h-[80vh] overflow-y-auto">
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-agro-text">Matrícula Aprendiz *</label>
                                <input type="text" className="input-field" placeholder="Ex: 95340" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-agro-text">Supervisor</label>
                                <select className="input-field appearance-none bg-white">
                                    <option value="">Qual supervisor?</option>
                                    <option value="1">João Silva</option>
                                    <option value="2">Maria Souza</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-agro-text">Nome Completo Aprendiz *</label>
                            <input type="text" className="input-field" placeholder="Digite o nome completo" required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-agro-text">Cargo</label>
                            <input type="text" className="input-field" placeholder="Selecione ou digite um cargo..." />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-agro-text">Data de Admissão</label>
                                <input type="date" className="input-field font-medium text-gray-400" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-agro-text">Data de Nascimento</label>
                                <input type="date" className="input-field font-medium text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-agro-text">Sexo</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button type="button" className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 font-bold text-sm hover:bg-agro-lightgreen hover:border-agro-green transition-all">
                                    <span>♂</span> Masculino
                                </button>
                                <button type="button" className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 font-bold text-sm hover:bg-pink-50 hover:border-pink-500 transition-all">
                                    <span>♀</span> Feminino
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-agro-text">Foto do Perfil</label>

                            <div className="flex flex-col items-center gap-6 p-8 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
                                {useCamera ? (
                                    <div className="relative w-full max-w-sm aspect-video rounded-2xl overflow-hidden shadow-xl ring-4 ring-agro-green/20">
                                        <Webcam
                                            audio={false}
                                            ref={webcamRef}
                                            screenshotFormat="image/jpeg"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            onClick={capture}
                                            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-agro-green text-white p-4 rounded-full shadow-lg hover:scale-110 active:scale-90 transition-all"
                                        >
                                            <Camera size={24} />
                                        </button>
                                    </div>
                                ) : photo ? (
                                    <div className="relative group">
                                        <img src={photo} alt="Preview" className="w-32 h-32 rounded-3xl object-cover ring-4 ring-white shadow-xl" />
                                        <button
                                            onClick={() => setPhoto(null)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <RefreshCw size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setUseCamera(true)}
                                            className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all group"
                                        >
                                            <div className="p-3 bg-agro-lightgreen text-agro-green rounded-xl group-hover:scale-110 transition-all">
                                                <Camera size={24} />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500">Tirar Foto</span>
                                        </button>
                                        <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer relative">
                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                                            <div className="p-3 bg-blue-50 text-blue-500 rounded-xl group-hover:scale-110 transition-all">
                                                <Upload size={24} />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500">Upload</span>
                                        </div>
                                    </div>
                                )}
                                <p className="text-[10px] text-gray-400 font-medium">PNG, JPG, GIF ou WebP (máx. 500KB)</p>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-6 bg-gray-50/50 flex gap-4 justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-2xl transition-all"
                    >
                        Cancelar
                    </button>
                    <button className="px-10 py-3 bg-agro-green text-white font-black rounded-2xl shadow-lg shadow-agro-green/20 hover:shadow-xl active:scale-95 transition-all">
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RegistrationModal
