export const PF = (path) => {
  if (!path) return ""; // handle empty paths
  return path.startsWith("http") ? path : `${process.env.REACT_APP_PUBLIC_FOLDER}${path}`;
};