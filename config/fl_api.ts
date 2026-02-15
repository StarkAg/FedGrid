// FL backend API (Flask) for training rounds / metrics
export const FL_API_URL =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_FL_API_URL || 'http://localhost:5000')
    : process.env.NEXT_PUBLIC_FL_API_URL || 'http://localhost:5000';
