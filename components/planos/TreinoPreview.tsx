// components/planos/TreinoPreview.tsx

"use client";

import { useState } from "react";
import type { PlanoTreinoEstruturado, DiaTreino, ExercicioTreino } from "@/types/planos-estruturados";

interface Props {
  plano: PlanoTreinoEstruturado;
}

// ============================================
// MAPEAMENTO GRUPO MUSCULAR
// ============================================

interface GrupoMuscularInfo {
  icon: string;
  grupo: string;
  cor: string;
  bgCard: string;
  bgBar: string;
  volumeMin: number;
  volumeMax: number;
}

const BODYPART_MAP: Record<string, GrupoMuscularInfo> = {
  chest: { icon: "🫁", grupo: "Peito", cor: "text-red-400", bgCard: "bg-red-500/20 border-red-500/30", bgBar: "bg-red-500", volumeMin: 10, volumeMax: 20 },
  back: { icon: "🔙", grupo: "Costas", cor: "text-green-400", bgCard: "bg-green-500/20 border-green-500/30", bgBar: "bg-green-500", volumeMin: 10, volumeMax: 20 },
  shoulders: { icon: "🎯", grupo: "Ombros", cor: "text-purple-400", bgCard: "bg-purple-500/20 border-purple-500/30", bgBar: "bg-purple-500", volumeMin: 8, volumeMax: 16 },
  "upper arms": { icon: "💪", grupo: "Braços", cor: "text-orange-400", bgCard: "bg-orange-500/20 border-orange-500/30", bgBar: "bg-orange-500", volumeMin: 8, volumeMax: 16 },
  "lower arms": { icon: "🦾", grupo: "Antebraços", cor: "text-amber-400", bgCard: "bg-amber-500/20 border-amber-500/30", bgBar: "bg-amber-500", volumeMin: 4, volumeMax: 10 },
  "upper legs": { icon: "🦵", grupo: "Pernas", cor: "text-blue-400", bgCard: "bg-blue-500/20 border-blue-500/30", bgBar: "bg-blue-500", volumeMin: 12, volumeMax: 22 },
  "lower legs": { icon: "🦶", grupo: "Panturrilhas", cor: "text-cyan-400", bgCard: "bg-cyan-500/20 border-cyan-500/30", bgBar: "bg-cyan-500", volumeMin: 6, volumeMax: 12 },
  waist: { icon: "🎯", grupo: "Core", cor: "text-pink-400", bgCard: "bg-pink-500/20 border-pink-500/30", bgBar: "bg-pink-500", volumeMin: 6, volumeMax: 12 },
  cardio: { icon: "❤️", grupo: "Cardio", cor: "text-rose-400", bgCard: "bg-rose-500/20 border-rose-500/30", bgBar: "bg-rose-500", volumeMin: 0, volumeMax: 0 },
  gluteos: { icon: "🍑", grupo: "Glúteos", cor: "text-fuchsia-400", bgCard: "bg-fuchsia-500/20 border-fuchsia-500/30", bgBar: "bg-fuchsia-500", volumeMin: 8, volumeMax: 16 },
};

const DEFAULT_GRUPO: GrupoMuscularInfo = {
  icon: "🏋️", grupo: "Geral", cor: "text-[rgba(245,240,235,0.45)]",
  bgCard: "bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]",
  bgBar: "bg-[#c8a96e]", volumeMin: 8, volumeMax: 16,
};

