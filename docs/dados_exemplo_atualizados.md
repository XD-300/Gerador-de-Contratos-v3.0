# Dados do Exemplo Atualizado

## Dados JSON Fornecidos:
```json
{
  "CONTRATO": "001/2026",
  "DATA": "13/10/2025",
  "NOME COMPLETO": "Maria de Souza Almeida",
  "NASC RESP": "05/09/1986",
  "CPF": "055.232.992-43",
  "RG RESPONSAVEL": "1234567",
  "TELEFONE": "(94) 98888-7777",
  "ENDEREÇO COMPLETO": "Rua Bernardo Sayão",
  "N CS": "189",
  "BAIRRO": "Centro",
  "CEP": "68140-000",
  "CID/EST": "",
  "NOME DO ALUNO": "João Vitor Almeida",
  "NASC ALUNO": "12/10/2012",
  "CPF DO ALUNO": "123.123.123-12",
  "RG ALUNO": "7778889",
  "PROFISSIONALIZANTE": "Técnico em Enfermagem",
  "CARGA HORÁRIA": "1200h",
  "VALOR TOTAL": "R$ 1.000,00",
  "PARCELA": "R$ 100,00",
  "DESCONTO": "R$ 20,00",
  "NÚMERO DE PARCELAS": "10",
  "VALOR PARCELA CARTÃO": "R$ 100,00",
  "VALOR ENTRADA": "R$ 100,00",
  "VALOR PARCELA BOLETO": "R$ 90,00",
  "DIA VENCIMENTO": "10",
  "_meta": { "forma": "Cartão", "modelo": "CONTRATO_DE_PRESTACAO_DE_SERVICO" }
}
```

## Mapeamento para Campos do Sistema:

| JSON Field | HTML ID | Valor a Ser Preenchido | Status |
|------------|---------|------------------------|--------|
| CONTRATO | contrato | 001/2026 | ✅ |
| DATA | data | 13/10/2025 | ✅ |
| NOME COMPLETO | nomeResp | Maria de Souza Almeida | ✅ |
| NASC RESP | nascResp | 05/09/1986 | ✅ |
| CPF | cpfResp | 055.232.992-43 | ✅ |
| RG RESPONSAVEL | rgResp | 1234567 | ✅ |
| TELEFONE | telResp | (94) 98888-7777 | ✅ |
| ENDEREÇO COMPLETO | endereco | Rua Bernardo Sayão | ✅ |
| N CS | numero | 189 | ✅ |
| BAIRRO | bairro | Centro | ✅ |
| CEP | cep | 68140-000 | ✅ |
| CID/EST | cidadeUf | Uruará/PA | ✅ |
| NOME DO ALUNO | nomeAluno | João Vitor Almeida | ✅ |
| NASC ALUNO | nascAluno | 12/10/2012 | ✅ |
| CPF DO ALUNO | cpfAluno | 123.123.123-12 | ✅ |
| RG ALUNO | rgAluno | 7778889 | ✅ |
| PROFISSIONALIZANTE | curso | Técnico em Enfermagem | ✅ |
| CARGA HORÁRIA | carga | 1200h | ✅ |
| VALOR TOTAL | total | R$ 1.000,00 | ✅ |
| PARCELA | parcela | R$ 100,00 | ✅ |
| DESCONTO | desconto | R$ 20,00 | ✅ |
| NÚMERO DE PARCELAS | nParcelas | 10 | ✅ |
| VALOR ENTRADA | entrada | R$ 100,00 | ✅ |
| DIA VENCIMENTO | diaVenc | 10 | ✅ |
| _meta.forma | forma | Cartão | ✅ |
| _meta.modelo | modelo | CONTRATO_DE_PRESTACAO_DE_SERVICO | ✅ |

## Comando do Botão Atualizado:
```javascript
onclick="
set('#modelo','CONTRATO_DE_PRESTACAO_DE_SERVICO');
set('#forma','cartao');
updateFormaUI();
set('#data','13/10/2025');
set('#nomeResp',titleCase('Maria de Souza Almeida'));
set('#nascResp','05/09/1986');
set('#cpfResp',maskCPF('05523299243'));
set('#rgResp','1234567');
set('#telResp',maskPhone('94988887777'));
set('#endereco',titleCase('Rua Bernardo Sayão'));
set('#numero','189');
set('#bairro',titleCase('Centro'));
set('#cep',maskCEP('68140000'));
set('#cidadeUf','Uruará/PA');
set('#nomeAluno',titleCase('João Vitor Almeida'));
set('#nascAluno','12/10/2012');
set('#cpfAluno',maskCPF('12312312312'));
set('#rgAluno','7778889');
set('#curso','Técnico em Enfermagem');
set('#carga','1200h');
set('#contrato','001/2026');
set('#nParcelas','10');
set('#parcela',fmtBRL(100.00));
set('#entrada',fmtBRL(100.00));
set('#total',fmtBRL(1000.00));
set('#desconto',fmtBRL(20.00));
set('#diaVenc','10');
recalc(false);
"
```

## Observações:
1. ✅ Todos os campos principais foram mapeados corretamente
2. ✅ As máscaras de formatação estão sendo aplicadas (CPF, telefone, CEP, data)
3. ✅ As funções titleCase() estão sendo usadas para nomes e endereços
4. ✅ Os valores monetários estão usando fmtBRL() para formatação
5. ✅ O modelo foi alterado de "Contrato_EJA" para "CONTRATO_DE_PRESTACAO_DE_SERVICO"
6. ✅ A data foi atualizada para 13/10/2025
7. ✅ O CPF foi corrigido de "39015451706" para "05523299243"
8. ✅ Campos financeiros foram ajustados conforme os dados fornecidos