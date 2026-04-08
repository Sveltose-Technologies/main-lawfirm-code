"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Row, Col } from "reactstrap";
import ClientLayout from "../../components/layout/ClientLayout";
import {
  getAllAttorneys,
  getAdminProfile,
  getUserMessageHistory,
  getClientAttorneyMessageHistory,
  adminClientMessage,
  attorneyClientMessage,
  getImgUrl,
} from "../../services/authService";

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [typedMessage, setTypedMessage] = useState("");
  const [chatList, setChatList] = useState([]);
  const [conversations, setConversations] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const scrollRef = useRef(null);

  const professionalGreen = "#083f36";

  // 1. Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversations, selectedChat]);

  // 2. Memoized Contact Fetching (Admin & Verified Attorneys)
  const fetchContacts = useCallback(async () => {
    try {
      const [adminRes, attorneysRes] = await Promise.all([
        getAdminProfile(),
        getAllAttorneys(),
      ]);

      let combined = [];

      if (adminRes && adminRes.id) {
        combined.push({
          id: adminRes.id,
          role: "Admin",
          chatId: `admin-${adminRes.id}`,
          name: adminRes.firstName || "Admin Office",
          img: getImgUrl(adminRes.profileImage),
        });
      }

      const verifiedAttorneys = (attorneysRes?.attorneys || [])
        .filter((a) => a.status === "verified")
        .map((a) => ({
          id: a.id,
          role: "Attorney",
          chatId: `attorney-${a.id}`,
          name: `${a.firstName} ${a.lastName || ""}`,
          img: getImgUrl(a.profileImage),
        }));

      const fullList = [...combined, ...verifiedAttorneys];
      setChatList(fullList);

      // Persistence: Restore active chat session
      const savedChatId = localStorage.getItem("client_active_chat");
      if (savedChatId && !selectedChat) {
        const found = fullList.find((c) => c.chatId === savedChatId);
        if (found) setSelectedChat(found);
      }
    } catch (err) {
      console.error("Fetch contacts error:", err);
    }
  }, [selectedChat]);

  // 3. Memoized History Fetching (Runtime Data comparison)
  const fetchHistory = useCallback(async () => {
    if (!selectedChat) return;
    localStorage.setItem("client_active_chat", selectedChat.chatId);

    const user = JSON.parse(localStorage.getItem("user"));
    try {
      let response;
      if (selectedChat.role === "Admin") {
        response = await getUserMessageHistory(selectedChat.id, user.id);
      } else {
        response = await getClientAttorneyMessageHistory(
          selectedChat.id,
          user.id,
        );
      }

      const history = (response?.data || []).map((msg) => ({
        id: msg.id || msg._id,
        text: msg.message,
        sender: msg.senderType === "client" ? "Me" : selectedChat.name,
        time: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      // Compare to prevent jitter/flicker if no new messages
      setConversations((prev) => {
        if (
          JSON.stringify(prev[selectedChat.chatId]) === JSON.stringify(history)
        )
          return prev;
        return { ...prev, [selectedChat.chatId]: history };
      });
    } catch (error) {
      console.error("History fetch error:", error);
    }
  }, [selectedChat]);

  // 4. Runtime Polling Effects
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    if (!selectedChat) return;
    fetchHistory(); // Initial fetch

    const interval = setInterval(() => {
      fetchHistory();
    }, 3000); // Polling every 3 seconds

    return () => clearInterval(interval);
  }, [selectedChat, fetchHistory]);

  // 5. Memoized Message Sending
  const handleSendMessage = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      if (!typedMessage.trim() || !selectedChat) return;

      const user = JSON.parse(localStorage.getItem("user"));
      const msgText = typedMessage;
      setTypedMessage("");

      try {
        if (selectedChat.role === "Attorney") {
          await attorneyClientMessage({
            attorneyId: selectedChat.id,
            clientId: user?.id,
            senderType: "client",
            message: msgText,
          });
        } else {
          await adminClientMessage({
            adminId: selectedChat.id,
            clientId: user?.id,
            senderType: "client",
            message: msgText,
          });
        }
        fetchHistory(); // Immediate refresh after sending
      } catch (err) {
        console.error("Send error:", err);
      }
    },
    [typedMessage, selectedChat, fetchHistory],
  );

  // 6. Optimized Search Filtering
  const filteredChatList = useMemo(() => {
    return chatList.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [chatList, searchTerm]);

  return (
    <ClientLayout>
      <div className="p-2 p-md-3" style={{ height: "calc(100vh - 120px)" }}>
        <Row className="h-100 g-0 shadow-sm rounded-4 border overflow-hidden bg-white">
          {/* LEFT SIDE: CONTACT LIST */}
          <Col
            md="4"
            lg="3"
            className="border-end d-flex flex-column h-100 bg-light">
            <div className="p-3 bg-white border-bottom">
              <h5 className="fw-bold mb-3">Messages</h5>
              <input
                placeholder="Search..."
                className="form-control rounded-pill border-0 bg-light px-3"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="overflow-auto flex-grow-1 custom-scrollbar">
              {filteredChatList.map((chat) => (
                <div
                  key={chat.chatId}
                  className={`p-3 border-bottom d-flex align-items-center gap-3 cursor-pointer transition-all ${
                    selectedChat?.chatId === chat.chatId
                      ? "bg-white active-chat"
                      : "hover-item"
                  }`}
                  onClick={() => setSelectedChat(chat)}>
                  <img
                    src={chat.img}
                    width="45"
                    height="45"
                    className="rounded-circle border"
                    alt=""
                  />
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="fw-bold text-dark small text-truncate">
                      {chat.name}
                    </div>
                    <div className="text-muted" style={{ fontSize: "11px" }}>
                      {chat.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Col>

          {/* RIGHT SIDE: CHAT AREA */}
          <Col md="8" lg="9" className="d-flex flex-column h-100 bg-white">
            {selectedChat ? (
              <>
                {/* Header */}
                <div className="p-3 border-bottom d-flex align-items-center gap-3 bg-white">
                  <img
                    src={selectedChat.img || ""}
                    width="40"
                    height="40"
                    className="rounded-circle border"
                    alt=""
                  />
                  <div>
                    <div className="fw-bold small">{selectedChat.name}</div>
                    <div
                      className="text-primary fw-bold"
                      style={{ fontSize: "10px" }}>
                      {selectedChat.role}
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div
                  className="flex-grow-1 p-4 overflow-auto bg-dots custom-scrollbar"
                  ref={scrollRef}>
                  {(conversations[selectedChat.chatId] || []).map((msg) => (
                    <div
                      key={msg.id}
                      className={`d-flex mb-3 ${msg.sender === "Me" ? "justify-content-end" : "justify-content-start"}`}>
                      <div
                        className={`p-3 shadow-sm ${msg.sender === "Me" ? "msg-me" : "msg-other"}`}
                        style={{ maxWidth: "75%" }}>
                        <div className="small">{msg.text}</div>
                        <div
                          className="text-end mt-1"
                          style={{ fontSize: "9px", opacity: 0.7 }}>
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="p-3 border-top bg-white">
                  <form onSubmit={handleSendMessage} className="d-flex gap-2">
                    <input
                      type="text"
                      placeholder="Write a message..."
                      className="form-control rounded-pill bg-light border-0 px-4"
                      value={typedMessage}
                      onChange={(e) => setTypedMessage(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="btn rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                      style={{
                        backgroundColor: professionalGreen,
                        width: "45px",
                        height: "45px",
                        color: "#fff",
                      }}>
                      ➤
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                <i className="bi bi-chat-dots fs-1 opacity-25"></i>
                <p className="mt-2 fw-bold">Select a chat to start</p>
              </div>
            )}
          </Col>
        </Row>

        <style jsx>{`
          .active-chat {
            border-left: 4px solid ${professionalGreen} !important;
          }
          .hover-item:hover {
            background-color: #f8f9fa;
          }
          .msg-me {
            background-color: ${professionalGreen};
            color: white;
            border-radius: 15px 15px 2px 15px;
          }
          .msg-other {
            background-color: white;
            color: #333;
            border-radius: 15px 15px 15px 2px;
            border: 1px solid #e0e0e0;
          }
          .bg-dots {
            background-color: #f8f9fa;
            background-image: radial-gradient(#d1d5db 0.8px, transparent 0.8px);
            background-size: 20px 20px;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 5px;
          }
        `}</style>
      </div>
    </ClientLayout>
  );
}







// "use client";
// import React, {
//   useState,
//   useEffect,
//   useRef,
//   useCallback,
//   useMemo,
// } from "react";
// import { Row, Col, Input, Button } from "reactstrap";
// import ClientLayout from "../../components/layout/ClientLayout";
// import {
//   getAllAttorneys,
//   getAdminProfile,
//   getUserMessageHistory,
//   getClientAttorneyMessageHistory,
//   adminClientMessage,
//   attorneyClientMessage,
//   getImgUrl,
// } from "../../services/authService";

// export default function Messages() {
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [typedMessage, setTypedMessage] = useState("");
//   const [chatList, setChatList] = useState([]);
//   const [conversations, setConversations] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
  
//   // File States
//   const [imageFile, setImageFile] = useState(null);
//   const [attachmentFile, setAttachmentFile] = useState(null);

//   const scrollRef = useRef(null);
//   const professionalGreen = "#083f36";

//   // 1. Auto-scroll to bottom
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [conversations, selectedChat]);

//   // 2. Fetch Contacts (Admin & Verified Attorneys)
//   const fetchContacts = useCallback(async () => {
//     try {
//       const [adminRes, attorneysRes] = await Promise.all([
//         getAdminProfile(),
//         getAllAttorneys(),
//       ]);

//       let combined = [];

//       if (adminRes && adminRes.id) {
//         combined.push({
//           id: adminRes.id,
//           role: "Admin",
//           chatId: `admin-${adminRes.id}`,
//           name: adminRes.firstName || "Admin Office",
//           img: getImgUrl(adminRes.profileImage),
//         });
//       }

//       const verifiedAttorneys = (attorneysRes?.attorneys || [])
//         .filter((a) => a.status === "verified")
//         .map((a) => ({
//           id: a.id,
//           role: "Attorney",
//           chatId: `attorney-${a.id}`,
//           name: `${a.firstName} ${a.lastName || ""}`,
//           img: getImgUrl(a.profileImage),
//         }));

//       const fullList = [...combined, ...verifiedAttorneys];
//       setChatList(fullList);

//       const savedChatId = localStorage.getItem("client_active_chat");
//       if (savedChatId && !selectedChat) {
//         const found = fullList.find((c) => c.chatId === savedChatId);
//         if (found) setSelectedChat(found);
//       }
//     } catch (err) {
//       console.error("Fetch contacts error:", err);
//     }
//   }, [selectedChat]);

//   // 3. Fetch History (including Images/Attachments)
//   const fetchHistory = useCallback(async () => {
//     if (!selectedChat) return;
//     localStorage.setItem("client_active_chat", selectedChat.chatId);

//     const user = JSON.parse(localStorage.getItem("user"));
//     try {
//       let response;
//       if (selectedChat.role === "Admin") {
//         response = await getUserMessageHistory(selectedChat.id, user.id);
//       } else {
//         response = await getClientAttorneyMessageHistory(selectedChat.id, user.id);
//       }

//       const history = (response?.data || []).map((msg) => ({
//         id: msg.id || msg._id,
//         text: msg.message,
//         image: msg.image,           // Map Image
//         attachment: msg.attachment, // Map PDF
//         sender: msg.senderType === "client" ? "Me" : selectedChat.name,
//         time: new Date(msg.createdAt).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//       }));

//       setConversations((prev) => {
//         if (JSON.stringify(prev[selectedChat.chatId]) === JSON.stringify(history)) return prev;
//         return { ...prev, [selectedChat.chatId]: history };
//       });
//     } catch (error) {
//       console.error("History fetch error:", error);
//     }
//   }, [selectedChat]);

//   useEffect(() => { fetchContacts(); }, [fetchContacts]);

//   useEffect(() => {
//     if (!selectedChat) return;
//     fetchHistory();
//     const interval = setInterval(() => { fetchHistory(); }, 3000);
//     return () => clearInterval(interval);
//   }, [selectedChat, fetchHistory]);

//   // 4. Send Message (Multipart FormData)
//   const handleSendMessage = useCallback(async (e) => {
//     if (e) e.preventDefault();
//     if ((!typedMessage.trim() && !imageFile && !attachmentFile) || !selectedChat) return;

//     const user = JSON.parse(localStorage.getItem("user"));
    
//     const formData = new FormData();
//     formData.append("senderType", "client");
//     formData.append("message", typedMessage.trim() || " ");
//     formData.append("clientId", user?.id);

//     if (imageFile) formData.append("image", imageFile);
//     if (attachmentFile) formData.append("attachment", attachmentFile);

//     try {
//       if (selectedChat.role === "Attorney") {
//         formData.append("attorneyId", selectedChat.id);
//         await attorneyClientMessage(formData);
//       } else {
//         formData.append("adminId", selectedChat.id);
//         await adminClientMessage(formData);
//       }
      
//       setTypedMessage("");
//       setImageFile(null);
//       setAttachmentFile(null);
//       fetchHistory();
//     } catch (err) {
//       console.error("Send error:", err);
//     }
//   }, [typedMessage, selectedChat, fetchHistory, imageFile, attachmentFile]);

//   const filteredChatList = useMemo(() => {
//     return chatList.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
//   }, [chatList, searchTerm]);

//   return (
//     <ClientLayout>
//       <div className="p-2 p-md-3" style={{ height: "calc(100vh - 120px)" }}>
//         <Row className="h-100 g-0 shadow-sm rounded-4 border overflow-hidden bg-white">
//           {/* Sidebar */}
//           <Col md="4" lg="3" className="border-end d-flex flex-column h-100 bg-light">
//             <div className="p-3 bg-white border-bottom">
//               <h5 className="fw-bold mb-3">Messages</h5>
//               <input
//                 placeholder="Search..."
//                 className="form-control rounded-pill border-0 bg-light px-3"
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <div className="overflow-auto flex-grow-1 custom-scrollbar">
//               {filteredChatList.map((chat) => (
//                 <div
//                   key={chat.chatId}
//                   className={`p-3 border-bottom d-flex align-items-center gap-3 cursor-pointer transition-all ${selectedChat?.chatId === chat.chatId ? "bg-white active-chat" : "hover-item"}`}
//                   onClick={() => setSelectedChat(chat)}
//                 >
//                   <img src={chat.img} width="45" height="45" className="rounded-circle border" alt="" />
//                   <div className="flex-grow-1 overflow-hidden">
//                     <div className="fw-bold text-dark small text-truncate">{chat.name}</div>
//                     <div className="text-muted" style={{ fontSize: "11px" }}>{chat.role}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Col>

//           {/* Chat Window */}
//           <Col md="8" lg="9" className="d-flex flex-column h-100 bg-white">
//             {selectedChat ? (
//               <>
//                 <div className="p-3 border-bottom d-flex align-items-center gap-3 bg-white">
//                   <img src={selectedChat.img || ""} width="40" height="40" className="rounded-circle border" alt="" />
//                   <div>
//                     <div className="fw-bold small">{selectedChat.name}</div>
//                     <div className="text-primary fw-bold" style={{ fontSize: "10px" }}>{selectedChat.role}</div>
//                   </div>
//                 </div>

//                 <div className="flex-grow-1 p-4 overflow-auto bg-dots custom-scrollbar" ref={scrollRef}>
//                   {(conversations[selectedChat.chatId] || []).map((msg) => (
//                     <div key={msg.id} className={`d-flex mb-3 ${msg.sender === "Me" ? "justify-content-end" : "justify-content-start"}`}>
//                       <div className={`p-3 shadow-sm ${msg.sender === "Me" ? "msg-me" : "msg-other"}`} style={{ maxWidth: "75%" }}>
                        
//                         {/* Image Logic */}
//                         {msg.image && (
//                           <div className="mb-2">
//                             <img 
//                               src={getImgUrl(msg.image)} 
//                               alt="sent" 
//                               className="rounded-3 shadow-sm img-fluid"
//                               style={{ maxHeight: "180px", maxWidth: "220px", objectFit: "cover", cursor: "pointer" }}
//                               onClick={() => window.open(getImgUrl(msg.image), "_blank")}
//                             />
//                           </div>
//                         )}

//                         {/* Attachment Logic */}
//                         {msg.attachment && (
//                           <div className="mb-2">
//                             <a 
//                               href={getImgUrl(msg.attachment)} 
//                               target="_blank" 
//                               className={`d-flex align-items-center gap-2 p-2 rounded border text-decoration-none ${msg.sender === "Me" ? "border-light text-white" : "border-secondary text-dark"}`}
//                               style={{ fontSize: "12px" }}
//                             >
//                               <i className="bi bi-file-earmark-pdf-fill fs-4"></i>
//                               <span>View Document</span>
//                             </a>
//                           </div>
//                         )}

//                         {msg.text && msg.text.trim() !== "" && <div className="small">{msg.text}</div>}
                        
//                         <div className="text-end mt-1" style={{ fontSize: "9px", opacity: 0.7 }}>{msg.time}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Input Area */}
//                 <div className="p-3 border-top bg-white">
//                   {(imageFile || attachmentFile) && (
//                     <div className="mb-2 d-flex gap-2">
//                       {imageFile && <span className="badge bg-secondary p-2">Image: {imageFile.name}</span>}
//                       {attachmentFile && <span className="badge bg-secondary p-2">File: {attachmentFile.name}</span>}
//                     </div>
//                   )}
//                   <form onSubmit={handleSendMessage} className="d-flex gap-2 align-items-center">
//                     <input
//                       type="text"
//                       placeholder="Write a message..."
//                       className="form-control rounded-pill bg-light border-0 px-4"
//                       value={typedMessage}
//                       onChange={(e) => setTypedMessage(e.target.value)}
//                     />
//                     <label className="mb-0 cursor-pointer px-1">
//                       <i className="bi bi-image text-muted fs-5"></i>
//                       <input type="file" accept="image/*" className="d-none" onChange={(e) => setImageFile(e.target.files[0])} />
//                     </label>
//                     <label className="mb-0 cursor-pointer px-1">
//                       <i className="bi bi-paperclip text-muted fs-5"></i>
//                       <input type="file" className="d-none" onChange={(e) => setAttachmentFile(e.target.files[0])} />
//                     </label>
//                     <button
//                       type="submit"
//                       className="btn rounded-circle d-flex align-items-center justify-content-center shadow-sm"
//                       style={{ backgroundColor: professionalGreen, width: "45px", height: "45px", color: "#fff" }}
//                     >
//                       ➤
//                     </button>
//                   </form>
//                 </div>
//               </>
//             ) : (
//               <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
//                 <i className="bi bi-chat-dots fs-1 opacity-25"></i>
//                 <p className="mt-2 fw-bold">Select a chat to start</p>
//               </div>
//             )}
//           </Col>
//         </Row>

//         <style jsx>{`
//           .active-chat { border-left: 4px solid ${professionalGreen} !important; }
//           .hover-item:hover { background-color: #f8f9fa; }
//           .msg-me { background-color: ${professionalGreen}; color: white; border-radius: 15px 15px 2px 15px; }
//           .msg-other { background-color: white; color: #333; border-radius: 15px 15px 15px 2px; border: 1px solid #e0e0e0; }
//           .bg-dots { background-color: #f8f9fa; background-image: radial-gradient(#d1d5db 0.8px, transparent 0.8px); background-size: 20px 20px; }
//           .custom-scrollbar::-webkit-scrollbar { width: 5px; }
//           .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 5px; }
//           .cursor-pointer { cursor: pointer; }
//         `}</style>
//       </div>
//     </ClientLayout>
//   );
// }