
export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-md bg-transparent border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition duration-150 ${className}`}
      {...props}
    />
  );
}

  