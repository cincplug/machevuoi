interface LoaderProps {
  color: string;
}

const Loader: React.FC<LoaderProps> = ({ color }) => (
  <svg
    className="loader"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 50 50"
  >
    <circle
      className="loader-circle"
      cx="25"
      cy="25"
      r="20"
      style={{ stroke: color }}
    />
  </svg>
);

export default Loader;
