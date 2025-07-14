const mongoose = require('mongoose');

// 定义连接函数（增强错误日志）
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return; // 避免重复连接
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    // 输出完整错误堆栈（包含具体原因，如认证失败、DNS解析失败等）
    console.error('MongoDB connection error:', err.stack); 
    throw new Error('Database connection failed');
  }
};

const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true, unique: true, trim: true },
  short_url: { type: Number, required: true, unique: true }
});

urlSchema.statics.connectDB = connectDB;

// 生成下一个short_url（原子操作，避免并发冲突）
urlSchema.statics.getNextShortUrl = async function () {
  await this.connectDB();
  // 使用一个单独的计数器文档（若不存在则创建）
  const counter = await this.collection.findOneAndUpdate(
    { _id: 'shortUrlCounter' },
    { $inc: { sequence_value: 1 } },
    { upsert: true, returnDocument: 'after' }
  );
  return counter.value.sequence_value;
};

module.exports = mongoose.models.Url || mongoose.model('Url', urlSchema);
  