/**
 * TechNova — Community & Social Service (LinkedIn + GitHub + Instagram Hybrid)
 * 
 * Özellikler:
 * - 👥 Kullanıcı Profilleri & Takip Sistemi (Follow / Unfollow)
 * - 💬 Anlık Doğrudan Mesajlaşma (Direct Messaging - DM)
 * - ⭐ Proje Yıldızlama / Beğenme (Starring)
 * - 📁 GitHub Tarzı Kod Ağacı & Repo Dosyaları
 * - 📸 Instagram Tarzı Çoklu Medya Galerisi
 */

const INITIAL_PUBLIC_USERS = {
  samet_admin: {
    username: "samet_admin",
    fullName: "Samet Başkale",
    role: "admin",
    roleLabel: "Şirket Yöneticisi & Kurucu",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    banner: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a8a 100%)",
    bio: "Uslukılıç Yazılım kurucusu. React 19, .NET 10, Cloud mimarileri ve yapay zekâ sistemleri üzerine çalışıyorum.",
    location: "Yozgat / Bozok Teknopark",
    company: "Uslukılıç Yazılım",
    github: "https://github.com/sametb",
    linkedin: "https://linkedin.com/in/sametb",
    website: "https://technova.dev",
    isEDevletVerified: true,
    followersCount: 1420,
    followingCount: 185,
    skills: ["React 19", ".NET 10", "SQL Server", "Docker", "FastAPI", "UI/UX"],
  },
  eren_dev: {
    username: "eren_dev",
    fullName: "Eren Demir",
    role: "editor",
    roleLabel: "Senior Frontend Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    banner: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0369a1 100%)",
    bio: "Modern arayüzler, WebGL, Tailwind ve performans optimizasyonu aşığı.",
    location: "Ankara / Türkiye",
    company: "TechNova Dev Team",
    github: "https://github.com/erendev",
    linkedin: "https://linkedin.com/in/erendev",
    website: "https://erendemir.dev",
    isEDevletVerified: true,
    followersCount: 890,
    followingCount: 230,
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Vite"],
  },
  zeynep_yazar: {
    username: "zeynep_yazar",
    fullName: "Zeynep Kaya",
    role: "author",
    roleLabel: "Kıdemli Teknik Yazar & Yapay Zekâ Araştırmacısı",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    banner: "linear-gradient(135deg, #4c1d95 0%, #581c87 50%, #701a75 100%)",
    bio: "TechNova'da yapay zekâ, LLM prompt engineering ve makine öğrenimi makaleleri hazırlıyorum.",
    location: "İstanbul / Türkiye",
    company: "AI Research Lab",
    github: "https://github.com/zeynepk",
    linkedin: "https://linkedin.com/in/zeynepk",
    website: "https://zeynepkaya.blog",
    isEDevletVerified: true,
    followersCount: 2150,
    followingCount: 95,
    skills: ["Prompt Engineering", "Python", "PyTorch", "Technical Writing", "SEO"],
  },
  merve_ik: {
    username: "merve_ik",
    fullName: "Merve Aydın",
    role: "hr",
    roleLabel: "İnsan Kaynakları & Yetenek Kazanımı Direktörü",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200",
    banner: "linear-gradient(135deg, #831843 0%, #9d174d 50%, #be185d 100%)",
    bio: "Uslukılıç Yazılım & TechNova için yetenekli yazılımcı ve stajyerleri ekibimize katıyorum.",
    location: "Yozgat / Bozok Teknopark",
    company: "Uslukılıç Yazılım",
    github: "https://github.com",
    linkedin: "https://linkedin.com/in/merveik",
    website: "https://technova.dev/kariyer",
    isEDevletVerified: true,
    followersCount: 3400,
    followingCount: 420,
    skills: ["Talent Acquisition", "IT Recruitment", "HR Strategy", "Team Building"],
  },
};

const INITIAL_CONVERSATIONS = [
  {
    id: "conv-1",
    participant: {
      username: "eren_dev",
      fullName: "Eren Demir",
      title: "Senior Frontend Developer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      online: true,
    },
    lastMessage: "FinTech projesindeki kod yapısını çok beğendim, tebrikler!",
    lastMessageTime: "12:45",
    unreadCount: 1,
    messages: [
      { id: 1, sender: "eren_dev", text: "Selam Samet! Yayınladığın FinTech Dashboard projesini inceledim.", time: "12:40", isMine: false },
      { id: 2, sender: "me", text: "Selam Eren, teşekkürler! Beğenmene sevindim.", time: "12:42", isMine: true },
      { id: 3, sender: "eren_dev", text: "FinTech projesindeki kod yapısını çok beğendim, tebrikler!", time: "12:45", isMine: false },
    ],
  },
  {
    id: "conv-2",
    participant: {
      username: "zeynep_yazar",
      fullName: "Zeynep Kaya",
      title: "Kıdemli Teknik Yazar",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      online: false,
    },
    lastMessage: "React 19 blog yazını okudum, harika bir rehber olmuş!",
    lastMessageTime: "Dün",
    unreadCount: 0,
    messages: [
      { id: 1, sender: "zeynep_yazar", text: "Merhaba! React 19 blog yazını okudum, harika bir rehber olmuş!", time: "Dün 16:20", isMine: false },
      { id: 2, sender: "me", text: "Çok teşekkür ederim Zeynep! Senin LLM makalen de çok faydalıydı.", time: "Dün 17:05", isMine: true },
    ],
  },
  {
    id: "conv-3",
    participant: {
      username: "merve_ik",
      fullName: "Merve Aydın (İK)",
      title: "İnsan Kaynakları Direktörü",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200",
      online: true,
    },
    lastMessage: "Yeni açtığımız Frontend ilanına gelen başvuruları incelediniz mi?",
    lastMessageTime: "2 gün önce",
    unreadCount: 0,
    messages: [
      { id: 1, sender: "merve_ik", text: "Merhaba Samet Bey, yeni açtığımız Frontend ilanına gelen başvuruları incelediniz mi?", time: "2 gün önce", isMine: false },
    ],
  },
];

