import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConversations, getMessages, sendMessage, clearCurrentChat } from "../store/slices/messageSlice";
import { Spinner, Form, Button } from "react-bootstrap";
import { AiOutlineSend, AiOutlineArrowLeft } from "react-icons/ai";
import { useLocation } from "react-router-dom"; 
import moment from "moment";
import "../styles/Messages.css";

const Messages = () => {
  const dispatch = useDispatch();
  const location = useLocation(); 
  
  const { conversations, currentChatMessages } = useSelector((state) => state.messages);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [activeConversation, setActiveConversation] = useState(null);
  const [text, setText] = useState("");
  const scrollRef = useRef();

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  useEffect(() => {
    if (location.state?.chatWith && currentUser) {
      const targetUser = location.state.chatWith;
      
      const existingConv = conversations.find(c => 
        c.participants.some(p => p._id === targetUser._id)
      );

      if (existingConv) {
        setTimeout(() => {
          setActiveConversation(prev => {
            if (prev?._id === existingConv._id) return prev; 
            return existingConv;
          });
        }, 0);
      } else {
        setTimeout(() => {
          setActiveConversation(prev => {
            const isSameTemp = prev?._id === "new" && prev.participants.some(p => p._id === targetUser._id);
            if (isSameTemp) return prev;

            return {
              _id: "new",
              participants: [currentUser, targetUser],
              isTemp: true 
            };
          });
        }, 0);
      }
    }
  }, [conversations, location.state, currentUser]);

  useEffect(() => {
    if (activeConversation && !activeConversation.isTemp) {
      dispatch(getMessages(activeConversation._id));
    } else {
      dispatch(clearCurrentChat()); 
    }
  }, [activeConversation, dispatch]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChatMessages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeConversation) return;

    const recipient = activeConversation.participants.find((p) => p._id !== currentUser._id);

    await dispatch(sendMessage({ recipientId: recipient._id, text }));
    setText("");

    if (activeConversation.isTemp) {
      dispatch(getConversations());
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "/default-profile-picture.jpg";
    return path.startsWith("http") ? path : `${serverUrl}${path}`;
  };

  const getOtherUser = (conversation) => {
    return conversation.participants.find((p) => p._id !== currentUser._id);
  };

  return (
    <div className="messages-container">
      <div className={`conversations-list ${activeConversation ? "d-none d-md-block" : "d-block"}`}>
        <div className="messages-header">
           <h4>{currentUser.username}</h4>
           <span className="text-muted-custom">Messages</span>
        </div>

        <div className="conversations-scroll">
          {conversations.map((conv) => {
            const otherUser = getOtherUser(conv);
            return (
              <div 
                key={conv._id} 
                className={`conversation-item ${activeConversation?._id === conv._id ? "active" : ""}`}
                onClick={() => setActiveConversation(conv)}
              >
                <img 
                  src={getImageUrl(otherUser?.profilePic)} 
                  alt="user" 
                  className="conversation-avatar"
                />
                <div className="conversation-info">
                  <span className="conversation-username">{otherUser?.name || "User"}</span>
                  <span className="conversation-last-msg">
                    {conv.lastMessage?.text ? 
                      (conv.lastMessage.text.length > 25 ? conv.lastMessage.text.substring(0, 25) + "..." : conv.lastMessage.text) 
                      : <i className="text-muted">Start a conversation</i>}
                  </span>
                </div>
                {conv.lastMessage?.createdAt && (
                    <span className="conversation-time">
                        {moment(conv.lastMessage.createdAt).fromNow(true)}
                    </span>
                )}
              </div>
            );
          })}
          {conversations.length === 0 && (
              <p className="text-center mt-4 text-muted">No conversations yet.</p>
          )}
        </div>
      </div>

      {/* --- Right Chat Window --- */}
      <div className={`chat-window ${!activeConversation ? "d-none d-md-flex" : "d-flex"}`}>
        
        {activeConversation ? (
          <>
            <div className="chat-header">
               <button className="back-btn d-md-none" onClick={() => setActiveConversation(null)}>
                  <AiOutlineArrowLeft size={24} />
               </button>
               <div className="d-flex align-items-center">
                  <img 
                    src={getImageUrl(getOtherUser(activeConversation)?.profilePic)} 
                    alt="avatar" 
                    className="chat-header-avatar"
                  />
                  <span className="chat-header-name">{getOtherUser(activeConversation)?.name}</span>
               </div>
            </div>

            <div className="chat-messages">
              {currentChatMessages.map((msg, index) => {
                const isOwn = msg.sender === currentUser._id;
                return (
                  <div key={index} className={`message-bubble-container ${isOwn ? "own" : "other"}`}>
                    {!isOwn && (
                         <img 
                            src={getImageUrl(getOtherUser(activeConversation)?.profilePic)} 
                            className="msg-avatar-small" 
                            alt="avatar"
                         />
                    )}
                    <div className={`message-bubble ${isOwn ? "own-bubble" : "other-bubble"}`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            <div className="chat-input-area">
              <Form onSubmit={handleSend} className="w-100 d-flex gap-2">
                <div className="input-wrapper w-100">
                    <input 
                      className="chat-input"
                      placeholder="Message..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <Button type="submit" variant="link" disabled={!text.trim()}>
                    <AiOutlineSend size={24} color={text.trim() ? "#0095f6" : "#c7c7c7"} />
                </Button>
              </Form>
            </div>
          </>
        ) : (
          <div className="empty-chat-state">
             <div className="empty-chat-icon">
                 <AiOutlineSend size={50} />
             </div>
             <h3>Your Messages</h3>
             <p>Send private photos and messages to a friend.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;