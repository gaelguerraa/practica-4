1. Express manda los rechazos de un handler async directo al middleware de errores, sin try/catch en cada ruta. ¿Qué tendrían que agregar en cada ruta si esto no fuera así?

Si Express no propagara automáticamente los rechazos de handlers async, cada ruta tendría que envolver su lógica en try/catch y llamar manualmente a next(error)

2. ¿Por qué el servicio no lanza directamente un 409 en vez de EjemplarPrestadoError?

El servicio no lanza directamente un 409 porque 409 Conflict es una decisión de la capa HTTP, no del dominio, El servicio solo conoce la regla de negocio: un ejemplar ya prestado no puede volver a prestarse. Por eso lanza EjemplarPrestadoError. Luego validar.ts traduce ese error a 409.

3. ¿Si mañana agregaran una app móvil que también consume esta API, qué archivos de esta práctica tendrían que tocar?

Ninguno, porque la app movil seria un cliente mas que consumiria el POST y GET de la API
