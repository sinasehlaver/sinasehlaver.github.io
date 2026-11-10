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
 *  theme         (optional) {preset:"orange"|"teal"|"violet"|"green"|"rose"|"blue", accent:"" | "#rrggbb" (custom accent, overrides preset)}
 *  experience    {heading, items:[{role, org, period, sub, bullets:[string]}]}
 *  education     {heading, items:[{title, sub, text}]}
 *  projects      {heading, items:[{name, url, description, source:"manual"|"pinned", live?:{label, href}, image?, imageAlt?}]}
 *                source "pinned" = written by the GitHub pinned-repos sync. A sync may replace
 *                only "pinned" items and must leave "manual" ones alone.
 *  skills        {heading, groups:[{label, items:[string]}], languages}
 *  beyond        {heading, items:[{kind, title, text, image, imageAlt, link:{label, href}}]}
 *                kind: "text"|"music"|"video"|"band"|"photo"|"link"
 *                image: relative path img/<file> (png|jpg|webp, no svg) or "" for none
 *                link: {label:"", href:""} means no link
 *                embed (optional): {provider:"youtube"|"instagram", url}; url "" or absent = none. Strict allowlist:
 *                  youtube https://www.youtube.com/watch?v=ID | https://youtu.be/ID | https://www.youtube.com/embed/ID
 *                  (facade, auto-loaded when scrolled into view -> youtube-nocookie.com) or channel https://www.youtube.com/@handle (cannot be
 *                  iframed: renders an "Open channel" card); instagram https://www.instagram.com/(p|reel)/SHORTCODE/.
 *                  Nothing third-party loads until the embed scrolls into view. YouTube refuses playback from file:// (error 153): works when hosted.
 *  contact       {heading, intro, links:[{label, href, style:"primary"|"default"}]}
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
      "small annoyances into small apps",
      "spreadsheets into real tools",
      "ML experiments into production",
      "rehearsal chaos into a calendar"
    ],
    "lead": "Data scientist at MigrosOne (via StartupHeroes), taking ML to production.\nOff the clock I'm a problem solver with whatever tool fits: web apps, handy scripts, sites that teach, 3D-printed parts, small tools that make everyday life easier. Music is the other half: I play, and I mix live sound as a Tonmeister.",
    "ctas": [
      {
        "label": "Get in touch",
        "href": "#contact",
        "style": "primary"
      },
      {
        "label": "Ask for my CV",
        "href": "#contact",
        "style": "default"
      }
    ],
    "stats": []
  },
  "theme": {
    "preset": "blue",
    "accent": ""
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
        ]
      },
      {
        "role": "Graduate Researcher",
        "org": "HistoCan",
        "period": "Mar 2021 – Aug 2024",
        "sub": "Ankara, Turkey",
        "bullets": [
          "Deep-learning segmentation and grading of cancerous tissue in histopathology slides; ran the AWS setup for datasets and distributed training."
        ]
      },
      {
        "role": "Undergraduate Researcher",
        "org": "KOVAN Lab, METU",
        "period": "Sep 2019 – Jun 2020",
        "sub": "",
        "bullets": [
          "UR5 cobot motion-planning integration for the TÜBİTAK-funded Apprentice Project."
        ]
      },
      {
        "role": "Intern",
        "org": "Vodafone GmbH",
        "period": "Jun – Dec 2018",
        "sub": "",
        "bullets": [
          "Smart Delivery prototype for 5G logistics in the Vodafone Innovation Park, Düsseldorf."
        ]
      },
      {
        "role": "Intern",
        "org": "Arçelik",
        "period": "Jul – Sep 2017",
        "sub": "",
        "bullets": [
          "CI for a Ruby on Rails BI tool; automated AWS deployment tests."
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
        "text": "Thesis: detecting cancer tissue grade from histopathology images with deep learning."
      },
      {
        "title": "BSc Computer Engineering",
        "sub": "METU · 2014–2020 · cGPA 3.29",
        "text": "Graduation project: GLaTeX, a LaTeX editor inside Google Docs."
      }
    ]
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
        "imageAlt": "The claude-pm-board project list: colourful project cards with short descriptors, next steps, open-task counts and Start buttons."
      },
      {
        "name": "company_ticket",
        "url": "https://github.com/sinasehlaver/company_ticket",
        "description": "Seat-map ticket sales for the ODTÜ Company musicals: sellers hold and sell seats live from a phone, with roles, per-show reports and backups.",
        "source": "manual",
        "image": "img/project-company-ticket.png",
        "imageAlt": "Ticket sales page for a musical: three show-day tabs, seat-count cards and a colour-tiered seat map with sold seats in crimson."
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
        "kind": "music",
        "title": "Tonmeister & live sound",
        "text": "Since 2014 I've mixed and recorded orchestras, musical shows and bands as a freelancer. Away from the console I tinker with Raspberry Pi, Arduino and 3D printers.",
        "image": "img/beyond-live-sound.png",
        "imageAlt": "Illustration of a mixing console with faders and a waveform",
        "link": {
          "label": "Follow on Instagram ↗",
          "href": "https://www.instagram.com/sinasehlaver/"
        },
        "embed": {
          "provider": "instagram",
          "url": ""
        }
      },
      {
        "kind": "music",
        "title": "Musicals",
        "text": "Conducted a 16-piece orchestra for Big Fish (2022-23), music-directed Once (2019-20), Addams Family and Urinetown (2014-16), plus two self-written musicals.",
        "image": "img/beyond-musicals.png",
        "imageAlt": "Illustration of a stage with curtains, a spotlight and notes on a staff",
        "link": {
          "label": "",
          "href": ""
        },
        "embed": {
          "provider": "youtube",
          "url": "https://www.youtube.com/watch?v=jB49wYjSNk0"
        }
      },
      {
        "kind": "video",
        "title": "YouTube covers",
        "text": "Covers and music videos live on my YouTube channel.",
        "image": "img/beyond-covers.png",
        "imageAlt": "Illustration of a video player with a play button and audio bars",
        "link": {
          "label": "My YouTube channel ↗",
          "href": "https://www.youtube.com/@sinasehlaver8714"
        },
        "embed": {
          "provider": "youtube",
          "url": "https://www.youtube.com/watch?v=izEKsTqRTFw"
        }
      },
      {
        "kind": "band",
        "title": "Bazen Müzik",
        "text": "2000s Turkish rock cover band.",
        "image": "img/beyond-bands.png",
        "imageAlt": "Illustration of two stage speakers and an amp level meter",
        "link": {
          "label": "BAZEN on Instagram ↗",
          "href": "https://www.instagram.com/bazen.muzik/"
        },
        "embed": {
          "provider": "instagram",
          "url": "https://www.instagram.com/p/DGiIa8LovE5/"
        }
      },
      {
        "kind": "band",
        "title": "Ekşi Değil Eksi",
        "text": "Turkish English, up-tempo disco funk cover band. Also produce cover videos.",
        "image": "img/beyond-bands.png",
        "imageAlt": "Illustration of two stage speakers and an amp level meter",
        "link": {
          "label": "Ekşi Değil Eksi on Instagram ↗",
          "href": "https://www.instagram.com/eksidegileksi/"
        },
        "embed": {
          "provider": "instagram",
          "url": "https://www.instagram.com/p/DbG65S6M7_v/"
        }
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
        "prova kaosunu takvime bağlamak"
      ],
      "lead": "MigrosOne'da data scientist olarak ML modellerini production'a taşıyorum (StartupHeroes üzerinden, uzaktan).\nMesai dışında da elimdeki işe hangi araç uyuyorsa onunla çözüm üretirim: web uygulamaları, işe yarayan scriptler, öğreten siteler, 3D baskı parçalar, günlük hayatı kolaylaştıran küçük araçlar. Müzik de işin öbür yarısı: çalarım, bir de Tonmeister olarak canlı ses miksi yaparım.",
      "ctas": [
        {
          "label": "İletişime geç"
        },
        {
          "label": "CV için yaz"
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
          "title": "Tonmeister ve canlı ses",
          "text": "2014'ten beri freelance olarak orkestraların, müzikallerin ve grupların canlı ses miksini yapıyor, kayıtlarını alıyorum. Mikserin başında olmadığım zamanlarda Raspberry Pi, Arduino ve 3D yazıcılarla uğraşıyorum.",
          "imageAlt": "Faderlı bir mikser ve dalga biçimi çizimi",
          "link": {
            "label": "Instagram'da takip et ↗"
          }
        },
        {
          "title": "Müzikaller",
          "text": "Big Fish (2022-23) için 16 kişilik orkestrayı şefledim; Once (2019-20), Addams Family ve Urinetown (2014-16) için müzik direktörlüğü yaptım. Kendi yazdığım iki müzikal de var.",
          "imageAlt": "Perdeler, bir spot ışığı ve porte üzerinde notalar olan bir sahne çizimi"
        },
        {
          "title": "YouTube cover'ları",
          "text": "Cover'larım ve müzik videolarım YouTube kanalımda.",
          "imageAlt": "Oynat düğmeli bir video oynatıcı ve ses çubukları çizimi",
          "link": {
            "label": "YouTube kanalım ↗"
          }
        },
        {
          "title": "Bazen Müzik",
          "text": "2000'ler Türk rock cover grubu.",
          "imageAlt": "İki sahne hoparlörü ve bir amfi seviye göstergesi çizimi",
          "link": {
            "label": "BAZEN Instagram'da ↗"
          }
        },
        {
          "title": "Ekşi Değil Eksi",
          "text": "Türkçe ve İngilizce şarkılarla çalan, hareketli bir disko funk cover grubu. Cover videoları da çekiyoruz.",
          "imageAlt": "İki sahne hoparlörü ve bir amfi seviye göstergesi çizimi",
          "link": {
            "label": "Ekşi Değil Eksi Instagram'da ↗"
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
