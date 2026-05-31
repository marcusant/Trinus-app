// scripts/listEquipments.ts

import { config } from 'dotenv';
config({ path: '.env.local' });

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;

const API_BASE = 'https://exercisedb.p.rapidapi.com';
const headers = {
  'X-RapidAPI-Key': RAPIDAPI_KEY,
  'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
};

async function listEquipments() {
  console.log('🏋️ Buscando lista de equipamentos...\n');

  const res = await fetch(`${API_BASE}/exercises/equipmentList`, { headers });
  if (!res.ok) throw new Error(`Erro ao buscar equipmentList: ${res.status}`);

  const equipments: string[] = await res.json();

  console.log('📋 Equipamentos disponíveis na API:\n');
  equipments.forEach((eq, i) => {
    console.log(`   ${i + 1}. ${eq}`);
  });

  console.log(`\n═══════════════════════════════════`);
  console.log(`   Total: ${equipments.length} equipamentos`);
  console.log(`═══════════════════════════════════`);
}

// Executar
listEquipments()
  .then(() => {
    console.log('\n🎉 Listagem concluída!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n💥 Erro fatal:', err);
    process.exit(1);
  });
