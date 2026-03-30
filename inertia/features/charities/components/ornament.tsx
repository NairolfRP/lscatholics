export function Ornament() {
  return (
    <div className="flex items-center justify-center gap-4 my-2">
      <span className="block h-px w-16 bg-secondary/60" />
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-secondary">
        <path d="M8 0v16M0 8h16M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1" />
      </svg>
      <span className="block h-px w-16 bg-secondary/60" />
    </div>
  )
}
