/**
 * Sistema de Avaliação de Jovens Aprendizes + Gestão de RH - Backend Completo
 * 1. Crie uma Planilha Google
 * 2. Extensões > Apps Script
 * 3. Cole este código
 * 4. Execute a função setup() para criar as abas necessárias
 * 5. Implemente o "Deploy" como Web App (Acesso: Anyone)
 */

// ⚠️ ID DA PLANILHA CORPORATIVA CONFIGURADO:
const SPREADSHEET_ID = '1uLYO-cq9-awdGTjyJU6KsogiY3g_HjuMz1MhTE-TmR8';
const SHEET_NAME = 'Aprendizes';
const CONFIG_SHEET_NAME = 'Configs';
const RH_SHEET_NAME = 'Colaboradores';
const RH_CONFIG_SHEET_NAME = 'RH_Configs';
const PONTO_SHEET_NAME = 'RegistrosPonto';
const FACE_SHEET_NAME = 'CadastroFacial';
const BADGE_SHEET_NAME = 'CadastroBadges';

// CHAVE DA GOOGLE CLOUD VISION API
const GOOGLE_VISION_API_KEY = 'AIzaSyB8-VzL3OfdaG0t7wPr3sGOq5TnQ-ztKPE'.trim(); 

function doGet(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const action = e.parameter.action;
  
  // Configurações do Jovem Aprendiz
  if (action === 'getConfigs') {
    const sheet = ss.getSheetByName(CONFIG_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    data.shift();
    
    const sectors = data.filter(r => r[0] === 'Sector').map(r => r[1]);
    const supervisors = data.filter(r => r[0] === 'Supervisor').map(r => r[1]);
    
    return ContentService.createTextOutput(JSON.stringify({ sectors, supervisors }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Configurações do RH
  if (action === 'getRHConfigs') {
    const sheet = ss.getSheetByName(RH_CONFIG_SHEET_NAME);
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ 
        sectors: [], companies: [], additionTypes: [] 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    const data = sheet.getDataRange().getValues();
    data.shift();
    
    const sectors = data.filter(r => r[0] === 'Sector').map(r => r[1]);
    const companies = data.filter(r => r[0] === 'Company').map(r => r[1]);
    const additionTypes = data.filter(r => r[0] === 'AdditionType').map(r => r[1]);
    
    return ContentService.createTextOutput(JSON.stringify({ sectors, companies, additionTypes }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Lista de Colaboradores (RH)
  if (action === 'getEmployees') {
    const sheet = ss.getSheetByName(RH_SHEET_NAME);
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const data = sheet.getDataRange().getValues();
    const headers = data.shift();
    
    const json = data.map((row, index) => {
      const obj = { id: index + 2 }; // ID baseado na linha
      headers.forEach((header, i) => {
        obj[header.toLowerCase()] = row[i];
      });
      return obj;
    });
    
    return ContentService.createTextOutput(JSON.stringify(json))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Registros de Ponto
  if (action === 'getAttendanceLogs') {
    const sheet = ss.getSheetByName(PONTO_SHEET_NAME);
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const data = sheet.getDataRange().getValues();
    const headers = data.shift();
    
    const json = data.map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header.toLowerCase()] = row[i];
      });
      return obj;
    });
    
    return ContentService.createTextOutput(JSON.stringify(json))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Cadastros Faciais
  if (action === 'getFaceRegistrations') {
    const sheet = ss.getSheetByName(FACE_SHEET_NAME);
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const data = sheet.getDataRange().getValues();
    data.shift(); // remove headers
    
    const json = data.map(row => ({
      matricula: row[1],
      nome: row[2]
    }));
    
    return ContentService.createTextOutput(JSON.stringify(json))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Embeddings Faciais completos (para comparação)
  if (action === 'getFaceEmbeddings') {
    const sheet = ss.getSheetByName(FACE_SHEET_NAME);
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const data = sheet.getDataRange().getValues();
    data.shift(); // remove headers
    
    const json = data.map(row => ({
      matricula: row[1],
      nome: row[2],
      embedding: row[3] // FaceData column contains the embedding JSON
    }));
    
    return ContentService.createTextOutput(JSON.stringify(json))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Lista de Aprendizes (padrão)
  const sheet = ss.getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  const json = data.map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify(json))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const action = params.action;
  
  // ==================== CONFIGURAÇÕES ====================
  
  if (action === 'saveConfigs') {
    const sheet = ss.getSheetByName(CONFIG_SHEET_NAME);
    sheet.clear();
    sheet.appendRow(['Type', 'Value']);
    params.sectors.forEach(s => sheet.appendRow(['Sector', s]));
    params.supervisors.forEach(s => sheet.appendRow(['Supervisor', s]));
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'saveRHConfigs') {
    let sheet = ss.getSheetByName(RH_CONFIG_SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(RH_CONFIG_SHEET_NAME);
    }
    sheet.clear();
    sheet.appendRow(['Type', 'Value']);
    (params.sectors || []).forEach(s => sheet.appendRow(['Sector', s]));
    (params.companies || []).forEach(s => sheet.appendRow(['Company', s]));
    (params.additionTypes || []).forEach(s => sheet.appendRow(['AdditionType', s]));
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ==================== JOVEM APRENDIZ ====================
  
  const apprenticeSheet = ss.getSheetByName(SHEET_NAME);
  
  if (action === 'addApprentice') {
    const d = params.data;
    apprenticeSheet.appendRow([
      new Date(), d.matricula, d.nome, d.cargo, d.supervisor,
      d.admissao, d.nascimento, d.sexo, d.foto,
      'not_evaluated', 1, 0, d.termino
    ]);
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === 'saveEvaluation') {
    const d = params.data;
    const rows = apprenticeSheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][1].toString() === d.apprenticeId.toString()) {
        const rowNumber = i + 1;
        apprenticeSheet.getRange(rowNumber, 10).setValue('not_evaluated');
        apprenticeSheet.getRange(rowNumber, 11).setValue(d.cycleFinished);
        apprenticeSheet.getRange(rowNumber, 12).setValue(d.score);
        break;
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'updateApprentice') {
    const d = params.data;
    const rows = apprenticeSheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][1].toString() === d.matricula.toString()) {
        const rowNumber = i + 1;
        apprenticeSheet.getRange(rowNumber, 3).setValue(d.nome);
        apprenticeSheet.getRange(rowNumber, 4).setValue(d.cargo);
        apprenticeSheet.getRange(rowNumber, 5).setValue(d.supervisor);
        apprenticeSheet.getRange(rowNumber, 6).setValue(d.admissao);
        apprenticeSheet.getRange(rowNumber, 7).setValue(d.nascimento);
        apprenticeSheet.getRange(rowNumber, 8).setValue(d.sexo);
        apprenticeSheet.getRange(rowNumber, 9).setValue(d.foto);
        if (d.termino) {
          apprenticeSheet.getRange(rowNumber, 13).setValue(d.termino);
        }
        break;
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'deleteApprentice') {
    const matricula = params.matricula;
    const rows = apprenticeSheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][1].toString() === matricula.toString()) {
        apprenticeSheet.deleteRow(i + 1);
        break;
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ==================== COLABORADORES (RH) ====================
  
  if (action === 'addEmployee') {
    let sheet = ss.getSheetByName(RH_SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(RH_SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Matricula', 'Nome', 'Setor', 'Empresa', 'Salario', 'Adicionais', 'Admissao', 'Demissao']);
    }
    const d = params.data;
    sheet.appendRow([
      new Date(), d.matricula, d.nome, d.setor, d.empresa,
      d.salario, d.adicionais, d.admissao, d.demissao || ''
    ]);
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'updateEmployee') {
    const sheet = ss.getSheetByName(RH_SHEET_NAME);
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Sheet not found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const d = params.data;
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][1].toString() === d.matricula.toString()) {
        const rowNumber = i + 1;
        sheet.getRange(rowNumber, 3).setValue(d.nome);
        sheet.getRange(rowNumber, 4).setValue(d.setor);
        sheet.getRange(rowNumber, 5).setValue(d.empresa);
        sheet.getRange(rowNumber, 6).setValue(d.salario);
        sheet.getRange(rowNumber, 7).setValue(d.adicionais);
        sheet.getRange(rowNumber, 8).setValue(d.admissao);
        sheet.getRange(rowNumber, 9).setValue(d.demissao || '');
        break;
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'deleteEmployee') {
    const sheet = ss.getSheetByName(RH_SHEET_NAME);
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const matricula = params.matricula;
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][1].toString() === matricula.toString()) {
        sheet.deleteRow(i + 1);
        break;
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ==================== PONTO FACIAL ====================
  
  if (action === 'registerClockIn') {
    let sheet = ss.getSheetByName(PONTO_SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(PONTO_SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Matricula', 'Nome', 'Setor', 'Data', 'Hora', 'Tipo']);
    }
    const d = params.data;
    const now = new Date();
    sheet.appendRow([
      now, d.matricula, d.nome, d.setor,
      Utilities.formatDate(now, 'America/Sao_Paulo', 'dd/MM/yyyy'),
      Utilities.formatDate(now, 'America/Sao_Paulo', 'HH:mm'),
      d.tipo || 'Entrada'
    ]);
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'registerFace') {
    let sheet = ss.getSheetByName(FACE_SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(FACE_SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Matricula', 'Nome', 'FaceData']);
    }
    const d = params.data;

    // Se d.image estiver presente, usar Google Vision para extrair landmarks PRIMEIRO
    if (d.image) {
      try {
        const visionData = callGoogleVision(d.image);
        if (visionData.faceAnnotations && visionData.faceAnnotations.length > 0) {
          d.faceData = JSON.stringify({
            landmarks: visionData.faceAnnotations[0].landmarks,
            type: 'google-vision'
          });
        } else {
          // BLOQUEIO: Se enviou imagem mas a IA não viu rosto, não cadastra
          return ContentService.createTextOutput(JSON.stringify({ 
            status: 'error', 
            message: 'A IA não detectou um rosto claro. Verifique a iluminação e olhe para a câmera.' 
          })).setMimeType(ContentService.MimeType.JSON);
        }
      } catch (e) {
        Logger.log("Erro ao extrair landmarks no registro: " + e.message);
        return ContentService.createTextOutput(JSON.stringify({ 
          status: 'error', 
          message: 'Erro na IA do Google: ' + e.message 
        })).setMimeType(ContentService.MimeType.JSON);
      }
    } else if (!d.faceData) {
        // Se não tem imagem nem faceData prévia, é um erro de payload
        return ContentService.createTextOutput(JSON.stringify({ 
            status: 'error', 
            message: 'Dados faciais ausentes.' 
        })).setMimeType(ContentService.MimeType.JSON);
    }

    // Verifica se já existe cadastro para essa matrícula para atualizar ou inserir
    const rows = sheet.getDataRange().getValues();
    let found = false;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][1].toString() === d.matricula.toString()) {
        const rowNumber = i + 1;
        sheet.getRange(rowNumber, 1).setValue(new Date());
        sheet.getRange(rowNumber, 3).setValue(d.nome);
        sheet.getRange(rowNumber, 4).setValue(d.faceData || 'REGISTERED');
        found = true;
        break;
      }
    }

    if (!found) {
      sheet.appendRow([new Date(), d.matricula, d.nome, d.faceData || 'REGISTERED']);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: found ? 'updated' : 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Identificação Facial via Nuvem
  if (action === 'identifyFace') {
    const result = identifyFaceAction(params.data.image);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ==================== BADGE NFC ====================

  if (action === 'registerBadge') {
    let sheet = ss.getSheetByName(BADGE_SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(BADGE_SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Matricula', 'Nome', 'BadgeUID']);
    }
    const d = params.data;
    const rows = sheet.getDataRange().getValues();
    let found = false;
    for (let i = 1; i < rows.length; i++) {
        if (rows[i][1].toString() === d.matricula.toString()) {
            sheet.getRange(i + 1, 4).setValue(d.badgeUID);
            sheet.getRange(i + 1, 1).setValue(new Date());
            found = true;
            break;
        }
    }
    if (!found) {
        sheet.appendRow([new Date(), d.matricula, d.nome, d.badgeUID]);
    }
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'identifyBadge') {
    const sheet = ss.getSheetByName(BADGE_SHEET_NAME);
    if (!sheet) return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Tabela de badges não encontrada' })).setMimeType(ContentService.MimeType.JSON);
    
    const badgeUID = params.data.badgeUID;
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
        if (rows[i][3].toString() === badgeUID.toString()) {
            return ContentService.createTextOutput(JSON.stringify({ 
                success: true, 
                employee: { matricula: rows[i][1], nome: rows[i][2] } 
            })).setMimeType(ContentService.MimeType.JSON);
        }
    }
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Crachá não reconhecido' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Aprendizes Sheet
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Timestamp', 'Matrícula', 'Nome', 'Cargo', 'Supervisor', 
      'Admissão', 'Nascimento', 'Sexo', 'Foto', 'Status', 'Ciclo', 'Nota', 'Término'
    ]);
  }

  // Configs Sheet
  let configSheet = ss.getSheetByName(CONFIG_SHEET_NAME);
  if (!configSheet) {
    configSheet = ss.insertSheet(CONFIG_SHEET_NAME);
    configSheet.appendRow(['Type', 'Value']);
    configSheet.appendRow(['Sector', 'Administrativo']);
    configSheet.appendRow(['Supervisor', 'Coordenador Geral']);
  }

  // Colaboradores Sheet (RH)
  let rhSheet = ss.getSheetByName(RH_SHEET_NAME);
  if (!rhSheet) {
    rhSheet = ss.insertSheet(RH_SHEET_NAME);
    rhSheet.appendRow(['Timestamp', 'Matricula', 'Nome', 'Setor', 'Empresa', 'Salario', 'Adicionais', 'Admissao', 'Demissao']);
  }

  // RH Configs Sheet
  let rhConfigSheet = ss.getSheetByName(RH_CONFIG_SHEET_NAME);
  if (!rhConfigSheet) {
    rhConfigSheet = ss.insertSheet(RH_CONFIG_SHEET_NAME);
    rhConfigSheet.appendRow(['Type', 'Value']);
    rhConfigSheet.appendRow(['Sector', 'Administrativo']);
    rhConfigSheet.appendRow(['Sector', 'RH']);
    rhConfigSheet.appendRow(['Sector', 'Operacional']);
    rhConfigSheet.appendRow(['Company', 'Falcão Engenharia']);
    rhConfigSheet.appendRow(['Company', 'Falcão Logística']);
    rhConfigSheet.appendRow(['AdditionType', 'Periculosidade']);
    rhConfigSheet.appendRow(['AdditionType', 'Insalubridade']);
    rhConfigSheet.appendRow(['AdditionType', 'Gratificação']);
  }

  // Registros de Ponto Sheet
  let pontoSheet = ss.getSheetByName(PONTO_SHEET_NAME);
  if (!pontoSheet) {
    pontoSheet = ss.insertSheet(PONTO_SHEET_NAME);
    pontoSheet.appendRow(['Timestamp', 'Matricula', 'Nome', 'Setor', 'Data', 'Hora', 'Tipo']);
  }

  // Cadastro Facial Sheet
  let faceSheet = ss.getSheetByName(FACE_SHEET_NAME);
  if (!faceSheet) {
    faceSheet = ss.insertSheet(FACE_SHEET_NAME);
    faceSheet.appendRow(['Timestamp', 'Matricula', 'Nome', 'FaceData']);
  }

  // Cadastro de Badges NFC
  let badgeSheet = ss.getSheetByName(BADGE_SHEET_NAME);
  if (!badgeSheet) {
    badgeSheet = ss.insertSheet(BADGE_SHEET_NAME);
    badgeSheet.appendRow(['Timestamp', 'Matricula', 'Nome', 'BadgeUID']);
  }

  Logger.log('Setup completo! Todas as abas foram criadas.');
}

/**
 * Action para identificar face via Google Vision
 */
function identifyFaceAction(imageBase64) {
  try {
    const visionData = callGoogleVision(imageBase64);
    
    if (!visionData.faceAnnotations || visionData.faceAnnotations.length === 0) {
      Logger.log("Identificação: Nenhum rosto detectado na imagem enviada (Verifique a iluminação).");
      return { success: false, faceDetected: false, error: 'A IA do Google não detectou nenhum rosto na imagem. Aproxime-se da luz.' };
    }

    const face = visionData.faceAnnotations[0];
    const landmarks = face.landmarks;
    
    // Buscar todos os cadastros
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(FACE_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    data.shift(); // remove headers
    
    let bestMatch = null;
    let minDistance = Infinity;
    
    Logger.log(`Iniciando comparação de rosto enviada contra ${data.length} cadastros.`);

    for (const row of data) {
      const matricula = row[1];
      const nome = row[2];
      const storedFaceData = row[3];
      
      try {
        const stored = JSON.parse(storedFaceData);
        if (stored.landmarks) {
          const distance = calculateFaceDistance(landmarks, stored.landmarks);
          Logger.log(`Distância para ${nome} (${matricula}): ${distance.toFixed(4)}`);
          
          if (distance < minDistance) {
            minDistance = distance;
            bestMatch = { matricula, nome };
          }
        }
      } catch (e) {
        // Ignora erros de parse
      }
    }

    // Threshold ajustado para 0.15 (mais tolerante para envios móveis)
    const threshold = 0.15; 
    
    if (bestMatch && minDistance < threshold) {
      const confidence = Math.max(0, (1 - (minDistance / threshold)) * 100).toFixed(0);
      Logger.log(`✅ SUCESSO: Identificado ${bestMatch.nome} com ${confidence}% de confiança.`);
      return { 
        success: true, 
        employee: bestMatch, 
        distance: minDistance,
        confidence: confidence + "%"
      };
    } else {
      const bestName = bestMatch ? bestMatch.nome : 'Nenhum';
      const dSafe = (minDistance === Infinity) ? "9.999" : minDistance.toFixed(4);
      Logger.log(`❌ FALHA: Nenhum rosto compatível. Melhor match: ${bestName} (${dSafe} > ${threshold})`);
      return { 
        success: false, 
        faceDetected: true,
        error: 'Rosto não reconhecido. Certifique-se de estar cadastrado e com boa iluminação.',
        bestDistance: dSafe
      };
    }
  } catch (err) {
    Logger.log("Erro crítico na identificação: " + err.message);
    return { success: false, error: "Erro no servidor da IA: " + err.message };
  }
}

/**
 * Função para você testar manualmente se sua API KEY está funcionando
 * Rode esta função no Editor do Apps Script e veja o Log
 */
function testVisionAPI() {
  const testImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="; // 1x1 pixel base64
  try {
    const result = callGoogleVision(testImage);
    Logger.log("✅ Conexão com Google Vision OK!");
    Logger.log("Resposta: " + JSON.stringify(result));
    return "OK";
  } catch (e) {
    Logger.log("❌ Falha na API: " + e.message);
    return "Erro: " + e.message;
  }
}

/**
 * Calcula a distância entre dois conjuntos de landmarks faciais
 */
function calculateFaceDistance(l1, l2) {
  const getPoint = (list, type) => {
    const p = list.find(p => p.type === type);
    return p ? p.position : null;
  };

  const normalizePoints = (landmarks) => {
    const leftEye = getPoint(landmarks, 'LEFT_EYE');
    const rightEye = getPoint(landmarks, 'RIGHT_EYE');
    
    if (!leftEye || !rightEye) return null;

    // Distância inter-ocular (IOD)
    const iod = Math.sqrt(Math.pow(rightEye.x - leftEye.x, 2) + Math.pow(rightEye.y - leftEye.y, 2));
    // Ponto médio entre os olhos
    const midX = (leftEye.x + rightEye.x) / 2;
    const midY = (leftEye.y + rightEye.y) / 2;

    // Pontos críticos para comparação
    const criticalPoints = ['LEFT_EYE', 'RIGHT_EYE', 'NOSE_TIP', 'MOUTH_LEFT', 'MOUTH_RIGHT', 'MOUTH_CENTER'];
    
    const normalized = {};
    criticalPoints.forEach(pType => {
      const p = getPoint(landmarks, pType);
      if (p) {
        normalized[pType] = {
          x: (p.x - midX) / iod,
          y: (p.y - midY) / iod
        };
      }
    });
    return normalized;
  };

  const n1 = normalizePoints(l1);
  const n2 = normalizePoints(l2);

  if (!n1 || !n2) {
    if (!n1) Logger.log("Aviso: Falha ao normalizar rosto enviado (pontos dos olhos ausentes).");
    return Infinity;
  }

  let totalDist = 0;
  let count = 0;

  for (const key in n1) {
    if (n2[key]) {
      totalDist += Math.sqrt(Math.pow(n1[key].x - n2[key].x, 2) + Math.pow(n1[key].y - n2[key].y, 2));
      count++;
    }
  }

  return count > 0 ? totalDist / count : Infinity;
}

/**
 * Chama a Google Cloud Vision API
 */
function callGoogleVision(imageBase64) {
  if (!imageBase64) throw new Error("Imagem não fornecida.");

  const url = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`;
  
  // Limpeza precisa do Base64
  let content = imageBase64;
  if (content.indexOf(',') > -1) {
    content = content.split(',')[1];
  }
  content = content.replace(/\s/g, ''); // Remove qualquer espaço ou quebra de linha

  if (!content || content.length < 100) {
    Logger.log("Erro: Imagem recebida com tamanho insuficiente (" + (content ? content.length : 0) + ")");
    throw new Error("Falha ao processar imagem da câmera. Por favor, recarregue a página ou verifique se sua câmera está funcionando.");
  }

  // Payload simplificado conforme documentação oficial v1
  const payload = {
    "requests": [
      {
        "image": {
          "content": content
        },
        "features": [
          {
            "type": "FACE_DETECTION"
          }
        ]
      }
    ]
  };

  const options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseText = response.getContentText();
  const json = JSON.parse(responseText);
  
  if (json.error) {
    Logger.log('Erro Vision API: ' + responseText);
    throw new Error('Vision API Error: ' + json.error.message);
  }

  return json.responses[0];
}
