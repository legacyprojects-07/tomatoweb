import { NoteItem, VideoLesson, SubjectName, GradeLevel } from '../types';

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: "Newton's Laws of Motion & Momentum Rules",
    subject: 'Physics',
    chapter: 'Force and Laws of Motion',
    grade: 'Class 10',
    content: `# Newton's Three Laws of Motion

## 1. First Law (Law of Inertia)
An object remains in a state of rest or uniform motion in a straight line unless acted upon by an external unbalanced force.
* **Inertia of Rest**: Passengers jerk backward when a bus starts suddenly.
* **Inertia of Motion**: Passengers lean forward when brakes are applied.

## 2. Second Law (Force and Momentum)
The rate of change of momentum of an object is directly proportional to the applied force and takes place in the direction of force.
Formula:
$$\\vec{F} = m \\cdot \\vec{a}$$
Where:
* $F$ = Force (Newtons, N)
* $m$ = Mass (kg)
* $a$ = Acceleration ($m/s^2$)

**Cricket Example**: A cricketer pulls his hands backward while catching a fast moving ball to increase time ($t$), decreasing force ($F$) and preventing hand injury!

## 3. Third Law (Action & Reaction)
To every action, there is an equal and opposite reaction acting on two different bodies simultaneously.
* **Rocket Propulsion**: Exhaust gases push downward $\\rightarrow$ Rocket accelerates upward.
* **Recoil of Gun**: Gun pushes bullet forward, bullet exerts backward recoil on gun.`,
    tags: ['Physics', 'Newton', 'Force', 'Mechanics', 'CBSE Class 10'],
    createdAt: '2026-08-10',
    updatedAt: '2026-08-10',
    isPinned: true,
    colorHex: '#E0F2FE',
    aiSummary: {
      summary: "This note covers the three foundational laws of classical mechanics formulated by Sir Isaac Newton: Inertia, Force-Mass-Acceleration relationship (F=ma), and Action-Reaction principle with real-world applications in rocket launches, cricket catches, and gun recoils.",
      keyTakeaways: [
        "Inertia resists changes in state of rest or motion.",
        "F = m * a derives from rate of change of linear momentum.",
        "Catching a ball by pulling hands back reduces impact force by increasing time interval.",
        "Action and Reaction forces always act on TWO DIFFERENT bodies simultaneously."
      ],
      keyFormulasOrTerms: [
        { term: "Force Formula", definition: "F = m * a (SI Unit: Newton / kg·m/s²)" },
        { term: "Linear Momentum (p)", definition: "p = m * v (Mass times velocity)" },
        { term: "Inertia", definition: "Inherent property of a body to resist change in motion state" }
      ],
      mindMapNodes: [
        { topic: "Newton's Laws", subtopics: ["1st Law: Inertia", "2nd Law: F=ma & Momentum", "3rd Law: Action-Reaction"] },
        { topic: "Real World Applications", subtopics: ["Rocket Launch", "Cricket Ball Catch", "Passenger Seatbelts"] }
      ],
      examTip: "In CBSE board exams, always draw a clear force vector diagram and specify that Action and Reaction forces act on DIFFERENT objects!"
    }
  },
  {
    id: 'note-2',
    title: 'Chemical Bonding & Periodic Table Trends',
    subject: 'Chemistry',
    chapter: 'Periodic Classification of Elements',
    grade: 'Class 10',
    content: `# Periodic Table Trends & Chemical Bonding

## Key Periodic Trends Across Period (Left to Right):
1. **Atomic Radius**: Decreases (due to increase in effective nuclear charge $Z_{eff}$).
2. **Ionization Energy**: Increases (harder to pull electrons).
3. **Electronegativity**: Increases (Halogens are most electronegative, Fluorine = 4.0).
4. **Metallic Character**: Decreases (Metals on left, Non-metals on right).

## Down a Group (Top to Bottom):
1. **Atomic Radius**: Increases (New electron shells added).
2. **Ionization Energy**: Decreases (Outer electrons farther from nucleus).
3. **Electronegativity**: Decreases.
4. **Metallic Character**: Increases.

## Types of Chemical Bonds:
* **Ionic Bond**: Complete transfer of valence electrons (e.g. $NaCl = Na^+ + Cl^-$). High melting point, conducts electricity in aqueous/molten state.
* **Covalent Bond**: Mutual sharing of electron pairs (e.g. $CH_4, H_2O$). Lower melting point, poor electrical conductors.`,
    tags: ['Chemistry', 'Periodic Table', 'Electronegativity', 'Bonds'],
    createdAt: '2026-08-11',
    updatedAt: '2026-08-11',
    isPinned: false,
    colorHex: '#DCFCE7'
  },
  {
    id: 'note-3',
    title: 'Trigonometric Identities & Standard Values',
    subject: 'Mathematics',
    chapter: 'Introduction to Trigonometry',
    grade: 'Class 10',
    content: `# Trigonometric Ratios & Core Identities

## Fundamental Identities:
1. $\\sin^2 \\theta + \\cos^2 \\theta = 1$
2. $1 + \\tan^2 \\theta = \\sec^2 \\theta$
3. $1 + \\cot^2 \\theta = \\csc^2 \\theta$

## Standard Angle Values Table:
* $\\sin 0^\\circ = 0, \\sin 30^\\circ = 1/2, \\sin 45^\\circ = 1/\\sqrt{2}, \\sin 60^\\circ = \\sqrt{3}/2, \\sin 90^\\circ = 1$
* $\\cos \\theta$ is the reverse order of $\\sin \\theta$.
* $\\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta}$

## Memory Trick (Pandit Badri Prasad):
"Pandit Badri Prasad / Har Har Bhole"
$$\\sin = \\frac{P}{H}, \\quad \\cos = \\frac{B}{H}, \\quad \\tan = \\frac{P}{B}$$`,
    tags: ['Maths', 'Trigonometry', 'Formulas', 'Identities'],
    createdAt: '2026-08-12',
    updatedAt: '2026-08-12',
    isPinned: true,
    colorHex: '#FEF3C7'
  },
  {
    id: 'note-locked-1',
    title: "🔥 TOPPER SECRET CHEAT SHEET: Electricity & Resistance Circuits",
    subject: 'Physics',
    chapter: 'Electricity & Circuits',
    grade: 'Class 10',
    content: `# Electricity & Circuit Laws (Topper Revision Sheet)

## 1. Ohm's Law & Resistance
$$V = I \\cdot R$$
* **Factors Affecting Resistance**: $R = \\rho \\frac{l}{A}$
* Length $l \\uparrow \\implies R \\uparrow$
* Area $A \\uparrow \\implies R \\downarrow$
* Temperature $\\uparrow \\implies R \\uparrow$ (for metals)

## 2. Combination of Resistors
* **Series Connection**:
  $$R_{eq} = R_1 + R_2 + R_3$$
  * Current $I$ remains SAME through all resistors.
* **Parallel Connection**:
  $$\\frac{1}{R_{eq}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3}$$
  * Voltage $V$ remains SAME across all branches.

## 3. Joule's Law of Heating & Electric Power
$$H = I^2 R t = V I t = \\frac{V^2}{R} t$$
$$P = V I = I^2 R = \\frac{V^2}{R} \\quad (1 \\text{ Watt} = 1 \\text{ Joule/second})$$
* **Commercial Unit**: $1 \\text{ kWh} = 3.6 \\times 10^6 \\text{ Joules}$`,
    tags: ['Physics', 'Electricity', 'OhmsLaw', 'CircuitMaster', 'TopperSheet'],
    createdAt: '2026-08-12',
    updatedAt: '2026-08-12',
    isPinned: false,
    isLocked: true,
    unlockRequirement: {
      gameType: 'quiz-battle',
      gameName: 'Quiz Mastery Arena',
      requiredScore: 3,
      description: 'Score 3 or more correct answers in the Quiz Mastery Arena game!'
    },
    aiSummary: {
      summary: "This high-yield locked cheat sheet provides complete formulas and circuit shortcuts for Electricity, Ohm's law, Series vs Parallel combinations, and Power calculation for Board Exams.",
      keyTakeaways: [
        "V=IR is linear for ohmic conductors.",
        "Parallel connection yields lower equivalent resistance than any individual resistor.",
        "1 kWh equals 3.6 x 10^6 Joules."
      ],
      keyFormulasOrTerms: [
        { term: "Resistivity (ρ)", definition: "Intrinsic material property independent of dimensions (SI Unit: Ω·m)" },
        { term: "Power Formula", definition: "P = V * I = I² * R = V² / R" }
      ],
      mindMapNodes: [
        { topic: "Electricity", subtopics: ["Ohm's Law", "Series & Parallel", "Joule Heating"] }
      ],
      examTip: "Always calculate equivalent resistance in parallel branches before finding total main current!"
    }
  },
  {
    id: 'note-locked-2',
    title: "🧪 ORGANIC CHEMISTRY MASTERY: Functional Groups & Reactions",
    subject: 'Chemistry',
    chapter: 'Carbon and its Compounds',
    grade: 'Class 10',
    content: `# Carbon & Its Compounds - Gold Summary

## 1. Covalent Bonding in Carbon
* Carbon atomic number = 6 (Configuration 2,4).
* Tetravalent ($sp^3$ hybrid orbital tendency) and forms stable covalent chains (Catenation).

## 2. Homologous Series
Group of organic compounds having same functional group and similar chemical properties.
* Consecutive members differ by $-\\text{CH}_2-$ unit and molecular mass of $14\\text{ u}$.

## 3. Core Chemical Reactions:
* **Combustion**: $\\text{CH}_4 + 2\\text{O}_2 \\rightarrow \\text{CO}_2 + 2\\text{H}_2\\text{O} + \\text{Heat}$
* **Substitution**: $\\text{CH}_4 + \\text{Cl}_2 \\xrightarrow{\\text{Sunlight}} \\text{CH}_3\\text{Cl} + \\text{HCl}$
* **Esterification**: $\\text{CH}_3\\text{COOH} + \\text{C}_2\\text{H}_5\\text{OH} \\xrightarrow{\\text{Conc. H}_2\\text{SO}_4} \\text{CH}_3\\text{COOC}_2\\text{H}_5 + \\text{H}_2\\text{O}$ (Fruity smell!)
* **Saponification**: Soap formation using Sodium Hydroxide.`,
    tags: ['Chemistry', 'Carbon', 'OrganicChemistry', 'Esterification'],
    createdAt: '2026-08-12',
    updatedAt: '2026-08-12',
    isPinned: false,
    isLocked: true,
    unlockRequirement: {
      gameType: 'memory-match',
      gameName: 'Concept Matcher',
      requiredScore: 4,
      description: 'Match 4 or more chemical pairs in under 12 turns!'
    },
    aiSummary: {
      summary: "Comprehensive topper guide for Organic Chemistry, functional groups, Esterification vs Saponification reactions, and IUPAC rules.",
      keyTakeaways: [
        "Carbon exhibits Catenation and Tetravalency.",
        "Esterification reaction produces sweet fruity smell.",
        "Soap forms micelles with hydrophobic tail and hydrophilic head."
      ],
      keyFormulasOrTerms: [
        { term: "Esterification", definition: "Reaction between Ethanoic acid and Ethanol forming Ethyl Ethanoate" },
        { term: "Homologous Series", definition: "Series differing by -CH2- unit and 14u mass" }
      ],
      mindMapNodes: [
        { topic: "Carbon Compounds", subtopics: ["Bonding", "Reactions", "Soaps & Detergents"] }
      ],
      examTip: "In esterification questions, mention Conc. H2SO4 acts as a dehydrating catalyst!"
    }
  },
  {
    id: 'note-locked-3',
    title: "🧬 HIGH-YIELD DIAGRAM BOOKLET: Human Heart, Brain & Reflex Arc",
    subject: 'Biology',
    chapter: 'Control and Coordination',
    grade: 'Class 10',
    content: `# Human Heart & Reflex Action Quick Visual Guide

## 1. Double Circulation in Human Heart:
* **Right Atrium & Ventricle**: Receive and pump Deoxygenated Blood to lungs via Pulmonary Artery.
* **Left Atrium & Ventricle**: Receive Oxygenated Blood from lungs via Pulmonary Vein and pump to body via Aorta.
* **Valves (Tricuspid/Bicuspid)**: Prevent backflow of blood.

## 2. Reflex Arc Pathway:
Receptor (Skin) $\\rightarrow$ Sensory Neuron $\\rightarrow$ Spinal Cord (Relay Neuron) $\\rightarrow$ Motor Neuron $\\rightarrow$ Effector (Muscle)
* Quick involuntary response without brain conscious intervention to prevent tissue damage!

## 3. Human Brain Divisions:
* **Forebrain**: Thinking center, memory, voluntary actions.
* **Midbrain**: Involuntary visual and auditory reflexes.
* **Hindbrain**: Cerebellum (Postural balance), Medulla (Heartbeat/BP), Pons (Breathing rate).`,
    tags: ['Biology', 'Heart', 'Circulation', 'ReflexArc', 'Brain'],
    createdAt: '2026-08-12',
    updatedAt: '2026-08-12',
    isPinned: false,
    isLocked: true,
    unlockRequirement: {
      gameType: 'formula-scramble',
      gameName: 'Word & Formula Scramble',
      requiredScore: 3,
      description: 'Unscramble 3 science terms/formulas before time runs out!'
    },
    aiSummary: {
      summary: "Key visual notes on Double Circulation in human heart, 5-step Reflex Arc pathway, and brain parts with function mapping.",
      keyTakeaways: [
        "Pulmonary Vein carries oxygenated blood (exception!).",
        "Reflex action is processed in the Spinal Cord for instantaneous reaction.",
        "Cerebellum controls body balance and posture walking in a straight line."
      ],
      keyFormulasOrTerms: [
        { term: "Reflex Arc", definition: "Neuronal pathway that controls a reflex action" },
        { term: "Double Circulation", definition: "Blood flows through heart twice in one complete body circuit" }
      ],
      mindMapNodes: [
        { topic: "Human Biology", subtopics: ["Circulation", "Reflex Arc", "Brain Parts"] }
      ],
      examTip: "Draw directional arrows for blood flow in heart diagrams to score full marks!"
    }
  },
  {
    id: 'note-locked-4',
    title: "📐 MATHEMATICS SPEED TRICKS: Trigonometric Heights & Distances",
    subject: 'Mathematics',
    chapter: 'Some Applications of Trigonometry',
    grade: 'Class 10',
    content: `# Heights & Distances Topper Shortcut Guide

## 1. Angle of Elevation vs Depression
* **Angle of Elevation**: Angle formed by line of sight with horizontal when object is ABOVE horizontal level.
* **Angle of Depression**: Angle formed when object is BELOW horizontal level. (Always equals angle of elevation by alternate interior angles!).

## 2. Special 30°-60°-90° Triangle Trick:
In a right triangle with angles $30^\\circ$ and $60^\\circ$:
* Side opposite to $30^\\circ = x$
* Side opposite to $60^\\circ = x\\sqrt{3}$
* Hypotenuse $= 2x$

## 3. Special 45°-45°-90° Triangle Trick:
* Base $= x$, Height $= x$, Hypotenuse $= x\\sqrt{2}$
* If height of tower = distance from foot, then Angle of Elevation is always $45^\\circ$!`,
    tags: ['Maths', 'HeightsAndDistances', 'TrigShortcuts', 'Geometry'],
    createdAt: '2026-08-12',
    updatedAt: '2026-08-12',
    isPinned: false,
    isLocked: true,
    unlockRequirement: {
      gameType: 'trivia-tower',
      gameName: 'Topper Trivia Tower',
      requiredScore: 4,
      description: 'Reach Tower Floor 4 in the Rapid Fire Trivia Tower!'
    },
    aiSummary: {
      summary: "Shortcut ratio methods for solving Heights & Distances problems in under 30 seconds without long algebraic equations.",
      keyTakeaways: [
        "Angle of depression equals angle of elevation.",
        "For 30-60-90 triangles, sides follow 1 : √3 : 2 ratio.",
        "For 45-45-90 triangles, base equals height."
      ],
      keyFormulasOrTerms: [
        { term: "Line of Sight", definition: "Line drawn from eye of observer to object" },
        { term: "Elevation Angle", definition: "Angle between horizontal and line of sight upwards" }
      ],
      mindMapNodes: [
        { topic: "Trig Applications", subtopics: ["Elevation", "Depression", "Ratio Tricks"] }
      ],
      examTip: "Always mark horizontal reference line at eye level when drawing angle of depression!"
    }
  },
  {
    id: 'note-locked-5',
    title: "🎮 VIDEO GAME REWARD: Advanced Physics & Rocket Propulsion",
    subject: 'Physics',
    chapter: 'Gravitation & Space Flight',
    grade: 'Class 11',
    content: `# Space Rocket Propulsion & Orbital Dynamics

## 1. Tsiolkovsky Rocket Equation
$$\\Delta v = v_e \\ln \\left( \\frac{m_0}{m_f} \\right)$$

## 2. Escape Velocity
$$v_e = \\sqrt{\\frac{2GM}{R}} \\approx 11.2 \\text{ km/s for Earth}$$

## 3. Satellite Orbital Speed
$$v_o = \\sqrt{\\frac{GM}{R+h}}$$`,
    tags: ['Physics', 'SpaceMechanics', 'VideoGame', 'TopperNote'],
    createdAt: '2026-08-12',
    updatedAt: '2026-08-12',
    isPinned: false,
    isLocked: true,
    unlockRequirement: {
      gameType: 'video-game',
      gameName: 'Tomato Space Runner Video Game',
      requiredScore: 50,
      description: 'Score 50+ points in the 2D Tomato Space Runner Video Game!'
    },
    aiSummary: {
      summary: "Exclusive reward note unlocked by playing the Tomato Space Runner Video Game. Contains rocket equations and space speed formulas.",
      keyTakeaways: [
        "Escape velocity on Earth is 11.2 km/s.",
        "Rocket acceleration depends on mass ratio and exhaust velocity."
      ],
      keyFormulasOrTerms: [
        { term: "Escape Velocity", definition: "Minimum speed needed for a body to escape gravitational field" }
      ],
      mindMapNodes: [
        { topic: "Space Dynamics", subtopics: ["Rocket Equation", "Escape Velocity"] }
      ],
      examTip: "Derive v_e by equating kinetic energy to gravitational potential energy at infinity!"
    }
  }
];

