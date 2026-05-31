// components/planos/AlimentarPreview.tsx

"use client";

import { useState } from "react";
import type { PlanoAlimentarEstruturado, Refeicao, AlimentoRefeicao } from "@/types/planos-estruturados";

interface Props {
  plano: PlanoAlimentarEstruturado;
}

// ============================================
// CÁLCULOS E HELPERS
// ============================================

interface MacroDistribuicao {
  nome: string;
  valor: number;
  percentual: number;
  cor: string;
  bgBar: string;
  icon: string;
  metaPorKg?: string;
}

function calcularDistribuicaoMacros(macros: { proteina_g: number; carboidrato_g: number; gordura_g: number }): MacroDistribuicao[] {
  const calProteina = macros.proteina_g * 4;
  const calCarbs = macros.carboidrato_g * 4;
  const calGordura = macros.gordura_g * 9;
  const totalCal = calProteina + calCarbs + calGordura;

  return [
    {
      nome: "Proteína",
      valor: macros.proteina_g,
      percentual: Math.round((calProteina / totalCal) * 100),
      cor: "text-blue-400",
      bgBar: "bg-blue-500",
      icon: "🥩",
    },
    {
      nome: "Carboidratos",
      valor: macros.carboidrato_g,
      percentual: Math.round((calCarbs / totalCal) * 100),
      cor: "text-amber-400",
      bgBar: "bg-amber-500",
      icon: "🍚",
    },
    {
      nome: "Gordura",
      valor: macros.gordura_g,
      percentual: Math.round((calGordura / totalCal) * 100),
      cor: "text-rose-400",
      bgBar: "bg-rose-500",
      icon: "🥑",
    },
  ];
}

function calcularCaloriasPorRefeicao(refeicoes: Refeicao[]): { nome: string; calorias: number; percentual: number; emoji: string }[] {
  const totalCalorias = refeicoes.reduce((t, r) => t + (r.calorias_total || 0), 0);
  
  return refeicoes.map((r) => ({
    nome: r.nome,
    calorias: r.calorias_total || 0,
    percentual: totalCalorias > 0 ? Math.round(((r.calorias_total || 0) / totalCalorias) * 100) : 0,
    emoji: getRefeicaoEmoji(r.nome),
  }));
}

function getRefeicaoEmoji(nome: string): string {
  const n = nome.toLowerCase();
  if (n.includes("pequeno") || n.includes("café") || (n.includes("manha") && !n.includes("lanche"))) return "☀️";
  if (n.includes("lanche") && (n.includes("manhã") || n.includes("manha"))) return "🥪";
  if (n.includes("almoço") || n.includes("almoco")) return "🍽️";
  if (n.includes("lanche") && n.includes("tarde")) return "🍎";
  if (n.includes("pré") || n.includes("pre")) return "⚡";
  if (n.includes("pós") || n.includes("pos")) return "💪";
  if (n.includes("jantar") || n.includes("janta")) return "🌙";
  if (n.includes("ceia")) return "😴";
  return "🍴";
}

