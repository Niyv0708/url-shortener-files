const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return; 
  try {
    // 新增：显式设置连接超时（30秒）和认证源（可选）
    await mongoose.connect(process.env.MONGODB_URI, {
      connectTimeoutMS: 30000, // 延长连接超时时间
      authSource: 'admin'       // 若数据库认证源非默认，需指定（如 'admin'）
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.stack); // 输出完整错误堆栈
    throw new Error('Database connection failed');
  }
};

const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true, unique: true, trim: true },
  short_url: { type: Number, required: true, unique: true }
});

urlSchema.statics.connectDB = connectDB;

// 生成下一个short_url（原子操作，确保初始值）
urlSchema.statics.getNextShortUrl = async function () {
  await this.connectDB();
  // 关键修改：upsert时设置初始sequence_value为1
  const counter = await this.collection.findOneAndUpdate(
    { _id: 'shortUrlCounter' },
    { $inc: { sequence_value: 1 }, $setOnInsert: { sequence_value: 1 } }, // 新增$setOnInsert初始化
    { upsert: true, returnDocument: 'after' }
  );
  return counter.value.sequence_value;
};

module.exports = mongoose.models.Url || mongoose.model('Url', urlSchema);
  