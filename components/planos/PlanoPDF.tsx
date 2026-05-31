'use client'

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'

// Estilos do PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 30,
    borderBottom: '2px solid #16a34a',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#16a34a',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f0fdf4',
    padding: 15,
    borderRadius: 5,
    marginBottom: 25,
    gap: 30,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 9,
    color: '#666',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#16a34a',
    marginTop: 20,
    marginBottom: 10,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 5,
  },
  content: {
    fontSize: 11,
    lineHeight: 1.6,
    textAlign: 'justify',
  },
  mealBlock: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fafafa',
    borderRadius: 4,
  },
  mealTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
    color: '#333',
  },
  mealContent: {
    fontSize: 10,
    color: '#555',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#999',
    borderTop: '1px solid #e5e7eb',
    paddingTop: 10,
  },
  watermark: {
    position: 'absolute',
    bottom: 50,
    right: 40,
    fontSize: 8,
    color: '#ccc',
  },
})

interface PlanoPDFProps {
  plano: {
    titulo: string
    objetivo: string
    conteudo: string
    created_at: string
    aluno: {
      nome: string
      email: string
    }
  }
  treinador?: string
}

// Parser simples do conteúdo Markdown
function parseContent(content: string) {
  const sections: { title: string; items: string[] }[] = []
  const lines = content.split('\n')
  let currentSection: { title: string; items: string[] } | null = null

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    // Detecta títulos (## ou ###)
    if (trimmed.startsWith('##')) {
      if (currentSection) sections.push(currentSection)
      currentSection = {
        title: trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, ''),
        items: [],
      }
    } else if (currentSection) {
      // Remove markdown básico
      const cleanLine = trimmed
        .replace(/^\*\*|\*\*$/g, '')
        .replace(/^-\s*/, '• ')
        .replace(/^\d+\.\s*/, '')
      if (cleanLine) currentSection.items.push(cleanLine)
    }
  }
  if (currentSection) sections.push(currentSection)

  return sections
}

export function PlanoPDF({ plano, treinador = 'Personal Trainer' }: PlanoPDFProps) {
  const sections = parseContent(plano.conteudo)
  const dataFormatada = new Date(plano.created_at).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{plano.titulo}</Text>
          <Text style={styles.subtitle}>
            Plano personalizado para {plano.aluno.nome}
          </Text>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>ALUNO</Text>
            <Text style={styles.infoValue}>{plano.aluno.nome}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>OBJETIVO</Text>
            <Text style={styles.infoValue}>{plano.objetivo}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>DATA</Text>
            <Text style={styles.infoValue}>{dataFormatada}</Text>
          </View>
        </View>

        {/* Conteúdo */}
        {sections.map((section, idx) => (
          <View key={idx} wrap={false}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.mealBlock}>
              {section.items.map((item, i) => (
                <Text key={i} style={styles.mealContent}>
                  {item}
                </Text>
              ))}
            </View>
          </View>
        ))}

        {/* Footer */}
        <Text style={styles.footer}>
          Documento gerado automaticamente • {treinador} • {dataFormatada}
        </Text>
      </Page>
    </Document>
  )
}
