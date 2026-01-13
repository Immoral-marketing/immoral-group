import { Resend } from 'resend';

// NOTE: Ideally this should be in process.env.RESEND_API_KEY
// Placing here as requested by user for this environment
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_Vwjcr5k6_CPrfGoE3T3piRnhKUFhJ7daE';
const resend = new Resend(RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    try {
        const data = await resend.emails.send({
            from: 'Immoral Group <onboarding@resend.dev>', // Using default Resend domain for testing/dev if verified domain not set up
            // Or if verified: 'Immoral Group <noreply@group.immoral.es>'
            // User mentioned verifying 'group.immoral.es', so let's try that or fallback to resend.dev for safety if not fully propagated.
            // However, user explicitly said "verificado con el subdominio de group.immoral.es".
            // Let's try to use a generic 'contact@group.immoral.es' or similar.
            from: 'Web Contact <noreply@group.immoral.es>',
            to: ['Gregory@immoral.marketing'],
            subject: `Nuevo mensaje de contacto de ${nombre}`,
            html: `
        <h1>Nuevo mensaje del formulario web</h1>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <div style="background-color: #f3f4f6; padding: 12px; border-radius: 4px;">
          ${mensaje.replace(/\n/g, '<br>')}
        </div>
      `,
        });

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Resend Error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
