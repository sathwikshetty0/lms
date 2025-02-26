
// import { useState, useEffect, useRef } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Loader2, Send, X, Maximize2, Minimize2, MessageCircle } from "lucide-react";
// import { motion, AnimatePresence, useDragControls } from "framer-motion";

// type Message = {
//   role: "user" | "ai";
//   content: string;
//   timestamp: string;
// };

// export default function Chatbot() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [isOpen, setIsOpen] = useState<boolean>(true);
//   const [isEnlarged, setIsEnlarged] = useState<boolean>(false);
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const dragControls = useDragControls();

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSend = async () => {
//     if (!input.trim() || loading) return;

//     const userMessage: Message = {
//       role: "user",
//       content: input,
//       timestamp: new Date().toISOString(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const response = await fetch("http://127.0.0.1:5000/ask", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ question: input }),
//       });

//       if (!response.body) throw new Error("No response body");

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder();
//       let completeResponse = "";

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;
//         completeResponse += decoder.decode(value, { stream: true });
//         setMessages((prev) => {
//           const newMessages = [...prev];
//           if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === "ai") {
//             newMessages[newMessages.length - 1].content = completeResponse;
//           } else {
//             newMessages.push({ role: "ai", content: completeResponse, timestamp: new Date().toISOString() });
//           }
//           return newMessages;
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching response:", error);
//       setMessages((prev) => [...prev, { role: "ai", content: "❌ Error occurred!", timestamp: new Date().toISOString() }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   // Floating chat button when closed
//   if (!isOpen) {
//     return (
//       <motion.div
//         drag
//         dragControls={dragControls}
//         dragMomentum={false}
//         dragConstraints={{ left: 0, right: window.innerWidth - 80, top: 0, bottom: window.innerHeight - 80 }}
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.95 }}
//         initial={{ scale: 0, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         className="fixed bottom-4 right-4 cursor-grab active:cursor-grabbing"
//       >
//         <button
//           onClick={() => setIsOpen(true)}
//           className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg"
//         >
//           <MessageCircle className="h-6 w-6" />
//         </button>
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ 
//         opacity: 1, 
//         y: 0,
//         width: isEnlarged ? "50vw" : "380px",
//         height: isEnlarged ? "100vh" : "600px",
//         right: isEnlarged ? 0 : position.x,
//         bottom: isEnlarged ? 0 : position.y,
//         borderRadius: isEnlarged ? "12px 0 0 0" : "12px"
//       }}
//       drag={!isEnlarged}
//       dragControls={dragControls}
//       dragMomentum={false}
//       dragConstraints={{ left: 0, right: window.innerWidth - 380, top: 0, bottom: window.innerHeight - 600 }}
//       onDragEnd={(event, info) => {
//         setPosition({ x: info.point.x, y: info.point.y });
//       }}
//       transition={{ duration: 0.3, ease: "easeInOut" }}
//       className="fixed bg-gradient-to-b from-slate-50 to-white shadow-2xl flex flex-col border border-gray-200 cursor-grab active:cursor-grabbing"
//     >
//       <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-xl">
//         <div className="flex items-center gap-2">
//           <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
//           <span className="text-lg font-medium">Dexes AI</span>
//         </div>
//         <div className="flex gap-1">
//           <button 
//             onClick={() => setIsEnlarged(!isEnlarged)} 
//             className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
//           >
//             {isEnlarged ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
//           </button>
//           <button 
//             onClick={() => setIsOpen(false)} 
//             className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-3">
//         <AnimatePresence>
//           {messages.map((msg, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
//               className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`p-3 max-w-[80%] transition-all duration-200 hover:shadow-lg ${
//                   msg.role === "user"
//                     ? "bg-blue-500 text-white rounded-t-2xl rounded-l-2xl rounded-br-lg ml-auto hover:bg-blue-600"
//                     : "bg-gray-100 text-gray-800 rounded-t-2xl rounded-r-2xl rounded-bl-lg mr-auto hover:bg-gray-200"
//                 } shadow-sm`}
//               >
//                 <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
//               </div>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="p-4 bg-white border-t border-gray-100">
//         <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-full border border-gray-200">
//           <Input
//             ref={inputRef}
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="Type your message..."
//             className="text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
//             disabled={loading}
//           />
//           <Button 
//             onClick={handleSend} 
//             disabled={loading} 
//             className="rounded-full p-2 h-8 w-8 bg-blue-500 hover:bg-blue-600 text-white"
//             size="icon"
//           >
//             {loading ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               <Send className="h-4 w-4" />
//             )}
//           </Button>
//         </div>
//       </div>
//     </motion.div>
//   );
// }


import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send, X, Maximize2, Minimize2, MessageCircle, Mail } from "lucide-react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";

type Message = {
  role: "user" | "ai";
  content: string;
  timestamp: string;
  showSupport?: boolean;
};

