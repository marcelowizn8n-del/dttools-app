import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from '../server/app';

// Export Express app as Vercel serverless function
export default async (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};
