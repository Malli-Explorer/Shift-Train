import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[ShiftTrain AI] Backend listening on port ${PORT}`);
  console.log(`[ShiftTrain AI] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[ShiftTrain AI] Notice: Demo railway data active.`);
});