function getGrupoMuscular(nomeExercicio: string, foco?: string[]): GrupoMuscularInfo {
  const nome = nomeExercicio.toLowerCase();

  // Verificar no foco primeiro
  if (foco) {
    const focoStr = foco.join(" ").toLowerCase();
    if (focoStr.includes("glut") || focoStr.includes("glúteo")) return BODYPART_MAP["gluteos"];
    if (focoStr.includes("perna") || focoStr.includes("quadri") || focoStr.includes("posterior")) return BODYPART_MAP["upper legs"];
    if (focoStr.includes("peito")) return BODYPART_MAP["chest"];
    if (focoStr.includes("costa") || focoStr.includes("dorsal")) return BODYPART_MAP["back"];
    if (focoStr.includes("ombro") || focoStr.includes("deltoid")) return BODYPART_MAP["shoulders"];
    if (focoStr.includes("braço") || focoStr.includes("bíceps") || focoStr.includes("tríceps")) return BODYPART_MAP["upper arms"];
    if (focoStr.includes("core") || focoStr.includes("abdom")) return BODYPART_MAP["waist"];
  }

  // Glúteos
  if (nome.includes("glut") || nome.includes("hip thrust") || nome.includes("ponte") || nome.includes("kickback") || nome.includes("glúteo")) {
    return BODYPART_MAP["gluteos"];
  }
  // Pernas
  if (nome.includes("squat") || nome.includes("leg") || nome.includes("lunge") || nome.includes("deadlift") || 
      nome.includes("agachamento") || nome.includes("extensora") || nome.includes("flexora") || 
      nome.includes("stiff") || nome.includes("passada") || nome.includes("búlgaro") || nome.includes("terra") ||
      nome.includes("afundo") || nome.includes("rdl") || nome.includes("romeno") || nome.includes("cadeira")) {
    return BODYPART_MAP["upper legs"];
  }
  // Peito
  if (nome.includes("bench") || nome.includes("chest") || nome.includes("fly") || nome.includes("push") || 
      nome.includes("supino") || nome.includes("crucifixo") || nome.includes("peito") || nome.includes("crossover")) {
    return BODYPART_MAP["chest"];
  }
  // Costas
  if (nome.includes("row") || nome.includes("pull") || nome.includes("lat") || nome.includes("back") || 
      nome.includes("remada") || nome.includes("puxada") || nome.includes("pulley") || nome.includes("costas") || 
      nome.includes("barra fixa") || nome.includes("chin") || nome.includes("serrote")) {
    return BODYPART_MAP["back"];
  }
  // Ombros
  if (nome.includes("shoulder") || nome.includes("lateral") || nome.includes("delt") || 
      nome.includes("desenvolvimento") || nome.includes("elevação") || nome.includes("ombro") || 
      nome.includes("arnold") || nome.includes("face pull") || nome.includes("posterior") || nome.includes("frontal")) {
    return BODYPART_MAP["shoulders"];
  }
  // Braços
  if (nome.includes("curl") || nome.includes("bicep") || nome.includes("tricep") || nome.includes("arm") || 
      nome.includes("rosca") || nome.includes("bíceps") || nome.includes("tríceps") || nome.includes("francesa") || 
      nome.includes("martelo") || nome.includes("scott") || nome.includes("mergulho") || nome.includes("dip") ||
      nome.includes("testa") || nome.includes("corda") || nome.includes("concentr")) {
    return BODYPART_MAP["upper arms"];
  }
  // Panturrilhas
  if (nome.includes("calf") || nome.includes("calves") || nome.includes("panturrilha") || nome.includes("gêmeos")) {
    return BODYPART_MAP["lower legs"];
  }
  // Core
  if (nome.includes("crunch") || nome.includes("plank") || nome.includes("ab") || nome.includes("core") || 
      nome.includes("abdominal") || nome.includes("prancha") || nome.includes("oblíquo") || nome.includes("infra")) {
    return BODYPART_MAP["waist"];
  }
  // Cardio
  if (nome.includes("cardio") || nome.includes("run") || nome.includes("bike") || nome.includes("corrida") || 
      nome.includes("bicicleta") || nome.includes("elíptico") || nome.includes("esteira")) {
    return BODYPART_MAP["cardio"];
  }

  return DEFAULT_GRUPO;
}

// ============================================
// CÁLCULOS DE VOLUME
// ============================================

interface VolumeGrupo {
  grupo: string;
  icon: string;
  cor: string;
  bgBar: string;
  series: number;
  volumeMin: number;
  volumeMax: number;
  status: "baixo" | "ideal" | "alto";
}

function calcularVolumeSemanal(dias: DiaTreino[]): VolumeGrupo[] {
  const volumeMap: Record<string, { icon: string; cor: string; bgBar: string; series: number; volumeMin: number; volumeMax: number }> = {};

  dias.forEach((dia) => {
    dia.exercicios.forEach((ex) => {
      const grupoInfo = getGrupoMuscular(ex.nome, dia.foco);
      if (!volumeMap[grupoInfo.grupo]) {
        volumeMap[grupoInfo.grupo] = {
          icon: grupoInfo.icon, cor: grupoInfo.cor, bgBar: grupoInfo.bgBar, series: 0,
          volumeMin: grupoInfo.volumeMin, volumeMax: grupoInfo.volumeMax,
        };
      }
      volumeMap[grupoInfo.grupo].series += ex.series;
    });
  });

  return Object.entries(volumeMap)
    .map(([grupo, data]) => {
      let status: "baixo" | "ideal" | "alto" = "ideal";
      if (data.volumeMin > 0) {
        if (data.series < data.volumeMin) status = "baixo";
        else if (data.series > data.volumeMax) status = "alto";
      }
      return { grupo, ...data, status };
    })
    .sort((a, b) => b.series - a.series);
}

function calcularTotalSeries(dias: DiaTreino[]): number {
  return dias.reduce((total, dia) => total + dia.exercicios.reduce((t, ex) => t + ex.series, 0), 0);
}

// ============================================
// COMPONENTES
// ============================================

