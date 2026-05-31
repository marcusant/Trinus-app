export function formatarPlanoParaMarkdown(plano: any): string {
  let md = `# 🍽️ Plano Alimentar - ${plano.alunoNome}\n\n`;
  md += `**Objetivo:** ${plano.objetivo} | **Peso:** ${plano.peso}kg | **Altura:** ${plano.altura}cm | **Idade:** ${plano.idade} anos\n\n`;
  
  if (plano.restricoes) {
    md += `**Restrições:** ${plano.restricoes}\n\n`;
  }
  
  md += `---\n\n`;
  md += `## 📊 Resumo Nutricional Diário\n\n`;
  md += `| Nutriente | Quantidade | % do Total |\n`;
  md += `|-----------|------------|------------|\n`;
  md += `| 🔥 Calorias | ${plano.resumo.caloriasTotais} kcal | 100% |\n`;
  md += `| 🥩 Proteínas | ${plano.resumo.proteinas.gramas}g | ${plano.resumo.proteinas.percentual}% |\n`;
  md += `| 🍚 Carboidratos | ${plano.resumo.carboidratos.gramas}g | ${plano.resumo.carboidratos.percentual}% |\n`;
  md += `| 🥑 Gorduras | ${plano.resumo.gorduras.gramas}g | ${plano.resumo.gorduras.percentual}% |\n\n`;
  md += `---\n\n`;
  md += `## 🍴 Refeições\n\n`;
  
  plano.refeicoes.forEach((ref: any) => {
    md += `### ${ref.numero}. ${ref.nome} - ⏰ ${ref.horario}\n\n`;
    md += `> **Total:** ${ref.totalKcal} kcal | P: ${ref.totalProteina}g | C: ${ref.totalCarboidrato}g | G: ${ref.totalGordura}g\n\n`;
    md += `| Alimento | Quantidade | Kcal | P | C | G |\n`;
    md += `|----------|------------|------|---|---|---|\n`;
    
    ref.alimentos.forEach((ali: any) => {
      md += `| ${ali.nome} | ${ali.quantidade} | ${ali.kcal} | ${ali.proteina}g | ${ali.carboidrato}g | ${ali.gordura}g |\n`;
    });
    
    md += `\n`;
  });
  
  md += `---\n\n`;
  md += `*Plano gerado em ${new Date(plano.criadoEm).toLocaleDateString('pt-PT')}*\n`;
  
  return md;
}
