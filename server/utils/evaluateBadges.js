
export const evaluateAndStoreBadges = async (userModelInstance) => {
  const badgeCatalog = {
    skill_collector: {
      test: (user) => user.skills?.length >= 5,
      message: "🎉 You've earned the Skill Collector badge!",
    },
    swap_master: {
      test: (user) => user.completedSwaps?.length >= 3,
      message: "🏆 You're now a Swap Master!",
    },
    profile_complete: {
      test: (user) =>
        user.avatar && user.email && user.skills?.length >= 3,
      message: " Profile Complete badge unlocked!",
    },
    first_connect: {
      test: (user) => user.swapRequests?.length >= 1,
      message: "📩 First Connect badge earned!",
    },
  }

  const earned = []

  for (const key in badgeCatalog) {
    if (
      badgeCatalog[key].test(userModelInstance) &&
      !userModelInstance.badges.includes(key)
    ) {
      userModelInstance.badges.push(key)
      earned.push(badgeCatalog[key].message)
    }
  }

  if (earned.length) await userModelInstance.save()
  return earned
}
