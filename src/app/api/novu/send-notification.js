import { Novu } from '@novu/node';

const novu = new Novu(process.env.NOVU_API_KEY); 

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { to, message, subject } = req.body;

    try {
      await novu.trigger('<template_id>', {
        to: {
          subscriberId: to, 
          email: to,       
        },
        payload: {
          message,
          subject,
        },
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
