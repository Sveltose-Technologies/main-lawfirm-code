// "use client";
// import React, {
//   useEffect,
//   useState,
//   useRef,
//   useCallback,
//   useMemo,
// } from "react";
// import { Row, Col, Input, ListGroup, ListGroupItem, Button } from "reactstrap";
// import * as authService from "../../services/authService";

// const Messages = () => {
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [typedMessage, setTypedMessage] = useState("");
//   const [chatList, setChatList] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [conversations, setConversations] = useState({});
//   const scrollRef = useRef(null);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [conversations, selectedChat]);
//   // 1. Memoize Data Fetching for Users
//   const getAllUserData = useCallback(async () => {
//     try {
//       const [alluserResponse, allAttorneysResponse] = await Promise.all([
//         authService.getAllUsers(),
//         authService.getAllAttorneys(),
//       ]);

//       const usersList = (alluserResponse?.clients || [])
//         .filter((user) => user.status === "verified")
//         .map((user) => ({
//           id: user.id,
//           chatId: `user-${user.id}`,
//           name: `${user.firstName} ${user.lastName || ""}`,
//           role: "User",
//           img: user.profileImage
//             ? authService.getImgUrl(user.profileImage)
//             : "/assets/images/profilepic.png",
//         }));

//       const attorneysList = (allAttorneysResponse?.attorneys || [])
//         .filter((attorney) => attorney.status === "verified")
//         .map((attorney) => ({
//           id: attorney.id,
//           chatId: `attorney-${attorney.id}`,
//           name: `${attorney.firstName || attorney.name} ${attorney.lastName || ""}`,
//           role: "Attorney",
//           img: attorney.profileImage
//             ? authService.getImgUrl(attorney.profileImage)
//             : "/assets/images/profilepic.png",
//         }));

//       setChatList([...usersList, ...attorneysList]);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   }, []);

//   // 2. Memoize Chat History Fetching
//   const getChatHistory = useCallback(async () => {
//     if (!selectedChat) return;
//     const user = JSON.parse(localStorage.getItem("user"));
//     try {
//       let response;
//       if (selectedChat.role === "User") {
//         response = await authService.getUserMessageHistory(
//           user?.id,
//           selectedChat.id,
//         );
//       } else {
//         response = await authService.getAttorneyMessageHistory(
//           user?.id,
//           selectedChat.id,
//         );
//       }

//       const formattedMessages = (response?.data || []).map((msg) => ({
//         id: msg.id || msg._id,
//         text: msg.message,
//         sender: msg.senderType === "admin" ? "Me" : selectedChat.name,
//         time: new Date(msg.createdAt).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//       }));

//       // Only update state if messages actually changed to prevent jitter
//       setConversations((prev) => {
//         const currentMsgs = prev[selectedChat.chatId] || [];
//         if (JSON.stringify(currentMsgs) === JSON.stringify(formattedMessages))
//           return prev;
//         return { ...prev, [selectedChat.chatId]: formattedMessages };
//       });
//     } catch (error) {
//       console.error("Error history:", error);
//     }
//   }, [selectedChat]);

//   // 3. Polling for Runtime feel (updates every 3 seconds)
//   useEffect(() => {
//     getAllUserData();
//   }, [getAllUserData]);

//   useEffect(() => {
//     if (!selectedChat) return;
//     getChatHistory(); // Initial fetch

//     const interval = setInterval(() => {
//       getChatHistory();
//     }, 3000); // Poll every 3 seconds

//     return () => clearInterval(interval);
//   }, [selectedChat, getChatHistory]);

//   // 4. Memoize Message Sending
//   const handleSendMessage = useCallback(
//     async (e) => {
//       if (e) e.preventDefault();
//       if (!typedMessage.trim() || !selectedChat) return;

//       const user = JSON.parse(localStorage.getItem("user"));
//       const currentMsg = typedMessage;
//       setTypedMessage("");

//       const payload = {
//         adminId: user?.id,
//         senderType: "admin",
//         message: currentMsg,
//       };

