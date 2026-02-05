/**
 * Serviço de Reconhecimento Facial usando face-api.js
 * Carrega modelos e fornece funções para detecção e comparação de rostos
 */

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';

let modelsLoaded = false;
let loadingPromise = null;

/**
 * Carrega os modelos de detecção facial
 * @returns {Promise<boolean>}
 */
export const loadFaceModels = async () => {
    if (modelsLoaded) return true;

    if (loadingPromise) return loadingPromise;

    loadingPromise = (async () => {
        try {
            // Aguarda o face-api.js estar disponível globalmente
            let attempts = 0;
            while (!window.faceapi && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            if (!window.faceapi) {
                throw new Error('face-api.js não carregou');
            }

            console.log('Carregando modelos de reconhecimento facial...');

            await Promise.all([
                window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                window.faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
            ]);

            modelsLoaded = true;
            console.log('Modelos Tiny carregados com sucesso!');
            return true;
        } catch (error) {
            console.error('Erro ao carregar modelos:', error);
            modelsLoaded = false;
            loadingPromise = null;
            throw error;
        }
    })();

    return loadingPromise;
};

/**
 * Verifica se os modelos estão carregados
 * @returns {boolean}
 */
export const areModelsLoaded = () => modelsLoaded;

/**
 * Detecta um rosto em um elemento de vídeo e retorna o descriptor (embedding)
 * @param {HTMLVideoElement} videoElement 
 * @returns {Promise<Float32Array|null>} Embedding de 128 dimensões ou null se não detectar rosto
 */
export const detectFaceFromVideo = async (videoElement) => {
    if (!modelsLoaded) {
        throw new Error('Modelos não carregados. Chame loadFaceModels() primeiro.');
    }

    try {
        // Opções ultra-otimizadas para TinyFaceDetector (128 é ideal para mobile)
        const options = new window.faceapi.TinyFaceDetectorOptions({
            inputSize: 128,
            scoreThreshold: 0.5 // Confiança mínima
        });

        const detection = await window.faceapi
            .detectSingleFace(videoElement, options)
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection) {
            return null;
        }

        return detection.descriptor;
    } catch (error) {
        console.error('Erro na detecção facial:', error);
        return null;
    }
};

/**
 * Compara um embedding com uma lista de embeddings cadastrados
 * @param {Float32Array} queryDescriptor - Embedding do rosto a ser identificado
 * @param {Array<{matricula: string, nome: string, embedding: number[]}>} registeredFaces - Lista de rostos cadastrados
 * @param {number} threshold - Limiar de similaridade (menor = mais restritivo). Padrão: 0.6
 * @returns {{matched: boolean, employee: object|null, distance: number}}
 */
export const findMatchingFace = (queryDescriptor, registeredFaces, threshold = 0.6) => {
    if (!registeredFaces || registeredFaces.length === 0) {
        return { matched: false, employee: null, distance: Infinity };
    }

    let bestMatch = null;
    let bestDistance = Infinity;

    for (const face of registeredFaces) {
        if (!face.embedding || face.embedding.length !== 128) continue;

        // Converter array para Float32Array se necessário
        const storedDescriptor = new Float32Array(face.embedding);

        // Calcular distância euclidiana
        const distance = window.faceapi.euclideanDistance(queryDescriptor, storedDescriptor);

        if (distance < bestDistance) {
            bestDistance = distance;
            bestMatch = face;
        }
    }

    const matched = bestDistance < threshold;

    return {
        matched,
        employee: matched ? bestMatch : null,
        distance: bestDistance
    };
};

/**
 * Converte um Float32Array para array normal (para armazenamento em JSON)
 * @param {Float32Array} descriptor 
 * @returns {number[]}
 */
export const descriptorToArray = (descriptor) => {
    return Array.from(descriptor);
};

/**
 * Verifica continuamente se há um rosto visível no vídeo
 * @param {HTMLVideoElement} videoElement 
 * @returns {Promise<boolean>}
 */
export const isFaceVisible = async (videoElement) => {
    if (!modelsLoaded) return false;

    try {
        const detection = await window.faceapi.detectSingleFace(videoElement);
        return !!detection;
    } catch {
        return false;
    }
};
