import { useNavigate } from 'react-router-dom'

const MemberCard = ({ receiver }) => {
  const navigate = useNavigate()

  const startChat = () => {
    if (!receiver?._id) return
    navigate(`/dm/${receiver._id}`)
  }

  return (
    <button
      onClick={startChat}
      className="px-3 py-1 mt-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      Message {receiver.username}
    </button>
  )
}

export default MemberCard
