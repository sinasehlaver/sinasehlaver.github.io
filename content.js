/*
 * content.js - single source of truth for index.html. Edit through editor.html (or by hand).
 * Plain script (file:// safe, no fetch): defines the global SITE object. Everything after the
 * assignment must stay valid JSON. Rendered by render.js with textContent only.
 * Text fields: `backticks` become <code>. URLs: http(s), mailto, relative paths, #anchors only.
 * Unknown extra keys on items are preserved by the editor (room for sync scripts).
 *
 * SCHEMA (version 1)
 *  version       1
 *  meta          {title, description}
 *  hero          {eyebrow, name:{first, accent}, prefix (plain text before the typed words, default "I build"),
 *                 words:[string | {text, prefix}] (typed line; an object's optional prefix
 *                 replaces hero.prefix for that word; max 80 chars, no "|"), lead,
 *                 ctas:[{label, href, style:"primary"|"default"}],
 *                 stats:[{value:number, suffix, decimals:int, label}]}
 *  theme         (optional) {preset:"orange"|"teal"|"violet"|"green"|"rose"|"blue", accent:"" | "#rrggbb" (custom accent, overrides preset),
 *                 fontDisplay, fontText: "" | font slug from site/fonts/fonts.json ("" = built-in Space Grotesk/Inter),
 *                 mat: {mode:"off"|"tinted"|"green", lines:10..100 (integer, line strength %), blur:0..12 (px, default 2), aura:"off"|"behind"|"over" (aurora glow with the mat; default off)} (cutting-mat background; absent = off)}
 *  langSwitch    (optional) boolean; true = show the TR/EN switch on the site. Absent/false = switch hidden and the site always renders English (set from the editor, Colours & site).
 *  experience    {heading, items:[{role, org, period, sub, bullets:[string], skills?:[string]}]}
 *  education     {heading, items:[{title, sub, text, skills?:[string]}], thesis?:{label, title, text, points:[string], link:{label,href}, figures:[{image,alt,caption}] (max 3)}}   (thesis = separate paper-style card under the degrees; shown only when title or text is set)
 *  projects      {heading, items:[{name, url, description, source:"manual"|"pinned", live?:{label, href}, image?, imageAlt?}]}
 *                source "pinned" = written by the GitHub pinned-repos sync. A sync may replace
 *                only "pinned" items and must leave "manual" ones alone.
 *  skills        {heading, groups:[{label, items:[string]}], languages}
 *  beyond        {heading, items:[{kind, title, text, link:{label, href}, embed?, embeds?, image?, imageAlt?, wide?}]}
 *                wide: true = full row (text cards always are); the rest pair up 2 per row on desktop (1 below 760px), so order them in pairs.
 *                image = a self-hosted photo under the text (img/<name>.png|jpg|webp, not svg; "" = none).
 *                embeds (optional, max 4): players side by side, each {provider, url, thumb?, thumbAlt?, link?:{label, href}} (link = a button under that player).
 *                kind: "text"|"music"|"video"|"band"|"photo"|"link"
 *                link: {label:"", href:""} means no link
 *                embed (optional): {provider:"youtube"|"instagram"|"" (auto from url), url, thumb?, thumbAlt?} (thumb = img/<name>; YouTube default img/thumb-<id>.jpg from scripts/fetch-thumbs.mjs); url "" or absent = none. Strict allowlist:
 *                  youtube (www./m./no-www, extra ?t=/&si= ok) watch?v=ID | youtu.be/ID | shorts|live|embed/ID
 *                  (a "Play" text button inserts the player below the card text -> youtube-nocookie.com) or channel https://www.youtube.com/@handle (cannot be
 *                  iframed: renders an "Open channel" link); instagram (p|reel|reels|tv)/SHORTCODE/ (optional user/ prefix, ?query ok);
 *                  @handle/subpage, /channel/UC…, /c/, /user/ = channel. Other https links on those hosts = an "Open on …" link. Empty embed {} = none (dropped on save).
 *                  Nothing third-party loads until the visitor clicks the button. YouTube refuses playback from file:// (error 153): works when hosted.
 *  contact       {heading, intro, links:[{label, href, style:"primary"|"default"}]}
 *  Sections experience/education/projects/skills/beyond/contact each take an optional boolean `hidden` (absent = visible; true = not rendered, nav link hidden; set from the editor).
 *  footer        {text}
 *  tr            (optional) Turkish overlay: a PARTIAL copy of the content above, text fields only (meta, hero incl. prefix/words,
 *                headings, experience/education/projects/skills/beyond/contact text, footer). Arrays overlay by index; projects.items
 *                entries may carry `match` (base name or url) so a pinned sync cannot misalign them. Urls, images, embeds, source,
 *                theme always come from the base. A missing/empty value falls back to English. Site: TR/EN button, ?lang=tr|en.
 */
