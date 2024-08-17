/* import React from "react";
import PropTypes from "prop-types";
import MessageList from "./MessageList";

const ActiveConversation = ({
  conversations,
  activeConversationId,
  setActiveConversationId,
}) => {
  return (
    <div>
      <h2>Active Conversations</h2>
      <ul>
        {conversations.map((conv) => (
          <li
            key={conv.id}
            onClick={() => setActiveConversationId(conv.id)}
            style={{
              cursor: "pointer",
              padding: "5px",
              border: "1px solid #ddd",
              marginBottom: "5px",
            }}
          >
            {conv.title || `Conversation ${conv.id}`}
          </li>
        ))}
      </ul>
      {activeConversationId && (
        <MessageList
          conversationId={activeConversationId}
          // Pass additional props as needed for message fetching and displaying
        />
      )}
    </div>
  );
};

ActiveConversation.propTypes = {
  conversations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string,
    })
  ).isRequired,
  activeConversationId: PropTypes.string,
  setActiveConversationId: PropTypes.func.isRequired,
};

export default ActiveConversation;
 */
