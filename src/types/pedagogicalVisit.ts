export enum PedagogicalVisitEnumLabels {
  oAmbienteEAlfabetizador = 'O ambiente é alfabetizador?',
  oEducadorCirculaPelaSalaDeAula = 'O educador circula pela sala de aula?',
  oRitmosDasOrientacoesEAdequadoParaAtenderAosEstudantesQueApresentamMaisDificuldades = 'O ritmo das orientações é adequado para atender aos estudantes que apresentam mais dificuldades?',
  oEducadorDemonstraDominioDoConteudoEDasHabilidadesPropostas = 'O educador demonstra domínio do conteúdo e das habilidades propostas?',
  osObjetivosDaAulaSaoInformadosAosEstudantes = 'Os objetivos da aula são informados aos estudantes?',
  ocorreAContextualizacaoEntreOConteudoEAsVivenciasDoEstudante = 'Ocorre a contextualização entre o conteúdo e as vivências do estudante?',
  osEstudantesqueApresentamMaioresDificuldadesRecebemAtencaoDiferenciada = 'Os estudantes que apresentam maiores dificuldades recebem atenção diferenciada?',
  oEducadorObservaAFormaDeRegistroDoEstudanteEConduzAAulaNoSentidoDeAlcancarOObjetivoProposto = 'O educador observa a forma de registro do estudante e conduz a aula no sentido de alcançar o objetivo proposto?',
  oEducadorSegueARotinaPropostaParaAAulaPeloProjeto = 'O educador segue a rotina proposta (para a aula) pelo projeto',
  aMaioriaDosEstudantesParticipamDaAula = 'A maioria dos estudantes participam da aula?',
  oPlanoDeAulaContemplaOsObjetivosDaAula = 'O plano de aula contempla os objetivos da aula?',
  leitura = 'Leitura',
  escrita = 'Escrita',
  atividadesDiferenciadas = 'Atividades diferenciadas',
  frequency = 'Quantidade de alunos presentes',
  observations = 'Observações',
}

export enum PedagogicalVisitEnumQuestions {
  oAmbienteEAlfabetizador = 'oAmbienteEAlfabetizador',
  oEducadorCirculaPelaSalaDeAula = 'oEducadorCirculaPelaSalaDeAula',
  oRitmosDasOrientacoesEAdequadoParaAtenderAosEstudantesQueApresentamMaisDificuldades = 'oRitmosDasOrientacoesEAdequadoParaAtenderAosEstudantesQueApresentamMaisDificuldades',
  oEducadorDemonstraDominioDoConteudoEDasHabilidadesPropostas = 'oEducadorDemonstraDominioDoConteudoEDasHabilidadesPropostas',
  osObjetivosDaAulaSaoInformadosAosEstudantes = 'osObjetivosDaAulaSaoInformadosAosEstudantes',
  ocorreAContextualizacaoEntreOConteudoEAsVivenciasDoEstudante = 'ocorreAContextualizacaoEntreOConteudoEAsVivenciasDoEstudante',
  osEstudantesqueApresentamMaioresDificuldadesRecebemAtencaoDiferenciada = 'osEstudantesqueApresentamMaioresDificuldadesRecebemAtencaoDiferenciada',
  oEducadorObservaAFormaDeRegistroDoEstudanteEConduzAAulaNoSentidoDeAlcancarOObjetivoProposto = 'oEducadorObservaAFormaDeRegistroDoEstudanteEConduzAAulaNoSentidoDeAlcancarOObjetivoProposto',
  oEducadorSegueARotinaPropostaParaAAulaPeloProjeto = 'oEducadorSegueARotinaPropostaParaAAulaPeloProjeto',
  aMaioriaDosEstudantesParticipamDaAula = 'aMaioriaDosEstudantesParticipamDaAula',
  oPlanoDeAulaContemplaOsObjetivosDaAula = 'oPlanoDeAulaContemplaOsObjetivosDaAula',
  leitura = 'leitura',
  escrita = 'escrita',
  atividadesDiferenciadas = 'atividadesDiferenciadas',
  frequency = 'frequency',
  observations = 'observations',
}

export interface PedagogicalVisit {
  id: string;
  date: Date;
  frequency: number;
  observations: string;
  teacher: {
    id: string;
    name: string;
  };
  coordinator: {
    id: string;
    name: string;
  };
  classroom: {
    id: string;
    year: number;
    period: string;
  };
  questions: any;
}

export interface GetOnePedagogicalVisit {
  id: string;
  date: Date;
  frequency: number;
  observations: string;
  questions: Record<PedagogicalVisitEnumQuestions, boolean>;
  School: {
    name: string;
  };
  Classroom: {
    period: string;
    year: string;
  };
  Teacher: {
    user: { name: string };
  };
  Coordinator: {
    user: { name: string };
  };
}
