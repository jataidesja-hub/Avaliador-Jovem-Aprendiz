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
  
  // 2. AÇÃO: SALVAR AVALIAÇÃO REALIZADA
  if (params.action === 'saveEvaluation') {
    const d = params.data;
    const rows = sheet.getDataRange().getValues();
    
    for (let i = 1; i < rows.length; i++) {
        if (rows[i][1].toString() === d.apprenticeId.toString()) {
            const rowNumber = i + 1;
            sheet.getRange(rowNumber, 10).setValue('not_evaluated'); // J: Status
            sheet.getRange(rowNumber, 11).setValue(d.cycleFinished);// K: Ciclo
            sheet.getRange(rowNumber, 12).setValue(d.score);        // L: Nota
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
            // Atualiza colunas C a I (Nome até Foto)
            sheet.getRange(rowNumber, 3, 1, 7).setValues([[
              d.nome, d.cargo, d.supervisor, d.admissao, d.nascimento, d.sexo, d.foto
            ]]);
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
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Timestamp', 'Matrícula', 'Nome', 'Cargo', 'Supervisor', 
      'Admissão', 'Nascimento', 'Sexo', 'Foto', 'Status', 'Ciclo', 'Nota'
    ]);
  }
}