function getCategoriaAlimento(item: string): { icon: string; cor: string } {
  const i = item.toLowerCase();
  
  // Proteínas
  if (i.includes("frango") || i.includes("peito") || i.includes("peru") || i.includes("atum") || 
      i.includes("salmão") || i.includes("peixe") || i.includes("ovo") || i.includes("carne") ||
      i.includes("bife") || i.includes("whey") || i.includes("protein") || i.includes("bacalhau") ||
      i.includes("camarão") || i.includes("tilápia")) {
    return { icon: "🥩", cor: "text-blue-400" };
  }
  
  // Carboidratos
  if (i.includes("arroz") || i.includes("batata") || i.includes("pão") || i.includes("aveia") ||
      i.includes("massa") || i.includes("macarrão") || i.includes("quinoa") || i.includes("mandioca") ||
      i.includes("tapioca") || i.includes("cuscuz") || i.includes("feijão") || i.includes("grão")) {
    return { icon: "🍚", cor: "text-amber-400" };
  }
  
  // Gorduras
  if (i.includes("azeite") || i.includes("abacate") || i.includes("amendoa") || i.includes("castanha") ||
      i.includes("noz") || i.includes("amendoim") || i.includes("manteiga") || i.includes("óleo") ||
      i.includes("coco")) {
    return { icon: "🥑", cor: "text-rose-400" };
  }
  
  // Laticínios
  if (i.includes("leite") || i.includes("queijo") || i.includes("iogurte") || i.includes("requeijão") ||
      i.includes("cottage") || i.includes("cream")) {
    return { icon: "🥛", cor: "text-cyan-400" };
  }
  
  // Frutas
  if (i.includes("banana") || i.includes("maçã") || i.includes("morango") || i.includes("laranja") ||
      i.includes("manga") || i.includes("uva") || i.includes("melão") || i.includes("mamão") ||
      i.includes("fruta") || i.includes("berry") || i.includes("kiwi")) {
    return { icon: "🍌", cor: "text-yellow-400" };
  }
  
  // Vegetais
  if (i.includes("brócol") || i.includes("espinafre") || i.includes("alface") || i.includes("tomate") ||
      i.includes("pepino") || i.includes("cenoura") || i.includes("legume") || i.includes("salada") ||
      i.includes("couve") || i.includes("abobrinha") || i.includes("cebola") || i.includes("piment")) {
    return { icon: "🥦", cor: "text-green-400" };
  }

  return { icon: "🍴", cor: "text-[rgba(245,240,235,0.5)]" };
}

// ============================================
// COMPONENTES
// ============================================

