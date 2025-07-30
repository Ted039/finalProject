import mongoose from 'mongoose'

const SkillCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String }, // optional emoji or icon
})

export default mongoose.model('SkillCategory', SkillCategorySchema)
