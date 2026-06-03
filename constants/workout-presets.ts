/**
 * Presets de treino usados tanto pelas Server Actions (criação no DB)
 * quanto pelo editor do trainer (sugestões de combos).
 *
 * Fonte única de verdade — não duplicar em hooks ou actions.
 */

export interface PresetExercise {
  exercise_id: string
  sets: number
  reps: string
  rest_seconds: number
  notes: string
}

export interface PresetDay {
  name: string
  day_number: number
  focus: string
  exercises: PresetExercise[]
}

export type PresetKey = "hipertrofia" | "emagrecimento" | "funcional_casa"

export const WORKOUT_PRESETS: Record<PresetKey, PresetDay[]> = {
  hipertrofia: [
    {
      name: "Dia A - Push (Peito, Ombros, Tríceps)",
      day_number: 1,
      focus: "Hipertrofia - Empurrar",
      exercises: [
        { exercise_id: "475acb10-f5cd-46a3-8080-8ec717aa707f", sets: 4, reps: "10-12", rest_seconds: 90, notes: "Foco na amplitude e controle no supino" },
        { exercise_id: "577c90da-2601-4824-9f48-b3f3c6e7bc74", sets: 3, reps: "10-12", rest_seconds: 90, notes: "Manter postura ereta no desenvolvimento" },
        { exercise_id: "7562d60c-a085-482c-8583-26f2968bcaf7", sets: 3, reps: "12-15", rest_seconds: 60, notes: "Foco na contração de pico no tríceps corda" },
      ],
    },
    {
      name: "Dia B - Pull (Costas e Bíceps)",
      day_number: 2,
      focus: "Hipertrofia - Puxar",
      exercises: [
        { exercise_id: "952005b7-9f0a-4e6d-90af-1b0953c5e9fe", sets: 4, reps: "8-10",  rest_seconds: 90, notes: "Barra fixa, controle a descida" },
        { exercise_id: "e1b12943-a5bc-43dc-838c-6c34d459d0e1", sets: 3, reps: "10-12", rest_seconds: 90, notes: "Remada curvada, coluna neutra" },
        { exercise_id: "a6f29601-da28-4019-9a65-307eb6799475", sets: 3, reps: "10-12", rest_seconds: 60, notes: "Rosca direta sem balançar o corpo" },
      ],
    },
    {
      name: "Dia C - Legs & Core (Pernas e Abdominais)",
      day_number: 3,
      focus: "Hipertrofia - Pernas e Core",
      exercises: [
        { exercise_id: "cff3c1f7-465f-41e7-8ee9-d008f3affa3c", sets: 4, reps: "10",   rest_seconds: 90, notes: "Agachamento profundo e controlado" },
        { exercise_id: "11a4ab9b-4177-4283-9a10-ab012ce6bb37", sets: 3, reps: "12",   rest_seconds: 90, notes: "Leg Press 45, empurre com calcanhares" },
        { exercise_id: "4f7c0cf4-4661-46bf-8ef7-352dc2dc7426", sets: 3, reps: "60s",  rest_seconds: 60, notes: "Manter prancha firme" },
      ],
    },
  ],

  emagrecimento: [
    {
      name: "Dia A - Cardio HIIT & Core",
      day_number: 1,
      focus: "Gasto Calórico e Core",
      exercises: [
        { exercise_id: "34d08c36-f394-4e13-b177-9f30e4f36716", sets: 1, reps: "20 min", rest_seconds: 0,  notes: "Corrida na esteira com variação de intensidade" },
        { exercise_id: "df1c99ab-09dd-4149-aff7-9bee606c505f", sets: 3, reps: "20",     rest_seconds: 45, notes: "Bicicleta abdominal controlada" },
        { exercise_id: "4f7c0cf4-4661-46bf-8ef7-352dc2dc7426", sets: 3, reps: "60s",    rest_seconds: 60, notes: "Prancha frontal, core contraído" },
      ],
    },
    {
      name: "Dia B - Força Funcional",
      day_number: 2,
      focus: "Tonificação Muscular Geral",
      exercises: [
        { exercise_id: "55e90237-cc44-4a09-85d9-b2fd528ee7b5", sets: 3, reps: "Máximo", rest_seconds: 60, notes: "Flexão de braços com corpo alinhado" },
        { exercise_id: "cff3c1f7-465f-41e7-8ee9-d008f3affa3c", sets: 3, reps: "15",     rest_seconds: 60, notes: "Agachamento com barra, descer bem" },
        { exercise_id: "e1b12943-a5bc-43dc-838c-6c34d459d0e1", sets: 3, reps: "12",     rest_seconds: 60, notes: "Remada curvada para dorsal" },
      ],
    },
    {
      name: "Dia C - Definição Muscular",
      day_number: 3,
      focus: "Resistência Muscular e Core",
      exercises: [
        { exercise_id: "475acb10-f5cd-46a3-8080-8ec717aa707f", sets: 3, reps: "15",      rest_seconds: 60, notes: "Supino reto com cadência lenta" },
        { exercise_id: "a6f29601-da28-4019-9a65-307eb6799475", sets: 3, reps: "15",      rest_seconds: 60, notes: "Rosca direta para bíceps" },
        { exercise_id: "c517a7b9-ab14-427f-b7a4-4eb91b16c35b", sets: 3, reps: "30s/lado",rest_seconds: 45, notes: "Prancha lateral, elevar quadril" },
      ],
    },
  ],

  funcional_casa: [
    {
      name: "Dia A - Superiores & Core (Peso Corporal)",
      day_number: 1,
      focus: "Força Corporal e Core",
      exercises: [
        { exercise_id: "55e90237-cc44-4a09-85d9-b2fd528ee7b5", sets: 4, reps: "12-15",    rest_seconds: 60, notes: "Flexão de braços convencional" },
        { exercise_id: "4f7c0cf4-4661-46bf-8ef7-352dc2dc7426", sets: 4, reps: "45s",       rest_seconds: 45, notes: "Prancha frontal firme" },
        { exercise_id: "c517a7b9-ab14-427f-b7a4-4eb91b16c35b", sets: 3, reps: "30s/lado",  rest_seconds: 45, notes: "Prancha lateral sustentada" },
      ],
    },
    {
      name: "Dia B - Inferiores & Cardio (Casa/Ar Livre)",
      day_number: 2,
      focus: "Resistência Muscular e Aeróbica",
      exercises: [
        { exercise_id: "cff3c1f7-465f-41e7-8ee9-d008f3affa3c", sets: 4, reps: "20 (Peso Corporal)", rest_seconds: 60, notes: "Agachamento com peso corporal contínuo" },
        { exercise_id: "df1c99ab-09dd-4149-aff7-9bee606c505f", sets: 3, reps: "20",                  rest_seconds: 45, notes: "Bicicleta abdominal rápida" },
        { exercise_id: "37ec7019-cb87-4d35-acdd-07ac8bff48ac", sets: 1, reps: "15 min",              rest_seconds: 0,  notes: "Corrida contínua ao ar livre" },
      ],
    },
  ],
}
