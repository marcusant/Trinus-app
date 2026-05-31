"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface Aluno {
  id: string;
  nome: string;
  peso?: number;
  altura?: number;
  idade?: number;
  sexo?: string;
  objetivo?: string;
  restricoes_alimentares?: string;
  notas?: string;
}

interface GerarPlanoProps {
  aluno: Aluno;
}

export default function GerarPlano({ aluno }: GerarPlanoProps) {
  const [tipo, setTipo] = useState<"treino" | "alimentacao">("treino");
  const [plano, setPlano] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const gerarPlano = async () => {
    setLoading(true);
    setErro(null);
    setPlano(null);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aluno, tipo }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao gerar plano");
      }

      setPlano(data.plano);
    } catch (err: any) {
      setErro(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-gray-800 rounded-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-white">
        🤖 Gerar Plano com IA
      </h2>

      {/* Seletor de tipo */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setTipo("treino")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            tipo === "treino"
              ? "bg-purple-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          🏋️ Treino
        </button>
        <button
          onClick={() => setTipo("alimentacao")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            tipo === "alimentacao"
              ? "bg-green-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          🥗 Alimentação
        </button>
      </div>

      {/* Botão gerar */}
      <button
        onClick={gerarPlano}
        disabled={loading}
        className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 
                   text-white rounded-lg font-bold transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin">⏳</span> A gerar...
          </>
        ) : (
          <>✨ Gerar Plano de {tipo === "alimentacao" ? "Alimentação" : "Treino"}</>
        )}
      </button>

      {/* Erro */}
      {erro && (
        <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          ❌ {erro}
        </div>
      )}

      {/* Resultado */}
      {plano && (
        <div className="mt-6 p-4 bg-gray-900 rounded-lg prose prose-invert max-w-none">
          <ReactMarkdown>{plano}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
