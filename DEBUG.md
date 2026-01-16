# 🔍 Guia de Debug - Problemas com Dados dos Aprendizes

## Problemas Relatados:
1. ❌ "Painel de proteção" está aparecendo como título
2. ❌ Nomes e sexos dos aprendizes não correspondem à planilha
3. ❌ Quantidade de homens e mulheres não bate com a planilha

## ✅ Soluções Aplicadas:

### 1. Título "Painel de proteção"
**Status:** ✓ Corrigido no código
- O código atual mostra: "Painel de Controle"
- Se ainda aparecer "Painel de proteção", é cache do navegador
- **Solução:** Pressione `Ctrl + Shift + R` para recarregar a página sem cache

### 2. Problemas com Sexo e Contagem

O problema pode estar em:

#### A. Formato dos dados na planilha

A planilha Google Sheets deve ter as seguintes colunas nesta ordem:

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Matrícula | Nome | Cargo | Supervisor | Admissão | Nascimento | **Sexo** | Foto | Status | Ciclo | Nota | Término |

**IMPORTANTE:** A coluna H (8ª coluna) deve conter os valores:
- `Feminino` (primeira letra maiúscula)
- `Masculino` (primeira letra maiúscula)

#### B. Verificar dados brutos

1. Abra o Console do Navegador (F12)
2. Vá para a aba "Console"
3. Digite: `localStorage.clear()` e pressione Enter
4. Recarregue a página (F5)
5. No console, verifique os dados retornados pela API

## 🛠️ Como Verificar a Planilha

1. Acesse sua planilha do Google Sheets
2. Verifique se a aba "Aprendizes" existe
3. Confirme que os cabeçalhos estão corretos:
   ```
   Timestamp | Matrícula | Nome | Cargo | Supervisor | Admissão | Nascimento | Sexo | Foto | Status | Ciclo | Nota | Término
   ```

4. Verifique se a coluna "Sexo" (coluna H) tem valores exatamente como:
   - `Feminino` ou `Masculino`
   - NÃO use: "F", "M", "feminino", "FEMININO", etc.

## 📝 Como Adicionar Log de Debug

Se ainda houver problemas, adicione temporariamente no arquivo `src/components/Dashboard.jsx` após a linha 23:

```javascript
const normalizeGender = (g) => g ? g.toString().trim().toLowerCase() : '';

// ADICIONE ESTAS LINHAS PARA DEBUG:
console.log('=== DEBUG SEXO ===');
apprentices.forEach(a => {
  console.log(`${a.nome}: Sexo Raw = "${a.sexo}", Normalizado = "${normalizeGender(a.sexo)}"`);
});
console.log('=================');

const female = apprentices.filter(a => normalizeGender(a.sexo) === 'feminino').length;
```

Isso mostrará no console do navegador (F12) o valor exato de cada sexo.

## 🔄 Passos para Corrigir

1. **Limpar cache do navegador:** `Ctrl + Shift + R`
2. **Verificar estrutura da planilha** (ver seção acima)
3. **Corrigir dados na planilha** se necessário
4. **Re-deployar o Apps Script** se você fez mudanças no backend:
   - Abra o Apps Script
   - Clique em "Implantar" → "Gerenciar implantações"
   - Clique em "Editar" (ícone de lápis)
   - Selecione "Nova versão"
   - Clique em "Implantar"
5. **Recarregar a aplicação** React

## 📞 Próximos Passos

Se o problema persistir, por favor compartilhe:
1. Uma captura de tela dos primeiros 3 registros da planilha (com os cabeçalhos)
2. O que aparece no console do navegador (F12 → Console)
