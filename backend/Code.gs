/**
 * Sistema de Avaliação de Jovens Aprendizes - Backend
 * 1. Crie uma Planilha Google
 * 2. Extensões > Apps Script
 * 3. Cole este código
 * 4. Implemente o "Deploy" como Web App (Acesso: Anyone)
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const SHEET_NAME = 'Aprendizes';

function doGet(e) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
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
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // 1. ADICIONAR APRENDIZ
  if (params.action === 'addApprentice') {
    const d = params.data;
    sheet.appendRow([
      new Date(),
      d.matricula,
      d.nome,
      d.cargo,
      d.supervisor,
      d.admissao,
      d.nascimento,
      d.sexo,
      d.foto,
      'not_evaluated',
      1, // Ciclo inicial
      0  // Nota inicial
    ]);
  }
  
  // 2. SALVAR AVALIAÇÃO
  if (params.action === 'saveEvaluation') {
    const d = params.data;
    const rows = sheet.getDataRange().getValues();
    
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][1].toString() === d.apprenticeId.toString()) {
        sheet.getCell(i + 1, 10).setValue(d.status || 'not_evaluated'); // Status (Coluna J)
        sheet.getCell(i + 1, 11).setValue(d.cycleFinished);            // Ciclo (Coluna K)
        sheet.getCell(i + 1, 12).setValue(d.score);                    // Nota (Coluna L)
        break;
      }
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Timestamp', 'Matrícula', 'Nome', 'Cargo', 'Supervisor', 
      'Admissão', 'Nascimento', 'Sexo', 'Foto', 'Status', 'Ciclo', 'Nota'
    ]);
  }
}
