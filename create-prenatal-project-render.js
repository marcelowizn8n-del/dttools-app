// Script para criar projeto pré-natal diretamente no Render
// Execute este código no console do navegador em https://dttools-app.onrender.com/admin

async function createPrenatalProject() {
  console.log('🏥 Criando projeto pré-natal no Render...');
  
  try {
    const response = await fetch('/api/admin/create-prenatal-project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Important for session cookie
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCESSO!', data);
      console.log('📋 Projeto ID:', data.projectId);
      console.log('🔄 Recarregue a página para ver o projeto na aba Projetos!');
      
      // Reload page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } else {
      console.error('❌ Erro:', data);
    }
  } catch (error) {
    console.error('❌ Erro ao criar projeto:', error);
  }
}

// Execute
createPrenatalProject();
