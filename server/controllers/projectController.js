
const Project = require('../models/Project')

// GET active projects
exports.getActiveProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: 'In Progress' }).populate('partner')
    res.json(projects)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
}

// POST start a project
exports.startProject = async (req, res) => {
  const { partnerId, skill, swapId, title } = req.body
  try {
    const newProject = await Project.create({
      partner: partnerId,
      skill,
      swapId,
      title,
      startedAt: new Date(),
      status: 'In Progress'
    })
    res.status(201).json(newProject)
  } catch (err) {
    res.status(500).json({ error: 'Failed to start project' })
  }
}

export const getActiveProjects = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;

  try {
    const projects = await Project.find({ status: 'In Progress' })
      .populate('partner')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Project.countDocuments({ status: 'In Progress' });

    res.status(200).json({
      projects,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch active projects' });
  }
};

