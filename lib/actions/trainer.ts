/**
 * Re-exporta todas as Server Actions do trainer mantendo
 * compatibilidade com imports existentes.
 *
 * Lógica está em:
 *   lib/actions/trainer/assessments.ts
 *   lib/actions/trainer/workout-plans.ts
 *   lib/actions/trainer/dashboard.ts
 */

export { scheduleAssessment, completeAssessment } from './trainer/assessments'

export {
  createWorkoutPlan,
  createCustomWorkoutPlan,
  updateCustomWorkoutPlan,
  deleteWorkoutPlan,
} from './trainer/workout-plans'

export type {
  CustomExerciseInput,
  CustomDayInput,
  CustomPlanStructure,
} from './trainer/workout-plans'

export { getTrainerDashboardData } from './trainer/dashboard'
