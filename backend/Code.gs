/**
 * Sistema de Avaliação de Jovens Aprendizes - Backend
 * 1. Crie uma Planilha Google
 * 2. Extensões > Apps Script
 * 3. Cole este código
 * 4. Implemente o "Deploy" como Web App (Acesso: Anyone)
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const SHEET_NAME = 'Aprendizes';
const CONFIG_SHEET_NAME = 'Configs';

function doGet(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  if (e.parameter.action === 'getConfigs') {
    const sheet = ss.getSheetByName(CONFIG_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    data.shift(); // remove headers
    
    const sectors = data.filter(r => r[0] === 'Sector').map(r => r[1]);
    const supervisors = data.filter(r => r[0] === 'Supervisor').map(r => r[1]);
    
    return ContentService.createTextOutput(JSON.stringify({ sectors, supervisors }))
      .setMimeType(ContentService.MimeType.JSON);
  }

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
  
  // 5. AÇÃO: SALVAR CONFIGURAÇÕES
  if (params.action === 'saveConfigs') {
    const sheet = ss.getSheetByName(CONFIG_SHEET_NAME);
    sheet.clear();
    sheet.appendRow(['Type', 'Value']);
    params.sectors.forEach(s => sheet.appendRow(['Sector', s]));
    params.supervisors.forEach(s => sheet.appendRow(['Supervisor', s]));
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = ss.getSheetByName(SHEET_NAME);
  
  // 1. ADICIONAR APRENDIZ
  if (params.action === 'addApprentice') {
    const d = params.data;
    sheet.appendRow([
      new Date(),       // A: Timestamp (1)
      d.matricula,      // B: Matrícula (2)
      d.nome,           // C: Nome (3)
      d.cargo,          // D: Cargo (4)
      d.supervisor,     // E: Supervisor (5)
      d.admissao,       // F: Admissão (6)
      d.nascimento,     // G: Nascimento (7)
      d.sexo,           // H: Sexo (8)
      d.foto,           // I: Foto (9)
      'not_evaluated',  // J: Status (10)
      1,                // K: Ciclo (11)
      0,                // L: Nota (12)
      d.termino         // M: Término (13)
    ]);
  }
  
  // 2. AÇÃO: SALVAR AVALIAÇÃO REALIZADA
  if (params.action === 'saveEvaluation') {
    const d = params.data;
    const rows = sheet.getDataRange().getValues();
    
    for (let i = 1; i < rows.length; i++) {
        if (rows[i][1].toString() === d.apprenticeId.toString()) {
            const rowNumber = i + 1;
            sheet.getRange(rowNumber, 10).setValue('not_evaluated'); // J: Status (10)
            sheet.getRange(rowNumber, 11).setValue(d.cycleFinished);// K: Ciclo (11)
            sheet.getRange(rowNumber, 12).setValue(d.score);        // L: Nota (12)
            break;
        }
    }
  }

  // 3. AÇÃO: ATUALIZAR CADASTRO DO APRENDIZ
  if (params.action === 'updateApprentice') {
    const d = params.data;
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
        if (rows[i][1].toString() === d.matricula.toString()) {
            const rowNumber = i + 1;
            // C: Nome (3), D: Cargo (4), E: Supervisor (5)
            // F: Admissão (6), G: Nascimento (7), H: Sexo (8), I: Foto (9)
            sheet.getRange(rowNumber, 3).setValue(d.nome);
            sheet.getRange(rowNumber, 4).setValue(d.cargo);
            sheet.getRange(rowNumber, 5).setValue(d.supervisor);
            sheet.getRange(rowNumber, 6).setValue(d.admissao);
            sheet.getRange(rowNumber, 7).setValue(d.nascimento);
            sheet.getRange(rowNumber, 8).setValue(d.sexo);
            sheet.getRange(rowNumber, 9).setValue(d.foto);
            // M: Término (13)
            if (d.termino) {
              sheet.getRange(rowNumber, 13).setValue(d.termino);
            }
            break;
        }
    }
  }

  // 4. AÇÃO: EXCLUIR APRENDIZ
  if (params.action === 'deleteApprentice') {
    const matricula = params.matricula;
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
        if (rows[i][1].toString() === matricula.toString()) {
            sheet.deleteRow(i + 1);
            break;
        }
    }
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
}
