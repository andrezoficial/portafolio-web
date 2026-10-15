const CONTEXTO_ANDRES = `
Eres el asistente virtual del portafolio de Andrés Suárez Moreno (no eres Andrés; si te preguntan, aclara que eres un asistente virtual). Responde siempre en español, con tono profesional, cordial y formal (trata al interlocutor de usted), de forma clara y concisa, sin emojis. No inventes datos ni cifras: no menciones porcentajes ni volúmenes que no aparezcan en esta información.

## PERFIL
Desarrollador Full-Stack Semi Senior en Bogotá, Colombia. Trabaja con React, JavaScript ES6+, Node.js/Express, PostgreSQL, MySQL, MongoDB, PHP/Laravel, Python (Django/Flask), APIs REST, JWT, microservicios, Docker, Git/GitHub, CI/CD, AWS, Heroku y Vercel. Experiencia con Jest, Mocha, Postman, OpenAPI/Swagger y pasarelas Stripe, PayPal, MercadoPago, Addi y Bold.

## EXPERIENCIA
- Freelance (2024–presente): APIs REST con autenticación JWT y roles; plataformas e-commerce; integración de pasarelas de pago; optimización de tiempos de carga; CI/CD y despliegues en AWS, Heroku y Vercel.
- Acoustic System SAS (2021–2023): módulos de Historia Clínica Electrónica con Laravel y PostgreSQL para varios centros médicos; interoperabilidad FHIR/HL7; dashboards React y notificaciones.
No añadas otras empresas o puestos que no estén en esta información.

## PROYECTOS
- El Impostor: juego social de deducción para 3–12 jugadores, PWA y aplicación publicada en Google Play; modo en un dispositivo y online, salas por código/enlace/QR, roles privados, votación con temporizador y reacciones en tiempo real.
- Genograma Free (genograma-rosy.vercel.app): herramienta gratuita sin registro para crear genogramas, editar vínculos y exportar PNG/SVG/JSON; genera desde texto o con IA.
- Defensa del Castillo (defensa-castillo.vercel.app): juego tower defense web con 15 oleadas, jefes por fases, mejoras de torres, habilidades, tutorial y guardado.
- Arcadia — Sala de juegos (arcadia-brown-omega.vercel.app): sala de juegos multijugador para jugar en grupo; la pantalla (TV o computador) muestra el juego y hasta 8 jugadores se unen desde el celular con código de sala o QR, sin instalar nada. Hecho con JavaScript, Three.js y Supabase. Incluye carreras, plataformas, aventura 3D, arena, estrategia, trivia, minijuegos arcade y modo torneo.
- ViorClinic (viorclinic.es): gestión clínica, pacientes, historial, citas, notificaciones, panel y reportes.
- Lafersua (lafersua.com): e-commerce con React, Node, PostgreSQL, PayPal, JWT y analítica.
## FORMACIÓN
Ingeniería en Sistemas Computacionales (UTEL) y Tecnólogo en Ingeniería Topográfica (Universidad Distrital Francisco José de Caldas). Full Stack Open (University of Helsinki, 2024); AWS Cloud Practitioner en proceso; JavaScript Algorithms and Data Structures (freeCodeCamp); Advanced SQL for Data Science y cursos de React, Git/GitHub y Laravel.
## CONTACTO
WhatsApp: +57 322 618 3938. Correo: andres1997rez@gmail.com. LinkedIn: linkedin.com/in/andres1997rez. Disponibilidad remoto, híbrido o presencial en Bogotá.
Si preguntan por precios, explica que dependen del alcance y recomienda WhatsApp. Si no sabes algo, dilo claramente. No afirmes que hay agenda de Calendly confirmada.
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body && typeof body === 'object' ? body : {};
  const { message, history = [] } = body;

  if (typeof message !== 'string' || !message.trim() || message.length > 500) {
    return res.status(400).json({ error: 'Mensaje inválido' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(503).json({ error: 'El asistente no está configurado temporalmente. Puedes contactar por WhatsApp o correo.' });
  }

  // Solo aceptar roles y contenido con el formato esperado; limitar historial y tamaño.
  const historialBruto = Array.isArray(history)
    ? history.slice(-10).filter(item =>
        item && ['user', 'model'].includes(item.role) &&
        Array.isArray(item.parts) &&
        item.parts.some(part => part && typeof part.text === 'string')
      ).map(item => ({
        role: item.role,
        parts: [{ text: item.parts.filter(part => part && typeof part.text === 'string').map(part => part.text).join(' ').slice(0, 1500) }]
      }))
    : [];

  // Gemini exige que la conversación empiece con 'user' y alterne roles.
  // Al recortar el historial puede quedar un turno 'model' al inicio: se descarta.
  const historialLimitado = [];
  for (const item of historialBruto) {
    const ultimo = historialLimitado[historialLimitado.length - 1];
    if (!ultimo && item.role !== 'user') continue;
    if (ultimo && ultimo.role === item.role) {
      historialLimitado[historialLimitado.length - 1] = item;
      continue;
    }
    historialLimitado.push(item);
  }
  if (historialLimitado.length && historialLimitado[historialLimitado.length - 1].role === 'user') {
    historialLimitado.pop();
  }

  try {
    // Los modelos de Gemini se retiran o se restringen con el tiempo (p. ej. 2.5 Flash ya solo
    // está disponible para proyectos que lo usaron antes). Se prueban en orden hasta que uno responda.
    // Se puede forzar uno con la variable de entorno GEMINI_MODEL.
    const modelos = [process.env.GEMINI_MODEL, 'gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-2.5-flash']
      .filter((m, i, arr) => m && arr.indexOf(m) === i);

    let data = null;
    for (const modelo of modelos) {
      const generationConfig = { maxOutputTokens: 1500, temperature: 0.7 };
      // 2.5 Flash "piensa" por defecto y esos tokens consumen maxOutputTokens: se desactiva.
      if (modelo.startsWith('gemini-2.5')) {
        generationConfig.maxOutputTokens = 800;
        generationConfig.thinkingConfig = { thinkingBudget: 0 };
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
          signal: AbortSignal.timeout(20000),
          body: JSON.stringify({
            system_instruction: { parts: [{ text: CONTEXTO_ANDRES }] },
            contents: [
              ...historialLimitado,
              { role: 'user', parts: [{ text: message }] }
            ],
            generationConfig
          })
        }
      );

      const resultado = await response.json().catch(() => ({}));

      if (response.ok) {
        data = resultado;
        break;
      }
      // El mensaje real queda en los logs de Vercel para poder diagnosticar.
      console.error(`Gemini API error [${modelo}]:`, response.status, resultado?.error?.status || 'unknown', resultado?.error?.message || '');
    }

    if (!data) {
      return res.status(502).json({ error: 'El asistente no pudo responder en este momento. Intenta por WhatsApp o correo.' });
    }

    const parts = data?.candidates?.[0]?.content?.parts;
    const reply = (Array.isArray(parts) ? parts.map(part => part?.text || '').join('').trim() : '')
      || 'Lo siento, no pude procesar su mensaje. Puede contactar a Andrés por WhatsApp o correo electrónico.';

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Server error:', error.message, error.stack);
    return res.status(500).json({ error: 'Error interno del asistente. Intenta nuevamente más tarde.' });
  }
}
