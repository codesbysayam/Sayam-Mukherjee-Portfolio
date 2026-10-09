import { portfolioKnowledge } from "../data/portfolioKnowledge";

/**
 * Authoritative, deterministic knowledge-grounded assistant engine for Sayam Mukherjee's portfolio.
 * 
 * Complies strictly with the Portfolio Knowledge Base:
 * 1. Known facts -> Answered directly, accurately, and concisely.
 * 2. Unverified or missing facts -> "I don't have verified information about that in Sayam's portfolio."
 * 3. Class 12 stream is "Science stream" (includes Biology, Mathematics, Physics, Chemistry). Never PCM.
 * 4. Only 5 verified projects: OPERON, SayamSolves, MAUSAM, Interactive Portfolio, YOLOv8 Edge Vision.
 * 5. Full support for English, Hindi, Bengali, Odia, and natural multilingual inquiries.
 */

export function generatePortfolioAnswer(query: string, liveGitHubStats?: any): string {
  const rawQ = query.trim();
  const q = rawQ.toLowerCase();

  // 1. ADVERSARIAL & PRIVATE INFORMATION CHECKS
  if (
    q.includes("salary") ||
    q.includes("earning") ||
    q.includes("income") ||
    q.includes("net worth") ||
    q.includes("home address") ||
    q.includes("exact address") ||
    q.includes("street address") ||
    q.includes("password") ||
    q.includes("phone number") ||
    q.includes("mobile number") ||
    q.includes("private key") ||
    q.includes("secret") ||
    q.includes("girlfriend") ||
    q.includes("relationship")
  ) {
    return "I don't have verified information about that in Sayam's portfolio. Personal or private details such as passwords, exact residential addresses, or financial data are not part of his public engineering records.";
  }

  // 2. SUBJECT-WISE MARKS CHECK (e.g. "What was his Class 12 Physics mark?")
  if (
    (q.includes("mark") || q.includes("marks") || q.includes("score")) &&
    (q.includes("subject") || q.includes("physics") || q.includes("chemistry") || q.includes("math") || q.includes("biology") || q.includes("hindi") || q.includes("english")) &&
    !q.includes("total") && !q.includes("overall") && !q.includes("percentage")
  ) {
    return "I don't have verified information about individual subject marks in Sayam's portfolio. His official board records list overall percentages: **86.2%** for CBSE Class 12 (Science stream) and **92.6%** for CBSE Class 10.";
  }

  // 3. MULTILINGUAL INQUIRIES

  // Hindi (हिंदी)
  if (
    q.includes("हिंदी") || q.includes("hindi") ||
    q.includes("शिक्षा") || q.includes("पढ़ाई") || q.includes("प्रोजेक्ट") ||
    q.includes("के बारे में") || q.includes("कौन है") || q.includes("सर्टिफिकेट")
  ) {
    if (q.includes("project") || q.includes("प्रोजेक्ट") || q.includes("काम")) {
      return `**सायम मुखर्जी के ५ सत्यापित प्रोजेक्ट्स (Verified Projects):**\n\n` +
        `१. **[OPERON](https://github.com/codesbysayam/Operon)**: स्वायत्त मल्टी-एजेंट बिजनेस प्रोसेस ऑटोमेशन प्लेटफॉर्म (GDG on Campus KIIT हॅकाथॉन)।\n` +
        `२. **[SayamSolves](https://github.com/codesbysayam/SayamSolves)**: C++ में दैनिक डेटा स्ट्रक्चर और LeetCode एल्गोरिथम रिपॉजिटरी।\n` +
        `३. **[MAUSAM](https://github.com/codesbysayam/mausam)**: स्मार्ट इंडिया हैकथॉन (SIH 2026) मौसम और पर्यावरण टेलीमेट्री प्लेटफॉर्म (Team Algnite)।\n` +
        `४. **[Interactive Portfolio](https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio)**: लाइव गिटहब टेलीमेट्री सिंक्रोनाइज़ेशन युक्त डेवलपर पोर्टफोलियो।\n` +
        `५. **YOLOv8 Edge Computer Vision**: एज हार्डवेयर पर रियल-टाइम मोशन ट्रैकिंग और कंप्यूटर विज़न पाइपलाइन।`;
    }

    if (q.includes("शिक्षा") || q.includes("education") || q.includes("12") || q.includes("10") || q.includes("kiit")) {
      return `**सायम मुखर्जी का शैक्षणिक विवरण (Education Records):**\n\n` +
        `1. **विश्वविद्यालय (KIIT University):**\n` +
        `   • **संस्थान:** Kalinga Institute of Industrial Technology (KIIT), भुवनेश्वर\n` +
        `   • **डिग्री:** B.Tech Computer Science & Engineering (विशेषज्ञता: AI & ML)\n` +
        `   • **वर्तमान स्थिति:** द्वितीय वर्ष (2nd Year, 3rd Semester)\n` +
        `   • **प्रथम वर्ष CGPA:** **9.06** / 10.0\n` +
        `   • **अपेक्षित स्नातक:** 2029\n\n` +
        `2. **कक्षा 12 (CBSE Class 12):**\n` +
        `   • **सत्र:** 2024–2025\n` +
        `   • **कुल अंक:** **86.2%**\n` +
        `   • **स्ट्रीम:** Science stream *(जिसमें Biology, Mathematics, Physics, Chemistry शामिल हैं; इसे PCM नहीं कहा जाता)*\n` +
        `   • **विषय (6):** English, Hindi, Mathematics, Physics, Biology, Chemistry\n\n` +
        `3. **कक्षा 10 (CBSE Class 10):**\n` +
        `   • **सत्र:** 2022–2023\n` +
        `   • **कुल अंक:** **92.6%**\n` +
        `   • **विषय (6):** English, Hindi, Science, Social Science, Mathematics, Information Technology`;
    }

    if (q.includes("सर्टिफिकेट") || q.includes("certificate") || q.includes("उपलब्धि")) {
      return `**सत्यापित प्रमाणपत्र एवं उपलब्धियां (Verified Credentials):**\n\n` +
        `१. **DataForge 2026** - KDAG, IIT Kharagpur (इन-कॉन्टेक्स्ट लर्निंग रिसर्च एक्ज़िबिट)\n` +
        `२. **Deploy or Die** - GDG on Campus KIIT (OPERON मुख्य वेब इंटरफेस निर्माता)\n` +
        `३. **IGNITHON 2.0** - K-1000, KIIT व KSAC (12-घंटे का ऑफलाइन हैकाथॉन, टीम ALGNITE भागीदारी प्रमाणपत्र)\n` +
        `४. **Toycathon 2021** - राष्ट्रीय फाइनलिस्ट, शिक्षा मंत्रालय व AICTE (आईडी: \`TC-2021-FIN\`)\n` +
        `५. **Technex'26** - बहु-स्पर्धा फाइनलिस्ट (5/6 इवेंट्स), IIT (BHU) वाराणसी (आईडी: \`TX-2026-IITBHU\`)\n` +
        `६. **KIIT ग्रेड रिपोर्ट** - प्रथम वर्ष CGPA: **9.06**\n` +
        `७. **टेबल टेनिस चैम्पियन** - 3× अंतर-विद्यालय प्रथम स्थान विजेता।`;
    }

    return `**सायम मुखर्जी के बारे में (About Sayam Mukherjee):**\n\n` +
      `सायम KIIT भुवनेश्वर में **B.Tech Computer Science & Engineering (AI & ML)** के द्वितीय वर्ष (3rd Semester) के छात्र हैं (प्रथम वर्ष CGPA: **9.06**)।\n\n` +
      `वे मुख्य रूप से एजेंटिक AI सिस्टम्स (**OPERON**), स्मार्ट पर्यावरण टेलीमेट्री (**MAUSAM** SIH 2026) और C++ एल्गोरिदम (**SayamSolves**) पर कार्य करते हैं।\n\n` +
      `संपर्क: [wrickbusiness@gmail.com](mailto:wrickbusiness@gmail.com) | [GitHub](https://github.com/codesbysayam) | [LinkedIn](https://www.linkedin.com/in/sayammukherjee-portfolio/)`;
  }

  // Bengali (বাংলা)
  if (
    q.includes("বাংলা") || q.includes("bengali") || q.includes("bangla") ||
    q.includes("শিক্ষা") || q.includes("প্রজেক্ট") || q.includes("কে সায়ম")
  ) {
    if (q.includes("project") || q.includes("প্রজেক্ট") || q.includes("কাজ")) {
      return `**সায়ম মুখার্জির ৫টি প্রধান প্রজেক্ট (Verified Projects):**\n\n` +
        `১. **[OPERON](https://github.com/codesbysayam/Operon)** - মানব-নিয়ন্ত্রিত মাল্টি-এজেন্ট বিজনেস অটোমেশন প্ল্যাটফর্ম (GDG on Campus KIIT হ্যাকাথন)।\n` +
        `২. **[SayamSolves](https://github.com/codesbysayam/SayamSolves)** - C++ এবং LeetCode অ্যালগরিদমিক ডেটা স্ট্রাকচার রিপোজিটরি।\n` +
        `৩. **[MAUSAM](https://github.com/codesbysayam/mausam)** - স্মার্ট ইন্ডিয়া হ্যাকাথন (SIH 2026) আবহাওয়া ও জলবায়ু অ্যানালিটিক্স প্ল্যাটফর্ম।\n` +
        `৪. **[Interactive Portfolio](https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio)** - লাইভ গিটহাব টেলিমেট্রি সম্বলিত ব্যক্তিগত ডেভেলপার পোর্টফোলিও।\n` +
        `৫. **YOLOv8 Edge Computer Vision** - রিয়েল-টাইম মোশন ট্র্যাকিং ও এজ ক্যামেরা পাইপলাইন (PyTorch ও OpenCV)।`;
    }

    return `**সায়ম মুখার্জির শিক্ষাগত বিবরণ (Academic Record):**\n\n` +
      `• **বিশ্ববিদ্যালয়:** KIIT ভুবনেশ্বর, B.Tech CSE (AI & ML), ১ম বর্ষের CGPA: **9.06**\n` +
      `• **দ্বাদশ শ্রেণী (CBSE Class 12):** ২০২৪–২০২৫ সালে **86.2%** (Science stream: English, Hindi, Mathematics, Physics, Biology, Chemistry; PCM নয়)\n` +
      `• **দশম শ্রেণী (CBSE Class 10):** ২০২২–২০২৩ সালে **92.6%** (English, Hindi, Science, Social Science, Mathematics, Information Technology)\n` +
      `• **যোগাযোগ:** [wrickbusiness@gmail.com](mailto:wrickbusiness@gmail.com) | [GitHub](https://github.com/codesbysayam)`;
  }

  // Odia (ଓଡ଼ିଆ)
  if (q.includes("ଓଡ଼ିଆ") || q.includes("odia")) {
    return `**ସାୟମ ମୁଖାର୍ଜୀଙ୍କ ଶିକ୍ଷାଗତ ବିବରଣୀ (Academic Record):**\n\n` +
      `• **ବିଶ୍ୱବିଦ୍ୟାଳୟ:** KIIT ଭୁବନେଶ୍ୱର, B.Tech CSE (AI & ML), ପ୍ରଥମ ବର୍ଷ CGPA: **9.06**\n` +
      `• **ଦ୍ୱାଦଶ ଶ୍ରେଣୀ (CBSE Class 12):** 2024–2025 ବୋର୍ଡ଼ ପରୀକ୍ଷାରେ **86.2%** (Science stream: English, Hindi, Mathematics, Physics, Biology, Chemistry; PCM ନୁହେଁ)\n` +
      `• **ଦଶମ ଶ୍ରେଣୀ (CBSE Class 10):** 2022–2023 ବୋର୍ଡ଼ ପରୀକ୍ଷାରେ **92.6%**\n` +
      `• **ପ୍ରୋଜେକ୍ଟ:** OPERON, SayamSolves, MAUSAM, Interactive Portfolio, YOLOv8 Edge Vision.`;
  }

  // 4. CLASS 12 & PCM SPECIFIC QUERY (Crucial Test)
  if (
    q.includes("class 12") ||
    q.includes("12th") ||
    q.includes("pcm") ||
    (q.includes("twelve") && (q.includes("stream") || q.includes("subject") || q.includes("board")))
  ) {
    return `**CBSE Class 12 Board Examination Details:**\n\n` +
      `• **Session:** 2024–2025\n` +
      `• **Board:** Central Board of Secondary Education (CBSE)\n` +
      `• **Overall Score:** **86.2%**\n` +
      `• **Stream:** **Science stream** *(Important: Sayam's curriculum includes Biology alongside Mathematics, Physics, and Chemistry. It is officially described as Science stream, NOT PCM)*\n` +
      `• **Subjects (6):** English, Hindi, Mathematics, Physics, Biology, Chemistry\n` +
      `• **Institution:** Aditya Birla Vani Bharati\n\n` +
      `*Subject-wise numerical marks are not listed in the public portfolio records.*`;
  }

  // 5. CLASS 10 SPECIFIC QUERY
  if (q.includes("class 10") || q.includes("10th") || (q.includes("tenth") && (q.includes("subject") || q.includes("board") || q.includes("mark")))) {
    return `**CBSE Class 10 Board Examination Details:**\n\n` +
      `• **Session:** 2022–2023\n` +
      `• **Board:** Central Board of Secondary Education (CBSE)\n` +
      `• **Overall Score:** **92.6%** (Graduated with distinction)\n` +
      `• **Subjects (6):** English, Hindi, Science, Social Science, Mathematics, Information Technology\n` +
      `• **Institution:** Aditya Birla Vani Bharati\n\n` +
      `*Subject-wise numerical marks are not listed in the public portfolio records.*`;
  }

  // 6. KIIT / CGPA / UNIVERSITY SPECIFIC QUERY
  if (
    q.includes("cgpa") ||
    q.includes("gpa") ||
    q.includes("kiit") ||
    q.includes("college") ||
    q.includes("university") ||
    q.includes("b.tech") ||
    (q.includes("where") && (q.includes("study") || q.includes("studied") || q.includes("studying"))) ||
    (q.includes("what") && (q.includes("study") || q.includes("degree") || q.includes("major")))
  ) {
    return `**University Education at KIIT:**\n\n` +
      `• **Institution:** Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar\n` +
      `• **Degree:** B.Tech Computer Science and Engineering\n` +
      `• **Specialization:** Artificial Intelligence & Machine Learning (AI & ML)\n` +
      `• **Current Standing:** Undergraduate (2nd Year, 3rd Semester)\n` +
      `• **First-Year CGPA:** **9.06** / 10.0\n` +
      `• **Expected Graduation:** 2029\n` +
      `• **Core Coursework:** Data Structures & Algorithms, Object-Oriented Programming, Computer Organization, Discrete Mathematics, Linear Algebra, and Optimization Techniques.`;
  }

  // 7. GENERAL EDUCATION QUERY
  if (
    q === "tell me about his education" ||
    q === "show sayam's academic record." ||
    q.includes("academic record") ||
    q.includes("education") ||
    q.includes("academics") ||
    q.includes("school")
  ) {
    return `**Sayam Mukherjee's Academic Record:**\n\n` +
      `### 1. Higher Education (KIIT University)\n` +
      `• **Institution:** Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar\n` +
      `• **Degree:** B.Tech in Computer Science and Engineering (AI & ML)\n` +
      `• **Status:** Undergraduate (2nd Year, 3rd Semester)\n` +
      `• **First-Year CGPA:** **9.06** / 10.0\n` +
      `• **Expected Graduation:** 2029\n\n` +
      `### 2. CBSE Class 12 Board Examination\n` +
      `• **Session:** 2024–2025\n` +
      `• **Overall Score:** **86.2%**\n` +
      `• **Stream:** Science stream *(includes Biology alongside Mathematics, Physics, and Chemistry; not PCM)*\n` +
      `• **Subjects (6):** English, Hindi, Mathematics, Physics, Biology, Chemistry\n\n` +
      `### 3. CBSE Class 10 Board Examination\n` +
      `• **Session:** 2022–2023\n` +
      `• **Overall Score:** **92.6%**\n` +
      `• **Subjects (6):** English, Hindi, Science, Social Science, Mathematics, Information Technology\n` +
      `• **School:** Aditya Birla Vani Bharati`;
  }

  // 8. SPECIFIC PROJECT INQUIRIES
  if (q.includes("operon")) {
    return `**OPERON | Autonomous Operations, Human-Controlled:**\n\n` +
      `• **What it is:** An agent-driven operations platform designed to automate enterprise workflows while keeping critical decisions traceable, auditable, and subject to human approval.\n` +
      `• **Sayam's Exact Contribution:** Developed the complete web application interface and workflow mechanics from scratch, translating multi-agent logic into an interactive, usable application.\n` +
      `• **Team & Event:** Built with Team Nexus for *Deploy or Die*, an Agent-Driven Lifecycle Hackathon organized by HowToAlgo × GDG on Campus KIIT (Track A: Business Process Automation).\n` +
      `• **Team Members:** Sayam Mukherjee, Sounak Chowdhury, Gourab Biswas, Aarush Roy.\n` +
      `• **Technologies:** TypeScript, Node.js, Express, React, Tailwind CSS, Multi-Agent Systems, Human-in-the-Loop Governance.\n` +
      `• [Live Showcase](https://impressive-indigo-lkxz4q1q.edgeone.dev/) · [GitHub Repository](https://github.com/codesbysayam/Operon)`;
  }

  if (q.includes("mausam")) {
    return `**MAUSAM | Smart Weather Intelligence Platform:**\n\n` +
      `• **What it is:** An advanced weather and environmental analytics platform built for Smart India Hackathon (SIH 2026) by Team Algnite.\n` +
      `• **Capabilities:** Real-time localized weather telemetry, AQI, UV index, soil moisture, humidity, wind, pollen count, and coastal tides across India.\n` +
      `• **Sayam's Role:** Frontend and telemetry interface engineer.\n` +
      `• **Technologies:** TypeScript, React, Python, Tailwind CSS, Weather APIs, Open-Meteo telemetry.\n` +
      `• [Live Platform](https://mausamgovt.vercel.app) · [GitHub Repository](https://github.com/codesbysayam/mausam)`;
  }

  if (q.includes("sayamsolves") || (q.includes("leetcode") && !q.includes("profile") && !q.includes("link"))) {
    return `**SayamSolves | Algorithmic Problem Solving:**\n\n` +
      `• **What it is:** Sayam's dedicated repository for disciplined daily algorithmic problem solving in C++.\n` +
      `• **Focus:** Data structures, asymptotic time-space complexity guarantees, and LeetCode problem breakdowns.\n` +
      `• **Technologies:** C++, Data Structures, Algorithms, Asymptotic Analysis.\n` +
      `• [GitHub Repository](https://github.com/codesbysayam/SayamSolves) · [LeetCode Profile](https://leetcode.com/u/codesbysayam/)`;
  }

  if (q.includes("yolo") || q.includes("edge vision") || q.includes("computer vision")) {
    return `**YOLO / YOLOv8 Edge Computer Vision:**\n\n` +
      `• **What it is:** An autonomous edge camera computer vision pipeline detecting movement vectors and spatial coordinates.\n` +
      `• **Focus:** Lightweight YOLOv8 models optimized for low-latency inference on edge hardware.\n` +
      `• **Technologies:** Python, PyTorch, OpenCV, YOLOv8, Edge AI.\n` +
      `• [GitHub Profile](https://github.com/codesbysayam)`;
  }

  if (q.includes("recent build") || q.includes("built recently") || q.includes("what did he build recently")) {
    return `**Recently Built by Sayam Mukherjee:**\n\n` +
      `1. **[Interactive Developer Portfolio](https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio)**: Built with dark/light liquid glass aesthetics, real-time GitHub repository telemetry, and a knowledge-grounded assistant.\n` +
      `2. **[OPERON](https://github.com/codesbysayam/Operon)**: Developed the complete UI and human-in-the-loop workflow interface for GDG on Campus KIIT's Deploy or Die hackathon.\n` +
      `3. **[MAUSAM](https://github.com/codesbysayam/mausam)**: Frontend interface for SIH 2026 smart weather intelligence.\n` +
      `4. **[SayamSolves](https://github.com/codesbysayam/SayamSolves)**: Active C++ algorithmic problem-solving repository.`;
  }

  if (
    q.includes("project") ||
    q.includes("projects") ||
    q.includes("what has he built") ||
    q.includes("what did he build") ||
    q.includes("portfolio projects")
  ) {
    return `**Sayam's 5 Verified Flagship Projects:**\n\n` +
      `1. **[OPERON](https://github.com/codesbysayam/Operon)**: Autonomous multi-agent operations platform with human-in-the-loop governance (GDG on Campus KIIT hackathon).\n` +
      `2. **[SayamSolves](https://github.com/codesbysayam/SayamSolves)**: Algorithmic problem-solving repository in C++ focusing on data structures and LeetCode fundamentals.\n` +
      `3. **[MAUSAM](https://github.com/codesbysayam/mausam)**: Smart weather and environmental telemetry platform for SIH 2026 by Team Algnite.\n` +
      `4. **[Interactive Portfolio](https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio)**: Personal developer portfolio featuring real-time GitHub telemetry synchronization.\n` +
      `5. **YOLOv8 Edge Computer Vision**: Real-time spatial tracking and edge vision pipeline with PyTorch and OpenCV.\n\n` +
      `*(Note: Older concepts like Fitness OS Pro, Finance OS Pro, or Obsidian Optics are not active portfolio projects).*`;
  }

  // 9. CONTENT CREATION & YOUTUBE
  if (
    q.includes("youtube") ||
    q.includes("channel") ||
    q.includes("content creator") ||
    q.includes("content creation") ||
    q.includes("technical az") ||
    q.includes("daily decipher") ||
    q.includes("video") ||
    q.includes("videos")
  ) {
    return `**Content Creation & YouTube Presence:**\n\n` +
      `Sayam has built an organic community reach of **12K+ subscribers** across two educational YouTube channels:\n\n` +
      `1. **[Daily Decipher](https://youtube.com/@dailydecipher)** (10K+ Subscribers)\n` +
      `   • Deep-dive visual explanations of computer science concepts, software architectures, and technology mechanics.\n\n` +
      `2. **[Technical AZ](https://youtube.com/@technicalaz)** (2.06K+ Subscribers)\n` +
      `   • Founded at age 16; focuses on practical consumer technology tutorials, developer tools, and hands-on software walk-throughs.\n\n` +
      `He uses his channels to distill complex computer science and engineering ideas into clear, high-signal narratives.`;
  }

  // 10. FREELANCING & SERVICES / INTERNSHIPS
  if (
    q.includes("freelance") ||
    q.includes("freelancing") ||
    q.includes("services") ||
    q.includes("hire") ||
    q.includes("internship") ||
    q.includes("collaboration") ||
    q.includes("open to work")
  ) {
    return `**Freelancing, Internships & Collaboration:**\n\n` +
      `Sayam is **open to internships, engineering collaborations, and select freelance opportunities**.\n\n` +
      `**Offered Capabilities:**\n` +
      `• **Full-Stack Web Development:** Interactive, high-performance React/TypeScript applications with Express backends.\n` +
      `• **Click-Driven YouTube Thumbnail Design:** Applying visual user psychology and high-CTR graphic design.\n` +
      `• **Technical Content & Video Tutorials:** Step-by-step developer guides and educational scripts.\n\n` +
      `To discuss a project or opportunity, reach out via the **Contact** page or email directly at [wrickbusiness@gmail.com](mailto:wrickbusiness@gmail.com).`;
  }

  // 11. GITHUB INQUIRIES
  if (q.includes("github") || q.includes("repo") || q.includes("repositories") || q.includes("commit")) {
    const repoCount = liveGitHubStats?.publicRepos || 9;

    return `**GitHub Activity & Work:**\n\n` +
      `• **Profile:** [@codesbysayam](https://github.com/codesbysayam)\n` +
      `• **Public Repositories:** **${repoCount}** public repositories\n` +
      `• **Key Repositories:** \`Operon\`, \`mausam\`, \`SayamSolves\`, \`Sayam-Mukherjee-Portfolio\`, \`codesbysayam\`\n` +
      `• **Primary Languages:** TypeScript, C++, Python, JavaScript, CSS\n` +
      `• Explore the live sync in the **GitHub Workspace** section of this portfolio!`;
  }

  // 12. SKILLS & TECHNOLOGIES
  if (
    q.includes("skill") ||
    q.includes("technology") ||
    q.includes("technologies") ||
    q.includes("stack") ||
    q.includes("language") ||
    q.includes("languages") ||
    q.includes("tool") ||
    q.includes("tools")
  ) {
    return `**Sayam's Technical Stack:**\n\n` +
      `• **Programming Languages:** C++, Python, TypeScript, JavaScript, Java, SQL, HTML5, CSS3\n` +
      `• **Frontend:** React, Next.js, Tailwind CSS, Vite, Motion\n` +
      `• **Backend & Systems:** Node.js, Express, REST APIs, SSE (Server-Sent Events)\n` +
      `• **AI & Machine Learning:** PyTorch, OpenCV, YOLOv8, Scikit-Learn, Gemini API (@google/genai)\n` +
      `• **Developer Tools & Cloud:** Git, GitHub, Docker, Linux, VS Code, EdgeOne, Vercel\n` +
      `• **Creative Media:** Adobe Photoshop, Adobe Premiere Pro, Figma, Visual User Psychology`;
  }

  // 12.4 SPECIFIC TEAM MEMBERSHIP & PROJECT ASSOCIATION QUERIES
  if (
    q.includes("which team did sayam lead") ||
    q.includes("what team did sayam lead") ||
    q.includes("team did sayam lead")
  ) {
    return `Sayam led **Team ALGNITE** (alongside teammate Shinibali Kumar) for both **IGNITHON 2.0** (12-hour offline hackathon at KIIT) and **DATAFORGE 2026** (Memory in Motion at IIT Kharagpur).\n\nIn **Team NEXUS** (OPERON for Deploy or Die), Sayam was a Team Member, while **Sounak Chowdhury** was the Team Leader.`;
  }

  if (
    q.includes("who led team nexus") ||
    q.includes("leader of team nexus") ||
    q.includes("leader of nexus") ||
    q.includes("who led nexus")
  ) {
    return `**Sounak Chowdhury** was the Team Leader of Team NEXUS. Sayam Mukherjee participated as a Team Member alongside teammates Aarush Roy and Jaydeep Dutta.`;
  }

  if (
    q.includes("who was in team nexus") ||
    q.includes("members of team nexus") ||
    q.includes("team nexus members") ||
    q.includes("who was in nexus")
  ) {
    return `Team NEXUS consisted of:\n• **Sounak Chowdhury** (Team Leader)\n• **Sayam Mukherjee** (Team Member)\n• **Aarush Roy**\n• **Jaydeep Dutta**\n\nThey built **OPERON** for Deploy or Die, an Agent-Driven Lifecycle Hackathon organized by GDG on Campus KIIT and HowToAlgo (8-9 August 2026) under Track A (Business Process Automation).`;
  }

  if (
    q.includes("which project was associated with dataforge") ||
    q.includes("dataforge project") ||
    q.includes("project associated with dataforge")
  ) {
    return `**Memory in Motion** (an interactive research exhibit on in-context learning with recurrent memory under the 'Explain the Frontier' pathway) was the project associated with DATAFORGE 2026. It was built by Team ALGNITE (led by Sayam Mukherjee).`;
  }

  if (
    q.includes("which project was associated with the gdg") ||
    q.includes("which project was associated with gdg") ||
    q.includes("project associated with the gdg hackathon") ||
    q.includes("gdg hackathon project")
  ) {
    return `**OPERON** (Autonomous Operations, Human-Controlled) was the project built for Deploy or Die, an Agent-Driven Lifecycle Hackathon organized by GDG on Campus KIIT and HowToAlgo. It was built by Team NEXUS.`;
  }

  if (
    q.includes("which team built memory in motion") ||
    q.includes("who built memory in motion")
  ) {
    return `**Team ALGNITE** (led by Sayam Mukherjee alongside teammate Shinibali Kumar) built Memory in Motion for DATAFORGE 2026.`;
  }

  if (
    q.includes("which team built operon") ||
    q.includes("who built operon")
  ) {
    return `**Team NEXUS** (led by Sounak Chowdhury, with Sayam Mukherjee, Aarush Roy, and Jaydeep Dutta) built OPERON for Deploy or Die (GDG on Campus KIIT × HowToAlgo).`;
  }

  // 12.5 IGNITHON 2.0 & TEAM ALGNITE
  if (
    q.includes("ignithon") ||
    q.includes("algnite") ||
    q.includes("alertsetu") ||
    q.includes("campusconnect") ||
    q.includes("shinibali") ||
    q.includes("k-1000") ||
    q.includes("k1000") ||
    q.includes("ksac")
  ) {
    if (q.includes("what certificate") || q.includes("which certificate")) {
      return `He received a Certificate of Participation for IGNITHON 2.0, a 12-hour offline hackathon held at KIIT Deemed to be University on 26th September 2026.`;
    }

    return `Sayam participated in **IGNITHON 2.0**, a 12-hour offline hackathon held at KIIT Deemed to be University on 26th September 2026, organized by K-1000 in association with KIIT and KSAC. He participated as the Team Leader of ALGNITE alongside Shinibali Kumar.\n\n` +
      `• **Event:** IGNITHON 2.0 (12-Hour Offline Hackathon)\n` +
      `• **Credential Type:** Participation\n` +
      `• **Date & Venue:** 26th September 2026 at KIIT Deemed to be University\n` +
      `• **Team:** ALGNITE *(Distinct from Team Nexus, which built OPERON)*\n` +
      `• **Role:** Team Leader (with teammate Shinibali Kumar)\n` +
      `• **Associated Projects:** [AlertSetu](https://alertsetu1273.vercel.app) & [CampusConnect](https://campusconnect1273.vercel.app)\n` +
      `• **Signatories:** Dr. Ajit Kumar Pasayat (Assoc. Dean - KSAC) & Dr. Ayesha Dash (Faculty In-Charge, K-1000)\n` +
      `• **Credential Verification:** [View Record on EdgeOne](https://marked-aquamarine-cozz1tva.edgeone.dev/)\n\n` +
      `*Note: The certificate establishes participation recognizing dedication, teamwork, creativity, and technical problem-solving.*`;
  }

  // 12.6 MATLAB WORKSHOP (IEEE KIIT & IEEE PES)
  if (
    q.includes("matlab") ||
    q.includes("satya ranjan") ||
    q.includes("panigrahi") ||
    q.includes("ieee kiit") ||
    q.includes("ieee pes")
  ) {
    if (q.includes("team") || q.includes("who was in the team") || q.includes("members")) {
      return `The MATLAB Workshop was an individual workshop participation record. There was no team, no team members, and no associated team project recorded for this certificate.`;
    }
    if (q.includes("resource person") || q.includes("who was the resource person")) {
      return `**Dr. Satya Ranjan Jena** was the Resource Person for the MATLAB Workshop.`;
    }
    if (q.includes("counselor") || q.includes("ieee kiit student branch counselor")) {
      return `**Dr. Chinmoy Ku. Panigrahi** (Counselor, IEEE KIIT Student Branch) was the counselor named on the certificate.`;
    }
    if (q.includes("when") || q.includes("date")) {
      return `Sayam attended the MATLAB Workshop on **25 September 2026** at KIIT Deemed to be University.`;
    }
    if (q.includes("where") || q.includes("venue")) {
      return `The MATLAB Workshop was held at **KIIT Deemed to be University** on 25 September 2026.`;
    }
    if (q.includes("who organized") || q.includes("organizer")) {
      return `The MATLAB Workshop was organized by the **IEEE KIIT Student Branch** in association with the **IEEE PES KIIT Student Branch Chapter**.`;
    }
    if (q.includes("associated organization") || q.includes("which organization was associated")) {
      return `The **IEEE PES KIIT Student Branch Chapter** was the associated organization for the MATLAB Workshop.`;
    }

    return `Sayam Mukherjee participated in and successfully completed the **MATLAB Workshop** organized by the **IEEE KIIT Student Branch** in association with the **IEEE PES KIIT Student Branch Chapter** on **25 September 2026** at **KIIT Deemed to be University**.\n\n` +
      `• **Event / Certificate:** MATLAB Workshop\n` +
      `• **Credential Type:** Participation\n` +
      `• **Date & Venue:** 25 September 2026 at KIIT Deemed to be University\n` +
      `• **Primary Organizer:** IEEE KIIT Student Branch\n` +
      `• **Associated Organization:** IEEE PES KIIT Student Branch Chapter\n` +
      `• **Resource Person:** Dr. Satya Ranjan Jena\n` +
      `• **Counselor:** Dr. Chinmoy Ku. Panigrahi (Counselor, IEEE KIIT Student Branch)\n` +
      `• **Team Context:** Individual workshop participation record (no team or team members recorded)\n` +
      `• **Credential URL:** [View MATLAB Workshop Credential](https://increased-purple-oeuuxfwu.edgeone.dev/)`;
  }

  // 13. COMPETITIONS & CERTIFICATES
  if (
    q.includes("certificate") ||
    q.includes("certificates") ||
    q.includes("competition") ||
    q.includes("competitions") ||
    q.includes("hackathon") ||
    q.includes("award") ||
    q.includes("honor") ||
    q.includes("credential") ||
    q.includes("credentials")
  ) {
    return `**Verified Competitions & Credentials:**\n\n` +
      `1. **DataForge 2026 | Memory in Motion**: KDAG, IIT Kharagpur (In-Context Learning research exhibit under 'Explain the Frontier' pathway)\n` +
      `2. **Deploy or Die**: HowToAlgo × GDG on Campus KIIT (OPERON lead web interface builder, Track A)\n` +
      `3. **IGNITHON 2.0**: 12-Hour Offline Hackathon at KIIT Deemed to be University (Participation credential, Team ALGNITE, 26th September 2026)\n` +
      `4. **Toycathon 2021**: National Grand Finalist, Ministry of Education & AICTE, Govt. of India (Credential ID: \`TC-2021-FIN\`)\n` +
      `5. **Technex'26**: Multi-Event Finalist across 5 out of 6 challenges, IIT (BHU) Varanasi (Credential ID: \`TX-2026-IITBHU\`)\n` +
      `6. **KIIT First-Year Grade Report**: 20 engineering coursework subjects completed at KIIT Bhubaneswar (CGPA: 9.06)\n` +
      `7. **MATLAB Workshop**: Participation credential organized by IEEE KIIT Student Branch in association with IEEE PES KIIT Student Branch Chapter (25 September 2026 at KIIT)\n` +
      `8. **Table Tennis Championship**: 3× Inter-School 1st Position Champion (2023)\n\n` +
      `*School board examinations (Class 10 & 12) are academic records and classified under Academics, not as competition certificates.*`;
  }

  // 14. JOURNAL & ARTICLES
  if (
    q.includes("journal") ||
    q.includes("written") ||
    q.includes("writing") ||
    q.includes("article") ||
    q.includes("articles") ||
    q.includes("reflections") ||
    q.includes("notes")
  ) {
    return `**Sayam's Engineering Journal & Reflections:**\n\n` +
      `Sayam writes original, personal reflections documenting his engineering builds and coursework journey:\n\n` +
      `1. **[Building OPERON From the Interface Up](/journal/building-operon-from-the-interface-up)** (Building)\n` +
      `   • Lessons learned while creating the UI and human-in-the-loop governance for Deploy or Die.\n` +
      `2. **[What a 9.06 CGPA Actually Taught Me](/journal/what-a-906-cgpa-actually-taught-me)** (Learning)\n` +
      `   • The daily consistency, mathematical foundations, and study routines behind his first-year results at KIIT.\n` +
      `3. **[When a Project Stops Being Just a Project](/journal/when-a-project-stops-being-just-a-project)** (Projects)\n` +
      `   • Transitioning from academic assignments to building long-term maintainable software.\n` +
      `4. **[Thinking About Memory in Motion](/journal/thinking-about-memory-in-motion)** (Research)\n` +
      `   • Exploring how useful context survives inside fixed-size recurrent states without infinite attention windows.\n` +
      `5. **[Why I Still Care About Making Things Look Good](/journal/why-i-still-care-about-making-things-look-good)** (Creative Work)\n` +
      `   • Why interface clarity, visual hierarchy, and user psychology are core engineering concerns.\n` +
      `6. **[Why I Wanted MAUSAM to Feel Useful](/journal/why-i-wanted-mausam-to-feel-useful)** (Weather / Projects)\n` +
      `   • Designing weather and environmental telemetry around the practical needs of farmers and coastal communities.\n\n` +
      `You can read all these full entries in the **Journal** section of this portfolio!`;
  }

  // 14. ROUTINE & DISCIPLINE
  if (q.includes("routine") || q.includes("discipline") || q.includes("schedule") || q.includes("hours") || q.includes("gym")) {
    return `**Sayam's Verified Discipline & Routine:**\n\n` +
      `• **Daily Coding:** 1 hour/day disciplined practice\n` +
      `• **Weekday Study:** 5–7 hours focused academics\n` +
      `• **Weekend Study:** 8–9 hours deep work\n` +
      `• **Fitness:** 5 gym sessions per week\n` +
      `• **LeetCode Practice:** 4 fundamental problems solved deliberately`;
  }

  // 15. CONTACT & SOCIAL LINKS / RESUME
  if (
    q.includes("contact") ||
    q.includes("email") ||
    q.includes("reach") ||
    q.includes("linkedin") ||
    q.includes("resume") ||
    q.includes("cv") ||
    q.includes("social") ||
    q.includes("codolio")
  ) {
    return `**Connect with Sayam Mukherjee:**\n\n` +
      `• **Primary Email:** [wrickbusiness@gmail.com](mailto:wrickbusiness@gmail.com)\n` +
      `• **Academic Email:** [24051052@kiit.ac.in](mailto:24051052@kiit.ac.in)\n` +
      `• **LinkedIn:** [linkedin.com/in/sayammukherjee-portfolio](https://www.linkedin.com/in/sayammukherjee-portfolio/)\n` +
      `• **GitHub:** [github.com/codesbysayam](https://github.com/codesbysayam)\n` +
      `• **LeetCode:** [leetcode.com/u/codesbysayam](https://leetcode.com/u/codesbysayam/)\n` +
      `• **Codolio:** [codolio.com/profile/codesbysayam](https://codolio.com/profile/codesbysayam)\n` +
      `• **Resume:** [View Professional Resume PDF](https://homely-scarlet-j1yvfmgp.edgeone.dev/Resume-Professional.pdf)\n` +
      `• **YouTube:** [Daily Decipher](https://youtube.com/@dailydecipher) · [Technical AZ](https://youtube.com/@technicalaz)\n` +
      `• **Location:** Bhubaneswar, Odisha, India (Hometown: Hooghly, West Bengal)`;
  }

  // 16. PORTFOLIO NAVIGATION & PAGES
  if (q.includes("navigate") || q.includes("navigation") || q.includes("pages") || q.includes("sections") || q.includes("tabs")) {
    return `**Portfolio Navigation & Sections:**\n\n` +
      `• **Home:** Overview, hero introduction, and engineering philosophy.\n` +
      `• **About:** Background, disciplined routine, and complete academic record (KIIT, Class 12, Class 10).\n` +
      `• **Skills:** Interactive technical stack matrix, languages, and live repository telemetry.\n` +
      `• **Ecosystem:** System architecture diagrams and engineering node graphs.\n` +
      `• **Projects:** All 5 verified projects (OPERON, SayamSolves, MAUSAM, Portfolio, YOLOv8).\n` +
      `• **Certificates:** Verified hackathon honors, competition credentials, and grade reports.\n` +
      `• **Journal:** Technical reflections, architectural notes, and articles.\n` +
      `• **Contact:** Direct message channel and social profiles.`;
  }

  // 17. IDENTITY / WHO IS SAYAM
  if (
    q.includes("who is") ||
    q.includes("about") ||
    q.includes("intro") ||
    q.includes("tell me about sayam") ||
    q.includes("yourself") ||
    q === "hi" ||
    q === "hello" ||
    q === "hey"
  ) {
    return `**About Sayam Mukherjee:**\n\n` +
      `Sayam is a 2nd-year B.Tech Computer Science and Engineering undergraduate specializing in **Artificial Intelligence & Machine Learning** at **Kalinga Institute of Industrial Technology (KIIT)**, Bhubaneswar (First-Year CGPA: **9.06**).\n\n` +
      `He builds full-stack systems and AI pipelines, focusing on agent-driven platforms (like **OPERON**), meteorological telemetry (**MAUSAM** for SIH 2026), and algorithmic foundations in C++ (**SayamSolves**). He is also an educational content creator with over **12K+ subscribers** across his YouTube channels.\n\n` +
      `You can ask me about his projects, education, skills, GitHub activity, content creation, or verified credentials!`;
  }

  // 18. DEFAULT KNOWLEDGE-GROUNDED FALLBACK
  return `I don't have verified information about that in Sayam's portfolio.\n\n` +
    `I can give you verified details on:\n` +
    `• **Education:** KIIT (9.06 CGPA), CBSE Class 12 (86.2% Science stream), CBSE Class 10 (92.6%)\n` +
    `• **Projects:** OPERON, SayamSolves, MAUSAM, Interactive Portfolio, YOLOv8 Edge Vision\n` +
    `• **Technical Stack:** C++, Python, TypeScript, React, Node.js, PyTorch\n` +
    `• **Content Creation:** YouTube channels Daily Decipher (10K+) & Technical AZ (2.06K+)\n` +
    `• **Competitions:** DataForge 2026 (IIT KGP), Deploy or Die (GDG KIIT), Technex'26 (IIT BHU), Toycathon\n` +
    `• **Contact & Profiles:** GitHub, LinkedIn, Resume, Email`;
}
