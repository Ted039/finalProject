const badgeCatalog = {
  skill_collector: {
    icon: '🧠',
    title: 'Skill Collector',
    description: 'Added 5+ skills',
    theme: 'bg-yellow-100 dark:bg-yellow-800'
  },
  swap_master: {
    icon: '🔁',
    title: 'Swap Master',
    description: 'Completed 3 swaps',
    theme: 'bg-blue-100 dark:bg-blue-800'
  },
  first_connect: {
    icon: '📩',
    title: 'First Connect',
    description: 'Sent your first swap request',
    theme: 'bg-purple-100 dark:bg-purple-800'
  },
  profile_complete: {
    icon: '✅',
    title: 'Profile Complete',
    description: 'Avatar + email + 3 skills',
    theme: 'bg-green-100 dark:bg-green-800'
  }
}

const BadgePanel = ({ earnedBadges }) => {
  return (
    <div className="mt-6">
      <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-white">Your Achievements</h3>
      {earnedBadges.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No badges yet — go earn some!</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {earnedBadges.map((badgeKey) => {
            const badge = badgeCatalog[badgeKey]
            return (
              <div key={badgeKey} className={`${badge.theme} p-4 rounded-lg text-center shadow hover:scale-105 transition`}>
                <span className="text-2xl">{badge.icon}</span>
                <h4 className="font-bold mt-2">{badge.title}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">{badge.description}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default BadgePanel