export const communityService = {
  /**
   * Kullanıcı Profilini Getirir
   */
  getUserProfile(username) {
    const rawUsers = localStorage.getItem("technova_registered_users");
    let localUsers = [];
    try {
      localUsers = rawUsers ? JSON.parse(rawUsers) : [];
    } catch (e) {
      console.error(e);
    }

    const matchedLocal = localUsers.find(
      (u) => u.userName?.toLowerCase() === username?.toLowerCase() || u.email?.split("@")[0] === username?.toLowerCase()
    );

    if (matchedLocal) {
      return {
        username: matchedLocal.userName || matchedLocal.email.split("@")[0],
        fullName: matchedLocal.fullName || "TechNova Üyesi",
        role: matchedLocal.role || "author",
        roleLabel: matchedLocal.role === "admin" ? "Şirket Yöneticisi" : matchedLocal.role === "editor" ? "Geliştirici" : matchedLocal.role === "hr" ? "İnsan Kaynakları" : "Yazar & İçerik Üreticisi",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
        banner: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a8a 100%)",
        bio: "TechNova platformunda açık kaynak projeler ve blog yazıları üreten aktif geliştirici.",
        location: "Türkiye",
        company: "TechNova Community",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        website: "https://technova.dev",
        isEDevletVerified: true,
        followersCount: 120,
        followingCount: 45,
        skills: ["React", ".NET", "JavaScript", "CSS"],
      };
    }

    return INITIAL_PUBLIC_USERS[username] || INITIAL_PUBLIC_USERS["samet_admin"];
  },

  /**
   * Takip Durumu (Follow / Unfollow)
   */
  isFollowing(username) {
    try {
      const list = JSON.parse(localStorage.getItem("technova_followed_users") || "[]");
      return list.includes(username);
    } catch {
      return false;
    }
  },

  toggleFollow(username) {
    try {
      let list = JSON.parse(localStorage.getItem("technova_followed_users") || "[]");
      const isAlready = list.includes(username);
      if (isAlready) {
        list = list.filter((u) => u !== username);
      } else {
        list.push(username);
      }
      localStorage.setItem("technova_followed_users", JSON.stringify(list));
      return !isAlready;
    } catch {
      return false;
    }
  },

  /**
   * Proje Yıldızlama (Star ⭐)
   */
  isStarred(projectId) {
    try {
      const list = JSON.parse(localStorage.getItem("technova_starred_projects") || "[]");
      return list.includes(Number(projectId));
    } catch {
      return false;
    }
  },

  toggleStar(projectId) {
    try {
      let list = JSON.parse(localStorage.getItem("technova_starred_projects") || "[]");
      const id = Number(projectId);
      const isAlready = list.includes(id);
      if (isAlready) {
        list = list.filter((item) => item !== id);
      } else {
        list.push(id);
      }
      localStorage.setItem("technova_starred_projects", JSON.stringify(list));
      return !isAlready;
    } catch {
      return false;
    }
  },

  /**
   * Mesajlaşma (Direct Messages)
   */
  getConversations() {
    try {
      const raw = localStorage.getItem("technova_dm_conversations");
      return raw ? JSON.parse(raw) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  },

  sendMessage(recipientUsername, text, projectRef = null) {
    const list = this.getConversations();
    let conv = list.find((c) => c.participant.username.toLowerCase() === recipientUsername.toLowerCase());

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: projectRef ? `[📌 Proje: ${projectRef.title}] ${text}` : text,
      time: "Şimdi",
      isMine: true,
    };

    if (conv) {
      conv.messages.push(newMessage);
      conv.lastMessage = newMessage.text;
      conv.lastMessageTime = "Şimdi";
    } else {
      const targetUser = this.getUserProfile(recipientUsername);
      conv = {
        id: `conv-${Date.now()}`,
        participant: {
          username: targetUser.username,
          fullName: targetUser.fullName,
          title: targetUser.roleLabel,
          avatar: targetUser.avatar,
          online: true,
        },
        lastMessage: newMessage.text,
        lastMessageTime: "Şimdi",
        unreadCount: 0,
        messages: [newMessage],
      };
      list.unshift(conv);
    }

    localStorage.setItem("technova_dm_conversations", JSON.stringify(list));
    window.dispatchEvent(new Event("technova_dm_updated"));
    return conv;
  },
};

export default communityService;
