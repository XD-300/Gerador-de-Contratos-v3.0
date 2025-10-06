/* ==========================================================================
   EXEMPLO DE USO DAS FUNÇÕES PYTHON PORTADAS
   Demonstração prática das funcionalidades avançadas
   ========================================================================== */

/**
 * Demonstra o uso das funções portadas do Python
 */
function exemploFuncoesPython() {
  console.log('🐍 === DEMONSTRAÇÃO DAS FUNÇÕES PYTHON PORTADAS ===');
  
  // ==========================================================================
  // 1. NORMALIZAÇÃO DE TEXTO
  // ==========================================================================
  console.log('\n📝 1. NORMALIZAÇÃO DE TEXTO:');
  
  const textoOriginal = "  maria   da silva   dos   santos  rg  do  aluno  ";
  console.log('Original:', textoOriginal);
  console.log('Espaços normalizados:', normalizarEspacos(textoOriginal));
  console.log('Siglas normalizadas:', normalizarSiglas(textoOriginal));
  console.log('Title Case completo:', titleCase(textoOriginal));
  
  // ==========================================================================
  // 2. SISTEMA DE ALIASES
  // ==========================================================================
  console.log('\n🔗 2. SISTEMA DE ALIASES:');
  
  const dadosComAlias = {
    "NÚMERO DO CPF": "12345678901",
    "TELEFONE RESPONSAVEL": "(11) 99999-9999",
    "CARGA HORARIA": "1200h",  // sem acento
    "PROFISSINALIZANTE": "Técnico em Enfermagem"  // com erro
  };
  
  console.log('Dados originais:', dadosComAlias);
  
  const dadosNormalizados = mesclarPorAlias(dadosComAlias);
  console.log('Dados normalizados:', dadosNormalizados);
  
  // ==========================================================================
  // 3. VALIDAÇÕES AVANÇADAS
  // ==========================================================================
  console.log('\n✅ 3. VALIDAÇÕES AVANÇADAS:');
  
  const testesValidacao = [
    { campo: "NOME COMPLETO", valor: "Maria da Silva" },
    { campo: "NOME COMPLETO", valor: "Jo" }, // muito curto
    { campo: "CPF", valor: "12345678901" },
    { campo: "CPF", valor: "111.111.111-11" }, // inválido
    { campo: "DATA", valor: "15/03/2025" },
    { campo: "DATA", valor: "32/13/2025" }, // inválida
    { campo: "TELEFONE", valor: "(11) 99999-9999" },
    { campo: "TELEFONE", valor: "123" } // muito curto
  ];
  
  testesValidacao.forEach(teste => {
    const isValid = validarCampo(teste.campo, teste.valor);
    console.log(`${teste.campo}: "${teste.valor}" -> ${isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`);
  });
  
  // ==========================================================================
  // 4. VALIDAÇÃO DE MÚLTIPLOS CAMPOS
  // ==========================================================================
  console.log('\n🎯 4. VALIDAÇÃO MÚLTIPLA:');
  
  const formularioTeste = {
    "NOME COMPLETO": "João da Silva",
    "CPF": "12345678901",
    "DATA": "15/03/2025",
    "TELEFONE": "(11) 99999-9999",
    "VALOR TOTAL": "R$ 1.500,00",
    "ENDEREÇO COMPLETO": "" // vazio - deve dar erro
  };
  
  const resultadoValidacao = validarCampos(formularioTeste);
  console.log('Resultado da validação:', resultadoValidacao);
  
  // ==========================================================================
  // 5. ORDENAÇÃO DE CAMPOS
  // ==========================================================================
  console.log('\n📋 5. ORDENAÇÃO DE CAMPOS:');
  
  const dadosDesordenados = {
    "VALOR TOTAL": "R$ 1.500,00",
    "NOME DO ALUNO": "Pedro Santos",
    "CONTRATO": "001/2025",
    "CPF": "12345678901",
    "DATA": "15/03/2025"
  };
  
  console.log('Dados desordenados:', Object.keys(dadosDesordenados));
  
  const dadosOrdenados = ordenarCampos(dadosDesordenados);
  console.log('Dados ordenados:', Object.keys(dadosOrdenados));
  
  // ==========================================================================
  // 6. SANITIZAÇÃO DE NOMES DE ARQUIVO
  // ==========================================================================
  console.log('\n🗃️ 6. SANITIZAÇÃO DE ARQUIVOS:');
  
  const nomesSujos = [
    "Contrato: João/Maria <2025>",
    "Arquivo com espaços    múltiplos",
    'Nome com "aspas" e *asteriscos*'
  ];
  
  nomesSujos.forEach(nome => {
    const limpo = sanitizarNomeArquivo(nome);
    console.log(`"${nome}" -> "${limpo}"`);
  });
  
  // ==========================================================================
  // 7. EXEMPLO PRÁTICO COMPLETO
  // ==========================================================================
  console.log('\n🎯 7. EXEMPLO PRÁTICO COMPLETO:');
  
  // Simula dados vindos de um formulário com possíveis problemas
  const formularioReal = {
    "  NOME COMPLETO  ": "  maria  da  silva  santos  ",
    "NÚMERO DO CPF": "12345678901", // alias
    "nasc resp": "15/03/1990", // minúsculo  
    "TELEFONE RESPONSAVEL": "11999999999", // sem formatação
    "rg responsavel": "123456789",
    "endereço completo": "  rua  das  flores  ",
    "BAIRRO": "centro",
    "CEP": "01234567", // sem hífen
    "cid/est": "são paulo/sp",
    "nome do aluno": "JOÃO VICTOR SANTOS", // maiúsculo
    "profissinalizante": "tecnico em enfermagem", // erro + minúsculo
    "carga horaria": "1200h", // sem acento
    "VALOR TOTAL": "2400", // sem formatação
    "forma": "Cartão"
  };
  
  console.log('📥 Dados brutos do formulário:');
  Object.entries(formularioReal).forEach(([k, v]) => 
    console.log(`  ${k}: "${v}"`)
  );
  
  // Aplica normalização completa
  const processados = {};
  
  // 1. Normaliza aliases
  const comAlias = mesclarPorAlias(formularioReal);
  
  // 2. Aplica formatações específicas
  Object.entries(comAlias).forEach(([campo, valor]) => {
    let valorProcessado = valor;
    
    // Normaliza espaços
    valorProcessado = normalizarEspacos(valorProcessado);
    
    // Aplica title case para nomes e endereços
    if (campo.includes('NOME') || campo.includes('ENDEREÇO') || 
        campo.includes('BAIRRO') || campo.includes('CID/EST')) {
      valorProcessado = titleCase(valorProcessado);
    }
    
    // Formata CPF
    if (campo.includes('CPF')) {
      valorProcessado = maskCPF(valorProcessado);
    }
    
    // Formata telefone
    if (campo.includes('TELEFONE')) {
      valorProcessado = maskPhone(valorProcessado);
    }
    
    // Formata CEP
    if (campo === 'CEP') {
      valorProcessado = maskCEP(valorProcessado);
    }
    
    // Formata valores monetários
    if (campo.includes('VALOR') || campo.includes('PARCELA')) {
      const parsed = parseBRL(valorProcessado);
      if (parsed > 0) {
        valorProcessado = fmtBRL(parsed);
      }
    }
    
    processados[campo] = valorProcessado;
  });
  
  // 3. Ordena campos
  const finais = ordenarCampos(processados);
  
  console.log('\n✨ Dados processados e ordenados:');
  Object.entries(finais).forEach(([k, v]) => 
    console.log(`  ${k}: "${v}"`)
  );
  
  // 4. Valida resultado
  const validacaoFinal = validarCampos(finais);
  console.log('\n🔍 Validação final:', validacaoFinal);
  
  console.log('\n🎉 === FIM DA DEMONSTRAÇÃO ===');
}

