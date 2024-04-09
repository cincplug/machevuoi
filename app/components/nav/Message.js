const Message = ({ message, setMessage }) => {
  return (
    <div className="message">
      {message.split(/(?<=[.!?])\s/).map((sentence, index) => (
        <p key={index}>{sentence}</p>
      ))}
      <button className="close" onClick={() => setMessage("")}>
        ✖️
      </button>
    </div>
  );
};

export default Message;
