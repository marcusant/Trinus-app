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

async function fetchBodyParts(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/exercises/bodyPartList`, { headers });
  if (!res.ok) throw new Error(`Erro ao buscar bodyPartList: ${res.status}`);
  return res.json();
}

async function fetchExercisesByBodyPart(bodyPart: string): Promise<ExerciseAPI[]> {
  const res = await fetch(
    `${API_BASE}/exercises/bodyPart/${encodeURIComponent(bodyPart)}?limit=500`,
    { headers }
  );
  if (!res.ok) throw new Error(`Erro ao buscar ${bodyPart}: ${res.status}`);
  return res.json();
}

async function seedExercises() {
  console.log('🚀 Iniciando seed de exercícios...\n');

  // 1. Buscar lista de grupos musculares
  console.log('📋 Buscando grupos musculares...');
  const bodyParts = await fetchBodyParts();
  console.log(`   Encontrados: ${bodyParts.join(', ')}\n`);

  let totalInseridos = 0;
  let totalErros = 0;

  // 2. Para cada grupo, buscar exercícios
  for (const bodyPart of bodyParts) {
    console.log(`💪 Buscando exercícios de "${bodyPart}"...`);
    
    try {
      const exercises = await fetchExercisesByBodyPart(bodyPart);
      console.log(`   Encontrados: ${exercises.length} exercícios`);

      // 3. Mapear e inserir no Supabase
      const records = exercises.map((ex) => ({
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
        }
      }

      console.log(`   ✅ Inseridos com sucesso\n`);

      // Rate limiting - 4s entre requests para respeitar limite de 15/min
      await new Promise((r) => setTimeout(r, 4000));
      
    } catch (err) {
      console.error(`   ❌ Erro ao processar ${bodyPart}:`, err);
    }
  }

  console.log('═══════════════════════════════════');
  console.log(`✅ Total inseridos: ${totalInseridos}`);
  console.log(`❌ Total erros: ${totalErros}`);
  console.log('═══════════════════════════════════');
}

// Executar
seedExercises()
  .then(() => {
    console.log('\n🎉 Seed concluído!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n💥 Erro fatal:', err);
    process.exit(1);
  });
