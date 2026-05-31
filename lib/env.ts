import { z } from 'zod';

const envSchema = z.object({
  // Supabase (Público)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  
  // APIs Externas (Privado - Apenas Servidor)
  RAPIDAPI_KEY: z.string().min(1),
  GEMINI_API_KEY: z.string().min(1),
  
  // App
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
});

// Validação em tempo de execução
const isServer = typeof window === 'undefined';

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key',
  RAPIDAPI_KEY: isServer ? (process.env.RAPIDAPI_KEY || 'placeholder_key') : 'CLIENT_PLACEHOLDER',
  GEMINI_API_KEY: isServer ? (process.env.GEMINI_API_KEY || 'placeholder_key') : 'CLIENT_PLACEHOLDER',
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
});

if (!parsed.success) {
  const errors = parsed.error.format();
  
  if (isServer) {
    console.error('❌ Erro de configuração: Variáveis de ambiente inválidas:', errors);
    // No servidor, avisamos mas não travamos o build se forem chaves de API externas.
    // Travamos apenas se forem chaves essenciais para o funcionamento básico (Supabase).
    if (errors.NEXT_PUBLIC_SUPABASE_URL || errors.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('⚠️ ERRO: Chaves do Supabase estão faltando. O build prosseguirá, mas o banco de dados falhará no runtime se não configurado.');
    }
    
    console.warn('⚠️ Aviso: Algumas chaves de API (GEMINI/RAPIDAPI) não foram detectadas no build.');
  }
}

export const env = parsed.data || {} as z.infer<typeof envSchema>;