function MacrosCard({ macros, calorias }: { macros: MacroDistribuicao[]; calorias: number }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="p-4 border-b border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.01)]">
      {/* Calorias Principal */}
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-[#f5f0eb]">{calorias}</div>
        <div className="text-xs text-[rgba(245,240,235,0.4)] uppercase tracking-wider">kcal / dia</div>
      </div>

      {/* Macros Grid */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {macros.map((macro, i) => (
          <div key={i} className="text-center p-2 bg-[rgba(255,255,255,0.02)] rounded-xl border border-[rgba(255,255,255,0.05)]">
            <span className="text-lg">{macro.icon}</span>
            <div className={`text-lg font-bold ${macro.cor}`}>{macro.valor}g</div>
            <div className="text-[10px] text-[rgba(245,240,235,0.4)] uppercase">{macro.nome}</div>
          </div>
        ))}
      </div>

      {/* Toggle Detalhes */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full text-xs text-[rgba(245,240,235,0.4)] hover:text-[#c8a96e] transition-colors flex items-center justify-center gap-1"
      >
        📊 {showDetails ? "Ocultar distribuição" : "Ver distribuição calórica"}
      </button>

      {/* Distribuição Expandida */}
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.05)] space-y-2">
          {macros.map((macro, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium ${macro.cor}`}>
                  {macro.icon} {macro.nome}
                </span>
                <span className="text-xs text-[rgba(245,240,235,0.5)]">
                  {macro.percentual}% ({macro.valor * (macro.nome === "Gordura" ? 9 : 4)} kcal)
                </span>
              </div>
              <div className="h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                <div
                  className={`h-full ${macro.bgBar} rounded-full transition-all duration-500`}
                  style={{ width: `${macro.percentual}%` }}
                />
              </div>
            </div>
          ))}

          {/* Resumo Calorias */}
          <div className="mt-2 pt-2 border-t border-[rgba(255,255,255,0.05)] text-xs text-[rgba(245,240,235,0.4)]">
            <div className="flex justify-between">
              <span>Proteína: {macros[0].valor}g × 4 =</span>
              <span className="text-blue-400">{macros[0].valor * 4} kcal</span>
            </div>
            <div className="flex justify-between">
              <span>Carboidratos: {macros[1].valor}g × 4 =</span>
              <span className="text-amber-400">{macros[1].valor * 4} kcal</span>
            </div>
            <div className="flex justify-between">
              <span>Gordura: {macros[2].valor}g × 9 =</span>
              <span className="text-rose-400">{macros[2].valor * 9} kcal</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DistribuicaoRefeicoes({ refeicoes }: { refeicoes: { nome: string; calorias: number; percentual: number; emoji: string }[] }) {
  const [expanded, setExpanded] = useState(false);

  if (refeicoes.every(r => r.calorias === 0)) return null;

  return (
    <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.05)]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-xs"
      >
        <span className="text-[rgba(245,240,235,0.5)] font-medium uppercase tracking-wide">
          📊 Calorias por Refeição
        </span>
        <span className="text-[rgba(245,240,235,0.3)]">{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div className="mt-3 space-y-2">
          {refeicoes.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-sm w-5">{r.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs text-[rgba(245,240,235,0.65)]">{r.nome}</span>
                  <span className="text-xs text-green-400">{r.calorias} kcal ({r.percentual}%)</span>
                </div>
                <div className="h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${r.percentual}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AlimentoItem({ alimento }: { alimento: AlimentoRefeicao }) {
  const { icon, cor } = getCategoriaAlimento(alimento.item);

  return (
    <li className="flex items-start gap-2 py-1">
      <span className={`text-sm flex-shrink-0 ${cor}`}>{icon}</span>
      <div className="flex-1 min-w-0">
        <span className="text-sm text-[rgba(245,240,235,0.7)]">
          {alimento.quantidade && (
            <span className="text-[rgba(245,240,235,0.5)] font-medium mr-1">
              {alimento.quantidade}
            </span>
          )}
          {alimento.item}
        </span>
      </div>
      {alimento.calorias && (
        <span className="text-[10px] text-[rgba(245,240,235,0.3)] flex-shrink-0 bg-[rgba(255,255,255,0.03)] px-1.5 py-0.5 rounded">
          {alimento.calorias}kcal
        </span>
      )}
    </li>
  );
}

function RefeicaoCard({ refeicao, index }: { refeicao: Refeicao; index: number }) {
  const [expanded, setExpanded] = useState(true);
  const macroEstimado = estimarMacrosRefeicao(refeicao);

  return (
    <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden hover:border-green-500/20 transition-colors">
      {/* Header da Refeição */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-[rgba(255,255,255,0.02)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{getRefeicaoEmoji(refeicao.nome)}</span>
          <div className="text-left">
            <h4 className="font-medium text-[#f5f0eb] text-sm">{refeicao.nome}</h4>
            <span className="text-[10px] text-[rgba(245,240,235,0.4)]">
              🕐 {refeicao.horario}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {refeicao.calorias_total && (
            <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">
              {refeicao.calorias_total} kcal
            </span>
          )}
          <span className="text-[rgba(245,240,235,0.3)] text-xs">
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </button>

      {/* Conteúdo Expandido */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-[rgba(255,255,255,0.03)]">
          {/* Mini Macros da Refeição */}
          {macroEstimado && (
            <div className="flex items-center gap-3 py-2 mb-2 text-[10px]">
              <span className="text-blue-400">🥩 ~{macroEstimado.proteina}g P</span>
              <span className="text-amber-400">🍚 ~{macroEstimado.carbs}g C</span>
              <span className="text-rose-400">🥑 ~{macroEstimado.gordura}g G</span>
            </div>
          )}

          {/* Lista de Alimentos */}
          <ul className="space-y-0.5">
            {refeicao.alimentos.map((alimento, aIdx) => (
              <AlimentoItem key={aIdx} alimento={alimento} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function estimarMacrosRefeicao(refeicao: Refeicao): { proteina: number; carbs: number; gordura: number } | null {
  if (!refeicao.calorias_total) return null;
  
  // Estimativa básica baseada no tipo de refeição
  const nome = refeicao.nome.toLowerCase();
  const cal = refeicao.calorias_total;
  
  // Pós-treino: mais carbs e proteína
  if (nome.includes("pós") || nome.includes("pos")) {
    return {
      proteina: Math.round(cal * 0.30 / 4),
      carbs: Math.round(cal * 0.55 / 4),
      gordura: Math.round(cal * 0.15 / 9),
    };
  }
  
  // Pequeno-almoço: equilibrado
  if (nome.includes("pequeno") || nome.includes("café")) {
    return {
      proteina: Math.round(cal * 0.25 / 4),
      carbs: Math.round(cal * 0.50 / 4),
      gordura: Math.round(cal * 0.25 / 9),
    };
  }
  
  // Jantar/Ceia: menos carbs
  if (nome.includes("jantar") || nome.includes("ceia")) {
    return {
      proteina: Math.round(cal * 0.35 / 4),
      carbs: Math.round(cal * 0.35 / 4),
      gordura: Math.round(cal * 0.30 / 9),
    };
  }
  
  // Default: equilibrado
  return {
    proteina: Math.round(cal * 0.30 / 4),
    carbs: Math.round(cal * 0.45 / 4),
    gordura: Math.round(cal * 0.25 / 9),
  };
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export function AlimentarPreview({ plano }: Props) {
  const [showTimeline, setShowTimeline] = useState(false);
  const macrosDistribuicao = calcularDistribuicaoMacros(plano.macros);
  const caloriasRefeicoes = calcularCaloriasPorRefeicao(plano.refeicoes);
  const totalRefeicoesComCalorias = plano.refeicoes.filter(r => r.calorias_total).length;

  return (
    <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-green-500/10 px-4 py-3 border-b border-[rgba(255,255,255,0.07)]">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-green-400 flex items-center gap-2">
            🥗 Plano Nutricional - {plano.objetivo}
          </h3>
          <span className="text-xs text-[rgba(245,240,235,0.5)]">
            {plano.objetivo}
          </span>
        </div>
      </div>

      {/* Macros Card */}
      <MacrosCard macros={macrosDistribuicao} calorias={plano.calorias_diarias} />

      {/* Distribuição por Refeição */}
      {totalRefeicoesComCalorias > 0 && (
        <DistribuicaoRefeicoes refeicoes={caloriasRefeicoes} />
      )}

      {/* Toggle Timeline */}
      <div className="px-4 py-2 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between">
        <button
          onClick={() => setShowTimeline(!showTimeline)}
          className="text-xs text-[rgba(245,240,235,0.4)] hover:text-[#c8a96e] transition-colors flex items-center gap-1"
        >
          🕐 {showTimeline ? "Ocultar horários" : "Ver timeline"}
        </button>
        <span className="text-xs text-[rgba(245,240,235,0.4)]">
          {plano.refeicoes.length} refeições
        </span>
      </div>

      {/* Timeline Compacta */}
      {showTimeline && (
        <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.05)] flex items-center gap-2 overflow-x-auto">
          {plano.refeicoes.map((r, i) => (
            <div key={i} className="flex flex-col items-center flex-shrink-0">
              <span className="text-lg">{getRefeicaoEmoji(r.nome)}</span>
              <span className="text-[10px] text-[rgba(245,240,235,0.5)]">{r.horario}</span>
            </div>
          ))}
        </div>
      )}

      {/* Refeições */}
      <div className="p-4 max-h-[450px] overflow-y-auto space-y-3">
        {plano.refeicoes.map((refeicao, idx) => (
          <RefeicaoCard key={idx} refeicao={refeicao} index={idx} />
        ))}

        {/* Hidratação */}
        {plano.hidratacao_litros && (
          <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">💧</span>
                <div>
                  <span className="text-sm font-medium text-blue-400">Hidratação</span>
                  <span className="text-sm text-[rgba(245,240,235,0.6)] ml-2">
                    {plano.hidratacao_litros}L por dia
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(Math.ceil(plano.hidratacao_litros), 4) }).map((_, i) => (
                  <span key={i} className="text-blue-400 text-sm">💧</span>
                ))}
              </div>
            </div>
            <p className="mt-2 text-xs text-blue-300/60">
              ≈ {Math.round(plano.hidratacao_litros * 4)} copos de 250ml
            </p>
          </div>
        )}
      </div>

      {/* Observações */}
      {plano.observacoes && (
        <div className="px-4 py-3 bg-[rgba(255,255,255,0.01)] border-t border-[rgba(255,255,255,0.05)]">
          <details className="group">
            <summary className="text-xs text-[rgba(245,240,235,0.5)] cursor-pointer hover:text-[#c8a96e] transition-colors flex items-center gap-1">
              📋 Dicas Importantes e Ajustes Sugeridos
              <span className="ml-auto text-[10px] group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 text-sm text-[rgba(245,240,235,0.65)] leading-relaxed whitespace-pre-wrap">
              {formatObservacoes(plano.observacoes)}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

function formatObservacoes(obs: string): React.ReactNode {
  // Detecta se tem formato markdown-like
  if (obs.includes("**") || obs.includes("##")) {
    const parts = obs.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <span key={i} className="font-semibold text-[#c8a96e]">
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });
  }
  return obs;
}