function VolumeSemanalCompact({ volumes, maxSeries }: { volumes: VolumeGrupo[]; maxSeries: number }) {
  const [expanded, setExpanded] = useState(false);
  const displayVolumes = expanded ? volumes : volumes.slice(0, 4);

  const getStatusIcon = (status: "baixo" | "ideal" | "alto") => {
    switch (status) {
      case "baixo": return "⚠️";
      case "alto": return "🔥";
      default: return "✅";
    }
  };

  return (
    <div className="p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[rgba(245,240,235,0.5)] font-medium uppercase tracking-wide">
          📊 Volume Semanal
        </span>
        <span className="text-xs text-[#c8a96e] font-bold">
          {volumes.reduce((t, v) => t + v.series, 0)} séries
        </span>
      </div>
      
      <div className="space-y-2">
        {displayVolumes.map((vol, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-sm w-5">{vol.icon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-xs font-medium ${vol.cor}`}>{vol.grupo}</span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px]">{getStatusIcon(vol.status)}</span>
                  <span className="text-xs text-[#f5f0eb]">{vol.series}</span>
                </div>
              </div>
              <div className="h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    vol.status === "baixo" ? "bg-yellow-500" : vol.status === "alto" ? "bg-orange-500" : vol.bgBar
                  }`}
                  style={{ width: `${Math.min((vol.series / maxSeries) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {volumes.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs text-[#c8a96e] hover:text-[#b8995e] transition-colors w-full text-center"
        >
          {expanded ? "Ver menos ↑" : `Ver mais ${volumes.length - 4} grupos ↓`}
        </button>
      )}

      {/* Legenda compacta */}
      <div className="flex justify-center gap-3 mt-3 pt-2 border-t border-[rgba(255,255,255,0.05)]">
        <span className="text-[10px] text-yellow-400">⚠️ Baixo</span>
        <span className="text-[10px] text-green-400">✅ Ideal</span>
        <span className="text-[10px] text-orange-400">🔥 Alto</span>
      </div>
    </div>
  );
}

function ExercicioCard({ ex, index, foco }: { ex: ExercicioTreino; index: number; foco: string[] }) {
  const [showObs, setShowObs] = useState(false);
  const { icon, grupo, bgCard, cor } = getGrupoMuscular(ex.nome, foco);

  return (
    <div className="p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl hover:border-purple-500/20 transition-colors">
      <div className="flex items-start justify-between gap-3">
        {/* Info do Exercício */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-5 bg-purple-500/20 text-purple-400 rounded text-xs font-bold flex items-center justify-center flex-shrink-0">
              {index + 1}
            </span>
            <h5 className="font-medium text-[#f5f0eb] leading-tight text-sm">
              {ex.nome}
            </h5>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap ml-7">
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${bgCard} ${cor}`}>
              {icon} {grupo}
            </span>
            {ex.equipamento && (
              <span className="text-[10px] text-[rgba(245,240,235,0.4)]">
                📍 {ex.equipamento}
              </span>
            )}
          </div>
        </div>

        {/* Métricas */}
        <div className="text-right flex-shrink-0">
          <span className="text-sm font-bold text-purple-400">
            {ex.series}x{ex.repeticoes}
          </span>
          <span className="block text-[10px] text-[rgba(245,240,235,0.4)]">
            ⏱ {ex.descanso_segundos}s
          </span>
        </div>
      </div>

      {/* Observação Expandível */}
      {ex.observacao && (
        <>
          <button
            onClick={() => setShowObs(!showObs)}
            className="mt-2 ml-7 text-[10px] text-[#c8a96e] hover:text-[#b8995e] flex items-center gap-1"
          >
            💡 {showObs ? "Ocultar dica" : "Ver dica de execução"}
          </button>
          {showObs && (
            <div className="mt-2 ml-7 p-2 bg-[rgba(200,169,110,0.1)] border border-[rgba(200,169,110,0.2)] rounded-lg">
              <p className="text-xs text-[#c8a96e] leading-relaxed">{ex.observacao}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export function TreinoPreview({ plano }: Props) {
  const [diaAtivo, setDiaAtivo] = useState(0);
  const [showVolume, setShowVolume] = useState(true);
  const diaAtual = plano.dias[diaAtivo];

  const volumesSemanal = calcularVolumeSemanal(plano.dias);
  const maxSeries = volumesSemanal.length > 0 ? Math.max(...volumesSemanal.map((v) => v.series), 20) : 20;
  const totalSeries = calcularTotalSeries(plano.dias);

  if (!diaAtual) return null;

  return (
    <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-purple-500/10 px-4 py-3 border-b border-[rgba(255,255,255,0.07)]">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-purple-400 flex items-center gap-2">
            🏋️ {plano.nome}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#c8a96e] font-medium">
              {totalSeries} sér/sem
            </span>
            <span className="text-xs text-[rgba(245,240,235,0.5)]">
              {plano.frequencia_semanal}x/sem · {plano.duracao_semanas} semanas
            </span>
          </div>
        </div>
      </div>

      {/* Toggle Volume */}
      <div className="px-4 py-2 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between">
        <button
          onClick={() => setShowVolume(!showVolume)}
          className="text-xs text-[rgba(245,240,235,0.5)] hover:text-[#c8a96e] transition-colors flex items-center gap-1"
        >
          📊 {showVolume ? "Ocultar volume" : "Ver volume semanal"}
        </button>
        <div className="flex items-center gap-2">
          {volumesSemanal.slice(0, 5).map((vol, i) => (
            <span key={i} className="text-sm" title={`${vol.grupo}: ${vol.series} séries`}>
              {vol.icon}
            </span>
          ))}
          {volumesSemanal.length > 5 && (
            <span className="text-[10px] text-[rgba(245,240,235,0.4)]">+{volumesSemanal.length - 5}</span>
          )}
        </div>
      </div>

      {/* Volume Semanal Collapsible */}
      {showVolume && (
        <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.05)]">
          <VolumeSemanalCompact volumes={volumesSemanal} maxSeries={maxSeries} />
        </div>
      )}

      {/* Tabs dos Dias */}
      <div className="flex border-b border-[rgba(255,255,255,0.07)] overflow-x-auto scrollbar-hide">
        {plano.dias.map((dia, idx) => {
          const diaSeries = dia.exercicios.reduce((t, ex) => t + ex.series, 0);
          return (
            <button
              key={idx}
              onClick={() => setDiaAtivo(idx)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 flex flex-col items-center gap-0.5 ${
                diaAtivo === idx
                  ? "text-purple-400 border-b-2 border-purple-400 bg-purple-500/5"
                  : "text-[rgba(245,240,235,0.5)] hover:text-[#f5f0eb] hover:bg-[rgba(255,255,255,0.02)]"
              }`}
            >
              <span>Dia {dia.dia}</span>
              <span className="text-[10px] opacity-60">{diaSeries} sér</span>
            </button>
          );
        })}
      </div>

      {/* Conteúdo do Dia */}
      <div className="p-4 max-h-[500px] overflow-y-auto">
        {/* Nome do Dia + Volume */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-[#f5f0eb] flex items-center gap-2">
            💪 {diaAtual.nome}
          </h4>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {diaAtual.foco.map((grupo) => {
              const grupoInfo = getGrupoMuscular(grupo, diaAtual.foco);
              return (
                <span
                  key={grupo}
                  className={`px-2 py-0.5 text-xs rounded-full border ${grupoInfo.bgCard} ${grupoInfo.cor}`}
                >
                  {grupoInfo.icon} {grupo}
                </span>
              );
            })}
          </div>
          
          {/* Mini resumo do dia */}
          <div className="flex items-center gap-4 mt-3 text-xs text-[rgba(245,240,235,0.5)]">
            <span>🏋️ {diaAtual.exercicios.length} exercícios</span>
            <span>📊 {diaAtual.exercicios.reduce((t, ex) => t + ex.series, 0)} séries</span>
          </div>
        </div>

        {/* Aquecimento */}
        {diaAtual.aquecimento && (
          <div className="mb-4 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-amber-400">🔥</span>
              <span className="text-xs text-amber-400 font-semibold uppercase tracking-wide">
                Aquecimento
              </span>
            </div>
            <p className="text-sm text-amber-200/80 leading-relaxed">
              {diaAtual.aquecimento}
            </p>
          </div>
        )}

        {/* Exercícios */}
        <div className="space-y-2">
          {diaAtual.exercicios.map((ex, idx) => (
            <ExercicioCard key={idx} ex={ex} index={idx} foco={diaAtual.foco} />
          ))}
        </div>

        {/* Alongamento */}
        {diaAtual.alongamento && (
          <div className="mt-4 p-3 bg-green-500/5 border border-green-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-green-400">🧘</span>
              <span className="text-xs text-green-400 font-semibold uppercase tracking-wide">
                Alongamento
              </span>
            </div>
            <p className="text-sm text-green-200/80 leading-relaxed">
              {diaAtual.alongamento}
            </p>
          </div>
        )}
      </div>

      {/* Footer com observações */}
      {plano.observacoes_gerais && (
        <div className="px-4 py-3 bg-[rgba(255,255,255,0.01)] border-t border-[rgba(255,255,255,0.05)]">
          <details className="group">
            <summary className="text-xs text-[rgba(245,240,235,0.5)] cursor-pointer hover:text-[#c8a96e] transition-colors flex items-center gap-1">
              📋 Observações gerais
              <span className="ml-auto text-[10px] group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-2 text-sm text-[rgba(245,240,235,0.65)] leading-relaxed">
              {plano.observacoes_gerais}
            </p>
          </details>
        </div>
      )}
    </div>
  );
}
