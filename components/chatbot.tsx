// // components/Chatbot.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Loader2, Send, Folder, Trash, PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
// import axios from "axios";

// export default function Chatbot() {
//   const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
//   const [history, setHistory] = useState<{ sessionId: string; chatHistory: { role: string; content: string }[] }[]>([]);
//   const [input, setInput] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); // State for sidebar visibility

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const savedSessions = localStorage.getItem("chatSessions");
//       if (savedSessions) {
//         setHistory(JSON.parse(savedSessions));
//       }
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("chatSessions", JSON.stringify(history));
//   }, [history]);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     setMessages((prev) => [...prev, { role: "user", content: input }]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await axios.post("http://127.0.0.1:5000/ask", { question: input }, { headers: { "Content-Type": "application/json" } });
//       const newMessage = { role: "ai", content: res.data.response };
//       setMessages((prev) => [...prev, newMessage]);
//       const sessionId = `session-${Date.now()}`;
//       const newHistory = { sessionId, chatHistory: [...messages, { role: "user", content: input }, newMessage] };
//       setHistory((prev) => [...prev, newHistory]);
//     } catch (error: any) {
//       console.error("Error fetching response:", error.response?.data || error.message);
//     }
//     setLoading(false);
//   };

//   const handleSessionClick = (sessionId: string) => {
//     const session = history.find((session) => session.sessionId === sessionId);
//     if (session) {
//       setMessages(session.chatHistory);
//     }
//   };

//   const handleDeleteSession = (sessionId: string) => {
//     const newHistory = history.filter((session) => session.sessionId !== sessionId);
//     setHistory(newHistory);
//   };

//   const handleNewChat = () => {
//     setMessages([]);
//   };

//   const handleSidebarToggle = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const filteredSessions = history.filter((session) =>
//     session.chatHistory.some((msg) => msg.content.includes(searchTerm))
//   );

//   return (
//     <div className="flex flex-col items-center justify-center bg-gray-900 text-white h-screen overflow-hidden">
//       <h1 className="text-4xl font-bold text-center mb-6">Clap AI - Chatbot</h1>

//       {/* Search Input for Sessions */}
//       <div className="mb-6 w-2/3 sm:w-1/2 md:w-1/3">
//         <Input
//           placeholder="Search Sessions"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="bg-gray-800 text-white rounded-md w-full p-3"
//         />
//       </div>

//       {/* Sidebar Toggle Button */}
//       <Button
//         onClick={handleSidebarToggle}
//         className="bg-gray-700 text-white rounded-full p-3 absolute top-6 left-6 z-10"
//       >
//         {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
//       </Button>

//       {/* Main Content Layout */}
//       <div className="flex w-full max-w-6xl h-full bg-gray-800 rounded-lg overflow-hidden shadow-xl">
//         {/* Chat History Sidebar */}
//         <div
//           className={`w-1/4 bg-gray-700 p-4 rounded-l-lg overflow-y-auto shadow-md transition-all duration-300 ${
//             isSidebarOpen ? "block" : "hidden"
//           }`}
//         >
//           <h2 className="text-lg font-semibold mb-4">Chat History</h2>
//           <div className="space-y-4">
//             {filteredSessions.map((session) => (
//               <div key={session.sessionId} className="flex justify-between items-center group">
//                 <Button
//                   variant="link"
//                   onClick={() => handleSessionClick(session.sessionId)}
//                   className="text-sm text-gray-300 w-full text-left hover:text-blue-500 transition"
//                 >
//                   <Folder className="mr-2" />
//                   {session.chatHistory.slice(-1)[0].content.slice(0, 30)}...
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   onClick={() => handleDeleteSession(session.sessionId)}
//                   className="text-red-500 p-0 opacity-0 group-hover:opacity-100 transition"
//                 >
//                   <Trash className="w-4 h-4" />
//                 </Button>
//               </div>
//             ))}
//           </div>

//           {/* New Chat Button */}
//           <Button
//             onClick={handleNewChat}
//             className="bg-green-500 text-white rounded-full p-3 mt-6 hover:bg-green-600 transition duration-200 w-full"
//           >
//             <PlusCircle className="mr-2" /> New Chat
//           </Button>
//         </div>

//         {/* Chat Window */}
//         <div className="w-3/4 flex flex-col space-y-4 p-6 overflow-y-auto">
//           <Card className="p-4 h-full border rounded-lg shadow-lg bg-gray-700 flex-1 overflow-y-auto">
//             <CardContent>
//               <div className="space-y-4">
//                 {messages.map((msg, index) => (
//                   <div
//                     key={index}
//                     className={`p-3 rounded-lg max-w-[80%] w-fit ${
//                       msg.role === "user" ? "bg-blue-600 text-white ml-auto" : "bg-gray-600 text-gray-200 mr-auto"
//                     }`}
//                   >
//                     {msg.content}
//                   </div>
//                 ))}
//               </div>
//               {loading && <div className="text-gray-400 text-center">AI is typing...</div>}
//             </CardContent>
//           </Card>

