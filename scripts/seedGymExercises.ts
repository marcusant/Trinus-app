// scripts/seedGymExercises.ts

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

// Equipamentos de academia
const GYM_EQUIPMENTS = [
  'barbell',
  'cable',
  'leverage machine',
  'smith machine',
  'ez barbell',
  'olympic barbell',
  'trap bar',
  'sled machine',
  'upper body ergometer',
  'elliptical machine',
  'stationary bike',
  'skierg machine',
  'hammer',
  'weighted',
];

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

async function fetchExercisesByEquipment(equipment: string): Promise<ExerciseAPI[]> {
  const res = await fetch(
    `${API_BASE}/exercises/equipment/${encodeURIComponent(equipment)}?limit=500`,
    { headers }
  );
  if (!res.ok) throw new Error(`Erro ao buscar ${equipment}: ${res.status}`);
  return res.json();
}

async function getExistingIds(): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('exercicios')
    .select('id');

  if (error) throw error;
  return new Set(data.map((e) => e.id));
}

async function seedGymExercises() {
  console.log('🏋️ Iniciando seed de exercícios de ACADEMIA...\n');

  // 1. Buscar IDs já existentes
  console.log('🔍 Verificando exercícios já existentes...');
  const existingIds = await getExistingIds();
  console.log(`   Já no banco: ${existingIds.size} exercícios\n`);

  let totalInseridos = 0;
  let totalErros = 0;
  let totalIgnorados = 0;

  // 2. Para cada equipamento de academia, buscar exercícios
  for (const equipment of GYM_EQUIPMENTS) {
    console.log(`🏋️ Buscando exercícios com "${equipment}"...`);

    try {
      const exercises = await fetchExercisesByEquipment(equipment);
      console.log(`   Encontrados na API: ${exercises.length} exercícios`);

      // 3. Filtrar apenas novos
      const newExercises = exercises.filter((ex) => !existingIds.has(ex.id));
      console.log(`   Novos para inserir: ${newExercises.length}`);

      if (newExercises.length === 0) {
        console.log(`   ⏭️ Todos já existem, pulando...\n`);
        totalIgnorados += exercises.length;
        await new Promise((r) => setTimeout(r, 4000));
        continue;
      }

      // 4. Mapear e inserir no Supabase
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

      // Upsert em batches de 100
      const BATCH_SIZE = 100;
      for (let i = 0; i < records.length; i += BATCH_SIZE) {
        const batch = records.slice(i, i + BATCH_SIZE);

        const { error } = await supabase
          .from('exercicios')
          .upsert(batch, { onConflict: 'id' });

        if (error) {
          console.error(`   ❌ Erro no batch ${i / BATCH_SIZE + 1}:`, error.message);
          totalErros += batch.length;
        } else {
          totalInseridos += batch.length;
          batch.forEach((ex) => existingIds.add(ex.id));
        }
      }

      console.log(`   ✅ Inseridos com sucesso\n`);

      // Rate limiting
      await new Promise((r) => setTimeout(r, 4000));

    } catch (err) {
      console.error(`   ❌ Erro ao processar ${equipment}:`, err);
    }
  }

  console.log('═══════════════════════════════════');
  console.log(`✅ Total inseridos: ${totalInseridos}`);
  console.log(`⏭️ Total já existentes (ignorados): ${totalIgnorados}`);
  console.log(`❌ Total erros: ${totalErros}`);
  console.log(`📊 Total no banco agora: ${existingIds.size}`);
  console.log('═══════════════════════════════════');
}

// Executar
seedGymExercises()
  .then(() => {
    console.log('\n🎉 Seed academia concluído!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n💥 Erro fatal:', err);
    process.exit(1);
  });
