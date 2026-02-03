// src/core/placeholders-map.js

// Mapeamento: [placeholder_no_DOCX] -> id_do_formulario
// Obs.: os placeholders no .docx devem estar assim: [lms_nome_aluno], [cod_contrato], etc.

window.PLACEHOLDER_MAP = {
  // 🔹 Identificação do aluno e contrato
  cod_aluno: 'raAluno',           // RA do aluno
  cod_contrato: 'contrato',       // Número do contrato

  // 🔹 Dados financeiros e do curso
  lms_inscricao: 'avista',        // Taxa de inscrição (se for usar separado, crie um campo próprio)
  lms_numero_parcela: 'nParcelas',
  lms_valor_parcela: 'parcela',
  lms_valor_curso: 'total',
  lms_curso: 'curso',
  lms_carga_horaria: 'carga',

  // 🔹 Dados do contratante (aluno)
  lms_nome_aluno: 'nomeAluno',
  lms_cpf_aluno: 'cpfAluno',
  lms_rg_aluno: 'rgAluno',
  lms_endereco_aluno: 'endereco',   // se o endereço do aluno for diferente, crie campos próprios no HTML
  lms_cidade_aluno: 'cidadeUf',
  lms_estado_aluno: 'cidadeUf',     // vamos extrair UF de cidadeUf (SP, PA, etc.)
  lms_cep_aluno: 'cep',
  lms_telefone_aluno: 'telResp',    // se tiver telefone do aluno, adicione um input específico
  lms_nasc_aluno: 'nascAluno',

  // 🔹 Dados do representante legal (quando aplicável)
  lms_nome_responsavel: 'nomeResp',
  lms_cpf_responsavel: 'cpfResp',
  lms_rg_responsavel: 'rgResp',
  lms_endereco_responsavel: 'endereco',
  lms_cidade_responsavel: 'cidadeUf',
  lms_estado_responsavel: 'cidadeUf',
  lms_cep_responsavel: 'cep',
  lms_nasc_responsavel: 'nascResp',
  lms_telefone_responsavel: 'telResp',

  // 🔹 Dados de local e data (assinatura)
  lms_cidade: 'cidadeUf',          // extrairemos a cidade (antes da barra)
  lms_estado: 'cidadeUf',          // extrairemos a UF (depois da barra)
  lms_data_completa: 'data'        // geraremos “DD de mês de AAAA”
};
