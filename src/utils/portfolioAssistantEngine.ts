import { portfolioKnowledge } from "../data/portfolioKnowledge";

/**
 * Authoritative, deterministic knowledge-grounded assistant engine for Sayam Mukherjee's portfolio.
 * 
 * Complies strictly with the Portfolio Knowledge Base:
 * 1. Known facts -> Answered directly, accurately, and concisely.
 * 2. Unverified or missing facts -> "I don't have verified information about that in Sayam's portfolio."
 * 3. Class 12 stream is "Science stream" (includes Biology, Mathematics, Physics, Chemistry). Never PCM.
 * 4. 8 verified showcase projects (OPERON, MAUSAM, SightForge, Memory in Motion, AXIOM, INKLOOM, Campus Connect, SayamSolves) + Interactive Portfolio repo.
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
      return `**सायम मुखर्जी के ८ सत्यापित प्रोजेक्ट्स (Verified Projects):**\n\n` +
        `१. **[OPERON](https://github.com/codesbysayam/Operon)**: मानव-नियंत्रित मल्टी-एजेंट बिजनेस प्रोसेस ऑटोमेशन प्लेटफॉर्म (GDG on Campus KIIT हॅकाथॉन)।\n` +
        `२. **[MAUSAM](https://github.com/codesbysayam/mausam_sih-26)**: स्मार्ट इंडिया हैकथॉन (SIH 2026) मौसम और Doppler रडार टेलीमेट्री प्लेटफॉर्म (Team ALGNITE)।\n` +
        `३. **[SightForge](https://github.com/codesbysayam/SightForge)**: Next.js 15 + FastAPI YOLOv8, 17-कीपॉइंट पोज़ और ByteTrack कंप्यूटर विज़न पाइपलाइन।\n` +
        `४. **[Memory in Motion](https://github.com/codesbysayam/Memory-in-Motion)**: DataForge 2026 (IIT Kharagpur) के लिए O(1) रिकरंट मेमोरी और Hebbian फास्ट-वेट्स रिसर्च लैब।\n` +
        `५. **[AXIOM](https://github.com/codesbysayam/AXIOM)**: WCC Launchpad 30 (36h) में निर्मित ऑटोनॉमस ऑपरेशंस कंट्रोल प्लेन।\n` +
        `६. **[INKLOOM](https://github.com/codesbysayam/inkloom)**: कंस्ट्रक्टेड AI लोगो डिज़ाइन वर्कस्पेस (पब्लिक फोर्क, \`master\` ब्रांच)।\n` +
        `७. **[Campus Connect](https://github.com/codesbysayam/CAMPUSCONNECT_1273)**: Next.js कॉलेज इवेंट डिस्कवरी और ऑर्गनाइज़र डैशबोर्ड।\n` +
        `८. **[SayamSolves](https://github.com/codesbysayam/sayam-solves)**: LeetHub V2 द्वारा सिंक की गई C++ DSA रिपॉजिटरी।`;
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
        `४. **WCC Launchpad 30** - We Code Coders व inkloom (36-घंटे का हैकाथॉन, टीम ALGNITE, AXIOM प्लेटफॉर्म, भागीदारी प्रमाणपत्र ID: \`L30-PTQXNX\`)\n` +
        `५. **Toycathon 2021** - राष्ट्रीय फाइनलिस्ट, शिक्षा मंत्रालय व AICTE (आईडी: \`TC-2021-FIN\`)\n` +
        `६. **Technex'26** - बहु-स्पर्धा फाइनलिस्ट (5/6 इवेंट्स), IIT (BHU) वाराणसी (आईडी: \`TX-2026-IITBHU\`)\n` +
        `७. **KIIT ग्रेड रिपोर्ट** - प्रथम वर्ष CGPA: **9.06**\n` +
        `८. **टेबल टेनिस चैम्पियन** - 3× अंतर-विद्यालय प्रथम स्थान विजेता।`;
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
      return `**সায়ম মুখার্জির ৮টি যাচাইকৃত প্রজেক্ট (Verified Projects):**\n\n` +
        `১. **[OPERON](https://github.com/codesbysayam/Operon)** - মানব-নিয়ন্ত্রিত মাল্টি-এজেন্ট বিজনেস অটোমেশন প্ল্যাটফর্ম (GDG on Campus KIIT)।\n` +
        `২. **[MAUSAM](https://github.com/codesbysayam/mausam_sih-26)** - স্মার্ট ইন্ডিয়া হ্যাকাথন (SIH 2026) আবহাওয়া ও Doppler রাডার প্ল্যাটফর্ম (Team ALGNITE)।\n` +
        `৩. **[SightForge](https://github.com/codesbysayam/SightForge)** - Next.js 15 + FastAPI YOLOv8 ও ByteTrack কম্পিউটার ভিশন সিস্টেম।\n` +
        `৪. **[Memory in Motion](https://github.com/codesbysayam/Memory-in-Motion)** - IIT Kharagpur DataForge 2026-এর O(1) রিকারেন্ট মেমরি রিসার্চ ল্যাব।\n` +
        `৫. **[AXIOM](https://github.com/codesbysayam/AXIOM)** - WCC Launchpad 30 (৩৬ ঘণ্টা) হ্যাকাথনে তৈরি অটোনমাস অপারেশনস কন্ট্রোল প্লেন।\n` +
        `৬. **[INKLOOM](https://github.com/codesbysayam/inkloom)** - AI লোগো ডিজাইন ওয়ার্কস্পেস (পাবলিক ফর্ক, \`master\` ব্রাঞ্চ)।\n` +
        `৭. **[Campus Connect](https://github.com/codesbysayam/CAMPUSCONNECT_1273)** - Next.js কলেজ ইভেন্ট ডিসকভারি ও অর্গানাইজার প্ল্যাটফর্ম।\n` +
        `৮. **[SayamSolves](https://github.com/codesbysayam/sayam-solves)** - LeetHub V2 সিঙ্কড C++ অ্যালগরিদম রিপোজিটরি।`;
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
      `• **ପ୍ରୋଜେକ୍ଟ:** OPERON, MAUSAM, SightForge, Memory in Motion, AXIOM, INKLOOM, Campus Connect, SayamSolves.`;
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
  if (q.includes("operon") && !q.includes("who built") && !q.includes("which team")) {
    return `**OPERON | Autonomous Operations, Human-Controlled:**\n\n` +
      `• **What it is:** An agent-driven operations platform automating Support, Finance, HR, and Ops workflows while keeping critical decisions traceable, auditable, and subject to human-in-the-loop approval.\n` +
      `• **Sayam's Exact Contribution:** Developed the TypeScript/React client workspace, Node.js/Express API integration, and approval checkpoint UI.\n` +
      `• **Team & Event:** Built with Team NEXUS for *Deploy or Die* (HowToAlgo × GDG on Campus KIIT, Track A: Business Process Automation).\n` +
      `• **Team Members:** Sounak Chowdhury (Team Leader), Sayam Mukherjee, Aarush Roy, Jaydeep Dutta.\n` +
      `• **Technologies:** TypeScript, Node.js, Express, React, Tailwind CSS, Multi-Agent Systems, Human-in-the-Loop Governance.\n` +
      `• [Live Showcase](https://operonpro.vercel.app) · [GitHub Repository](https://github.com/codesbysayam/Operon)`;
  }

  if (q.includes("mausam")) {
    return `**MAUSAM | Smart Weather Intelligence Platform:**\n\n` +
      `• **What it is:** SIH 2026 atmospheric intelligence platform by Team ALGNITE unifying Doppler radar nowcasting, SACHET/NDMA alerts, CPCB NAQI air quality, INCOIS marine state, soil moisture, and Ask MAUSAM AI.\n` +
      `• **Repository Disclosure:** Active canonical repo is \`codesbysayam/mausam_sih-26\` (with \`mausam_sample\` retained as an earlier SIH 2026 snapshot).\n` +
      `• **Technologies:** TypeScript, React, Python, Tailwind CSS, Weather APIs, C, PLpgSQL.\n` +
      `• [Live Platform](https://mausamgovt.vercel.app) · [Canonical Repository](https://github.com/codesbysayam/mausam_sih-26)`;
  }

  if (q.includes("sightforge") || q.includes("yolo") || q.includes("edge vision") || q.includes("computer vision")) {
    return `**SightForge | Dual-Service YOLOv8 Pose & ByteTrack Edge CV Platform:**\n\n` +
      `• **What it is:** Real-time computer vision platform pairing a Next.js 15 / React 19 16:9 HTML5 Canvas client with a FastAPI Python backend.\n` +
      `• **Pipeline Details:** YOLOv8 Person Detection (COCO Class ID 0), 17 COCO body keypoints pose estimation, Non-Max Suppression (IoU 0.45), ByteTrack persistent ID tracking, and PostgreSQL telemetry storage.\n` +
      `• **Hosting Disclosure:** Self-hosted dual-service repository orchestrated via Makefile (no public cloud host URL).\n` +
      `• [GitHub Repository](https://github.com/codesbysayam/SightForge)`;
  }

  if (q.includes("sayamsolves") || q.includes("sayam-solves") || (q.includes("leetcode") && !q.includes("profile") && !q.includes("link"))) {
    return `**SayamSolves | C++ DSA Solutions & LeetHub V2:**\n\n` +
      `• **What it is:** Sayam's open-source C++ Data Structures & Algorithms repository automatically synced via LeetHub V2.\n` +
      `• **Verified Metrics:** Tracks **3** committed solution directories in \`stats.json\` (LC 0005 Longest Palindromic Substring, 0033 Search in Rotated Sorted Array, 0115 Distinct Subsequences) alongside a **4-problem** LeetCode profile baseline.\n` +
      `• **Technologies:** C++, Data Structures, Algorithms, Dynamic Programming, Binary Search.\n` +
      `• [GitHub Repository](https://github.com/codesbysayam/sayam-solves) · [LeetCode Profile](https://leetcode.com/u/codesbysayam/)`;
  }

  if (q.includes("recent build") || q.includes("built recently") || q.includes("what did he build recently")) {
    return `**Recently Built & Updated by Sayam Mukherjee:**\n\n` +
      `1. **[Memory in Motion](https://github.com/codesbysayam/Memory-in-Motion)**: Mechanistic interpretability lab for DataForge 2026 (IIT Kharagpur) at [memoryinmotion.vercel.app](https://memoryinmotion.vercel.app).\n` +
      `2. **[MAUSAM](https://github.com/codesbysayam/mausam_sih-26)**: SIH 2026 atmospheric telemetry & Doppler radar platform at [mausamgovt.vercel.app](https://mausamgovt.vercel.app).\n` +
      `3. **[SightForge](https://github.com/codesbysayam/SightForge)**: Next.js 15 + FastAPI YOLOv8 person/pose & ByteTrack edge computer vision workbench.\n` +
      `4. **[Interactive Portfolio](https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio)**: Editorial developer portfolio with pre-rendered 11-repo GitHub telemetry.\n` +
      `5. **[AXIOM](https://github.com/codesbysayam/AXIOM)**: Autonomous operations control plane built in 36h for WCC Launchpad 30.`;
  }

  if (
    q.includes("project") ||
    q.includes("projects") ||
    q.includes("what has he built") ||
    q.includes("what did he build") ||
    q.includes("portfolio projects")
  ) {
    return `**Sayam's 8 Verified Flagship Projects:**\n\n` +
      `1. **[OPERON](https://github.com/codesbysayam/Operon)**: Multi-agent operations platform with human-in-the-loop approval gates ([operonpro.vercel.app](https://operonpro.vercel.app)).\n` +
      `2. **[MAUSAM](https://github.com/codesbysayam/mausam_sih-26)**: SIH 2026 weather & Doppler nowcasting platform ([mausamgovt.vercel.app](https://mausamgovt.vercel.app)).\n` +
      `3. **[SightForge](https://github.com/codesbysayam/SightForge)**: Dual-service Next.js 15 + FastAPI YOLOv8 pose & ByteTrack CV platform (local self-hosted).\n` +
      `4. **[Memory in Motion](https://github.com/codesbysayam/Memory-in-Motion)**: DataForge 2026 mechanistic lab contrasting O(1) recurrent memory vs O(T) KV caches ([memoryinmotion.vercel.app](https://memoryinmotion.vercel.app)).\n` +
      `5. **[AXIOM](https://github.com/codesbysayam/AXIOM)**: 36h WCC Launchpad 30 control plane with policy gates & audit chains ([axiomwcc.vercel.app](https://axiomwcc.vercel.app)).\n` +
      `6. **[INKLOOM](https://github.com/codesbysayam/inkloom)**: Public fork (\`master\` branch, \`isFork: true\`) for constructed AI logo systems ([inkloom.art](https://inkloom.art), models under construction).\n` +
      `7. **[Campus Connect](https://github.com/codesbysayam/CAMPUSCONNECT_1273)**: Next.js campus event discovery & organizer dashboard ([campusconnect1273.vercel.app](https://campusconnect1273.vercel.app), seeded in-memory store).\n` +
      `8. **[SayamSolves](https://github.com/codesbysayam/sayam-solves)**: LeetHub V2 synced C++ DSA repository (3 repo files / 4 LC baseline).\n\n` +
      `*(This site itself is hosted in \`codesbysayam/Sayam-Mukherjee-Portfolio\`. Concepts like Fitness OS Pro or Finance OS Pro are not active projects.)*`;
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
    const repoCount = liveGitHubStats?.publicRepos || 11;

    return `**GitHub Activity & Work:**\n\n` +
      `• **Profile:** [@codesbysayam](https://github.com/codesbysayam)\n` +
      `• **Public Repositories:** **${repoCount}** public repositories (**6** stars across portfolio builds)\n` +
      `• **Key Repositories:** \`Operon\`, \`mausam_sih-26\`, \`SightForge\`, \`Memory-in-Motion\`, \`AXIOM\`, \`inkloom\`, \`CAMPUSCONNECT_1273\`, \`sayam-solves\`, \`Sayam-Mukherjee-Portfolio\`\n` +
      `• **Primary Languages:** TypeScript, Python, CSS, JavaScript, HTML, C, C++\n` +
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
    return `Sayam led **Team ALGNITE** as Team Leader for **WCC Launchpad 30** (36-hour hackathon, building AXIOM across Frontend, Backend, and AI / ML), **IGNITHON 2.0** (12-hour offline hackathon at KIIT), and **DATAFORGE 2026** (Memory in Motion at IIT Kharagpur).\n\nIn **Team NEXUS** (OPERON for Deploy or Die), Sayam was a Team Member, while **Sounak Chowdhury** was the Team Leader.`;
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

  // 12.54 SHINIBALI KUMAR - WCC LAUNCHPAD 30
  if (
    q.includes("shinibali") ||
    q.includes("f3rfrc") ||
    q.includes("l30-f3rfrc")
  ) {
    return `**Shinibali Kumar** was Sayam Mukherjee's teammate in **Team ALGNITE** during **WCC Launchpad 30** (36-Hour Hackathon on 4–5 October 2026, organized by We Code Coders with title sponsor inkloom).\n\n` +
      `• **Recipient:** Shinibali Kumar\n` +
      `• **Role:** Team Member (Team ALGNITE)\n` +
      `• **Tracks:** Product / Research and Presentation / Demo\n` +
      `• **Credential ID:** \`L30-F3RFRC\` (Issued 15 October 2026)\n` +
      `• **Credential Type:** Certificate of Participation\n` +
      `• **Contribution:** Contributed to the technical development and validation of AXIOM by working on the workflow and agent execution logic, supporting policy and evaluation design, validating system behaviour across scenarios, testing multi-agent workflows, and preparing the project for demonstration and evaluation.\n` +
      `• **Associated Project:** [AXIOM](https://axiomwcc.vercel.app)\n` +
      `• **Credential Verification:** [Verify at We Code Coders](https://wecodecoders.in/verify/L30-F3RFRC)`;
  }

  // 12.55 WCC LAUNCHPAD 30 & AXIOM (TEAM ALGNITE)
  if (
    q.includes("launchpad") ||
    q.includes("wcc") ||
    q.includes("we code coders") ||
    q.includes("inkloom") ||
    q.includes("axiom") ||
    q.includes("ptqxnx") ||
    q.includes("l30")
  ) {
    if (q.includes("what certificate") || q.includes("which certificate")) {
      return `He received a Certificate of Participation for WCC Launchpad 30, a 36-hour hackathon held on 4–5 October 2026 organized by We Code Coders with title sponsor inkloom (Credential ID: \`L30-PTQXNX\`, issued 15 October 2026).`;
    }

    return `Sayam participated in **WCC Launchpad 30**, a 36-hour hackathon held on 4–5 October 2026, organized by We Code Coders with title sponsor inkloom. He led Team ALGNITE as Team Leader across Frontend, Backend, and AI / ML tracks.\n\n` +
      `• **Event:** WCC Launchpad 30 (36-Hour Hackathon)\n` +
      `• **Credential Type:** Participation\n` +
      `• **Credential ID:** \`L30-PTQXNX\` (Issued 15 October 2026)\n` +
      `• **Organizer:** We Code Coders | **Title Sponsor:** inkloom\n` +
      `• **Team:** ALGNITE *(Role: Team Leader)*\n` +
      `• **Tracks:** Frontend, Backend, and AI / ML\n` +
      `• **Associated Project:** [AXIOM](https://axiomwcc.vercel.app) (Agentic AI platform - led development and built primary architecture)\n` +
      `• **Credential Verification:** [View Record on EdgeOne](https://heavy-sapphire-gc08crqu.edgeone.dev/)\n\n` +
      `*Note: The certificate establishes participation as Team Leader demonstrating technical leadership, full-stack architecture, and AI engineering.*`;
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
      `4. **WCC Launchpad 30**: 36-Hour Hackathon by We Code Coders & inkloom (Participation credential, Team Leader of Team ALGNITE, AXIOM platform, 4–5 October 2026, ID: \`L30-PTQXNX\`)\n` +
      `5. **Toycathon 2021**: National Grand Finalist, Ministry of Education & AICTE, Govt. of India (Credential ID: \`TC-2021-FIN\`)\n` +
      `6. **Technex'26**: Multi-Event Finalist across 5 out of 6 challenges, IIT (BHU) Varanasi (Credential ID: \`TX-2026-IITBHU\`)\n` +
      `7. **KIIT First-Year Grade Report**: 20 engineering coursework subjects completed at KIIT Bhubaneswar (CGPA: 9.06)\n` +
      `8. **MATLAB Workshop**: Participation credential organized by IEEE KIIT Student Branch in association with IEEE PES KIIT Student Branch Chapter (25 September 2026 at KIIT)\n` +
      `9. **Table Tennis Championship**: 3× Inter-School 1st Position Champion (2023)\n\n` +
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

  // 14b. CONTENT CREATION & YOUTUBE CHANNELS
  if (
    q.includes("youtube") ||
    q.includes("channel") ||
    q.includes("creator") ||
    q.includes("video") ||
    q.includes("daily decipher") ||
    q.includes("technical az") ||
    q.includes("obsidian optics") ||
    q.includes("obsidianoptics")
  ) {
    if (q.includes("obsidian") || q.includes("optics")) {
      return `**Obsidian Optics Official YouTube Channel:**\n\n` +
        `• **Handle:** [@ObsidianOptics_in](https://www.youtube.com/@ObsidianOptics_in)\n` +
        `• **Category:** Visual Storytelling & Media\n` +
        `• **Focus:** Cinematic visual narratives, creative editing, and modern digital storytelling\n` +
        `• **Verification Status:** Verified studio snapshot analytics.\n` +
        `• **Channel Link:** [Visit Obsidian Optics on YouTube](https://www.youtube.com/@ObsidianOptics_in)`;
    }

    return `**Sayam's YouTube Channels & Media Platforms (3 Channels):**\n\n` +
      `1. **[Daily Decipher](https://youtube.com/@dailydecipher)** (@dailydecipher) - 10K+ historical subscribers (2023–2026). Distilling complex computer science concepts, algorithmic foundations, and educational visual deep-dives.\n` +
      `2. **[Technical AZ](https://youtube.com/@technicalaz)** (@technicalaz) - 2.06K+ historical subscribers (2021–2023). Technology tutorials, consumer software, and developer tool guides (founded at age 16).\n` +
      `3. **[Obsidian Optics](https://www.youtube.com/@ObsidianOptics_in)** (@ObsidianOptics_in) - Visual storytelling, cinematic tech narratives, and media production.\n\n` +
      `Historical community reach exceeds **12K+ subscribers** across these platforms. You can also explore the dedicated **[Video Showcase](#showcase)** in the portfolio!`;
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

  // 15. DEDICATED RESUME & CV INTENT
  if (q.includes("resume") || q.includes("cv") || q.includes("curriculum vitae")) {
    return `**Sayam Mukherjee's Verified Resume:**\n\n` +
      `• **Headline:** Computer Science Engineering Student | AI & Machine Learning | Software Development\n` +
      `• **Degree & CGPA:** B.Tech in CSE (AI & ML) at KIIT University, Bhubaneswar (2025–2029) | First-Year CGPA: 9.06/10\n` +
      `• **Featured Projects:** AXIOM (WCC Launchpad 30), Memory in Motion (DataForge 2026, IIT Kharagpur), SightForge (YOLOv8 Pose + ByteTrack), MAUSAM (SIH 2026), OPERON (Multi-Agent Operations Platform, GDG KIIT), Campus Connect, INKLOOM, SayamSolves\n` +
      `• **Hard Skills:** Python, Java, C, C++, JavaScript, TypeScript, React, Next.js 15, FastAPI, Node.js, Express.js, Tailwind CSS, Vite, PyTorch, YOLOv8, PostgreSQL, SQL\n` +
      `• **Certifications:** WCC Launchpad 30 (Team Leader), DataForge 2026, Technex'26 (IIT BHU), Toycathon 2021, MATLAB Workshop (IEEE KIIT)\n\n` +
      `📄 **View Complete Document:** [Open Verified Resume PDF](https://exciting-brown-6y14ojmv.edgeone.dev/)`;
  }

  // 16. CONTACT & SOCIAL LINKS
  if (
    q.includes("contact") ||
    q.includes("email") ||
    q.includes("reach") ||
    q.includes("linkedin") ||
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
      `• **Resume:** [View Professional Resume PDF](https://exciting-brown-6y14ojmv.edgeone.dev/)\n` +
      `• **YouTube:** [Daily Decipher](https://youtube.com/@dailydecipher) · [Technical AZ](https://youtube.com/@technicalaz) · [Obsidian Optics](https://www.youtube.com/@ObsidianOptics_in)\n` +
      `• **Location:** Bhubaneswar, Odisha, India (Hometown: Hooghly, West Bengal)`;
  }

  // 16. PORTFOLIO NAVIGATION & PAGES
  if (q.includes("navigate") || q.includes("navigation") || q.includes("pages") || q.includes("sections") || q.includes("tabs")) {
    return `**Portfolio Navigation & Sections:**\n\n` +
      `• **Home:** Overview, hero introduction, and engineering philosophy.\n` +
      `• **About / Experience:** Background, career tracks, content creation, disciplined routine, and complete academic record.\n` +
      `• **Video Showcase:** Dedicated YouTube creator showcase featuring all 3 channels, analytics, and video library.\n` +
      `• **Skills:** Interactive technical stack matrix, languages, and live repository telemetry.\n` +
      `• **Ecosystem:** System architecture diagrams and engineering node graphs.\n` +
      `• **Projects:** All 8 verified projects (OPERON, MAUSAM, SightForge, Memory in Motion, AXIOM, INKLOOM, Campus Connect, SayamSolves).\n` +
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
      `He builds full-stack systems and AI pipelines, focusing on agent-driven platforms (**OPERON**, **AXIOM**), meteorological telemetry (**MAUSAM** for SIH 2026), edge computer vision (**SightForge**), mechanistic interpretability (**Memory in Motion**), and algorithmic foundations in C++ (**SayamSolves**). He is also an educational and creative content creator across YouTube channels Daily Decipher, Technical AZ, and Obsidian Optics (@ObsidianOptics_in).\n\n` +
      `You can ask me about his projects, education, skills, GitHub activity, content creation, or verified credentials!`;
  }

  // 18. DEFAULT KNOWLEDGE-GROUNDED FALLBACK
  return `I don't have verified information about that in Sayam's portfolio.\n\n` +
    `I can give you verified details on:\n` +
    `• **Education:** KIIT (9.06 CGPA), CBSE Class 12 (86.2% Science stream), CBSE Class 10 (92.6%)\n` +
    `• **Projects:** OPERON, MAUSAM, SightForge, Memory in Motion, AXIOM, INKLOOM, Campus Connect, SayamSolves\n` +
    `• **Technical Stack:** C++, Python, TypeScript, React, Next.js, FastAPI, Node.js, YOLOv8\n` +
    `• **Content Creation:** YouTube channels Daily Decipher (10K+ historical), Technical AZ (2.06K+ historical), and Obsidian Optics (@ObsidianOptics_in)\n` +
    `• **Competitions:** DataForge 2026 (IIT KGP), Deploy or Die (GDG KIIT), WCC Launchpad 30, IGNITHON 2.0, Technex'26 (IIT BHU), Toycathon\n` +
    `• **Contact & Profiles:** GitHub, LinkedIn, Resume, Email`;
}