//       try {
//         if (selectedChat.role === "Attorney") {
//           payload.attorneyId = selectedChat.id;
//           await authService.adminAttorneyMessage(payload);
//         } else {
//           payload.clientId = selectedChat.id;
//           await authService.adminClientMessage(payload);
//         }
//         getChatHistory(); // Refresh instantly after sending
//       } catch (error) {
//         console.error("Send error:", error);
//       }
//     },
//     [typedMessage, selectedChat, getChatHistory],
//   );

//   // 5. Optimized Filtering with useMemo
//   const filteredChatList = useMemo(() => {
//     return chatList.filter((chat) =>
//       chat.name.toLowerCase().includes(searchTerm.toLowerCase()),
//     );
//   }, [chatList, searchTerm]);

//   return (
//     <div className="p-2 p-md-3" style={{ height: "calc(100vh - 100px)" }}>
//       <Row className="h-100 g-0 shadow-sm rounded-4 border overflow-hidden bg-white">
//         {/* LEFT SIDE: Inbox */}
//         <Col
//           md="4"
//           lg="3"
//           className="border-end d-flex flex-column h-100 bg-light">
//           <div className="p-3 bg-white border-bottom">
//             <h5 className="fw-bold mb-3">Messages</h5>
//             <Input
//               placeholder="Search..."
//               className="rounded-pill border-0 bg-light px-3"
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <ListGroup
//             flush
//             className="overflow-auto flex-grow-1 custom-scrollbar">
//             {filteredChatList.map((chat) => (
//               <ListGroupItem
//                 key={chat.chatId}
//                 active={selectedChat?.chatId === chat.chatId}
//                 onClick={() => setSelectedChat(chat)}
//                 className="p-3 border-0 border-bottom chat-item d-flex align-items-center gap-3"
//                 style={{ cursor: "pointer" }}>
//                 <img
//                   src={chat.img}
//                   width="45"
//                   height="45"
//                   className="rounded-circle border"
//                   alt=""
//                 />
//                 <div className="flex-grow-1">
//                   <div className="fw-bold text-dark small">{chat.name}</div>
//                   <div className="text-muted" style={{ fontSize: "11px" }}>
//                     {chat.role}
//                   </div>
//                 </div>
//               </ListGroupItem>
//             ))}
//           </ListGroup>
//         </Col>

//         {/* RIGHT SIDE: Chat Window */}
//         <Col md="8" lg="9" className="d-flex flex-column h-100 bg-white">
//           {selectedChat ? (
//             <>
//               {/* Header */}
//               <div className="p-3 border-bottom d-flex align-items-center gap-3 bg-white">
//                 <img
//                   src={selectedChat.img || "/assets/images/profilepic.png"}
//                   width="40"
//                   height="40"
//                   className="rounded-circle border"
//                   alt=""
//                 />
//                 <div>
//                   <div className="fw-bold small">{selectedChat.name}</div>
//                   <div className="text-primary" style={{ fontSize: "11px" }}>
//                     {selectedChat.role}
//                   </div>
//                 </div>
//               </div>

//               {/* Messages Area */}
//               <div
//                 className="flex-grow-1 p-3 overflow-auto bg-light custom-scrollbar"
//                 ref={scrollRef}>
//                 {(conversations[selectedChat.chatId] || []).map((msg) => (
//                   <div
//                     key={msg.id}
//                     className={`d-flex mb-3 ${msg.sender === "Me" ? "justify-content-end" : "justify-content-start"}`}>
//                     <div
//                       className={`p-2 px-3 shadow-sm ${msg.sender === "Me" ? "text-white" : "bg-white text-dark"}`}
//                       style={{
//                         maxWidth: "75%",
//                         backgroundColor:
//                           msg.sender === "Me" ? "#083f36" : "#ffffff",
//                         borderRadius:
//                           msg.sender === "Me"
//                             ? "12px 12px 2px 12px"
//                             : "12px 12px 12px 2px",
//                       }}>
//                       <div className="small">{msg.text}</div>
//                       <div
//                         className="text-end"
//                         style={{ fontSize: "9px", opacity: 0.7 }}>
//                         {msg.time}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Input Area (Ispe Border-Top hai taaki alag dikhe) */}
//               <div className="p-3 border-top bg-white">
//                 <form onSubmit={handleSendMessage} className="d-flex gap-2">
//                   <Input
//                     type="text"
//                     placeholder="Write a message..."
//                     className="rounded-pill bg-light border-0 px-4"
//                     value={typedMessage}
//                     onChange={(e) => setTypedMessage(e.target.value)}
//                   />
//                   <Button
//                     type="submit"
//                     className="rounded-circle border-0 d-flex align-items-center justify-content-center"
//                     style={{
//                       backgroundColor: "#083f36",
//                       width: "45px",
//                       height: "45px",
//                     }}>
//                     <i className="bi bi-send-fill text-white"></i>
//                   </Button>
//                 </form>
//               </div>
//             </>
//           ) : (
//             <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
//               <i className="bi bi-chat-dots fs-1 opacity-25"></i>
//               <p className="mt-2">Select a chat to start</p>
//             </div>
//           )}
//         </Col>
//       </Row>

