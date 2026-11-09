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
 *  hero          {eyebrow, name:{first, accent}, words:[string] (typed line), lead,
 *                 ctas:[{label, href, style:"primary"|"default"}],
 *                 stats:[{value:number, suffix, decimals:int, label}]}
 *  experience    {heading, items:[{role, org, period, sub, bullets:[string]}]}
 *  education     {heading, items:[{title, sub, text}]}
 *  projects      {heading, items:[{name, url, description, source:"manual"|"pinned", live?:{label, href}}]}
 *                source "pinned" = written by the GitHub pinned-repos sync. A sync may replace
 *                only "pinned" items and must leave "manual" ones alone.
 *  skills        {heading, groups:[{label, items:[string]}], languages}
 *  beyond        {heading, items:[{kind, title, text, image, imageAlt, link:{label, href}}]}
 *                kind: "text"|"music"|"video"|"band"|"photo"|"link"
 *                image: relative path img/<file> (png|jpg|webp, no svg) or "" for none
 *                link: {label:"", href:""} means no link
 *                embed (optional): {provider:"youtube"|"instagram", url}; url "" or absent = none. Strict allowlist:
 *                  youtube https://www.youtube.com/watch?v=ID | https://youtu.be/ID | https://www.youtube.com/embed/ID
 *                  (click-to-load facade -> youtube-nocookie.com) or channel https://www.youtube.com/@handle (cannot be
 *                  iframed: renders an "Open channel" card); instagram https://www.instagram.com/(p|reel)/SHORTCODE/.
 *                  Nothing third-party loads before the click. YouTube refuses playback from file:// (error 153): works when hosted.
 *  contact       {heading, intro, links:[{label, href, style:"primary"|"default"}]}
 *  footer        {text}
 */
window.SITE = {
  "version": 1,
  "meta": {
    "title": "Sina Şehlaver — Data Scientist / Musician",
    "description": "Data Scientist with 5+ years across the ML lifecycle: recommendation systems, demand forecasting, medical imaging."
  },
  "hero": {
    "eyebrow": "Builder, tinkerer, data scientist",
    "name": {
      "first": "Sina",
      "accent": "Şehlaver"
    },
    "words": [
      "tools for my own problems",
      "apps for a theater company",
      "dashboards I actually use",
      "ML systems by day"
    ],
    "lead": "I make small, finished software for real people: a project board for my Claude workspace, rehearsal booking for a theater company, ticket sales for a student musical. By day I'm a Data Scientist taking ML from experiment to production.",
    "ctas": [
      {
        "label": "Get in touch",
        "href": "#contact",
        "style": "primary"
      },
      {
        "label": "CV (PDF)",
        "href": "cv.pdf",
        "style": "default"
      }
    ],
    "stats": []
  },
  "experience": {
    "heading": "Day job",
    "items": [
      {
        "role": "Data Scientist",
        "org": "MigrosOne",
        "period": "Mar 2021 – Present",
        "sub": "Remote · via StartupHeroes",
        "bullets": [
          "Train and maintain a hybrid cart-prediction engine (MultiDAE + XGBoost) on AWS SageMaker.",
          "Run recommendation endpoints that drive up to 11% of order revenue.",
          "Built a LangGraph agent with a custom UI and step-level observability."
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
    "heading": "Things I've built",
    "items": [
      {
        "name": "claude-pm-board",
        "url": "https://github.com/sinasehlaver/claude-pm-board",
        "description": "A local board for running Claude Code across many projects, kept in plain Markdown files that you and your agents both read and write.",
        "source": "pinned"
      },
      {
        "name": "company_ticket",
        "url": "https://github.com/sinasehlaver/company_ticket",
        "description": "",
        "source": "pinned"
      },
      {
        "name": "Way of Life: Rule a Neighbourhood",
        "url": "",
        "image": "img/project-way-of-life.png",
        "imageAlt": "Pixel-art street with eight neighbours, five value meters and the first level of the game",
        "description": "A pixel-art game: set the rules of a small Turkish neighbourhood and hear its eight residents react. 12 categories, 36 levels.",
        "source": "manual",
        "live": {
          "label": "Live",
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
          "label": "Live",
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
    "intro": "Looking for ML Engineer or MLOps roles. The fastest way to reach me:",
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
    "text": "© 2026 Sina Şehlaver"
  }
};
