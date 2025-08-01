import Project from '../models/Project.js';
import Notification from '../models/Notification.js';

// GET active projects with pagination
export const getActiveProjects = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;

  try {
    const projects = await Project.find({ status: 'In Progress' })
      .populate('partner')
      .populate('initiator')
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

// POST start a new project
export const startProject = async (req, res) => {
  const { partnerId, skill, swapId, title } = req.body;

  try {
    if (!partnerId || !skill || !swapId || !title) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newProject = await Project.create({
      collabTitle: title,
      initiator: req.user.id,
      partner: partnerId,
      skillsOffered: skill,
      swapId,
      startedAt: new Date(),
      status: 'In Progress',
      messages: [],
      notes: [],
      resourcesShared: []
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error starting project:', error.message);
    res.status(500).json({ message: 'Failed to start project' });
  }
};

// POST approve a project
export const approveProject = async (req, res) => {
  const { projectId, recipientId } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.status = 'Completed';
    project.completedAt = new Date();
    await project.save();

    await Notification.create({
      recipientId,
      message: 'Your project has been approved!',
      startedProjectId: project._id
    });

    res.status(200).json({ message: 'Project approved and notification sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve project.' });
  }
};

// PUT cancel a project
export const cancelProject = async (req, res) => {
  const { projectId } = req.params;
  const { recipientId } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.status = 'Cancelled';
    await project.save();

    if (recipientId) {
      await Notification.create({
        recipientId,
        message: `Collaboration on "${project.collabTitle}" has been cancelled.`,
        startedProjectId: project._id
      });
    }

    res.status(200).json({ message: 'Project collaboration cancelled.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel project.' });
  }
};

// GET single project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('partner')
      .populate('initiator')
      .populate('messages.userId')
      .populate('notes.addedBy')
      .populate('resourcesShared.addedBy');

    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST add resource to project
export const addProjectResource = async (req, res) => {
  const { title, type, url } = req.body;

  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.resourcesShared.push({
      title,
      type,
      url,
      addedBy: req.user.id,
      timestamp: new Date()
    });

    await project.save();
    res.status(201).json({ message: 'Resource added successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add resource.' });
  }
};

// POST add note to project
export const addProjectNote = async (req, res) => {
  const { content } = req.body;

  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.notes.push({
      content,
      addedBy: req.user.id,
      timestamp: new Date()
    });

    await project.save();
    res.status(201).json({ message: 'Note added successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add note.' });
  }
};

// POST add message to project
export const addProjectMessage = async (req, res) => {
  const { message } = req.body;

  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.messages.push({
      message,
      userId: req.user.id,
      timestamp: new Date()
    });

    await project.save();
    res.status(201).json({ message: 'Message added successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add message.' });
  }
};

