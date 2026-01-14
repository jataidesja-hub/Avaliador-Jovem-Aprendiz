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
  
  if (params.action === 'add') {
    sheet.appendRow([
      new Date(),
      params.matricula,
      params.nome,
      params.cargo,
      params.supervisor,
      params.admissao,
      params.nascimento,
      params.sexo,
      params.fotoUrl, // Aqui você pode salvar a URL da foto ou Base64 se for pequeno
      'nao-avaliado'
    ]);
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
      'Admissão', 'Nascimento', 'Sexo', 'Foto', 'Status'
    ]);
  }
}
