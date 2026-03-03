// ============================================================================
// DYNAMIC STAGE GENERATOR
// Generates random scenarios with logical lifecycle ordering
// Supports seeded random for reproducible testing
// ============================================================================

class StageGenerator {
  constructor(seed = null) {
    this.seed = seed;
    this.randomIndex = 0;
  }

  // --------- Seeded Random Number Generator ---------
  // Using simple linear congruential generator for reproducibility
  seededRandom() {
    if (this.seed === null) {
      return Math.random();
    }
    // LCG formula: (a * x + c) mod m
    const a = 1664525;
    const c = 1013904223;
    const m = 2147483648; // 2^31
    
    this.seed = (a * this.seed + c) % m;
    return this.seed / m;
  }

  // --------- Utility: Shuffle array with seeded random ---------
  shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(this.seededRandom() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // --------- Utility: Pick random element with seeded random ---------
  pickRandom(array) {
    if (array.length === 0) return null;
    const idx = Math.floor(this.seededRandom() * array.length);
    return array[idx];
  }

  // --------- Stage Templates ---------
  getIdeaStages() {
    return [
      {
        id: 'idea-founding-vision',
        title: 'Defining Your Vision',
        type: 'idea',
        description: 'Your startup is just an idea. You need to decide what problem your tech will solve and who your target users are. Do you focus on accessibility features that help all users, or build the quickest minimum viable product (MVP) first and add accessibility later?',
        choices: [
          {
            text: 'Build inclusive from day one – hire an accessibility expert (£3,000)',
            effects: { impact: 6, inclusivity: 16, trust: 10, budget: -3000 }
          },
          {
            text: 'Launch fast with core features, add accessibility in phase 2 (£500)',
            effects: { impact: 12, inclusivity: 6, trust: 5, budget: -500 }
          },
          {
            text: 'Research competitor products and user feedback first (£2,000)',
            effects: { impact: 8, inclusivity: 10, trust: 12, budget: -2000 }
          }
        ]
      },
      {
        id: 'idea-target-market',
        title: 'Choosing Your Market',
        type: 'idea',
        description: 'You have identified a promising gap in the market. Now you must decide whether to target the broadest possible audience (which requires more investment in inclusivity) or focus on a niche group with more specific needs.',
        choices: [
          {
            text: 'Target everyone – design for diverse users and disabilities (£4,000)',
            effects: { impact: 7, inclusivity: 18, trust: 12, budget: -4000 }
          },
          {
            text: 'Start with your core audience, expand later (£1,500)',
            effects: { impact: 10, inclusivity: 8, trust: 8, budget: -1500 }
          }
        ]
      },
      {
        id: 'idea-funding',
        title: 'Securing Initial Funding',
        type: 'idea',
        description: 'Investors are interested in your idea, but they have different priorities. One wants rapid growth; another emphasises responsible tech practices. How do you pitch your vision?',
        choices: [
          {
            text: 'Promise rapid growth and market dominance (gain £8,000, but lower ethics standards)',
            effects: { impact: 11, inclusivity: 4, trust: 6, budget: 8000 }
          },
          {
            text: 'Pitch sustainable, ethical growth with strong user trust (gain £5,000)',
            effects: { impact: 7, inclusivity: 13, trust: 14, budget: 5000 }
          },
          {
            text: 'Emphasise both speed and ethics – negotiate mixed terms (gain £6,500)',
            effects: { impact: 9, inclusivity: 10, trust: 11, budget: 6500 }
          }
        ]
      }
    ];
  }

  getBuildStages() {
    return [
      {
        id: 'build-team-formation',
        title: 'Building Your Engineering Team',
        type: 'build',
        description: 'You are assembling your first engineering team. You can hire experienced developers quickly, or invest time in training junior developers who are passionate about inclusive design. What is your priority?',
        choices: [
          {
            text: 'Hire senior developers with proven track records (£12,000)',
            effects: { impact: 13, inclusivity: 8, trust: 11, budget: -12000 }
          },
          {
            text: 'Train junior developers with diverse backgrounds (£8,000)',
            effects: { impact: 8, inclusivity: 15, trust: 10, budget: -8000 }
          },
          {
            text: 'Mix of senior and junior with accessibility specialist (£11,000)',
            effects: { impact: 11, inclusivity: 13, trust: 12, budget: -11000 }
          }
        ]
      },
      {
        id: 'build-infrastructure',
        title: 'Choosing Your Tech Stack',
        type: 'build',
        description: 'Choosing the right technology is critical. You can select a stable, accessible framework that is slightly slower to develop in, or a trendy new framework that is faster but less mature for accessibility compliance.',
        choices: [
          {
            text: 'Use mature, accessible framework (slower build) – (£5,000)',
            effects: { impact: 9, inclusivity: 14, trust: 11, budget: -5000 }
          },
          {
            text: 'Use trendy, fast framework (accessibility adds work later) – (£3,000)',
            effects: { impact: 12, inclusivity: 7, trust: 6, budget: -3000 }
          }
        ]
      },
      {
        id: 'build-user-testing',
        title: 'Early User Testing',
        type: 'build',
        description: 'You have a working prototype. Do you test it with real users before launch – especially users with disabilities – or do you rely on automated tests and launch faster?',
        choices: [
          {
            text: 'Conduct user testing with diverse users, including those with disabilities (£6,000)',
            effects: { impact: 10, inclusivity: 17, trust: 13, budget: -6000 }
          },
          {
            text: 'Run automated accessibility tests only (£2,000)',
            effects: { impact: 12, inclusivity: 8, trust: 7, budget: -2000 }
          }
        ]
      },
      {
        id: 'build-security',
        title: 'Planning Data Security',
        type: 'build',
        description: 'Your product will handle user data. Do you invest heavily in security and compliance from the start, or implement basic security and upgrade later?',
        choices: [
          {
            text: 'Implement enterprise-grade security and GDPR compliance upfront (£8,000)',
            effects: { impact: 8, inclusivity: 10, trust: 15, budget: -8000 }
          },
          {
            text: 'Use standard security – plan upgrades as you grow (£3,500)',
            effects: { impact: 11, inclusivity: 8, trust: 8, budget: -3500 }
          }
        ]
      }
    ];
  }

  getLaunchStages() {
    return [
      {
        id: 'launch-beta',
        title: 'Launching Your Beta',
        type: 'launch',
        description: 'Your product is ready for its first public release. You can do a quiet launch to a small group, or a big public launch. A bigger launch gets more attention but also higher expectations and more scrutiny.',
        choices: [
          {
            text: 'Quiet launch to 1,000 beta testers for feedback (£2,000)',
            effects: { impact: 8, inclusivity: 11, trust: 10, budget: -2000 }
          },
          {
            text: 'Big public launch with marketing campaign (£10,000)',
            effects: { impact: 14, inclusivity: 9, trust: 8, budget: -10000 }
          }
        ]
      },
      {
        id: 'launch-marketing',
        title: 'Your Launch Marketing Strategy',
        type: 'launch',
        description: 'Your marketing message needs to resonate with your audience. Do you highlight cutting-edge features, your inclusive values, or price competitiveness?',
        choices: [
          {
            text: 'Market the cool tech features and innovation (£8,000)',
            effects: { impact: 12, inclusivity: 6, trust: 8, budget: -8000 }
          },
          {
            text: 'Emphasise accessibility and inclusivity in your marketing (£7,000)',
            effects: { impact: 9, inclusivity: 15, trust: 13, budget: -7000 }
          },
          {
            text: 'Focus on affordability and ease of use (£5,000)',
            effects: { impact: 10, inclusivity: 12, trust: 11, budget: -5000 }
          }
        ]
      },
      {
        id: 'launch-partnerships',
        title: 'Building Strategic Partnerships',
        type: 'launch',
        description: 'Established companies want to partner with you. Should you partner with the biggest player (more reach, less independence) or build relationships gradually?',
        choices: [
          {
            text: 'Partner with tech giant – gain massive reach (gain £15,000, but lose some autonomy)',
            effects: { impact: 13, inclusivity: 7, trust: 8, budget: 15000 }
          },
          {
            text: 'Build partnerships gradually – stay independent and aligned with values',
            effects: { impact: 8, inclusivity: 13, trust: 12, budget: -2000 }
          }
        ]
      }
    ];
  }

  getCrisisStages() {
    return [
      {
        id: 'crisis-accessibility',
        title: 'Accessibility Crisis',
        type: 'crisis',
        description: 'A disability rights group has publicly complained that your product is not accessible to blind users and those with motor impairments. They are calling for boycotts. You have 72 hours to respond.',
        choices: [
          {
            text: 'Halt development and hire accessibility experts to fix it immediately (£15,000)',
            effects: { impact: 12, inclusivity: 18, trust: 14, budget: -15000 }
          },
          {
            text: 'Release a public apology and commit to fixes in 3 months (£8,000)',
            effects: { impact: 8, inclusivity: 12, trust: 8, budget: -8000 }
          },
          {
            text: 'Defend your current process and emphasise future improvements (£2,000)',
            effects: { impact: 6, inclusivity: 4, trust: -8, budget: -2000 }
          }
        ]
      },
      {
        id: 'crisis-data-breach',
        title: 'Data Security Breach',
        type: 'crisis',
        description: 'Hackers have exposed user data including names and email addresses. Regulators are investigating, and you must notify users and potentially face GDPR fines. Speed and transparency are critical.',
        choices: [
          {
            text: 'Transparent disclosure to all users within 24 hours, hire security firm (£20,000)',
            effects: { impact: 10, inclusivity: 11, trust: 15, budget: -20000 }
          },
          {
            text: 'Public statement with internal investigation (£10,000)',
            effects: { impact: 9, inclusivity: 9, trust: 8, budget: -10000 }
          },
          {
            text: 'Quiet fix and minimal communication (£5,000) – high legal risk',
            effects: { impact: 8, inclusivity: 6, trust: -12, budget: -5000 }
          }
        ]
      },
      {
        id: 'crisis-ethics',
        title: 'AI Ethics & Algorithm Bias',
        type: 'crisis',
        description: 'Journalists have discovered that your AI algorithm treats users from certain backgrounds unfairly, denying them services. You must respond fast or face serious reputational damage.',
        choices: [
          {
            text: 'Pause the AI, audit algorithms, hire ethics researcher (£18,000)',
            effects: { impact: 11, inclusivity: 18, trust: 14, budget: -18000 }
          },
          {
            text: 'Publicly apologise and commit to 6-month audit (£12,000)',
            effects: { impact: 9, inclusivity: 14, trust: 10, budget: -12000 }
          },
          {
            text: 'Defend the algorithm as "optimal" for business (£3,000) – major trust loss',
            effects: { impact: 10, inclusivity: 2, trust: -15, budget: -3000 }
          }
        ]
      },
      {
        id: 'crisis-employee-conduct',
        title: 'Employee Conduct Scandal',
        type: 'crisis',
        description: 'A news story breaks about toxic company culture and sexism in your workplace. Employees are calling for leadership change. How do you respond?',
        choices: [
          {
            text: 'Transparent investigation, leadership accountability, hire HR expert (£14,000)',
            effects: { impact: 9, inclusivity: 16, trust: 13, budget: -14000 }
          },
          {
            text: 'Public apology and commitment to cultural change (£8,000)',
            effects: { impact: 8, inclusivity: 12, trust: 9, budget: -8000 }
          },
          {
            text: 'Minimise the issue and move forward (£2,000) – major backlash risk',
            effects: { impact: 7, inclusivity: 4, trust: -14, budget: -2000 }
          }
        ]
      }
    ];
  }

  getGrowthStages() {
    return [
      {
        id: 'growth-scaling',
        title: 'Scaling Your Team',
        type: 'growth',
        description: 'Demand for your product is growing. You need more staff. Do you hire quickly and affordably, or invest in quality hiring and diversity?',
        choices: [
          {
            text: 'Hire quickly from traditional talent pools (£16,000)',
            effects: { impact: 13, inclusivity: 7, trust: 8, budget: -16000 }
          },
          {
            text: 'Invest in diversity hiring and inclusive interview processes (£18,000)',
            effects: { impact: 12, inclusivity: 16, trust: 12, budget: -18000 }
          }
        ]
      },
      {
        id: 'growth-expansion',
        title: 'International Expansion',
        type: 'growth',
        description: 'Your product is successful in one country. Now you can expand to other regions. Do you adapt for local accessibility laws and cultures, or stick with one global approach?',
        choices: [
          {
            text: 'Customise for local laws (WCAG, GDPR, etc.) – slower but better (£22,000)',
            effects: { impact: 11, inclusivity: 16, trust: 14, budget: -22000 }
          },
          {
            text: 'Use one global product, minimal customisation (£12,000)',
            effects: { impact: 13, inclusivity: 8, trust: 9, budget: -12000 }
          }
        ]
      },
      {
        id: 'growth-sustainability',
        title: 'Sustainability & Social Responsibility',
        type: 'growth',
        description: 'Your company is profitable. Investors want returns. Do you prioritise profits or invest in sustainability and social good?',
        choices: [
          {
            text: 'Maximize profits – bare minimum on sustainability (£0)',
            effects: { impact: 14, inclusivity: 5, trust: 6, budget: 5000 }
          },
          {
            text: 'Invest in carbon-neutral infrastructure and tech education (£10,000)',
            effects: { impact: 11, inclusivity: 15, trust: 14, budget: -10000 }
          },
          {
            text: 'Balance growth with responsible practices (£6,000)',
            effects: { impact: 12, inclusivity: 12, trust: 12, budget: -6000 }
          }
        ]
      },
      {
        id: 'growth-acquisition-offer',
        title: 'Big Company Acquisition Offer',
        type: 'growth',
        description: 'A major tech firm wants to buy your company for £50 million. You could exit and reward your investors. But will the acquiring company maintain your values?',
        choices: [
          {
            text: 'Sell – take the money and move on (gain £50,000)',
            effects: { impact: 10, inclusivity: 6, trust: 5, budget: 50000 }
          },
          {
            text: 'Negotiate strict conditions to protect your values and users (£2,000 legal costs)',
            effects: { impact: 11, inclusivity: 14, trust: 13, budget: -2000 }
          },
          {
            text: 'Decline and remain independent (£0)',
            effects: { impact: 9, inclusivity: 14, trust: 14, budget: 0 }
          }
        ]
      }
    ];
  }

  // --------- Main Generation Method ---------
  generateScenario(problemId = null) {
    // Get all stage pools
    const ideaStages = this.getIdeaStages();
    const buildStages = this.getBuildStages();
    const launchStages = this.getLaunchStages();
    const crisisStages = this.getCrisisStages();
    const growthStages = this.getGrowthStages();

    // Randomly decide how many stages (5-7)
    const numStages = 5 + Math.floor(this.seededRandom() * 3); // 5, 6, or 7

    // Pick one crisis stage (mandatory)
    const selectedCrisis = this.pickRandom(crisisStages);
    const remainingStagesNeeded = numStages - 1;

    // Build sequence: we need to distribute remaining stages across Idea, Build, Launch, Growth
    // Ensure at least one from most categories
    let stageCounts = {
      idea: 0,
      build: 0,
      launch: 0,
      growth: 0
    };

    // Ensure at least 1 from Idea and Build
    stageCounts.idea = 1;
    stageCounts.build = 1;
    let remaining = remainingStagesNeeded - 2;

    // Distribute remaining stages
    // Bias: more likely to have Build and Growth stages
    const categories = ['idea', 'build', 'launch', 'growth'];
    while (remaining > 0) {
      const category = this.pickRandom(categories);
      stageCounts[category]++;
      remaining--;
    }

    // Pick stages from each category
    let stages = [];

    if (stageCounts.idea > 0) {
      stages.push(...this.shuffle(ideaStages).slice(0, stageCounts.idea));
    }
    if (stageCounts.build > 0) {
      stages.push(...this.shuffle(buildStages).slice(0, stageCounts.build));
    }
    if (stageCounts.launch > 0) {
      stages.push(...this.shuffle(launchStages).slice(0, stageCounts.launch));
    }

    // Insert crisis at a random but sensible position (not first, not last)
    const crisisPosition = 1 + Math.floor(this.seededRandom() * (stages.length - 1));
    stages.splice(crisisPosition, 0, selectedCrisis);

    if (stageCounts.growth > 0) {
      stages.push(...this.shuffle(growthStages).slice(0, stageCounts.growth));
    }

    // Generate unique title based on crisis type and stage count
    const crisisTitles = {
      'crisis-accessibility': 'Accessibility Crisis: Digital Inclusion',
      'crisis-data-breach': 'Data Breach Crisis: Security & Trust',
      'crisis-ethics': 'AI Ethics Crisis: Algorithm Bias',
      'crisis-employee-conduct': 'Culture Crisis: Workplace Conduct'
    };
    
    const uniqueTitle = crisisTitles[selectedCrisis.id] || 'Tech Startup Crisis';
    const stageCount = stages.length;
    const uniqueTheme = `${stageCount} Decision Stages • ${selectedCrisis.title}`;

    // simple sanity check – crisis must be present
    if (!stages.some(s => s.type === 'crisis')) {
      console.error('StageGenerator: no crisis stage generated, forcing one.');
      // insert the selected crisis in the middle as a fallback
      const fallbackPos = Math.floor(stages.length / 2) || 1;
      stages.splice(fallbackPos, 0, selectedCrisis);
    }

    // Return scenario with stages (include seed for reproducibility)
    return {
      id: problemId || 'generated-' + Math.random().toString(36).substr(2, 9),
      title: uniqueTitle,
      theme: uniqueTheme,
      initialBudget: 40000,
      briefDescription: 'You are founding a new tech startup. Your mission is to build an ethical, inclusive product that solves real problems. But running a tech company means making tough trade-offs between speed, profit, ethics, and user care. Every decision you make will impact your company\'s growth (Impact), your commitment to inclusivity (Inclusivity), whether people trust you (Trust), and your financial health (Budget). Can you build a successful tech company while staying true to your values?',
      objectives: 'Build a successful tech company by making ethical decisions that balance speed, profitability, inclusivity, and user trust.',
      stages: stages,
      seed: this.seed // expose the seed used so the scenario can be recreated exactly
    };
  }
}

// ============================================================================
// EXPORT FOR USE
// ============================================================================
// Usage:
// const generator = new StageGenerator(); // random
// const generator = new StageGenerator(12345); // seeded for reproducibility
// const scenario = generator.generateScenario();

// support CommonJS require (useful for testing with Node)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StageGenerator;
}