export const INITIAL_LESSONS: VideoLesson[] = [
  {
    id: 'les-1',
    title: 'Visualising Life Processes: Photosynthesis in Action',
    subject: 'Biology',
    chapter: 'Life Processes',
    duration: '14 mins',
    thumbnailUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    summary: 'A 3D animated deep-dive into Chloroplast structures, Light vs Dark reactions, and ATP generation in plant leaves.',
    keyTimestamps: [
      { time: '01:20', topic: 'Chloroplast Structure & Stroma' },
      { time: '05:45', topic: 'Light Dependent Reaction in Thylakoids' },
      { time: '10:15', topic: 'Calvin Cycle & Glucose Synthesis' }
    ],
    keyNotesToSave: `Photosynthesis Formula: 6CO2 + 6H2O + Light Energy -> C6H12O6 + 6O2. Chlorophyll absorbs blue and red wavelengths of light while reflecting green.`
  },
  {
    id: 'les-2',
    title: 'Mastering Quadratic Equations in 15 Minutes',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    duration: '15 mins',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    summary: 'Learn the Quadratic Formula derivation, Discriminant rule (D = b² - 4ac), and splitting the middle term tricks.',
    keyTimestamps: [
      { time: '02:00', topic: 'Standard Form ax² + bx + c = 0' },
      { time: '06:30', topic: 'Middle Term Factorization Tricks' },
      { time: '11:10', topic: 'Discriminant & Nature of Roots' }
    ],
    keyNotesToSave: `Discriminant D = b^2 - 4ac: If D > 0 -> 2 distinct real roots. If D = 0 -> 2 equal real roots. If D < 0 -> No real roots.`
  },
  {
    id: 'les-3',
    title: '3D Simulation: Refraction Through Prism & Rainbow Formation',
    subject: 'Physics',
    chapter: 'Human Eye and Colorful World',
    duration: '12 mins',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    summary: 'Watch sunlight disperse into VIBGYOR through a glass prism and total internal reflection inside raindrops.',
    keyTimestamps: [
      { time: '01:00', topic: 'Refraction & Dispersion of Light' },
      { time: '05:20', topic: 'Angle of Deviation' },
      { time: '08:45', topic: 'Rainbow Formation in Atmosphere' }
    ],
    keyNotesToSave: `Dispersion occurs because different colors travel at different speeds in glass. Red deviates least (longest wavelength), Violet deviates most.`
  }
];

export const SUBJECT_COLOR_MAP: Record<SubjectName, { bg: string; text: string; border: string; accent: string }> = {
  Physics: { bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-200', accent: '#0284C7' },
  Chemistry: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', accent: '#059669' },
  Mathematics: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', accent: '#D97706' },
  Biology: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200', accent: '#E11D48' },
  'Social Science': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', accent: '#2563EB' },
  'English Literature': { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200', accent: '#4F46E5' }
};