window.SITE = {
  "version": 1,
  "meta": {
    "title": "Sina Şehlaver — Data Scientist / Musician",
    "description": "Data Scientist with 5+ years across the ML lifecycle: recommendation systems, demand forecasting, medical imaging."
  },
  "hero": {
    "eyebrow": "Builder, tinkerer, data scientist, musician, sound engineer",
    "name": {
      "first": "Sina",
      "accent": "Şehlaver"
    },
    "prefix": "I turn",
    "words": [
      {
        "text": "ML from notebook to production",
        "prefix": "I ship"
      },
      {
        "text": "repetitive chores into handy scripts",
        "prefix": "I automate"
      },
      "hard ideas into sites that teach",
      {
        "text": "music, on and off stage",
        "prefix": "I play"
      },
      {
        "text": "problems with whatever tool fits",
        "prefix": "I solve"
      },
      {
        "text": "what's needed",
        "prefix": "I do"
      }
    ],
    "lead": "Data scientist at MigrosOne (via StartupHeroes), taking ML to production.\nOff the clock I'm a problem solver with whatever tool fits: web apps, handy scripts, sites that teach, 3D-printed parts, small tools that make everyday life easier. Music is the other half: I play, and I mix live sound as a Tonmeister.",
    "ctas": [
      {
        "label": "Get in touch",
        "href": "#contact",
        "style": "primary"
      }
    ],
    "stats": []
  },
  "theme": {
    "preset": "blue",
    "accent": "",
    "fontDisplay": "yeseva-one",
    "fontText": "schibsted-grotesk",
    "mat": {
      "mode": "tinted",
      "lines": 100,
      "blur": 3,
      "aura": "behind"
    }
  },
  "experience": {
    "heading": "Experience",
    "items": [
      {
        "role": "Data Scientist",
        "org": "MigrosOne",
        "period": "Mar 2021 – Present",
        "sub": "Remote · via StartupHeroes",
        "bullets": [
          "Build, deploy and maintain machine-learning models in production on AWS.",
          "Work across recommendation, forecasting and LLM-agent projects, end to end."
        ],
        "skills": [
          "Python",
          "AWS SageMaker",
          "MLOps",
          "LLM agents",
          "LangGraph",
          "forecasting",
          "recommendation",
          "RecBole"
        ]
      },
      {
        "role": "Graduate Researcher",
        "org": "HistoCan",
        "period": "Mar 2021 – Aug 2024",
        "sub": "Ankara, Turkey",
        "bullets": [
          "Deep-learning segmentation and grading of cancerous tissue in histopathology slides; ran the AWS setup for datasets and distributed training."
        ],
        "skills": [
          "AWS",
          "PyTorch",
          "OpenMMLab",
          "CLIP",
          "deep learning",
          "image segmentation"
        ]
      },
      {
        "role": "Undergraduate Researcher",
        "org": "KOVAN Lab, METU",
        "period": "Sep 2019 – Jun 2020",
        "sub": "",
        "bullets": [
          "UR5 cobot motion-planning integration for the TÜBİTAK-funded Apprentice Project."
        ],
        "skills": [
          "Robotics",
          "UR5 cobot",
          "motion planning",
          "MoveIt",
          "ROS"
        ]
      },
      {
        "role": "Intern",
        "org": "Vodafone GmbH",
        "period": "Jun – Dec 2018",
        "sub": "",
        "bullets": [
          "Smart Delivery prototype for 5G logistics in the Vodafone Innovation Park, Düsseldorf."
        ],
        "skills": [
          "5G",
          "prototyping",
          "logistics"
        ]
      },
      {
        "role": "Intern",
        "org": "Arçelik",
        "period": "Jul – Sep 2017",
        "sub": "",
        "bullets": [
          "CI for a Ruby on Rails BI tool; automated AWS deployment tests."
        ],
        "skills": [
          "Ruby on Rails",
          "CI",
          "AWS",
          "test automation"
        ]
      }
    ]
  },
  "education": {
    "heading": "Education",
    "items": [
      {
        "title": "MSc Computer Engineering",
        "sub": "METU · 2021–2024 · cGPA 3.80",
        "text": "Thesis: detecting cancer tissue grade from histopathology images with deep learning.",
        "skills": [
          "Python",
          "PyTorch",
          "deep learning",
          "histopathology",
          "computer vision"
        ]
      },
      {
        "title": "BSc Computer Engineering",
        "sub": "METU · 2014–2020 · cGPA 3.29",
        "text": "Graduation project: GLaTeX, a LaTeX editor inside Google Docs.",
        "skills": [
          "C++",
          "Java",
          "Python",
          "LaTeX",
          "Google Docs"
        ]
      }
    ],
    "thesis": {
      "label": "MSc thesis",
      "title": "Does language help a model read colorectal cancer slides?",
      "text": "Pathologists grade colorectal cancer by eye on whole slide images, which is slow and varies from person to person. Models that outline the tumour grade pixel by pixel need annotated slides, and there are very few of those.\nI took MaskCLIP, a model that matches image regions to text prompts such as \"tumor grade 1\" or \"normal mucosa\", and made it trainable on our own annotated slides. The CLIP encoders stay frozen and only the decode head learns. Switching the text input on and off gave a fair test of what language adds.",
      "points": [
        "103 slides from 103 patients (Ankara Bilkent City Hospital), annotated pixel by pixel with pathologists into 5 classes: tumor grade 1, 2, 3, normal mucosa, other",
        "8 models compared: ConvNeXt, Swin, SegFormer and MaskCLIP with ViT or ResNet backbones, image-only or image-text, plus a pathology-trained PLIP variant",
        "Result: Swin was best (mean F-score 62.9). Image-only MaskCLIP scored 50 to 54; with text it fell to 52 (ResNet) and 37 (ViT). With prompts this generic, language did not help.",
        "Pathology-trained PLIP weights beat the general CLIP ones. I also set up the AWS training pipeline."
      ],
      "link": {
        "label": "",
        "href": ""
      },
      "figures": [
        {
          "image": "img/thesis-histopathology.png",
          "alt": "Four H&E stained colorectal slides, each next to its colour-coded annotation of tumor grades and normal mucosa",
          "caption": "Slides and expert annotations: grade 1 green, grade 2 yellow, grade 3 red, normal mucosa blue."
        },
        {
          "image": "img/thesis-architecture.png",
          "alt": "Diagram: frozen CLIP text and image encoders feed a trainable segmentation decode head whose prediction is compared with the ground truth",
          "caption": "Image-text MaskCLIP: frozen CLIP encoders, trainable decode head."
        }
      ]
    }
  },
  "projects": {
    "heading": "Projects",
    "items": [
      {
        "name": "claude-pm-board",
        "url": "https://github.com/sinasehlaver/claude-pm-board",
        "description": "A local board for running Claude Code across many projects, kept in plain Markdown files that you and your agents both read and write.",
        "source": "pinned",
        "image": "img/project-claude-pm-board.png",
        "imageAlt": "The claude-pm-board project list: colourful project cards with short descriptors, next steps, open-task counts and Start buttons.",
        "live": {
          "label": "Try the demo",
          "href": "https://sinasehlaver.github.io/demos/claude-pm-board/"
        }
      },
      {
        "name": "company_ticket",
        "url": "https://github.com/sinasehlaver/company_ticket",
        "description": "Seat-map ticket sales for the ODTÜ Company musicals: sellers hold and sell seats live from a phone, with roles, per-show reports and backups.",
        "source": "manual",
        "image": "img/project-company-ticket.png",
        "imageAlt": "Ticket sales page for a musical: three show-day tabs, seat-count cards and a colour-tiered seat map with sold seats in crimson.",
        "live": {
          "label": "Try the demo",
          "href": "https://sinasehlaver.github.io/demos/company_ticket/"
        }
      },
      {
        "name": "How Computers Work",
        "url": "",
        "image": "img/project-how-computers-work.png",
        "imageAlt": "A four-instruction program adding two numbers in registers, beside the chapter list from Lamp to Claude Code",
        "description": "An interactive Turkish/English explainer of how a computer works, built up from a battery and a lamp to a processor and a game.",
        "source": "manual",
        "live": {
          "label": "To the site",
          "href": "https://sinasehlaver.github.io/apps/how-computers-work/"
        }
      },
      {
        "name": "Way of Life: Rule a Neighbourhood",
        "url": "",
        "image": "img/project-way-of-life.png",
        "imageAlt": "Pixel-art street with eight neighbours, five value meters and the first level of the game",
        "description": "A pixel-art game: set the rules of a small Turkish neighbourhood and hear its eight residents react. 12 categories, 36 levels.",
        "source": "manual",
        "live": {
          "label": "To the site",
          "href": "https://sinasehlaver.github.io/apps/way-of-life/"
        }
      },
      {
        "name": "pergel",
        "url": "https://github.com/sinasehlaver/pergel",
        "description": "Draft a logo with a compass: swing circles, ink the regions where they overlap, and export a clean true-arc SVG. Runs in the browser, nothing leaves your machine.",
        "source": "manual",
        "image": "img/project-pergel.png",
        "imageAlt": "Three overlapping circles on a square canvas with two of their regions inked in coral, beside the layer and canvas panels.",
        "live": {
          "label": "Try it live",
          "href": "https://pergel.onrender.com/"
        }
      }
    ]
  },
  "skills": {
    "heading": "Tools",
    "groups": [
      {
        "label": "ML / Data",
        "items": [
          "PyTorch",
          "RecBole",
          "XGBoost",
          "scikit-learn",
          "PySpark",
          "Pandas",
          "LangGraph",
          "LangChain"
        ]
      },
      {
        "label": "Platform",
        "items": [
          "AWS SageMaker",
          "BigQuery",
          "Airflow",
          "Firebase",
          "Next.js"
        ]
      },
      {
        "label": "Hardware",
        "items": [
          "Raspberry Pi",
          "Arduino",
          "E-ink displays",
          "3D printing"
        ]
      },
      {
        "label": "Languages",
        "items": [
          "Turkish",
          "Persian",
          "English",
          "German"
        ]
      }
    ],
    "languages": ""
  },
  "beyond": {
    "heading": "Beyond work",
    "items": [
      {
        "kind": "text",
        "title": "Building with Claude Code",
        "text": "I use Claude Code to build whatever makes my life easier: an app that draws consistent, custom-styled charts and tables for my presentations, a notes and to-do app, a personal widget desktop, a Telegram assistant for my Mac, a ticketing site for university musicals. I run it like a small team: my own board hands backlog items to parallel agents, every project keeps its own rules and memory so nothing is explained twice, and nothing ships until its tests and browser checks pass.",
        "link": {
          "label": "",
          "href": ""
        },
        "embeds": []
      },
      {
        "kind": "video",
        "title": "Productions & events",
        "text": "I make music videos and run productions with crews of musicians, camera and sound people, and I organise events from the first call to the last cable. I'm the get-it-done person: if something's needed, I either do it or know who can. A wide network across music, theatre and tech makes that easy.",
        "link": {
          "label": "",
          "href": ""
        },
        "wide": true,
        "embeds": [
          {
            "provider": "youtube",
            "url": "https://youtu.be/izEKsTqRTFw?si=Op-Alx8JiIFr3YAG&t=195",
            "thumb": "",
            "thumbAlt": "",
            "link": {
              "label": "My YouTube channel ↗",
              "href": "https://www.youtube.com/@sinasehlaver8714"
            }
          },
          {
            "provider": "youtube",
            "url": "https://youtu.be/OLYQllYu_RM?si=zBtub_1MTsqdMcrL&t=35",
            "thumb": "",
            "thumbAlt": "",
            "link": {
              "label": "Eksi on YouTube ↗",
              "href": "https://www.youtube.com/@eksimusik"
            }
          }
        ]
      },
      {
        "kind": "music",
        "title": "Tonmeister & live sound",
        "text": "Since 2014 I've mixed and recorded orchestras, musical shows and bands as a freelancer. Away from the console I tinker with Raspberry Pi, Arduino and 3D printers.",
        "link": {
          "label": "Follow on Instagram ↗",
          "href": "https://www.instagram.com/sinasehlaver/"
        },
        "image": "img/img-9788-low.jpg",
        "imageAlt": "",
        "embeds": []
      },
      {
        "kind": "music",
        "title": "Musicals",
        "text": "Conducted a 16-piece orchestra for Big Fish (2022-23), music-directed Once (2019-20), Addams Family and Urinetown (2014-16), plus two self-written musicals.",
        "link": {
          "label": "",
          "href": ""
        },
        "image": "img/dscf1265.jpg",
        "imageAlt": "",
        "embeds": []
      },
      {
        "kind": "band",
        "title": "Eksi",
        "text": "Turkish English, up-tempo disco funk cover band. Also produce cover videos.",
        "link": {
          "label": "Eksi on Instagram ↗",
          "href": "https://www.instagram.com/eksidegileksi/"
        },
        "embed": {
          "provider": "instagram",
          "url": "https://www.instagram.com/p/DbG65S6M7_v/"
        },
        "embeds": []
      },
      {
        "kind": "band",
        "title": "Bazen",
        "text": "2000s Turkish rock cover band.",
        "link": {
          "label": "Bazen on Instagram ↗",
          "href": "https://www.instagram.com/bazen.muzik/"
        },
        "embed": {
          "provider": "instagram",
          "url": "https://www.instagram.com/p/DGiIa8LovE5/"
        },
        "embeds": []
      }
    ]
  },
  "contact": {
    "heading": "Contact",
    "intro": "Happy to chat, or to send you my CV on request. Just email me:",
    "links": [
      {
        "label": "sinasehlaver@gmail.com",
        "href": "mailto:sinasehlaver@gmail.com",
        "style": "primary"
      },
      {
        "label": "LinkedIn ↗",
        "href": "https://www.linkedin.com/in/sinasehlaver/",
        "style": "default"
      },
      {
        "label": "GitHub ↗",
        "href": "https://github.com/sinasehlaver",
        "style": "default"
      },
      {
        "label": "Instagram ↗",
        "href": "https://www.instagram.com/sinasehlaver/",
        "style": "default"
      }
    ]
  },
  "footer": {
    "text": "© 2026 Sina Şehlaver · Built with Claude Code"
  },
  "tr": {
    "meta": {
      "title": "Sina Şehlaver — Data Scientist / Müzisyen",
      "description": "ML sürecinin baştan sona 5+ yıllık içinde olan bir data scientist: öneri sistemleri, talep tahmini, medikal görüntüleme."
    },
    "hero": {
      "eyebrow": "Yapımcı, kurcalayıcı, veri bilimci, müzisyen, ses mühendisi",
      "prefix": "İşim gücüm:",
      "words": [
        "küçük dertleri küçük uygulamalara çevirmek",
        "Excel tablolarını gerçek araçlara dönüştürmek",
        "ML deneylerini production'a taşımak",
        "prova kaosunu takvime bağlamak",
        "elimdeki araçla sorun çözmek",
        "ne gerekiyorsa yapmak"
      ],
      "lead": "MigrosOne'da data scientist olarak ML modellerini production'a taşıyorum (StartupHeroes üzerinden, uzaktan).\nMesai dışında da elimdeki işe hangi araç uyuyorsa onunla çözüm üretirim: web uygulamaları, işe yarayan scriptler, öğreten siteler, 3D baskı parçalar, günlük hayatı kolaylaştıran küçük araçlar. Bugünlerde çoğunu Claude Code ile yapıyorum. Müzik de işin öbür yarısı: çalarım, bir de Tonmeister olarak canlı ses miksi yaparım.",
      "ctas": [
        {
          "label": "İletişime geç"
        }
      ]
    },
    "experience": {
      "heading": "Deneyim",
      "items": [
        {
          "role": "Data Scientist",
          "period": "Mart 2021 – Günümüz",
          "sub": "Remote · StartupHeroes üzerinden",
          "bullets": [
            "Makine öğrenmesi modellerini AWS üzerinde geliştiriyor, canlıya alıyor ve çalışır halde tutuyorum.",
            "Öneri, tahmin ve LLM agent projelerinde baştan sona çalışıyorum."
          ]
        },
        {
          "role": "Yüksek Lisans Araştırmacısı",
          "period": "Mart 2021 – Ağustos 2024",
          "sub": "Ankara, Türkiye",
          "bullets": [
            "Histopatoloji kesitlerinde kanserli dokuyu derin öğrenmeyle segmente edip derecelendirdim; veri setleri ve dağıtık eğitim için AWS altyapısını kurup yönettim."
          ]
        },
        {
          "role": "Lisans Araştırmacısı",
          "period": "Eylül 2019 – Haziran 2020",
          "bullets": [
            "TÜBİTAK destekli Apprentice projesinde UR5 kobotu için hareket planlama entegrasyonunu yaptım."
          ]
        },
        {
          "role": "Stajyer",
          "period": "Haziran – Aralık 2018",
          "bullets": [
            "Düsseldorf'taki Vodafone İnovasyon Parkı'nda 5G lojistiği için Smart Delivery prototipi geliştirdim."
          ]
        },
        {
          "role": "Stajyer",
          "period": "Temmuz – Eylül 2017",
          "bullets": [
            "Ruby on Rails ile yazılmış bir BI aracına CI kurdum; AWS'ye otomatik deploy testleri yazdım."
          ]
        }
      ]
    },
    "education": {
      "heading": "Eğitim",
      "items": [
        {
          "title": "Bilgisayar Mühendisliği Yüksek Lisansı",
          "sub": "ODTÜ · 2021–2024 · GNO 3,80",
          "text": "Tez: histopatoloji görüntülerinde kanser derecesini derin öğrenmeyle tespit etme."
        },
        {
          "title": "Bilgisayar Mühendisliği Lisansı",
          "sub": "ODTÜ · 2014–2020 · GNO 3,29",
          "text": "Bitirme projesi: GLaTeX, Google Docs içinde çalışan bir LaTeX editörü."
        }
      ]
    },
    "projects": {
      "heading": "Projeler",
      "items": [
        {
          "match": "claude-pm-board",
          "description": "Claude Code'u birden fazla projede yönetmek için yerel bir pano. Her şey düz Markdown dosyalarında durur; hem siz hem agent'larınız okuyup yazabilir."
        },
        {
          "match": "company_ticket",
          "description": "ODTÜ Company müzikalleri için koltuk haritalı bilet satışı. Satıcılar koltukları telefondan anlık olarak ayırıp satıyor; roller, gösteri bazlı raporlar ve yedekleme de var."
        },
        {
          "match": "pergel",
          "description": "Pergelle logo çizin: daireler çevirin, kesiştikleri bölgeleri boyayın, temiz bir SVG olarak dışa aktarın. Tarayıcıda çalışır, hiçbir şey makinenizden çıkmaz.",
          "imageAlt": "Kare bir tuvalde üst üste binen üç daire; iki bölgesi mercan rengiyle boyalı, yanlarda katman ve tuval panelleri."
        },
        {
          "match": "Way of Life: Rule a Neighbourhood",
          "name": "Way of Life: Mahalleyi Yönet",
          "imageAlt": "Sekiz komşusu, beş değer göstergesi ve oyunun ilk seviyesiyle piksel sanat bir sokak",
          "description": "Piksel sanat bir oyun: küçük bir Türk mahallesinin kurallarını sen koyuyorsun, sekiz komşunun tepkisini sen görüyorsun. 12 kategori, 36 seviye.",
          "live": {
            "label": "Siteye git"
          }
        },
        {
          "match": "How Computers Work",
          "name": "Bilgisayarlar Nasıl Çalışır",
          "imageAlt": "Yazmaçlarda iki sayıyı toplayan dört komutluk bir program ve Lamba'dan Claude Code'a bölüm listesi",
          "description": "Bir pil ve ampulden işlemciye, oradan da bir oyuna uzanan; bilgisayarın nasıl çalıştığını anlatan interaktif Türkçe/İngilizce bir anlatım.",
          "live": {
            "label": "Siteye git"
          }
        }
      ]
    },
    "skills": {
      "heading": "Araçlar",
      "groups": [
        {
          "label": "ML / Veri"
        },
        {
          "label": "Platform"
        },
        {
          "label": "Donanım",
          "items": [
            "Raspberry Pi",
            "Arduino",
            "E-ink ekranlar",
            "3D baskı"
          ]
        },
        {
          "label": "Diller",
          "items": [
            "Türkçe",
            "Farsça",
            "İngilizce",
            "Almanca"
          ]
        }
      ]
    },
    "beyond": {
      "heading": "İş dışında",
      "items": [
        {
          "title": "Claude Code ile üretmek",
          "text": "Hayatımı kolaylaştıran ne varsa Claude Code ile yapıyorum: sunumlarım için tutarlı, özel stilli grafik ve tablolar çizen bir uygulama, not ve yapılacaklar uygulaması, kişisel bir widget masaüstü, Mac'im için Telegram asistanı, üniversite müzikalleri için bir bilet satış sitesi. Küçük bir ekip gibi çalıştırıyorum: kendi panom backlog maddelerini paralel agent'lara dağıtıyor, her projenin kendi kuralları ve hafızası var, böylece hiçbir şey iki kez anlatılmıyor; testler ve tarayıcı kontrolleri geçmeden de hiçbir şey yayına çıkmıyor."
        },
        {
          "title": "Prodüksiyon ve etkinlikler",
          "text": "Müzik videoları çekiyor, müzisyenlerden, kamera ve ses ekibinden oluşan ekiplerle prodüksiyon yürütüyorum; etkinlikleri de ilk telefondan son kabloya kadar organize ediyorum. İşi bitiren kişiyim: bir şey gerekiyorsa ya kendim yaparım ya da kimin yapacağını bilirim. Müzik, tiyatro ve teknoloji alanındaki geniş çevrem bunu kolaylaştırıyor.",
          "embeds": [
            {
              "link": {
                "label": "YouTube kanalım ↗"
              }
            },
            {
              "link": {
                "label": "Eksi YouTube'da ↗"
              }
            }
          ]
        },
        {
          "title": "Tonmeister ve canlı ses",
          "text": "2014'ten beri freelance olarak orkestraların, müzikallerin ve grupların canlı ses miksini yapıyor, kayıtlarını alıyorum. Mikserin başında olmadığım zamanlarda Raspberry Pi, Arduino ve 3D yazıcılarla uğraşıyorum.",
          "link": {
            "label": "Instagram'da takip et ↗"
          }
        },
        {
          "title": "Müzikaller",
          "text": "Big Fish (2022-23) için 16 kişilik orkestrayı şefledim; Once (2019-20), Addams Family ve Urinetown (2014-16) için müzik direktörlüğü yaptım. Kendi yazdığım iki müzikal de var."
        },
        {
          "title": "Eksi",
          "text": "Türkçe ve İngilizce şarkılarla çalan, hareketli bir disko funk cover grubu. Cover videoları da çekiyoruz.",
          "link": {
            "label": "Eksi Instagram'da ↗"
          }
        },
        {
          "title": "Bazen",
          "text": "2000'ler Türk rock cover grubu.",
          "link": {
            "label": "Bazen Instagram'da ↗"
          }
        }
      ]
    },
    "contact": {
      "heading": "İletişim",
      "intro": "Sohbet etmeye ya da isteyene CV'mi göndermeye hazırım. Bana e-posta atmanız yeter:",
      "links": [
        {},
        {
          "label": "LinkedIn ↗"
        },
        {
          "label": "GitHub ↗"
        },
        {
          "label": "Instagram ↗"
        }
      ]
    },
    "footer": {
      "text": "© 2026 Sina Şehlaver · Claude Code ile yapıldı"
    }
  }
};
