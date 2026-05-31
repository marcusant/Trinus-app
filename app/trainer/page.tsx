// app/trainer/page.tsx
"use client"

import { useTrainerDashboard } from "./_hooks/useTrainerDashboard"
import { TrainerSidebar } from "./_components/TrainerSidebar"
import { TrainerHeader } from "./_components/TrainerHeader"
import { DashboardTab } from "./_components/DashboardTab"
import { ClientsTab } from "./_components/ClientsTab"
import { AssessmentsTab } from "./_components/AssessmentsTab"
import { ScheduleModal } from "./_components/ScheduleModal"
import { PrescribeModal } from "./_components/PrescribeModal"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function TrainerDashboard() {
  const {
    // states
    trainerName,
    isLoading,
    logoutLoading,
    isPending,
    activeTab,
    setActiveTab,

    // Clients
    clients,
    filteredClients,
    clientSearch,
    setClientSearch,
    selectedClient,
    setSelectedClient,

    // Client Details
    clientSessions,
    clientAssessments,
    clientPlans,
    isClientDetailsLoading,

    // Assessments
    pendingAssessments,
    completedAssessments,
    completingAssessmentId,
    setCompletingAssessmentId,
    completeNotes,
    setCompleteNotes,

    // Stats
    trainerPlansCount,

    // Schedule Assessment Modal
    showScheduleModal,
    setShowScheduleModal,
    scheduleDate,
    setScheduleDate,
    scheduleNotes,
    setScheduleNotes,

    // Prescribe Workout Modal
    showPrescribeModal,
    setShowPrescribeModal,
    planName,
    setPlanName,
    planStartDate,
    setPlanStartDate,
    presetType,
    setPresetType,

    // Wizard details
    createStep,
    setCreateStep,
    editingPlan,
    setEditingPlan,
    exercisesLibrary,
    localStructure,
    setLocalStructure,
    activeDayIndex,
    setActiveDayIndex,
    searchQuery,
    setSearchQuery,
    showSearchDropdown,
    setShowSearchDropdown,
    focusedDayIdxForSearch,
    setFocusedDayIdxForSearch,
    draggedExIndex,
    setDraggedExIndex,

    // Handlers
    handleLogout,
    handleScheduleSubmit,
    handleCompleteSubmit,
    handleAddExerciseToDay,
    handleRemoveExerciseFromDay,
    handleReorderExercises,
    handleMoveExercise,
    handleEditExerciseField,
    handleApplyComboToDay,
    handleEditPlan,
    handleDeletePlan,
    handlePrescribeSubmit,
  } = useTrainerDashboard()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col xl:flex-row relative">
      <TrainerSidebar
        trainerName={trainerName}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        logoutLoading={logoutLoading}
        isLoading={isLoading}
        handleLogout={handleLogout}
      />

      <div className="flex-1 xl:pl-64 min-h-screen pb-24 xl:pb-8 flex flex-col w-full">
        <TrainerHeader
          trainerName={trainerName}
          logoutLoading={logoutLoading}
          isLoading={isLoading}
          handleLogout={handleLogout}
        />

        {isLoading ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-muted-foreground animate-pulse">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm font-semibold">Sincronizando com a base de dados Supabase...</span>
          </div>
        ) : (
          <main className="px-4 xl:px-8 py-6 mx-auto w-full max-w-5xl space-y-8 flex-1">
            {activeTab === "dashboard" && (
              <DashboardTab
                clients={clients}
                pendingAssessments={pendingAssessments}
                trainerPlansCount={trainerPlansCount}
                isPending={isPending}
                onViewClient={(client) => {
                  setSelectedClient(client)
                  setActiveTab("clients")
                }}
                onCompleteAssessment={(id, notes) => {
                  setCompletingAssessmentId(id)
                  setCompleteNotes(notes)
                  setActiveTab("assessments")
                }}
                onNavigateToClients={() => {
                  if (clients.length > 0) {
                    setSelectedClient(clients[0])
                    setActiveTab("clients")
                  } else {
                    toast.info("Não tem alunos vinculados para gerir.")
                  }
                }}
              />
            )}

            {activeTab === "clients" && (
              <ClientsTab
                filteredClients={filteredClients}
                clientSearch={clientSearch}
                setClientSearch={setClientSearch}
                selectedClient={selectedClient}
                setSelectedClient={setSelectedClient}
                isClientDetailsLoading={isClientDetailsLoading}
                clientSessions={clientSessions}
                clientPlans={clientPlans}
                clientAssessments={clientAssessments}
                onPrescriberTreino={() => {
                  setPlanStartDate(new Date().toISOString().split('T')[0])
                  setShowPrescribeModal(true)
                }}
                onAgendarAvaliacao={() => {
                  setScheduleDate(new Date().toISOString().substring(0, 16))
                  setShowScheduleModal(true)
                }}
                onEditPlan={handleEditPlan}
                onDeletePlan={handleDeletePlan}
              />
            )}

            {activeTab === "assessments" && (
              <AssessmentsTab
                completingAssessmentId={completingAssessmentId}
                setCompletingAssessmentId={setCompletingAssessmentId}
                completeNotes={completeNotes}
                setCompleteNotes={setCompleteNotes}
                pendingAssessments={pendingAssessments}
                completedAssessments={completedAssessments}
                isPending={isPending}
                handleCompleteSubmit={handleCompleteSubmit}
              />
            )}
          </main>
        )}
      </div>

      {showScheduleModal && selectedClient && (
        <ScheduleModal
          selectedClient={selectedClient}
          scheduleDate={scheduleDate}
          setScheduleDate={setScheduleDate}
          scheduleNotes={scheduleNotes}
          setScheduleNotes={setScheduleNotes}
          isPending={isPending}
          onSubmit={handleScheduleSubmit}
          onClose={() => setShowScheduleModal(false)}
        />
      )}

      {showPrescribeModal && selectedClient && (
        <PrescribeModal
          selectedClient={selectedClient}
          planName={planName}
          setPlanName={setPlanName}
          planStartDate={planStartDate}
          setPlanStartDate={setPlanStartDate}
          presetType={presetType}
          setPresetType={setPresetType}
          createStep={createStep}
          setCreateStep={setCreateStep}
          editingPlan={editingPlan}
          exercisesLibrary={exercisesLibrary}
          localStructure={localStructure}
          setLocalStructure={setLocalStructure}
          activeDayIndex={activeDayIndex}
          setActiveDayIndex={setActiveDayIndex}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showSearchDropdown={showSearchDropdown}
          setShowSearchDropdown={setShowSearchDropdown}
          focusedDayIdxForSearch={focusedDayIdxForSearch}
          setFocusedDayIdxForSearch={setFocusedDayIdxForSearch}
          draggedExIndex={draggedExIndex}
          setDraggedExIndex={setDraggedExIndex}
          isPending={isPending}
          onAddExercise={handleAddExerciseToDay}
          onRemoveExercise={handleRemoveExerciseFromDay}
          onReorderExercises={handleReorderExercises}
          onMoveExercise={handleMoveExercise}
          onEditExerciseField={handleEditExerciseField}
          onApplyCombo={handleApplyComboToDay}
          onSubmit={handlePrescribeSubmit}
          onClose={() => setShowPrescribeModal(false)}
        />
      )}
    </div>
  )
}
