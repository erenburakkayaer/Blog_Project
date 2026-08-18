import { useState, useRef, useEffect } from "react";

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "bot",
    text: "Merhaba! Ben TechNova AI Asistanı 🤖\n\nSize nasıl yardımcı olabilirim?\n• Hizmetlerimiz hakkında bilgi\n• Proje teklifi almak\n• Blog ve içerikler\n• Yazar kazanç programı",
    time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
  },
];

const QUICK_REPLIES = [
  "Hizmetleriniz neler?",
  "Yazar kazanç programı",
  "Proje teklifi almak istiyorum",
  "İletişim bilgileri",
];

const BOT_RESPONSES = {
  hizmet: "TechNova olarak şu hizmetleri sunuyoruz:\n\n🌐 **Web Yazılım** - React, Next.js, Node.js\n📱 **Mobil Uygulama** - React Native, Flutter\n🤖 **Yapay Zekâ & ML** - GPT entegrasyonları\n🛡️ **Siber Güvenlik** - Penetrasyon testleri\n\nHangi hizmet hakkında daha fazla bilgi almak istersiniz?",
  yazar: "📝 **Yazar Kazanç Programı**\n\nTechNova platformunda içerik üretin, okundukça kazanın!\n\n💰 Her 1.000 okunmaya ~₺250 kazanç\n💳 IBAN'ınıza her ayın 1'inde ödeme\n📊 Min. çekim eşiği: ₺500\n\nHemen kayıt olmak için /giris sayfasına gidebilirsiniz.",
  teklif: "Harika! Proje teklifiniz için birkaç soru sormak istiyorum:\n\n1. Projenizin türü nedir? (Web / Mobil / Yapay Zekâ)\n2. Hedef kitleniz kimlerden oluşuyor?\n3. Bütçe aralığınız ne kadar?\n\nYa da /teklif-al sayfamızı ziyaret ederek detaylı form doldurabilirsiniz! 🚀",
  iletisim: "📍 **Bize Ulaşın**\n\n🏢 Bozok Teknopark, Bozok Ünv. Erdoğan Akdağ Kampüsü / Yozgat\n📧 info@uslukilicyazilim.com\n📞 +90 (354) 000 00 00\n\n⏰ Çalışma Saatleri: Pzt-Cum 09:00-18:00\n\n/iletisim sayfamızdan da mesaj gönderebilirsiniz!",
  fiyat: "Fiyatlandırmamız proje kapsamına göre belirlenmektedir.\n\n📊 Basit Web Sitesi: ₺5.000 - ₺15.000\n🛒 E-ticaret: ₺15.000 - ₺50.000\n📱 Mobil Uygulama: ₺20.000+\n🤖 AI Entegrasyon: ₺30.000+\n\nDetaylı teklif için /teklif-al sayfamızı ziyaret edin!",
  default: "Anlıyorum! Size daha iyi yardımcı olabilmem için lütfen sorunuzu biraz daha detaylandırır mısınız?\n\nYa da şu konularda hemen bilgi alabiliriz:\n• Hizmetler\n• Yazar kazanç programı\n• Proje teklifi\n• İletişim",
};

function getResponse(message) {
  const lower = message.toLowerCase();
  if (lower.includes("hizmet") || lower.includes("ne yapıyor") || lower.includes("neler")) return BOT_RESPONSES.hizmet;
  if (lower.includes("yazar") || lower.includes("kazan") || lower.includes("para")) return BOT_RESPONSES.yazar;
  if (lower.includes("teklif") || lower.includes("proje") || lower.includes("fiyat") || lower.includes("ücret")) {
    if (lower.includes("fiyat") || lower.includes("ücret")) return BOT_RESPONSES.fiyat;
    return BOT_RESPONSES.teklif;
  }
  if (lower.includes("iletişim") || lower.includes("adres") || lower.includes("telefon") || lower.includes("mail")) return BOT_RESPONSES.iletisim;
  return BOT_RESPONSES.default;
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      text: userText,
      time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Simulate AI typing delay
    await new Promise((res) => setTimeout(res, 900 + Math.random() * 600));

    const botMsg = {
      id: Date.now() + 1,
      role: "bot",
      text: getResponse(userText),
      time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, botMsg]);
    setTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        className="ai-chatbot__toggle"
        onClick={() => setOpen((p) => !p)}
        aria-label="AI Asistan"
        title="TechNova AI Asistanı"
      >
        {open ? (
          <i className="bi bi-x-lg" style={{ fontSize: 22 }} />
        ) : (
          <>
            <i className="bi bi-robot" style={{ fontSize: 22 }} />
            {unread > 0 && (
              <span className="ai-chatbot__unread">{unread}</span>
            )}
          </>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="ai-chatbot__window">
          {/* Header */}
          <div className="ai-chatbot__header">
            <div className="d-flex align-items-center gap-3">
              <div className="ai-chatbot__avatar">
                <i className="bi bi-robot" />
                <span className="ai-chatbot__status-dot" />
              </div>
              <div>
                <div className="fw-bold" style={{ fontSize: "0.92rem" }}>TechNova AI</div>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.7)" }}>
                  <span className="ai-chatbot__status-dot me-1" style={{ width: 6, height: 6, display: "inline-block", borderRadius: "50%", background: "#34d399" }} />
                  Çevrimiçi — Genellikle anında yanıt verir
                </div>
              </div>
            </div>
            <button
              className="btn-close btn-close-white"
              style={{ fontSize: "0.8rem" }}
              onClick={() => setOpen(false)}
            />
          </div>

          {/* Messages */}
          <div className="ai-chatbot__messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`ai-chatbot__message ${msg.role === "user" ? "ai-chatbot__message--user" : "ai-chatbot__message--bot"}`}
              >
                {msg.role === "bot" && (
                  <div className="ai-chatbot__bot-icon">
                    <i className="bi bi-robot" />
                  </div>
                )}
                <div>
                  <div className="ai-chatbot__bubble">
                    {msg.text.split("\n").map((line, i) => (
                      <span key={i}>
                        {line.replace(/\*\*(.*?)\*\*/g, "$1")}
                        {i < msg.text.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                  <div className="ai-chatbot__time">{msg.time}</div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="ai-chatbot__message ai-chatbot__message--bot">
                <div className="ai-chatbot__bot-icon">
                  <i className="bi bi-robot" />
                </div>
                <div className="ai-chatbot__bubble ai-chatbot__typing">
                  <span /><span /><span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="ai-chatbot__quick-replies">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                className="ai-chatbot__quick-reply"
                onClick={() => sendMessage(reply)}
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="ai-chatbot__input-wrap">
            <textarea
              ref={inputRef}
              className="ai-chatbot__input"
              placeholder="Mesajınızı yazın..."
              value={input}
              rows={1}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="ai-chatbot__send"
              onClick={() => sendMessage()}
              disabled={!input.trim() || typing}
            >
              <i className="bi bi-send-fill" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
