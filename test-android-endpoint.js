// Archivo de prueba para el endpoint de Android
const testAndroidEndpoint = async () => {
  const testUrl = "https://pass.walletclub.io/d/p/SgmFlriWSqq6mEhtINHVkg.pkpass?t=yMhwUuQ";
  
  try {
    console.log('Iniciando prueba con URL:', testUrl);
    
    const response = await fetch('https://android-instalacion-automatica-onlinemidafilia.replit.app/generateLink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        originalLink: testUrl
      })
    });

    console.log('Status de la respuesta:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en la respuesta:', errorText);
      throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Datos de la respuesta:', data);
    console.log('Link para Android:', data.passwalletLink);

  } catch (error) {
    console.error('Error completo:', error);
  }
};

// Ejecutar la prueba
testAndroidEndpoint();
