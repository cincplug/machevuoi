const Message = ({ message }) => {
  return (
    <div className="message">
      {message.split(/(?<=[.!?])\s/).map((sentence, index) => (
        <p key={index}>{sentence}</p>
      ))}
    </div>
  );
};

export default Message;
