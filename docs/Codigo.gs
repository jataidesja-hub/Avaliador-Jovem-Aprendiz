/**
 * Sistema de Avaliação de Jovens Aprendizes + Gestão de RH - Backend Completo
 * 1. Crie uma Planilha Google
 * 2. Extensões > Apps Script
 * 3. Cole este código
 * 4. Execute a função setup() para criar as abas necessárias
 * 5. Implemente o "Deploy" como Web App (Acesso: Anyone)
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const SHEET_NAME = 'Aprendizes';
const CONFIG_SHEET_NAME = 'Configs';
const RH_SHEET_NAME = 'Colaboradores';
const RH_CONFIG_SHEET_NAME = 'RH_Configs';
const PONTO_SHEET_NAME = 'RegistrosPonto';
const FACE_SHEET_NAME = 'CadastroFacial';

// CHAVE DA GOOGLE CLOUD VISION API
const GOOGLE_VISION_API_KEY = 'AIzaSyB8-VzL3OfdaG0t7wPr3sGOq5TnQ-ztKPE'; 

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
    // Verifica se já existe cadastro para essa matrícula
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][1].toString() === d.matricula.toString()) {
        // Atualiza o registro existente
        sheet.getRange(i + 1, 1).setValue(new Date());
        sheet.getRange(i + 1, 4).setValue(d.faceData || 'REGISTERED');
        return ContentService.createTextOutput(JSON.stringify({ status: 'updated' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    // Novo cadastro
    // Se d.image estiver presente, usar Google Vision para extrair landmarks
    if (d.image) {
      try {
        const visionData = callGoogleVision(d.image);
        if (visionData.faceAnnotations && visionData.faceAnnotations.length > 0) {
          d.faceData = JSON.stringify({
            landmarks: visionData.faceAnnotations[0].landmarks,
            type: 'google-vision'
          });
        }
      } catch (e) {
        // Fallback para o que veio no faceData ou erro
      }
    }

    sheet.appendRow([new Date(), d.matricula, d.nome, d.faceData || 'REGISTERED']);
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Identificação Facial via Nuvem
  if (action === 'identifyFace') {
    const result = identifyFaceAction(params.data.image);
    return ContentService.createTextOutput(JSON.stringify(result))
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

  Logger.log('Setup completo! Todas as abas foram criadas.');
}

/**
 * Action para identificar face via Google Vision
 */
function identifyFaceAction(imageBase64) {
  const visionData = callGoogleVision(imageBase64);
  
  if (!visionData.faceAnnotations || visionData.faceAnnotations.length === 0) {
    return { success: false, error: 'Nenhum rosto detectado pela IA do Google.' };
  }

  const face = visionData.faceAnnotations[0];
  const landmarks = face.landmarks;
  
  // Buscar todos os cadastros
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(FACE_SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  data.shift(); // remove headers
  
  let bestMatch = null;
  let minDistance = Infinity;
  
  for (const row of data) {
    const matricula = row[1];
    const nome = row[2];
    const storedFaceData = row[3];
    
    try {
      const stored = JSON.parse(storedFaceData);
      // Se for um cadastro da Vision API (tem landmarks)
      if (stored.landmarks) {
        const distance = calculateFaceDistance(landmarks, stored.landmarks);
        if (distance < minDistance) {
          minDistance = distance;
          bestMatch = { matricula, nome };
        }
      }
    } catch (e) {
      // Ignora cadastros antigos (face-api.js) ou inválidos
    }
  }

  // Threshold para landmarks (ajustável: 0.05 é rígido, 0.10 é tolerante)
  const threshold = 0.08; 
  
  if (bestMatch && minDistance < threshold) {
    Logger.log(`Sucesso: Identificado ${bestMatch.nome} com distância ${minDistance.toFixed(4)}`);
    return { success: true, employee: bestMatch, distance: minDistance };
  } else {
    Logger.log(`Falha: Melhor match foi ${bestMatch ? bestMatch.nome : 'nenhum'} com distância ${minDistance.toFixed(4)} (threshold ${threshold})`);
    return { success: false, error: 'Rosto não reconhecido. Tente se aproximar mais ou ficar em local mais iluminado.' };
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

  if (!n1 || !n2) return Infinity;

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
  const url = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`;
  const content = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

  const payload = {
    requests: [{
      image: { content: content },
      features: [{ type: 'FACE_DETECTION', maxResults: 1 }]
    }]
  };

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const responseText = response.getContentText();
  const json = JSON.parse(responseText);
  
  if (json.error) {
    Logger.log('Erro na Vision API: ' + responseText);
    throw new Error('Erro na API do Google: ' + json.error.message);
  }

  return json.responses[0];
}
