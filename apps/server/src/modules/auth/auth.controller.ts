import { Router } from 'express';
import { generateToken } from '../../middleware/auth';
// In a real app, use @solana/web3.js to verify the signature
// import { sign } from 'tweetnacl';
// import { decodeUTF8 } from 'tweetnacl-util';

const router = Router();

router.post('/login', async (req, res) => {
  const { walletAddress, signature, message } = req.body;

  if (!walletAddress || !signature || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // TODO: Verify signature here using nacl
  // const isVerified = sign.detached.verify(
  //   decodeUTF8(message),
  //   decode(signature),
  //   decode(walletAddress)
  // );

  // For simulation purposes:
  const isVerified = true; 

  if (isVerified) {
    const token = generateToken(walletAddress);
    return res.json({ token });
  } else {
    return res.status(401).json({ error: 'Invalid signature' });
  }
});

export default router;