// ==========================================================================
// FUNÇÃO PARA TESTAR NO CONSOLE DO NAVEGADOR
// ==========================================================================

/**
 * Executa testes das funções Python
 * Usage: testarFuncoesPython() no console do navegador
 */
function testarFuncoesPython() {
  if (typeof window !== 'undefined') {
    exemploFuncoesPython();
    
    console.log('\n💡 DICAS DE USO:');
    console.log('• titleCase("maria da silva") - Formata nomes');
    console.log('• maskCPF("12345678901") - Aplica máscara CPF');
    console.log('• validarCampo("CPF", "123.456.789-01") - Valida campo');
    console.log('• mesclarPorAlias({data}) - Normaliza aliases');
    console.log('• ordenarCampos({data}) - Ordena campos');
  }
}

// Auto-executa quando carregado (apenas se em ambiente de desenvolvimento)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Aguarda um pouco para garantir que outras dependências carregaram
  setTimeout(() => {
    console.log('🔧 Modo desenvolvimento detectado. Execute testarFuncoesPython() para ver exemplos.');
  }, 1000);
}

// Exporta para uso global
if (typeof window !== 'undefined') {
  window.testarFuncoesPython = testarFuncoesPython;
  window.exemploFuncoesPython = exemploFuncoesPython;
}

console.log('✅ Exemplos das funções Python carregados com sucesso');