//       <style jsx>{`
//         .chat-item:hover {
//           background-color: #f8f9fa !important;
//         }
//         .chat-item.active {
//           background-color: #e9ecef !important;
//           border-left: 4px solid #083f36 !important;
//         }
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 5px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #ccc;
//           border-radius: 5px;
//         }
//       `}</style>
//     </div>
//   );
// };;

// export default Messages;

"use client";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Row, Col, Input, ListGroup, ListGroupItem, Button } from "reactstrap";
import * as authService from "../../services/authService";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [typedMessage, setTypedMessage] = useState("");
  const [chatList, setChatList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState({});

  // States for file uploads
  const [imageFile, setImageFile] = useState(null);
  const [attachmentFile, setAttachmentFile] = useState(null);

  const scrollRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversations, selectedChat]);

  // Fetch all Users and Attorneys for the sidebar
  const getAllUserData = useCallback(async () => {
    try {
      const [alluserResponse, allAttorneysResponse] = await Promise.all([
        authService.getAllUsers(),
        authService.getAllAttorneys(),
      ]);

      const usersList = (alluserResponse?.clients || [])
        .filter((user) => user.status === "verified")
        .map((user) => ({
          id: user.id,
          chatId: `user-${user.id}`,
          name: `${user.firstName} ${user.lastName || ""}`,
          role: "User",
          img: user.profileImage
            ? authService.getImgUrl(user.profileImage)
            : "/assets/images/profilepic.png",
        }));

      const attorneysList = (allAttorneysResponse?.attorneys || [])
        .filter((attorney) => attorney.status === "verified")
        .map((attorney) => ({
          id: attorney.id,
          chatId: `attorney-${attorney.id}`,
          name: `${attorney.firstName || attorney.name} ${attorney.lastName || ""}`,
          role: "Attorney",
          img: attorney.profileImage
            ? authService.getImgUrl(attorney.profileImage)
            : "/assets/images/profilepic.png",
        }));

      setChatList([...usersList, ...attorneysList]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  // Fetch Message History including Images and Attachments
  const getChatHistory = useCallback(async () => {
    if (!selectedChat) return;
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      let response;
      if (selectedChat.role === "User") {
        response = await authService.getUserMessageHistory(
          user?.id,
          selectedChat.id,
        );
      } else {
        response = await authService.getAttorneyMessageHistory(
          user?.id,
          selectedChat.id,
        );
      }

      // Updated mapping to include image and attachment URLs
      const formattedMessages = (response?.data || []).map((msg) => ({
        id: msg.id || msg._id,
        text: msg.message,
        image: msg.image, // From API
        attachment: msg.attachment, // From API
        sender: msg.senderType === "admin" ? "Me" : selectedChat.name,
        time: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setConversations((prev) => {
        const currentMsgs = prev[selectedChat.chatId] || [];
        if (JSON.stringify(currentMsgs) === JSON.stringify(formattedMessages))
          return prev;
        return { ...prev, [selectedChat.chatId]: formattedMessages };
      });
    } catch (error) {
      console.error("Error history:", error);
    }
  }, [selectedChat]);

  useEffect(() => {
    getAllUserData();
  }, [getAllUserData]);

  useEffect(() => {
    if (!selectedChat) return;
    getChatHistory();
    const interval = setInterval(() => {
      getChatHistory();
    }, 3000); // Polling every 3 seconds
    return () => clearInterval(interval);
  }, [selectedChat, getChatHistory]);

  // Send Message with Text, Image, and PDF
  const handleSendMessage = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      if (
        (!typedMessage.trim() && !imageFile && !attachmentFile) ||
        !selectedChat
      ) {
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));
      const senderId = user?.id || user?._id;

      if (!senderId) {
        console.error("No Admin ID found");
        return;
      }

      const formData = new FormData();
      formData.append("adminId", senderId);
      formData.append("senderType", "admin");
      // Use a space as fallback text if sending only files
      formData.append("message", typedMessage.trim() || " ");

      if (imageFile) formData.append("image", imageFile);
      if (attachmentFile) formData.append("attachment", attachmentFile);

      if (selectedChat.role === "Attorney") {
        formData.append("attorneyId", selectedChat.id);
      } else {
        formData.append("clientId", selectedChat.id);
      }

      try {
        if (selectedChat.role === "Attorney") {
          await authService.adminAttorneyMessage(formData);
        } else {
          await authService.adminClientMessage(formData);
        }

        setTypedMessage("");
        setImageFile(null);
        setAttachmentFile(null);
        getChatHistory();
      } catch (error) {
        console.error(
          "Send error details:",
          error.response?.data || error.message,
        );
      }
    },
    [typedMessage, selectedChat, getChatHistory, imageFile, attachmentFile],
  );

  const filteredChatList = useMemo(() => {
    return chatList.filter((chat) =>
      chat.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [chatList, searchTerm]);

  return (
    <div className="p-2 p-md-3" style={{ height: "calc(100vh - 100px)" }}>
      <Row className="h-100 g-0 shadow-sm rounded-4 border overflow-hidden bg-white">
        {/* Sidebar */}
        <Col
          md="4"
          lg="3"
          className="border-end d-flex flex-column h-100 bg-light">
          <div className="p-3 bg-white border-bottom">
            <h5 className="fw-bold mb-3">Messages</h5>
            <Input
              placeholder="Search..."
              className="rounded-pill border-0 bg-light px-3"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ListGroup
            flush
            className="overflow-auto flex-grow-1 custom-scrollbar">
            {filteredChatList.map((chat) => (
              <ListGroupItem
                key={chat.chatId}
                active={selectedChat?.chatId === chat.chatId}
                onClick={() => setSelectedChat(chat)}
                className="p-3 border-0 border-bottom chat-item d-flex align-items-center gap-3"
                style={{ cursor: "pointer" }}>
                <img
                  src={chat.img}
                  width="45"
                  height="45"
                  className="rounded-circle border"
                  alt=""
                />
                <div className="flex-grow-1">
                  <div className="fw-bold text-dark small">{chat.name}</div>
                  <div className="text-muted" style={{ fontSize: "11px" }}>
                    {chat.role}
                  </div>
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </Col>

        {/* Chat Window */}
        <Col md="8" lg="9" className="d-flex flex-column h-100 bg-white">
          {selectedChat ? (
            <>
              <div className="p-3 border-bottom d-flex align-items-center gap-3 bg-white">
                <img
                  src={selectedChat.img || "/assets/images/profilepic.png"}
                  width="40"
                  height="40"
                  className="rounded-circle border"
                  alt=""
                />
                <div>
                  <div className="fw-bold small">{selectedChat.name}</div>
                  <div className="text-primary" style={{ fontSize: "11px" }}>
                    {selectedChat.role}
                  </div>
                </div>
              </div>

              {/* Message List */}
              <div
                className="flex-grow-1 p-3 overflow-auto bg-light custom-scrollbar"
                ref={scrollRef}>
                {(conversations[selectedChat.chatId] || []).map((msg) => (
                  <div
                    key={msg.id}
                    className={`d-flex mb-3 ${msg.sender === "Me" ? "justify-content-end" : "justify-content-start"}`}>
                    <div
                      className={`p-2 px-3 shadow-sm ${msg.sender === "Me" ? "text-white" : "bg-white text-dark"}`}
                      style={{
                        maxWidth: "75%",
                        backgroundColor:
                          msg.sender === "Me" ? "#083f36" : "#ffffff",
                        borderRadius:
                          msg.sender === "Me"
                            ? "12px 12px 2px 12px"
                            : "12px 12px 12px 2px",
                      }}>
                      {/* Image Rendering */}
                      {/* Image Rendering */}
                      {msg.image && (
                        <div className="mb-2 mt-1">
                          <img
                            src={authService.getImgUrl(msg.image)}
                            alt="sent file"
                            className="rounded-3 shadow-sm"
                            style={{
                              maxHeight: "180px", // Reduced height
                              maxWidth: "220px", // Added width limit
                              width: "100%",
                              objectFit: "cover", // Keeps aspect ratio nice
                              cursor: "pointer",
                              display: "block",
                            }}
                            onClick={() =>
                              window.open(
                                authService.getImgUrl(msg.image),
                                "_blank",
                              )
                            }
                          />
                        </div>
                      )}
                      {/* PDF / Attachment Rendering */}
                      {msg.attachment && (
                        <div className="mb-2 mt-1">
                          <a
                            href={authService.getImgUrl(msg.attachment)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`d-flex align-items-center gap-2 p-2 rounded border ${
                              msg.sender === "Me"
                                ? "text-white border-light"
                                : "text-dark border-secondary"
                            }`}
                            style={{
                              textDecoration: "none",
                              fontSize: "12px",
                            }}>
                            <i className="bi bi-file-earmark-pdf-fill fs-4 text-danger"></i>
                            <span>View Document</span>
                            <i className="bi bi-download ms-auto"></i>
                          </a>
                        </div>
                      )}

                      {/* Text Rendering (Hides empty space fallback) */}
                      {msg.text && msg.text.trim() !== "" && (
                        <div className="small">{msg.text}</div>
                      )}

                      <div
                        className="text-end"
                        style={{ fontSize: "9px", opacity: 0.7 }}>
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-3 border-top bg-white">
                {(imageFile || attachmentFile) && (
                  <div className="mb-2 d-flex gap-2">
                    {imageFile && (
                      <span className="badge bg-secondary p-2">
                        <i className="bi bi-image me-1"></i> {imageFile.name}
                        <i
                          className="bi bi-x-circle ms-2 cursor-pointer"
                          onClick={() => setImageFile(null)}></i>
                      </span>
                    )}
                    {attachmentFile && (
                      <span className="badge bg-secondary p-2">
                        <i className="bi bi-file-earmark me-1"></i>{" "}
                        {attachmentFile.name}
                        <i
                          className="bi bi-x-circle ms-2 cursor-pointer"
                          onClick={() => setAttachmentFile(null)}></i>
                      </span>
                    )}
                  </div>
                )}

                <form
                  onSubmit={handleSendMessage}
                  className="d-flex gap-2 align-items-center">
                  <Input
                    type="text"
                    placeholder="Write a message..."
                    className="rounded-pill bg-light border-0 px-4"
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                  />
                  <label className="mb-0 px-2" style={{ cursor: "pointer" }}>
                    <i className="bi bi-image text-muted fs-5"></i>
                    <input
                      type="file"
                      accept="image/*"
                      className="d-none"
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />
                  </label>
                  <label className="mb-0 px-2" style={{ cursor: "pointer" }}>
                    <i className="bi bi-paperclip text-muted fs-5"></i>
                    <input
                      type="file"
                      className="d-none"
                      onChange={(e) => setAttachmentFile(e.target.files[0])}
                    />
                  </label>
                  <Button
                    type="submit"
                    className="rounded-circle border-0 d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: "#083f36",
                      width: "45px",
                      height: "45px",
                    }}>
                    <i className="bi bi-send-fill text-white"></i>
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
              <i className="bi bi-chat-dots fs-1 opacity-25"></i>
              <p className="mt-2">Select a chat to start</p>
            </div>
          )}
        </Col>
      </Row>

      <style jsx>{`
        .chat-item:hover {
          background-color: #f8f9fa !important;
        }
        .chat-item.active {
          background-color: #e9ecef !important;
          border-left: 4px solid #083f36 !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 5px;
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Messages;
