// app/client/page.tsx — Orquestrador Puro do Painel do Aluno
"use client"

import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useClientDashboard, PROGRESSIVE_QUESTIONS } from "./_hooks/useClientDashboard"

// Sub-components
import { ClientSidebar } from "./_components/ClientSidebar"
import { ClientHeader } from "./_components/ClientHeader"
import { DashboardTab } from "./_components/DashboardTab"
import { TreinosTab } from "./_components/TreinosTab"
import { AlimentacaoTab } from "./_components/AlimentacaoTab"
import { ProgressoTab } from "./_components/ProgressoTab"
import { PerfilTab } from "./_components/PerfilTab"
import { CheckInModal } from "./_components/CheckInModal"
import { WorkoutTimer } from "./_components/WorkoutTimer"
import { RestTimerBar } from "./_components/RestTimerBar"
import { WorkoutSummary } from "./_components/WorkoutSummary"
import { BottomNav } from "./_components/BottomNav"

export default function ClientDashboard() {
  const router = useRouter()
  const dashboard = useClientDashboard()

  const {
    userName,
    profile,
    isLoading,
    hasAnamnese,
    logoutLoading,
    isPending,
    activeTab,
    setActiveTab,
    trainerName,
    activePlan,
    planDays,
    dayExercises,
    previousSets,
    selectedDayId,
    setSelectedDayId,
    sessions,
    assessments,
    checkIns,
    progressiveLogs,
    questionValue,
    setQuestionValue,
    isSubmittingQuestion,
    activeMealPlan,
    mealDays,
    selectedMealDayId,
    setSelectedMealDayId,
    dayMeals,
    isMealsLoading,
    isTimerRunning,
    timerSeconds,
    activeWorkoutDayId,
    workoutLogs,
    updateSet,
    toggleSet,
    setRpe,
    addSet,
    removeSet,
    restIsResting,
    restRemaining,
    restTotal,
    startRest,
    addRestTime,
    skipRest,
    showCheckInModal,
    setShowCheckInModal,
    checkInWeight,
    setCheckInWeight,
    checkInNotes,
    setCheckInNotes,
    checkInMood,
    setCheckInMood,
    checkInEnergy,
    setCheckInEnergy,
    isExercisesLoading,
    habits,
    toggleHabit,
    completedHabits,
    habitPct,
    totalMin,
    hasOnboarding,
    weekDays,
    weekCompleted,
    currentStreak,
    xp,
    userLevel,
    nextProgressiveQuestion,
    progressiveProgress,
    fmt,
    handleStartWorkout,
    handleFinishWorkout,
    workoutSummary,
    handleSaveWorkout,
    handleDiscardWorkout,
    handleCheckInSubmit,
    handleProgressiveSubmit,
    handleLogout,
  } = dashboard

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground font-semibold">A carregar o teu painel...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex relative">

      {/* Desktop Sidebar */}
      <ClientSidebar
        userName={userName}
        email={profile?.email || ""}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab)
          if (tab === "treino" && planDays[0] && !selectedDayId) {
            setSelectedDayId(planDays[0].id)
          }
        }}
        logoutLoading={logoutLoading}
        handleLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 xl:pl-64 min-h-screen pb-24 xl:pb-8 flex flex-col w-full">

        {/* Floating Workout Timer */}
        <WorkoutTimer
          isTimerRunning={isTimerRunning}
          timerSeconds={timerSeconds}
          isPending={isPending}
          fmt={fmt}
          handleFinishWorkout={handleFinishWorkout}
        />

        {/* Barra de descanso (contagem decrescente, estilo Hevy) */}
        <RestTimerBar
          isResting={restIsResting}
          restRemaining={restRemaining}
          restTotal={restTotal}
          addRestTime={addRestTime}
          skipRest={skipRest}
        />

        {/* Header (Mobile + Desktop) */}
        <ClientHeader
          userName={userName}
          userLevel={userLevel}
          trainerName={trainerName}
          logoutLoading={logoutLoading}
          handleLogout={handleLogout}
        />

        {/* Main Body */}
        <main className="px-4 xl:px-8 mx-auto w-full max-w-5xl space-y-6 flex-1">

          {activeTab === "dashboard" && (
            <DashboardTab
              xp={xp}
              userLevel={userLevel}
              currentStreak={currentStreak}
              hasOnboarding={hasOnboarding}
              hasAnamnese={hasAnamnese}
              progressiveProgress={progressiveProgress}
              progressiveLogs={progressiveLogs}
              totalQuestions={PROGRESSIVE_QUESTIONS.length}
              nextProgressiveQuestion={nextProgressiveQuestion}
              questionValue={questionValue}
              setQuestionValue={setQuestionValue}
              isSubmittingQuestion={isSubmittingQuestion}
              handleProgressiveSubmit={handleProgressiveSubmit}
              onGoToOnboarding={() => router.push("/onboarding")}
              activePlan={activePlan}
              planDays={planDays}
              habits={habits}
              completedHabits={completedHabits}
              habitPct={habitPct}
              toggleHabit={toggleHabit}
              weekDays={weekDays}
              weekCompleted={weekCompleted}
              setActiveTab={setActiveTab}
              setSelectedDayId={setSelectedDayId}
              setShowCheckInModal={setShowCheckInModal}
            />
          )}

          {activeTab === "treino" && (
            <TreinosTab
              profile={profile}
              trainerName={trainerName}
              activePlan={activePlan}
              planDays={planDays}
              selectedDayId={selectedDayId}
              setSelectedDayId={setSelectedDayId}
              dayExercises={dayExercises}
              previousSets={previousSets}
              isExercisesLoading={isExercisesLoading}
              sessions={sessions}
              isTimerRunning={isTimerRunning}
              timerSeconds={timerSeconds}
              activeWorkoutDayId={activeWorkoutDayId}
              isPending={isPending}
              fmt={fmt}
              handleStartWorkout={handleStartWorkout}
              handleFinishWorkout={handleFinishWorkout}
              workoutLogs={workoutLogs}
              updateSet={updateSet}
              toggleSet={toggleSet}
              setRpe={setRpe}
              addSet={addSet}
              removeSet={removeSet}
              startRest={startRest}
            />
          )}

          {activeTab === "alimentacao" && (
            <AlimentacaoTab
              activeMealPlan={activeMealPlan}
              mealDays={mealDays}
              selectedMealDayId={selectedMealDayId}
              setSelectedMealDayId={setSelectedMealDayId}
              dayMeals={dayMeals}
              isMealsLoading={isMealsLoading}
            />
          )}

          {activeTab === "progresso" && (
            <ProgressoTab
              sessions={sessions}
              checkIns={checkIns}
              assessments={assessments}
              memberSince={profile?.created_at || ""}
              xp={xp}
              totalMin={totalMin}
              currentStreak={currentStreak}
              isPending={isPending}
              setShowCheckInModal={setShowCheckInModal}
            />
          )}

          {activeTab === "perfil" && (
            <PerfilTab
              userName={userName}
              profile={profile}
              userLevel={userLevel}
              xp={xp}
              currentStreak={currentStreak}
              sessions={sessions}
              trainerName={trainerName}
              hasOnboarding={hasOnboarding}
              hasAnamnese={hasAnamnese}
              onGoToOnboarding={() => router.push("/onboarding")}
            />
          )}

        </main>

        {/* Global Check-in Modal */}
        <CheckInModal
          showCheckInModal={showCheckInModal}
          setShowCheckInModal={setShowCheckInModal}
          checkInWeight={checkInWeight}
          setCheckInWeight={setCheckInWeight}
          checkInNotes={checkInNotes}
          setCheckInNotes={setCheckInNotes}
          checkInMood={checkInMood}
          setCheckInMood={setCheckInMood}
          checkInEnergy={checkInEnergy}
          setCheckInEnergy={setCheckInEnergy}
          isPending={isPending}
          handleCheckInSubmit={handleCheckInSubmit}
        />

        {/* Ecrã de resumo do treino (estilo Hevy) */}
        <WorkoutSummary
          summary={workoutSummary}
          defaultTitle={(() => {
            const d = workoutSummary ? planDays.find(pd => pd.id === workoutSummary.dayId) : null
            return d?.name || (d ? `Dia ${d.day_number}` : "Treino")
          })()}
          isPending={isPending}
          fmt={fmt}
          onSave={handleSaveWorkout}
          onDiscard={handleDiscardWorkout}
        />

      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        planDays={planDays}
        selectedDayId={selectedDayId}
        setSelectedDayId={setSelectedDayId}
      />
    </div>
  )
}
