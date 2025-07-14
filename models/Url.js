const mongoose = require('mongoose');

// 连接MongoDB
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

connectDB();

// 定义URL模型
const urlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  short_url: {
    type: Number,
    required: true,
    unique: true
  }
});

// 生成下一个short_url（基于现有记录数量）
urlSchema.statics.getNextShortUrl = async function () {
  const count = await this.countDocuments({});
  return count + 1;
};

module.exports = mongoose.models.Url || mongoose.model('Url', urlSchema);
  