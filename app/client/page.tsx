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
import { BottomNav } from "./_components/BottomNav"

export default function ClientDashboard() {
  const router = useRouter()
  const dashboard = useClientDashboard()

  const {
    userName,
    profile,
    isLoading,
    logoutLoading,
    isPending,
    activeTab,
    setActiveTab,
    trainerName,
    activePlan,
    planDays,
    dayExercises,
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
    pendingAssessments,
    doneAssessments,
    totalMin,
    hasOnboarding,
    weekDays,
    weekCompleted,
    currentStreak,
    bestStreak,
    xp,
    userLevel,
    nextProgressiveQuestion,
    progressiveProgress,
    fmt,
    handleStartWorkout,
    handleStopWorkout,
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
          handleStopWorkout={handleStopWorkout}
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
              bestStreak={bestStreak}
              hasOnboarding={hasOnboarding}
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
              sessions={sessions}
              totalMin={totalMin}
              habits={habits}
              completedHabits={completedHabits}
              habitPct={habitPct}
              toggleHabit={toggleHabit}
              weekDays={weekDays}
              weekCompleted={weekCompleted}
              pendingAssessments={pendingAssessments}
              doneAssessments={doneAssessments}
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
              isExercisesLoading={isExercisesLoading}
              sessions={sessions}
              isTimerRunning={isTimerRunning}
              timerSeconds={timerSeconds}
              activeWorkoutDayId={activeWorkoutDayId}
              isPending={isPending}
              fmt={fmt}
              handleStartWorkout={handleStartWorkout}
              handleStopWorkout={handleStopWorkout}
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
