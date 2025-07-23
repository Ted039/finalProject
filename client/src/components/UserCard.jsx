import { useState } from 'react'
import SwapRequestForm from './SwapRequestForm'
import MemberCard from './MemberCard'
import { toast } from 'react-hot-toast'

const UserCard = ({ user }) => {
  const [showModal, setShowModal] = useState(false)

  const closeModal = () => setShowModal(false)

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow hover:shadow-lg transition flex flex-col justify-between">
      {/* Profile */}
      <div className="flex items-center gap-4 mb-4">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="Avatar"
            className="h-16 w-16 rounded-full object-cover ring-2 ring-green-600"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-800 dark:text-white">
            {user.username.slice(0, 2).toUpperCase()}
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold dark:text-white">{user.username}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Skills: <span className="font-medium">{user.skills?.join(', ') || 'None listed'}</span>
          </p>
          <p className="text-xs text-gray-500">
            Categories: {user.categories?.join(', ') || 'Uncategorized'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-3 space-y-3">
        <button
          onClick={() => setShowModal(true)}
          className="w-full text-sm py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Request Swap 
        </button>

        <MemberCard receiver={user} />
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg w-full shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <SwapRequestForm
              toUserId={user._id}
              toUsername={user.username}
              onSuccess={() => {
                toast.success(`Swap request sent to ${user.username}`)
                closeModal()
              }}
            />
          </div>
        </div>
      )}
    </article>
  )
}

export default UserCard
