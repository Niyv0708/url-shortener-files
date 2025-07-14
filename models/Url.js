const mongoose = require('mongoose');

// 定义连接函数
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return; // 避免重复连接
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw new Error('Database connection failed');
  }
};

// 定义URL模型
const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true, unique: true, trim: true },
  short_url: { type: Number, required: true, unique: true }
});

// 将 connectDB 添加为模型的静态方法
urlSchema.statics.connectDB = connectDB;

// 生成下一个short_url（确保连接后查询）
urlSchema.statics.getNextShortUrl = async function () {
  await this.connectDB(); // 通过 this 调用当前模型的静态方法
  const count = await this.countDocuments({});
  return count + 1;
};

module.exports = mongoose.models.Url || mongoose.model('Url', urlSchema);
  