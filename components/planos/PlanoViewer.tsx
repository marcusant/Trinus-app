"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PlanoViewerProps {
  conteudo: string;
  nomeAluno?: string;
}

export default function PlanoViewer({ conteudo, nomeAluno }: PlanoViewerProps) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 max-w-4xl mx-auto">
      {nomeAluno && (
        <div className="mb-6 pb-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">
            🍎 Plano Alimentar
          </h1>
          <p className="text-gray-400">Aluno: {nomeAluno}</p>
        </div>
      )}

      <div className="prose prose-invert max-w-none
        prose-table:w-full
        prose-table:border-collapse
        prose-th:bg-blue-600
        prose-th:text-white
        prose-th:px-4
        prose-th:py-2
        prose-th:text-left
        prose-th:font-semibold
        prose-td:px-4
        prose-td:py-2
        prose-td:border
        prose-td:border-gray-700
        prose-tr:bg-gray-800
        prose-tr:even:bg-gray-850
        prose-tr:hover:bg-gray-700
        prose-h2:text-xl
        prose-h2:text-blue-400
        prose-h2:mt-8
        prose-h2:mb-4
        prose-h3:text-lg
        prose-h3:text-green-400
        prose-h3:mt-6
        prose-h3:mb-3
        prose-ul:text-gray-300
        prose-li:text-gray-300
        prose-strong:text-yellow-400
        prose-hr:border-gray-700
        prose-hr:my-6
      ">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {conteudo}
        </ReactMarkdown>
      </div>
    </div>
  );
}
