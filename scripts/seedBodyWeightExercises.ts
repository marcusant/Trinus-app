// scripts/seedBodyWeightExercises.ts

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

// Configs
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const API_BASE = 'https://exercisedb.p.rapidapi.com';
const headers = {
  'X-RapidAPI-Key': RAPIDAPI_KEY,
  'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
};

interface ExerciseAPI {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  secondaryMuscles: string[];
  instructions: string[];
}

async function fetchBodyWeightExercises(): Promise<ExerciseAPI[]> {
  const res = await fetch(
    `${API_BASE}/exercises/equipment/body%20weight?limit=200`,
    { headers }
  );
  if (!res.ok) throw new Error(`Erro ao buscar body weight: ${res.status}`);
  return res.json();
}

async function getExistingIds(): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('exercicios')
    .select('id');

  if (error) throw error;
  return new Set(data.map((e) => e.id));
}

async function seedBodyWeight() {
  console.log('🏠 Iniciando seed de exercícios BODY WEIGHT...\n');

  // 1. Buscar exercícios da API
  console.log('📋 Buscando exercícios body weight na API...');
  const exercises = await fetchBodyWeightExercises();
  console.log(`   Encontrados: ${exercises.length} exercícios\n`);

  // 2. Buscar IDs já existentes
  console.log('🔍 Verificando exercícios já existentes...');
  const existingIds = await getExistingIds();
  console.log(`   Já no banco: ${existingIds.size} exercícios\n`);

  // 3. Filtrar apenas novos
  const newExercises = exercises.filter((ex) => !existingIds.has(ex.id));
  console.log(`🆕 Novos para inserir: ${newExercises.length}\n`);

  if (newExercises.length === 0) {
    console.log('✅ Banco já está atualizado com todos os body weight!');
    return;
  }

  // 4. Mapear para o schema do banco
  const records = newExercises.map((ex) => ({
    id: ex.id,
    nome: ex.name,
    nome_en: ex.name,
    grupo_muscular: ex.bodyPart,
    musculo_alvo: ex.target,
    equipamento: ex.equipment,
    musculos_secundarios: ex.secondaryMuscles,
    instrucoes: ex.instructions,
    gif_url: ex.gifUrl,
    descricao: null,
    dificuldade: null,
    categoria: null,
  }));

  // 5. Inserir em batches
  const BATCH_SIZE = 100;
  let totalInseridos = 0;
  let totalErros = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);

    const { error } = await supabase
      .from('exercicios')
      .upsert(batch, { onConflict: 'id' });

    if (error) {
      console.error(`❌ Erro no batch ${i / BATCH_SIZE + 1}:`, error.message);
      totalErros += batch.length;
    } else {
      totalInseridos += batch.length;
      console.log(`   ✅ Batch ${i / BATCH_SIZE + 1}: ${batch.length} inseridos`);
    }
  }

  // 6. Resumo por grupo muscular
  const summary = newExercises.reduce((acc, ex) => {
    acc[ex.bodyPart] = (acc[ex.bodyPart] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\n📊 Inseridos por grupo muscular:');
  console.table(summary);

  console.log('\n═══════════════════════════════════');
  console.log(`✅ Total inseridos: ${totalInseridos}`);
  console.log(`❌ Total erros: ${totalErros}`);
  console.log('═══════════════════════════════════');
}

// Executar
seedBodyWeight()
  .then(() => {
    console.log('\n🎉 Seed body weight concluído!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n💥 Erro fatal:', err);
    process.exit(1);
  });