//           {/* Input Field */}
//           <div className="flex mt-4 space-x-2 items-center">
//             <Input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Ask me anything..."
//               className="bg-gray-800 text-white rounded-full p-3 focus:ring-2 focus:ring-blue-500 w-full"
//             />
//             <Button
//               onClick={handleSend}
//               disabled={loading}
//               className="bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 transition duration-200"
//             >
//               {loading ? <Loader2 className="animate-spin" /> : <Send />}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// components/Chatbot.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Send, Folder, Trash, PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [history, setHistory] = useState<{ sessionId: string; chatHistory: { role: string; content: string }[] }[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); // State for sidebar visibility

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSessions = localStorage.getItem("chatSessions");
      if (savedSessions) {
        setHistory(JSON.parse(savedSessions));
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatSessions", JSON.stringify(history));
  }, [history]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:5000/ask", { question: input }, { headers: { "Content-Type": "application/json" } });
      const newMessage = { role: "ai", content: res.data.response };
      setMessages((prev) => [...prev, newMessage]);
      const sessionId = `session-${Date.now()}`;
      const newHistory = { sessionId, chatHistory: [...messages, { role: "user", content: input }, newMessage] };
      setHistory((prev) => [...prev, newHistory]);
    } catch (error: any) {
      console.error("Error fetching response:", error.response?.data || error.message);
    }
    setLoading(false);
  };

  const handleSessionClick = (sessionId: string) => {
    const session = history.find((session) => session.sessionId === sessionId);
    if (session) {
      setMessages(session.chatHistory);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    const newHistory = history.filter((session) => session.sessionId !== sessionId);
    setHistory(newHistory);
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const filteredSessions = history.filter((session) =>
    session.chatHistory.some((msg) => msg.content.includes(searchTerm))
  );

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 text-gray-800 h-screen overflow-hidden transition-all">
      <h1 className="text-4xl font-semibold text-center text-blue-600 mb-6">Clap AI - Chatbot</h1>

      {/* Search Input for Sessions */}
      <div className="mb-6 w-2/3 sm:w-1/2 md:w-1/3">
        <Input
          placeholder="Search Sessions"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white text-gray-800 rounded-lg w-full p-3 shadow-md"
        />
      </div>

      {/* Sidebar Toggle Button */}
      <Button
        onClick={handleSidebarToggle}
        className="bg-blue-500 text-white rounded-full p-3 absolute top-6 left-6 z-10 shadow-md hover:bg-blue-600 transition duration-200"
      >
        {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </Button>

      {/* Main Content Layout */}
      <div className="flex w-full max-w-6xl h-full bg-white rounded-lg overflow-hidden shadow-xl">
        {/* Chat History Sidebar */}
        <div
          className={`w-1/4 bg-blue-50 p-4 rounded-l-lg overflow-y-auto shadow-md transition-all duration-300 ${
            isSidebarOpen ? "block" : "hidden"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4 text-blue-600">Chat History</h2>
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <div key={session.sessionId} className="flex justify-between items-center group">
                <Button
                  variant="link"
                  onClick={() => handleSessionClick(session.sessionId)}
                  className="text-sm text-gray-700 w-full text-left hover:text-blue-500 transition"
                >
                  <Folder className="mr-2" />
                  {session.chatHistory.slice(-1)[0].content.slice(0, 30)}...
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDeleteSession(session.sessionId)}
                  className="text-red-500 p-0 opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* New Chat Button */}
          <Button
            onClick={handleNewChat}
            className="bg-blue-600 text-white rounded-full p-3 mt-6 hover:bg-blue-700 transition duration-200 w-full"
          >
            <PlusCircle className="mr-2" /> New Chat
          </Button>
        </div>

        {/* Chat Window */}
        <div className="w-3/4 flex flex-col space-y-4 p-6 overflow-y-auto">
          <Card className="p-4 h-full border rounded-lg shadow-lg bg-blue-50 flex-1 overflow-y-auto">
            <CardContent>
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg max-w-[80%] w-fit ${
                      msg.role === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-gray-800 mr-auto"
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
              {loading && <div className="text-gray-500 text-center">AI is typing...</div>}
            </CardContent>
          </Card>

          {/* Input Field */}
          <div className="flex mt-4 space-x-2 items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="bg-white text-gray-800 rounded-full p-3 focus:ring-2 focus:ring-blue-500 w-full shadow-md"
            />
            <Button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 transition duration-200"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
