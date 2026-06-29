import express from 'express';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
// import { PrismaClient } from '@prisma/client';

const router = express.Router();
// const prisma = new PrismaClient();

// Mock RBAC Login Endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // NOTE: In production, this will query Prisma DB and compare bcrypt hashes.
  // const user = await prisma.user.findUnique({ where: { email } });
  
  // Mock Logic based on Hierarchy
  const validRoles = ['constable', 'sho', 'district', 'hq', 'admin', 'officer'];
  const userPrefix = email.split('@')[0];

  if (validRoles.includes(userPrefix) && password === `${userPrefix}123`) {
     
     // Determine role for payload
     let role = 'CONSTABLE';
     let fullName = 'Demo Officer';
     
     switch(userPrefix) {
       case 'constable': role = 'CONSTABLE'; fullName = 'Constable Ramesh'; break;
       case 'sho': role = 'SHO'; fullName = 'SHO Rajesh Kumar'; break;
       case 'district': role = 'DISTRICT_ADMIN'; fullName = 'SP Lucknow'; break;
       case 'hq': role = 'STATE_HQ_ADMIN'; fullName = 'DGP Headquarters'; break;
       case 'admin': role = 'SUPER_ADMIN'; fullName = 'Control Room Admin'; break;
     }

     const payload = {
        uid: `demo-${userPrefix}`,
        email,
        role,
        fullName
     };

     // const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
     const token = 'mock-jwt-token-replace-in-prod';

     return res.json({ token, user: payload });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

export default router;
