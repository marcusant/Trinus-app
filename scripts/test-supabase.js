import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Connecting to:', url)

const supabase = createClient(url, anonKey)

const candidateTables = [
  'profiles',
  'perfil_utilizador',
  'anamnese',
  'cardio_config',
  'checkin',
  'exercicios',
  'exercicios_cardio',
  'medicoes',
  'mesociclo_template',
  'overlap_muscular',
  'plano_exercicio',
  'plano_sessao',
  'plano_volume',
  'planos_alimentares',
  'planos_treino'
]

async function testAll() {
  console.log('\n--- DIAGNÓSTICO DE TABELAS NA BASE DE DADOS ATIVA ---')
  for (const table of candidateTables) {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      
    if (error) {
      if (error.code === 'PGRST205') {
        console.log(`❌ Tabela '${table}': NÃO EXISTE na base de dados.`)
      } else if (error.code === '42501') {
        // RLS impede leitura direta sem filtro, mas a tabela EXISTE!
        console.log(`🔒 Tabela '${table}': EXISTE (Bloqueada por RLS/Políticas de Acesso).`)
      } else {
        console.log(`⚠️ Tabela '${table}': Erro desconhecido (${error.code}) - ${error.message}`)
      }
    } else {
      console.log(`✅ Tabela '${table}': EXISTE e possui ${count ?? 0} registo(s).`)
    }
  }
}
testAll()
