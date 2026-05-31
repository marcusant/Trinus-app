// lib/exercisedb-service.ts
import { env } from '@/lib/env';

// ============================================
// TIPOS
// ============================================

export interface ExerciseDB {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  secondaryMuscles: string[];
  instructions: string[];
}

export interface ExerciseSimplified {
  id: string;
  name: string;
  target: string;
  equipment: string;
}

// ============================================
// MAPEAMENTO DE EQUIPAMENTOS POR LOCAL
// ============================================

const EQUIPMENT_BY_LOCAL: Record<string, string[]> = {
  ginasio: [
    'barbell', 'dumbbell', 'cable', 'leverage machine', 'smith machine',
    'ez barbell', 'olympic barbell', 'trap bar', 'kettlebell',
    'medicine ball', 'stability ball', 'resistance band', 'body weight',
    'assisted', 'band', 'bosu ball', 'hammer', 'roller', 'rope',
    'sled machine', 'tire', 'weighted', 'wheel roller'
  ],
  casa: [
    'body weight', 'dumbbell', 'resistance band', 'stability ball',
    'kettlebell', 'band', 'roller', 'wheel roller', 'medicine ball'
  ],
  ar_livre: [
    'body weight', 'resistance band', 'band'
  ]
};

// ============================================
// BODYPARTS VÁLIDOS NO EXERCISEDB
// ============================================

export const VALID_BODYPARTS = [
  'back', 'cardio', 'chest', 'lower arms', 'lower legs',
  'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'
] as const;

export type BodyPart = typeof VALID_BODYPARTS[number];

// Mapeamento de aliases (o que o Gemini pode retornar → bodyPart real)
const BODYPART_ALIASES: Record<string, BodyPart> = {
  'back': 'back',
  'costas': 'back',
  'chest': 'chest',
  'peito': 'chest',
  'peitoral': 'chest',
  'shoulders': 'shoulders',
  'ombros': 'shoulders',
  'deltoids': 'shoulders',
  'triceps': 'upper arms',
  'biceps': 'upper arms',
  'upper arms': 'upper arms',
  'braços': 'upper arms',
  'arms': 'upper arms',
  'forearms': 'lower arms',
  'lower arms': 'lower arms',
  'antebraços': 'lower arms',
  'legs': 'upper legs',
  'upper legs': 'upper legs',
  'quadriceps': 'upper legs',
  'hamstrings': 'upper legs',
  'glutes': 'upper legs',
  'pernas': 'upper legs',
  'coxas': 'upper legs',
  'glúteos': 'upper legs',
  'calves': 'lower legs',
  'lower legs': 'lower legs',
  'panturrilhas': 'lower legs',
  'core': 'waist',
  'waist': 'waist',
  'abs': 'waist',
  'abdomen': 'waist',
  'abdominal': 'waist',
  'cardio': 'cardio',
  'neck': 'neck',
  'pescoço': 'neck'
};

// ============================================
// CACHE EM MEMÓRIA (por bodyPart)
// ============================================

const exerciseCache = new Map<string, { data: ExerciseDB[]; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hora

// ============================================
// FUNÇÕES PRINCIPAIS
// ============================================

/**
 * Normaliza bodyPart para o formato do ExerciseDB
 */
export function normalizeBodyPart(input: string): BodyPart | null {
  const normalized = input.toLowerCase().trim();
  return BODYPART_ALIASES[normalized] || null;
}

/**
 * Busca exercícios por bodyPart com cache
 */
export async function fetchExercisesByBodyPart(bodyPart: BodyPart): Promise<ExerciseDB[]> {
  const cacheKey = bodyPart;
  const cached = exerciseCache.get(cacheKey);
  
  // Retorna cache se válido
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // Busca na API
  const API_KEY = env.RAPIDAPI_KEY;


  
  const response = await fetch(
    `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}?limit=100`,
    {
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`ExerciseDB error: ${response.status}`);
  }

  const exercises: ExerciseDB[] = await response.json();
  
  // Guarda no cache
  exerciseCache.set(cacheKey, { data: exercises, timestamp: Date.now() });
  
  return exercises;
}

/**
 * Busca exercícios para múltiplos bodyParts em paralelo
 */
export async function fetchExercisesForBodyParts(
  bodyParts: string[],
  local: string = 'ginasio'
): Promise<Record<string, ExerciseSimplified[]>> {
  
  const allowedEquipment = EQUIPMENT_BY_LOCAL[local] || EQUIPMENT_BY_LOCAL.ginasio;
  const result: Record<string, ExerciseSimplified[]> = {};
  
  // Normaliza e deduplica bodyParts
  const normalizedParts = [...new Set(
    bodyParts
      .map(bp => normalizeBodyPart(bp))
      .filter((bp): bp is BodyPart => bp !== null)
  )];



  // Busca em paralelo
  const promises = normalizedParts.map(async (bodyPart) => {
    try {
      const exercises = await fetchExercisesByBodyPart(bodyPart);
      
      // Filtra por equipamento e simplifica
      const filtered = exercises
        .filter(ex => allowedEquipment.includes(ex.equipment))
        .slice(0, 20) // Limita a 20 por grupo
        .map(ex => ({
          id: ex.id,
          name: ex.name,
          target: ex.target,
          equipment: ex.equipment
        }));

      return { bodyPart, exercises: filtered };
    } catch (error) {
      console.error(`❌ Erro ao buscar ${bodyPart}:`, error);
      return { bodyPart, exercises: [] };
    }
  });

  const results = await Promise.all(promises);
  
  for (const { bodyPart, exercises } of results) {
    result[bodyPart] = exercises;

  }

  return result;
}

/**
 * Formata exercícios para o prompt do Gemini
 */
export function formatExercisesForPrompt(
  exercisesByBodyPart: Record<string, ExerciseSimplified[]>
): string {
  let output = '';
  
  for (const [bodyPart, exercises] of Object.entries(exercisesByBodyPart)) {
    if (exercises.length === 0) continue;
    
    output += `\n### ${bodyPart.toUpperCase()}\n`;
    exercises.forEach(ex => {
      output += `- ${ex.name} (${ex.equipment}) [target: ${ex.target}]\n`;
    });
  }
  
  return output || 'Nenhum exercício encontrado.';
}
