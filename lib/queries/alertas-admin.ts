import { createClient } from '@/lib/supabase/server'

export interface AlertaAdmin {
  tipo: 'sem_treino' | 'sem_alimentacao' | 'reavaliacao' | 'inativo'
  titulo: string
  descricao: string
  alunos: {
    id: string
    nome: string
    dias?: number
  }[]
  prioridade: 'alta' | 'media' | 'baixa'
  acao: string
  link: string
}

export async function getAlertasAdmin(): Promise<AlertaAdmin[]> {
  const supabase = await createClient()
  const alertas: AlertaAdmin[] = []
  const hoje = new Date().toISOString().split('T')[0]
  const limite14Dias = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()

  // Buscar todos os alunos (role = 'aluno')
  const { data: alunos } = await supabase
    .from('perfil_utilizador')
    .select('user_id, nome, updated_at')
    .eq('role', 'aluno')

  if (!alunos || alunos.length === 0) return alertas

  const alunoIds = alunos.map(a => a.user_id)

  // Buscar planos ativos
  const { data: planosAtivos } = await supabase
    .from('planos_treino')
    .select('perfil_id')
    .eq('ativo', true)
    .in('perfil_id', alunoIds)

  const { data: alimentaresAtivos } = await supabase
    .from('planos_alimentares')
    .select('perfil_id')
    .eq('ativo', true)
    .in('perfil_id', alunoIds)

  // Buscar reavaliações pendentes
  const { data: reavaliacoes } = await supabase
    .from('anamnese')
    .select('perfil_id, proxima_reavaliacao')
    .lte('proxima_reavaliacao', hoje)
    .in('perfil_id', alunoIds)

  // IDs com planos ativos
  const comTreino = new Set(planosAtivos?.map(p => p.perfil_id) || [])
  const comAlimentar = new Set(alimentaresAtivos?.map(p => p.perfil_id) || [])

  // 1. Alunos SEM plano de treino
  const semTreino = alunos.filter(a => !comTreino.has(a.user_id))
  if (semTreino.length > 0) {
    alertas.push({
      tipo: 'sem_treino',
      titulo: 'Alunos sem plano de treino',
      descricao: `${semTreino.length} aluno(s) sem plano ativo`,
      alunos: semTreino.map(a => ({ id: a.user_id, nome: a.nome })),
      prioridade: 'alta',
      acao: 'Criar plano',
      link: '/admin/alunos'
    })
  }

  // 2. Alunos SEM plano alimentar
  const semAlimentar = alunos.filter(a => !comAlimentar.has(a.user_id))
  if (semAlimentar.length > 0) {
    alertas.push({
      tipo: 'sem_alimentacao',
      titulo: 'Alunos sem plano alimentar',
      descricao: `${semAlimentar.length} aluno(s) sem plano ativo`,
      alunos: semAlimentar.map(a => ({ id: a.user_id, nome: a.nome })),
      prioridade: 'alta',
      acao: 'Criar plano',
      link: '/admin/alunos'
    })
  }

  // 3. Reavaliações pendentes
  if (reavaliacoes && reavaliacoes.length > 0) {
    const alunosReavaliacao = reavaliacoes.map(r => {
      const aluno = alunos.find(a => a.user_id === r.perfil_id)
      return { id: r.perfil_id, nome: aluno?.nome || 'Desconhecido' }
    })
    alertas.push({
      tipo: 'reavaliacao',
      titulo: 'Reavaliações pendentes',
      descricao: `${reavaliacoes.length} aluno(s) para reavaliar`,
      alunos: alunosReavaliacao,
      prioridade: 'media',
      acao: 'Ver anamnese',
      link: '/admin/anamneses'
    })
  }

  // 4. Alunos inativos (sem update há 14+ dias)
  const inativos = alunos.filter(a => a.updated_at && a.updated_at < limite14Dias)
  if (inativos.length > 0) {
    alertas.push({
      tipo: 'inativo',
      titulo: 'Alunos inativos',
      descricao: `${inativos.length} aluno(s) sem atividade há 14+ dias`,
      alunos: inativos.map(a => ({
        id: a.user_id,
        nome: a.nome,
        dias: Math.floor((Date.now() - new Date(a.updated_at).getTime()) / (1000 * 60 * 60 * 24))
      })),
      prioridade: 'baixa',
      acao: 'Contactar',
      link: '/admin/alunos'
    })
  }

  // Ordenar por prioridade
  const ordemPrioridade = { alta: 0, media: 1, baixa: 2 }
  return alertas.sort((a, b) => ordemPrioridade[a.prioridade] - ordemPrioridade[b.prioridade])
}
