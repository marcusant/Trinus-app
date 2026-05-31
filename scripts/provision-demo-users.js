import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Connecting to Supabase:', url)
const supabase = createClient(url, anonKey)

const demoUsers = [
  {
    email: 'admin@trinus.com',
    password: 'trinus123',
    name: 'Marcus (Admin)',
    role: 'admin'
  },
  {
    email: 'trainer@trinus.com',
    password: 'trinus123',
    name: 'Marcus (Treinador)',
    role: 'trainer'
  },
  {
    email: 'client@trinus.com',
    password: 'trinus123',
    name: 'Marcus (Cliente)',
    role: 'client'
  }
]

async function provision() {
  console.log('\n--- PROVISIONAMENTO DE CONTAS DE DEMONSTRAÇÃO NA BASE ATIVA ---')
  
  for (const userDef of demoUsers) {
    console.log(`\nTentando provisionar: ${userDef.email} (${userDef.role.toUpperCase()})...`)
    
    // 1. Tentar fazer login para ver se já existe
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: userDef.email,
      password: userDef.password
    })
    
    let user = signInData?.user
    
    if (signInError) {
      console.log(`Conta não existe ou credenciais incorretas (${signInError.message}). Cadastrando...`)
      
      // 2. Tentar cadastrar
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: userDef.email,
        password: userDef.password
      })
      
      if (signUpError) {
        console.error(`❌ Erro ao cadastrar ${userDef.email}:`, signUpError.message)
        continue
      }
      
      user = signUpData.user
      console.log(`✅ Conta criada no Auth para ${userDef.email}! (ID: ${user?.id})`)
    } else {
      console.log(`✅ Conta já existe no Auth! (ID: ${user?.id})`)
    }
    
    if (user) {
      // 3. Atualizar tabela profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: userDef.name,
          email: userDef.email,
          role: userDef.role,
          updated_at: new Date().toISOString()
        })
        
      if (profileError) {
        console.error(`❌ Erro ao upsert em 'profiles':`, profileError.message)
      } else {
        console.log(`✅ Perfil upserted na tabela 'profiles'!`)
      }
      
      // 4. Atualizar tabela user_roles
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          role: userDef.role
        }, {
          onConflict: 'user_id'
        })
        
      if (roleError) {
        console.error(`❌ Erro ao upsert em 'user_roles':`, roleError.message)
      } else {
        console.log(`✅ Papel atribuído na tabela 'user_roles'!`)
      }
    }
  }
  
  console.log('\n--- FIM DO PROVISIONAMENTO ---')
}

provision()
