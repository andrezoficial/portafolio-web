# Portafolio Web

Proyecto estático de portafolio con estilos, animaciones, sistema de partículas y chat de contacto. La reorganización busca facilitar mantenimiento y crecimiento sin rehacer el diseño existente.

## Estructura

```text
portafolio-web-main/
├── index.html
├── assets/
│   ├── css/styles.css
│   └── js/
│       ├── main.js        # Entrada del cliente y eventos de interfaz
│       ├── app.js         # Inicialización y comportamiento general
│       ├── chat.js        # Conversación y envío de mensajes
│       ├── effects.js     # Animaciones y observadores
│       ├── particles.js   # Sistema de partículas
│       └── utilities.js   # Utilidades visuales reutilizables
├── api/chat.js            # Endpoint del chat (lado servidor)
├── favicon.png
├── poster-video.webp
└── Andres-Suarez-CV.pdf
```

## Arquitectura del cliente

El navegador carga `assets/js/main.js` como módulo ES. Las dependencias se expresan mediante `import` y `export`, y las acciones de los botones se enlazan con `data-action` y `data-chat-option`, sin atributos `onclick` ni necesidad de exponer funciones en `window`.

- Mantén el HTML y los identificadores existentes salvo que actualices sus selectores.
- Añade estilos a `assets/css/styles.css` y funciones al módulo responsable.
- Importa explícitamente las funciones que otro módulo necesite.
- Mantén claves y secretos exclusivamente en el entorno del servidor; nunca los incluyas en JavaScript público.

## Ejecución local

Los módulos ES deben servirse mediante HTTP; no abras el archivo directamente con `file://`.

Desde la carpeta del proyecto ejecuta:

```bash
python -m http.server 8000
```

Luego abre `http://localhost:8000` en el navegador.

## Chat de contacto

El cliente envía solicitudes a `/api/chat`. Para que la respuesta de IA funcione, despliega `api/chat.js` en el entorno serverless compatible y configura `GEMINI_API_KEY` como variable de entorno. La página estática por sí sola no ejecuta el endpoint.

## Comprobaciones antes de publicar

Se validaron la sintaxis de los archivos JavaScript, la correspondencia de importaciones/exportaciones, las referencias de recursos del HTML, la ausencia de `onclick` inline y la integridad del ZIP. Estas comprobaciones estáticas no sustituyen pruebas completas en navegador. Antes de desplegar, prueba:

- apertura y cierre del chat;
- opciones del chat y envío de mensajes con el endpoint configurado;
- animación inicial y partículas;
- enlaces internos y desplazamiento;
- escritorio, móvil y teclado.


## Actualización de portafolio (octubre de 2026)

- Video de presentación integrado en una sección adaptable, con controles, `muted`, `playsinline` y reproducción en bucle.
- CV actualizado desde `Andres_Suarez_CV_SemiSenior_ATS.docx`; la web ofrece `Andres-Suarez-CV.pdf`.
- Contenido profesional y proyectos alineados con el CV suministrado.
- Correcciones defensivas en inicialización, elementos opcionales, chat, animaciones y contadores.
- El endpoint `/api/chat` requiere `GEMINI_API_KEY` configurada en el despliegue. No incluyas esa clave en el frontend ni en el repositorio.
- El video se sirve desde `assets/video-portafolio.mp4`; si se desea optimizar aún más la carga móvil, conviene generar una versión MP4 comprimida y conservar una imagen de póster.


## Optimización (octubre de 2026)

- Eliminado el CDN de Tailwind 2.2 (~300 KB y bloqueante); se reemplazó por una base mínima y las ~14 utilidades usadas, dentro de `styles.css`.
- Video recomprimido (4,2 → 1,4 MB), con `preload="none"` y reproducción solo cuando entra en pantalla; póster en WebP.
- Favicon reducido a 192 px; retirados archivos sin referencia (`portada.png`, `fondo.jpg`, PDF duplicado).
- Partículas: sin `shadowBlur`, menos partículas en móvil, pausa con la pestaña oculta.
- Listeners por elemento (p, li, tarjetas, encabezados) y estilos inyectados por JS pasaron a CSS; eliminado código muerto y `console.log`.
