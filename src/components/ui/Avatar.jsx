function initials(name) {
  return name
    .replace(/^Prof\.\s*/, '')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function Avatar({ user, size = 36 }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, background: user.color, fontSize: size * 0.38 }}
    >
      {initials(user.name)}
    </span>
  )
}
