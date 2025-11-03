import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { birth } = req.query;

  if (!birth || typeof birth !== 'string') {
    return res.status(400).json({ error: 'Parâmetro birth é obrigatório' });
  }

  try {
    const response = await fetch(`https://o-eremita-api.onrender.com/personal-year/?birth=${birth}`);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro ao buscar dados na API externa' });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Erro no proxy API:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}
