// FL backend API: when on localhost use port 5001; otherwise same-origin /api (for prod behind nginx)
export const FL_API_URL =
  typeof window !== 'undefined'
    ? (window.location.hostname === 'localhost'
        ? 'http://localhost:5001'
        : `${window.location.origin}/api`)
    : process.env.NEXT_PUBLIC_FL_API_URL || 'http://localhost:5001';
