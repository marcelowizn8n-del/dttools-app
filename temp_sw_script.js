      if ('serviceWorker' in navigator) {
        // Desregistrar todos os service workers existentes
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          registrations.forEach(function(registration) {
            registration.unregister();
            console.log('DTTools SW unregistered:', registration.scope);
          });
        });
      }
