const EmptyState = () => (
  <div className="flex flex-col items-center justify-center">
    <img
      src="/illustrations/no-results.svg" // Replace with your illustration
      alt="No results found"
      className="w-48 h-48 mb-4"
    />
    <h3 className="text-lg font-semibold text-gray-700 dark:text-white">
      No matching members
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
      Try adjusting your filters or searching a different skill.
    </p>
  </div>
)
export default EmptyState
