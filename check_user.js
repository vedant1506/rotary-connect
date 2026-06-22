const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function checkUser() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection;
  const adminUsers = await db.collection('adminusers').find({}).toArray();
  console.log("All Admin Users:", adminUsers);
  process.exit(0);
}
checkUser().catch(console.error);
