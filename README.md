<div align="center">

<img src="public/aat.svg" alt="Anxiety Aid Tools Logo" width="200" height="200" />

# Anxiety Aid Tools

**Evidence-based techniques to find calm when you need it most**

[![License: GPL](https://img.shields.io/badge/License-GPL-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Multilingual Support](https://img.shields.io/badge/Languages-4-blue?logo=google-translate)](https://github.com/alvinunreal/anxiety-aid-tools)
[![GitHub Stars](https://img.shields.io/github/stars/alvinunreal/anxiety-aid-tools?style=social)](https://github.com/alvinunreal/anxiety-aid-tools/stargazers)

[**Website**](https://anxietyaidtools.com/) · [**Contribute**](#contributing) · [**Star Us**](https://github.com/alvinunreal/anxiety-aid-tools)

*Transform anxious moments into opportunities for calm with scientifically-backed breathing exercises, grounding techniques, and mindfulness tools.*

</div>

> **Version sans pistage (fork)** — Ce fork reprend la dernière version libre et gratuite du projet (licence GPL-3.0), sans inscription ni option payante.
> Modifications apportées :
> - suppression de Google Analytics et de Sentry (aucune donnée envoyée à un tiers) ;
> - police Inter et icônes embarquées : le site ne fait **aucune requête externe** ;
> - génération en site HTML statique (`npx nuxt generate` → dossier `.output/public`), hébergeable n'importe où ;
> - français par défaut (anglais, portugais et chinois via le sélecteur de langue) ;
> - publication automatique possible sur GitHub Pages (`.github/workflows/pages.yml`) et image Docker/nginx (`docker compose up -d` → http://localhost:8080).

---

## What Makes This Special

A collection of anxiety management techniques built around four core principles.

### 🚪 **No Barriers**
- **No signup required** - Open the website and start immediately
- **No ads** - Clean interface focused on what matters
- **Works offline** - Available when you need it, regardless of connection

### 🔒 **Privacy First**
- **No tracking** - Your usage patterns stay private
- **Local storage only** - All preferences saved on your device
- **No data collection** - We don't know who you are or what you do

### 🧬 **Open Source**
- **Code is public** - Anyone can inspect, improve, or adapt it
- **Community maintained** - Built by people who understand anxiety
- **GPL licensed** - Free to use, modify, and redistribute

### 🧠 **Science-Based**
- **Research-backed techniques** - Methods studied in clinical settings
- **Educational content** - Understanding why techniques work
- **Evidence references** - Links to supporting research where available

---

## 🛠️ Interactive Techniques

<div align="center">

| 🫁 **Breathing** | ⚓ **Grounding** | 🧘 **Visualization** | 💭 **Mindfulness** |
|:---:|:---:|:---:|:---:|
| Guided breathing patterns | 5-4-3-2-1 sensory technique | Peaceful place imagery | Thought labeling |
| 2-3 minutes | 3-5 minutes | 5-10 minutes | 5-10 minutes |

</div>

### 🌟 **Featured Techniques**

- **🫁 Breathing Exercises** - Interactive animations guide your breath rhythm
- **⚓ 5-4-3-2-1 Grounding** - Sensory awareness to anchor you in the present
- **🎯 Guided Breathing** - Customizable breath patterns with visual cues
- **💪 Progressive Muscle Relaxation** - Release physical tension systematically
- **🌅 Peaceful Visualization** - Immersive guided imagery sessions
- **🧠 Thought Labeling** - Cognitive techniques to reframe anxious thoughts
- **🫧 Stress Relief Bubbles** - Interactive bubble-popping for instant relief
- **🎵 Sound Therapy** - Calming ambient soundscapes
- **⚾ Virtual Stress Ball** - Tactile relief through digital interaction

---

## **Why Open Source Mental Health Matters**

> **"Mental health tools should be accessible to everyone, everywhere, without barriers."**

### **Our Mission**
- **Remove barriers** to mental health support
- **Democratize access** to evidence-based techniques
- **Build trust** through transparency and community input
- **Enable customization** for different cultures and needs

### **Community Impact**
- **Global reach** - No geographic restrictions
- **Always free** - No premium features or paywalls
- **Privacy first** - All data stays on your device
- **Community-driven** - Built by and for people who understand anxiety

---

## **Quick Start**

### **For Users**

#### Local
```bash
# Visit the live demo
https://anxietyaidtools.com/

# Or run locally
git clone https://github.com/alvinunreal/anxiety-aid-tools.git
cd anxiety-aid-tools
npm install
npm run dev
```

### **For Contributors**
```bash
# Fork the repository
gh repo fork alvinunreal/anxiety-aid-tools

# Make your improvements
git checkout -b feature/your-improvement

# Sync translations (if you modified text)
npm run sync-locales

# Submit your contribution
gh pr create
```

---

### **Clinical Disclaimer**
This tool provides general anxiety management techniques and is not a substitute for professional mental health treatment. If you're experiencing persistent anxiety, please consult a healthcare provider.

---

## **Contributing**

We believe the best mental health tools are built by communities who understand the challenges firsthand.

### **Ways to Help**
- **Report bugs** - Help us improve reliability
- **Suggest features** - Share ideas for new techniques
- **Add translations** - Make it accessible to more people
- **Improve content** - Enhance educational materials
- **Design contributions** - Better UX for people in distress

### **Development Setup**
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run with HTTPS (for testing PWA features)
pnpm dev-https

# Build for production
pnpm build

# Check translations are in sync
pnpm sync-locales
```

### **Code Structure**
```
anxiety-aid-tools/
├── components/          # Reusable Vue components
│   ├── *Exercise.vue   # Interactive technique components
│   └── TechniquesGrid.vue
├── composables/        # Shared logic
│   └── useTechniques.js # Technique data and utilities
├── i18n/              # Internationalization
│   └── locales/       # Translation files
├── pages/             # Route components
│   └── [technique].vue # Individual technique pages
└── public/            # Static assets
    └── aat.svg        # App logo
```

---

## **Acknowledgments**

Built with gratitude for:
- **Mental health researchers** whose studies inform our techniques
- **Open source community** providing the tools to build accessible software
- **Beta testers** who provided feedback during anxious moments
- **Contributors** who help make this tool better for everyone

---

## **License**

GPL License - feel free to use, modify, and distribute. Mental health tools should be open and accessible.

---

<div align="center">

**If this project helped you, consider starring it to help others discover these techniques.**

[**Star on GitHub**](https://github.com/alvinunreal/anxiety-aid-tools) • [**Report Issues**](https://github.com/alvinunreal/anxiety-aid-tools/issues) • [**Join Discussions**](https://github.com/alvinunreal/anxiety-aid-tools/discussions)

*Remember: You're stronger than your anxiety, and you're not alone in this journey.*

</div>
