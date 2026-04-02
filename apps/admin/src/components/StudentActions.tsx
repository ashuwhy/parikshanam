'use client'

export function StudentActions({
  isActive,
  onDeactivate,
  onDelete,
}: {
  isActive: boolean
  onDeactivate: () => Promise<void>
  onDelete: () => Promise<void>
}) {
  return (
    <div className="mt-4 flex gap-4">
      {isActive && (
        <form action={onDeactivate}>
          <button type="submit" className="text-xs text-red-500 hover:underline">
            Deactivate
          </button>
        </form>
      )}
      <button
        type="button"
        className="text-xs text-red-700 font-semibold hover:underline"
        onClick={() => {
          if (confirm('Permanently delete this user and all their data? This cannot be undone.')) {
            void onDelete()
          }
        }}
      >
        Delete user
      </button>
    </div>
  )
}
