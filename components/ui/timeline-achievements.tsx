"use client"

import { Calendar, Award, Flame, Dumbbell, UserCheck, CheckCircle2, Trophy, Star } from "lucide-react"

interface WorkoutSession {
  id: string
  started_at: string
  finished_at: string
  duration_seconds: number
  workout_day_id: string
}

interface CheckIn {
  id: string
  date: string
  weight_kg: number | null
  notes: string | null
  created_at: string
  mood?: number | null
  energy_level?: number | null
}

interface TimelineAchievementsProps {
  sessions: WorkoutSession[]
  checkIns: CheckIn[]
  memberSince: string // ISO string or date
  currentXP: number
}

interface Achievement {
  id: string
  title: string
  description: string
  date: Date
  icon: React.ReactNode
  colorClass: string
  badgeText?: string
}

export function TimelineAchievements({
  sessions,
  checkIns,
  memberSince,
  currentXP,
}: TimelineAchievementsProps) {
  // Generate achievements dynamically
  const achievements: Achievement[] = []

  const joinDate = memberSince ? new Date(memberSince) : new Date()

  // 1. Join Achievement
  achievements.push({
    id: "join",
    title: "Membro Fundador",
    description: "Juntou-se à elite da equipa TRINUS. Começa a jornada!",
    date: joinDate,
    icon: <Calendar className="h-4 w-4" />,
    colorClass: "bg-purple-500/10 border-purple-500/30 text-purple-400",
  })

  // Sort sessions chronological for milestones
  const chronSessions = [...sessions].sort(
    (a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
  )

  // 2. First Workout
  if (chronSessions.length > 0) {
    achievements.push({
      id: "first_workout",
      title: "Primeiro Passo",
      description: "Concluiu o seu primeiro treino. O primeiro de muitos!",
      date: new Date(chronSessions[0].started_at),
      icon: <Dumbbell className="h-4 w-4" />,
      colorClass: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    })
  }

  // 3. Workout Milestones: 5, 10, 25, 50, 100
  const workoutMilestones = [5, 10, 25, 50, 100]
  workoutMilestones.forEach((milestone) => {
    if (chronSessions.length >= milestone) {
      achievements.push({
        id: `workout_${milestone}`,
        title: `Consistência Nível ${milestone}`,
        description: `Completou com sucesso ${milestone} sessões de treino!`,
        date: new Date(chronSessions[milestone - 1].started_at),
        icon: <Trophy className="h-4 w-4" />,
        colorClass: "bg-amber-500/10 border-amber-500/30 text-amber-400",
        badgeText: `${milestone} Treinos`,
      })
    }
  })

  // Sort check-ins chronological
  const chronCheckIns = [...checkIns].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // 4. First Check-in
  if (chronCheckIns.length > 0) {
    achievements.push({
      id: "first_checkin",
      title: "Compromisso Inicial",
      description: "Registou o seu primeiro check-in de progresso físico e humor.",
      date: new Date(chronCheckIns[0].date),
      icon: <UserCheck className="h-4 w-4" />,
      colorClass: "bg-green-500/10 border-green-500/30 text-green-400",
    })
  }

  // 5. XP Levels achieved (approximate dates based on Nth sessions/check-ins)
  // Bronze: 0 XP
  // Prata: 500 XP
  // Ouro: 1500 XP
  // Platina: 3000 XP
  // Diamante: 6000 XP
  const levelMilestones = [
    { xp: 500, name: "Prata", icon: "🥈", color: "text-zinc-300", colorClass: "bg-zinc-500/10 border-zinc-500/30 text-zinc-300" },
    { xp: 1500, name: "Ouro", icon: "🥇", color: "text-amber-400", colorClass: "bg-amber-500/10 border-amber-500/30 text-amber-400" },
    { xp: 3000, name: "Platina", icon: "🏆", color: "text-slate-200", colorClass: "bg-slate-500/10 border-slate-500/30 text-slate-200" },
    { xp: 6000, name: "Diamante", icon: "💎", color: "text-cyan-400", colorClass: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" },
  ]

  levelMilestones.forEach((lvl) => {
    if (currentXP >= lvl.xp) {
      // Find approximate date: when workouts + check-ins sum to this XP
      // Workout = 100 XP, CheckIn = 20 XP
      let runningXP = 0
      let achDate = joinDate

      const allEvents = [
        ...chronSessions.map((s) => ({ date: new Date(s.started_at), xp: 100 })),
        ...chronCheckIns.map((c) => ({ date: new Date(c.date), xp: 20 })),
      ].sort((a, b) => a.date.getTime() - b.date.getTime())

      for (const ev of allEvents) {
        runningXP += ev.xp
        if (runningXP >= lvl.xp) {
          achDate = ev.date
          break
        }
      }

      achievements.push({
        id: `level_${lvl.name.toLowerCase()}`,
        title: `Nível ${lvl.name} Atingido`,
        description: `Subiu de nível ao ultrapassar a marca de ${lvl.xp} XP no TRINUS!`,
        date: achDate,
        icon: <Star className="h-4 w-4" />,
        colorClass: lvl.colorClass,
        badgeText: `${lvl.icon} ${lvl.name}`,
      })
    }
  })

  // Sort achievements: most recent first
  const sortedAchievements = achievements.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  )

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-card/40 p-4 sm:p-6 backdrop-blur-sm shadow-glow-whisper">
      <div className="flex items-center gap-2 mb-6">
        <Award className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-sm font-bold text-foreground">Timeline de Conquistas</h3>
          <p className="text-[10px] text-muted-foreground">O registo visual do seu progresso e marcos atingidos</p>
        </div>
      </div>

      {sortedAchievements.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-xs text-muted-foreground">Sem conquistas registadas ainda. Continue ativo!</p>
        </div>
      ) : (
        <div className="relative border-l border-white/5 pl-4 sm:pl-6 ml-2 sm:ml-3 space-y-6">
          {sortedAchievements.map((ach) => (
            <div key={ach.id} className="relative group">
              {/* Point on timeline */}
              <div 
                className={`absolute -left-[27px] sm:-left-[35px] top-0.5 flex items-center justify-center w-6 sm:w-8 h-6 sm:h-8 rounded-lg border bg-black shadow-glow-whisper transition-all duration-300 group-hover:scale-110 ${ach.colorClass}`}
              >
                {ach.icon}
              </div>

              {/* Achievement Content */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-bold text-foreground leading-none">
                      {ach.title}
                    </h4>
                    {ach.badgeText && (
                      <span className="text-[9px] font-semibold bg-white/5 border border-white/5 px-2 py-0.5 rounded-full text-foreground">
                        {ach.badgeText}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                    {formatDate(ach.date)}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed max-w-xl">
                  {ach.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