type SupportForm = {
  email: string;
  subject: string;
  message: string;
  Phone: string;
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isEnlarged, setIsEnlarged] = useState<boolean>(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showSupportForm, setShowSupportForm] = useState<boolean>(false);
  const [supportForm, setSupportForm] = useState<SupportForm>({
    email: "",
    subject: "",
    message: "",
    Phone: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragControls = useDragControls();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSupportSubmit = async () => {
    if (!supportForm.email || !supportForm.message) return;

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/send_support_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supportForm),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, {
          role: "ai",
          content: "Thank you for reaching out! Your support request has been sent. We'll get back to you soon.",
          timestamp: new Date().toISOString()
        }]);
        setShowSupportForm(false);
        setSupportForm({ email: "", subject: "",Phone: "", message: "" });
      } else {
        throw new Error(data.error || "Failed to send support request");
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "ai",
        content: "Failed to send support request. Please try again later.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let completeResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        completeResponse += decoder.decode(value, { stream: true });
        
        // Check if response indicates out of context
        const isOutOfContext = completeResponse.includes("out of subject");
        
        setMessages((prev) => {
          const newMessages = [...prev];
          if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === "ai") {
            newMessages[newMessages.length - 1] = {
              ...newMessages[newMessages.length - 1],
              content: completeResponse,
              showSupport: isOutOfContext
            };
          } else {
            newMessages.push({
              role: "ai",
              content: completeResponse,
              timestamp: new Date().toISOString(),
              showSupport: isOutOfContext
            });
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [...prev, { role: "ai", content: "❌ Error occurred!", timestamp: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Support form component
  const SupportForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white p-4 rounded-lg shadow-lg border border-gray-200"
    >
      <h3 className="text-lg font-semibold mb-4">Contact Support</h3>
      <div className="space-y-4">
        <Input
          type="email"
          placeholder="Your email"
          value={supportForm.email}
          onChange={(e) => setSupportForm(prev => ({ ...prev, email: e.target.value }))}
          className="w-full"
        />
        <Input
          type="Phone"
          placeholder="Your Phone number"
          value={supportForm.Phone}
          onChange={(e) => setSupportForm(prev => ({ ...prev, Phone: e.target.value }))}
          className="w-full"
        />
        <Input
          placeholder="Subject"
          value={supportForm.subject}
          onChange={(e) => setSupportForm(prev => ({ ...prev, subject: e.target.value }))}
          className="w-full"
        />
        <Textarea
          placeholder="Your message"
          value={supportForm.message}
          onChange={(e) => setSupportForm(prev => ({ ...prev, message: e.target.value }))}
          className="w-full min-h-[100px]"
        />
        <div className="flex gap-2">
          <Button
            onClick={handleSupportSubmit}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
          </Button>
          <Button
            onClick={() => setShowSupportForm(false)}
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      </div>
    </motion.div>
  );

  // Floating chat button when closed
  if (!isOpen) {
    return (
      <motion.div
        drag
        dragControls={dragControls}
        dragMomentum={false}
        dragConstraints={{ left: 0, right: window.innerWidth - 80, top: 0, bottom: window.innerHeight - 80 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-4 right-4 cursor-grab active:cursor-grabbing"
      >
        {/* <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </button> */}
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        width: isEnlarged ? "50vw" : "380px",
        height: isEnlarged ? "100vh" : "600px",
        right: isEnlarged ? 0 : position.x,
        bottom: isEnlarged ? 0 : position.y,
        borderRadius: isEnlarged ? "12px 0 0 0" : "12px"
      }}
      drag={!isEnlarged}
      dragControls={dragControls}
      dragMomentum={false}
      dragConstraints={{ left: 0, right: window.innerWidth - 380, top: 0, bottom: window.innerHeight - 600 }}
      onDragEnd={(event, info) => {
        setPosition({ x: info.point.x, y: info.point.y });
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed bg-gradient-to-b from-slate-50 to-white shadow-2xl flex flex-col border border-gray-200 cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-lg font-medium">Dexes AI</span>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => setIsEnlarged(!isEnlarged)} 
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
          >
            {isEnlarged ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <motion.div
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 max-w-[80%] transition-all duration-200 hover:shadow-lg ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white rounded-t-2xl rounded-l-2xl rounded-br-lg ml-auto hover:bg-blue-600"
                      : "bg-gray-100 text-gray-800 rounded-t-2xl rounded-r-2xl rounded-bl-lg mr-auto hover:bg-gray-200"
                  } shadow-sm`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
              
              {msg.showSupport && !showSupportForm && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <Button
                    onClick={() => setShowSupportForm(true)}
                    variant="outline"
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                  >
                    <Mail className="h-4 w-4" />
                    Contact Support Team
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {showSupportForm && <SupportForm />}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-full border border-gray-200">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
            disabled={loading}
          />
          <Button 
            onClick={handleSend} 
            disabled={loading} 
            className="rounded-full p-2 h-8 w-8 bg-blue-500 hover:bg-blue-600 text-white"
            size="icon"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}