// scripts/test-exercisedb.ts
// Teste rápido da integração com ExerciseDB

import { config } from 'dotenv';
config({ path: '.env.local' });

const EXERCISEDB_API_URL = 'https://exercisedb.p.rapidapi.com';

const headers = {
  'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
  'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
};

async function testConnection() {
  console.log('🏋️ Testando conexão com ExerciseDB...\n');

  try {
    // Teste 1: Listar grupos musculares
    console.log('📋 Buscando grupos musculares...');
    const bodyPartsRes = await fetch(
      `${EXERCISEDB_API_URL}/exercises/bodyPartList`,
      { headers }
    );
    
    if (!bodyPartsRes.ok) {
      throw new Error(`Erro ${bodyPartsRes.status}: ${bodyPartsRes.statusText}`);
    }
    
    const bodyParts = await bodyPartsRes.json();
    console.log('✅ Grupos musculares:', bodyParts);

    // Teste 2: Buscar exercícios de peito
    console.log('\n📋 Buscando exercícios de peito (limit 3)...');
    const exercisesRes = await fetch(
      `${EXERCISEDB_API_URL}/exercises/bodyPart/chest?limit=3`,
      { headers }
    );
    
    const exercises = await exercisesRes.json();
    exercises.forEach((ex: any) => {
      console.log(`  • ${ex.name} (${ex.equipment}) - Target: ${ex.target}`);
    });

    console.log('\n🎉 Integração funcionando perfeitamente!');
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error);
  }
}

testConnection();
