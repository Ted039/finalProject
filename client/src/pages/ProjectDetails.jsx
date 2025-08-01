import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import socket from '@/socket'


function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [messageInput, setMessageInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [resourceInput, setResourceInput] = useState({ title: '', url: '', type: 'link' });
  const [liveMessages, setLiveMessages] = useState([]);

  const token = localStorage.getItem('token');

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // If no project found, trigger fallback creation
      if (!res.data) {
        console.warn("No project found — creating one...");
        const createRes = await api.post('/projects/start', {
          swapId, // you'll need to make sure this is accessible
          partnerId,
          skill,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        navigate(`/projects/${createRes.data._id}`);
        return;
      }

      setProject(res.data);
      setLiveMessages(res.data.messages || []);

    } catch (err) {
      console.error('Error fetching project details:', err.response?.data || err.message);
      setProject(null);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProject();
    socket.emit('joinProjectRoom', id);

    socket.on('newProjectMessage', (msg) => {
      setLiveMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit('leaveProjectRoom', id);
      socket.off('newProjectMessage');
    };
  }, [id]);

  const sendMessage = () => {
    socket.emit('sendProjectMessage', { projectId: id, message: messageInput });
    setMessageInput('');
  };

  const submitNote = async () => {
    try {
      await api.post(`/projects/${id}/note`, { content: noteInput }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNoteInput('');
      fetchProject();
    } catch (err) {
      console.error('Error adding note');
    }
  };

  const submitResource = async () => {
    try {
      await api.post(`/projects/${id}/resource`, resourceInput, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResourceInput({ title: '', url: '', type: 'link' });
      fetchProject();
    } catch (err) {
      console.error('Error adding resource');
    }
  };

  const renderTabContent = () => {
    if (!project) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-2">
            <h3 className="text-xl font-bold">{project.collabTitle}</h3>
            <p><strong>Type:</strong> {project.collabType || 'Project'}</p>
            <p><strong>Status:</strong> {project.status}</p>
            <p><strong>Skills Offered:</strong> {project.skillsOffered?.join(', ')}</p>
            <p><strong>Skills Requested:</strong> {project.skillsRequested?.join(', ')}</p>
            <p><strong>Swap ID:</strong> {project.swapId}</p>
            <p><strong>Initiator:</strong> {project.initiator?.username || 'Unknown'}</p>
            <p><strong>Partner:</strong> {project.partner?.username || 'Unknown'}</p>
            <p><strong>Started:</strong> {new Date(project.startedAt).toLocaleDateString()}</p>
            {project.completedAt && (
              <p><strong>Completed:</strong> {new Date(project.completedAt).toLocaleDateString()}</p>
            )}
          </div>
        );

      case 'timeline':
        return <div> Timeline view — milestones, deadlines, progress tracking coming soon.</div>;

      case 'files':
        return <div> File zone — upload/download integration planned.</div>;

      case 'collaborators':
        return (
          <div>
            <p><strong>Collaborators:</strong></p>
            <ul className="list-disc ml-5">
              <li>{project.initiator?.username || 'Initiator unknown'}</li>
              <li>{project.partner?.username || 'Partner unknown'}</li>
            </ul>
          </div>
        );

      case 'messages':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Live Chat</h4>
            {liveMessages.length ? (
              liveMessages.map((msg, index) => (
                <div key={index} className="border p-3 rounded">
                  <p><strong>{msg.user?.username || 'Unknown'}:</strong> {msg.message}</p>
                  <p className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p>No messages yet.</p>
            )}
            <div className="mt-4">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                className="w-full border rounded px-3 py-2 mb-2"
              />
              <button onClick={sendMessage} className="px-4 py-2 bg-blue-600 text-white rounded">
                Send
              </button>
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Notes</h4>
            {project.notes?.length ? (
              project.notes.map((note, index) => (
                <div key={index} className="border p-3 rounded">
                  <p>{note.content}</p>
                  <p className="text-xs text-gray-500">
                    — {note.addedBy?.username || 'Unknown'}, {new Date(note.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No notes added.</p>
            )}
            <div className="mt-4">
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Add a note..."
                className="w-full border rounded px-3 py-2 mb-2"
              />
              <button onClick={submitNote} className="px-4 py-2 bg-green-600 text-white rounded">
                Add Note
              </button>
            </div>
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Resources</h4>
            {project.resourcesShared?.length ? (
              project.resourcesShared.map((res, index) => (
                <div key={index} className="border p-3 rounded">
                  <p><strong>{res.title || 'Untitled'}</strong> ({res.type})</p>
                  {res.url && (
                    <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {res.url}
                    </a>
                  )}
                  <p className="text-xs text-gray-500">
                    Shared by {res.addedBy?.username || 'Unknown'} on {new Date(res.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No resources shared yet.</p>
            )}
            <div className="mt-4 space-y-2">
              <input
                type="text"
                value={resourceInput.title}
                onChange={(e) => setResourceInput({ ...resourceInput, title: e.target.value })}
                placeholder="Resource Title"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                value={resourceInput.url}
                onChange={(e) => setResourceInput({ ...resourceInput, url: e.target.value })}
                placeholder="Resource URL"
                className="w-full border rounded px-3 py-2"
              />
              <select
                value={resourceInput.type}
                onChange={(e) => setResourceInput({ ...resourceInput, type: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="link">Link</option>
                <option value="file">File</option>
                <option value="video">Video</option>
              </select>
              <button onClick={submitResource} className="px-4 py-2 bg-purple-600 text-white rounded">
                Share Resource
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

    return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-semibold dark:text-white mb-4">
        Collaboration Details
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading collaboration info...</p>
      ) : !project ? (
        <p className="text-red-500">Collaboration not found.</p>
      ) : (
        <>
          {/* Tab Navigation */}
          <div className="flex gap-4 border-b mb-6 text-sm font-medium text-gray-500 dark:text-gray-400">
            {[
              'overview',
              'timeline',
              'files',
              'collaborators',
              'messages',
              'notes',
              'resources',
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 border-b-2 ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="text-gray-700 dark:text-gray-300">
            {renderTabContent()}
          </div>
        </>
      )}
    </div>
  );
}

export default ProjectDetails;