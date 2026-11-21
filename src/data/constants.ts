export enum SkillNames {
  PYTHON = "python",
  TENSORFLOW = "tensorflow",
  KERAS = "keras",
  OPENCV = "opencv",
  PYTORCH = "pytorch",
  NUMPY = "numpy",
  PANDAS = "pandas",
  SCIKITLEARN = "scikitlearn",
  DOCKER = "docker",
  FASTAPI = "fastapi",
  GIT = "git",
  JENKINS = "jenkins",
  STREAMLIT = "streamlit",
  SQL = "sql",
  PYSPARK = "pyspark",
  LINUX = "linux",
}

export type Skill = {
  id: number;
  name: string;
  label: string;
  shortDescription: string;
  color: string;
  icon: string;
  /** Optional local artwork for the 3D module; falls back to icon. */
  keyboardIcon?: string;
  /** Plastic/accent color of the 3D module. */
  keyboardColor?: string;
  /** Browser KeyboardEvent.code, e.g. KeyQ. */
  shortcut?: string;
  category?: string;
};

const DEV = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/";

export const SKILLS: Record<SkillNames, Skill> = {
  [SkillNames.PYTHON]: {
    id: 1,
    name: "python",
    label: "Python",
    category: "Languages & Data",
    shortDescription:
      "Vectorized NumPy/SciPy array computations and core computer vision pipelines.",
    color: "#3776AB",
    icon: `${DEV}python/python-original.svg`,
    keyboardColor: "#3776AB",
    shortcut: "KeyQ",
  },
  [SkillNames.TENSORFLOW]: {
    id: 2,
    name: "tensorflow",
    label: "TensorFlow",
    category: "Computer Vision & DL",
    shortDescription:
      "Core deep learning engine for Modified U-Net, Siamese U-Net, and DenseNet121 pipelines.",
    color: "#FF6F00",
    icon: `${DEV}tensorflow/tensorflow-original.svg`,
    keyboardColor: "#FF6F00",
    shortcut: "KeyW",
  },
  [SkillNames.KERAS]: {
    id: 3,
    name: "keras",
    label: "Keras",
    category: "Computer Vision & DL",
    shortDescription:
      "Multi-class CNNs for traffic sign recognition (99.7% val accuracy) and rapid prototyping.",
    color: "#D00000",
    icon: `${DEV}keras/keras-original.svg`,
    keyboardColor: "#D00000",
    shortcut: "KeyE",
  },
  [SkillNames.OPENCV]: {
    id: 4,
    name: "opencv",
    label: "OpenCV",
    category: "Computer Vision & DL",
    shortDescription:
      "Image preprocessing, augmentations, filtering, and Grad-CAM visual explanations.",
    color: "#5C3EE8",
    icon: `${DEV}opencv/opencv-original.svg`,
    keyboardColor: "#5C3EE8",
    shortcut: "KeyR",
  },
  [SkillNames.PYTORCH]: {
    id: 5,
    name: "pytorch",
    label: "PyTorch & YOLO",
    category: "Computer Vision & DL",
    shortDescription:
      "Real-time object detection with YOLOv8, bounding box prediction, and edge inference.",
    color: "#EE4C2C",
    icon: `${DEV}pytorch/pytorch-original.svg`,
    keyboardColor: "#EE4C2C",
    shortcut: "KeyT",
  },
  [SkillNames.NUMPY]: {
    id: 6,
    name: "numpy",
    label: "NumPy",
    category: "Languages & Data",
    shortDescription:
      "High-performance N-dimensional array operations for imagery and tensor math.",
    color: "#4DABCF",
    icon: `${DEV}numpy/numpy-original.svg`,
    keyboardColor: "#4DABCF",
    shortcut: "KeyY",
  },
  [SkillNames.PANDAS]: {
    id: 7,
    name: "pandas",
    label: "Pandas",
    category: "Languages & Data",
    shortDescription:
      "Feature engineering, dataset cleaning, error analysis, and ETL pipelines.",
    color: "#3978D5",
    icon: `${DEV}pandas/pandas-original.svg`,
    keyboardColor: "#3978D5",
    shortcut: "KeyA",
  },
  [SkillNames.SCIKITLEARN]: {
    id: 8,
    name: "scikitlearn",
    label: "Scikit-Learn",
    category: "Core ML Theory",
    shortDescription:
      "Confusion matrices, ROC-AUC, Recall optimization, and supervised/unsupervised ML.",
    color: "#F7931E",
    icon: `${DEV}scikitlearn/scikitlearn-original.svg`,
    keyboardColor: "#F7931E",
    shortcut: "KeyD",
  },
  [SkillNames.DOCKER]: {
    id: 9,
    name: "docker",
    label: "Docker",
    category: "MLOps & Deployment",
    shortDescription:
      "Reproducible inference microservices and containerized model deployment.",
    color: "#2496ED",
    icon: `${DEV}docker/docker-original.svg`,
    keyboardColor: "#2496ED",
    shortcut: "KeyZ",
  },
  [SkillNames.FASTAPI]: {
    id: 10,
    name: "fastapi",
    label: "FastAPI",
    category: "MLOps & Deployment",
    shortDescription:
      "High-performance asynchronous REST endpoints for low-latency model serving.",
    color: "#009688",
    icon: `${DEV}fastapi/fastapi-original.svg`,
    keyboardColor: "#009688",
    shortcut: "KeyX",
  },
  [SkillNames.GIT]: {
    id: 11,
    name: "git",
    label: "Git & CI/CD",
    category: "MLOps & Deployment",
    shortDescription:
      "Version control, automated test pipelines, and GitHub Actions workflows.",
    color: "#F05032",
    icon: `${DEV}git/git-original.svg`,
    keyboardColor: "#F05032",
    shortcut: "KeyC",
  },
  [SkillNames.JENKINS]: {
    id: 12,
    name: "jenkins",
    label: "Jenkins",
    category: "MLOps & Deployment",
    shortDescription:
      "Continuous integration workflows and automated build/deployment pipelines.",
    color: "#D24939",
    icon: `${DEV}jenkins/jenkins-original.svg`,
    keyboardColor: "#D24939",
    shortcut: "KeyV",
  },
  [SkillNames.STREAMLIT]: {
    id: 13,
    name: "streamlit",
    label: "Streamlit",
    category: "MLOps & Deployment",
    shortDescription:
      "Interactive real-time model dashboards and inference web apps.",
    color: "#FF4B4B",
    icon: `${DEV}streamlit/streamlit-original.svg`,
    keyboardColor: "#FF4B4B",
    shortcut: "KeyB",
  },
  [SkillNames.SQL]: {
    id: 14,
    name: "sql",
    label: "SQL",
    category: "Languages & Data",
    shortDescription:
      "Relational database querying, aggregations, and structured data extraction.",
    color: "#336791",
    icon: `${DEV}postgresql/postgresql-original.svg`,
    keyboardColor: "#336791",
    shortcut: "KeyN",
  },
  [SkillNames.PYSPARK]: {
    id: 15,
    name: "pyspark",
    label: "PySpark",
    category: "Languages & Data",
    shortDescription:
      "Distributed DataFrames and large-scale batch data processing.",
    color: "#E25A1C",
    icon: `${DEV}apachespark/apachespark-original.svg`,
    keyboardColor: "#E25A1C",
    shortcut: "KeyM",
  },
  [SkillNames.LINUX]: {
    id: 16,
    name: "linux",
    label: "Linux",
    category: "Production AI",
    shortDescription:
      "Production AI environments, edge inference pipelines, and system tooling.",
    color: "#FCC624",
    icon: `${DEV}linux/linux-original.svg`,
    keyboardColor: "#FCC624",
    shortcut: "KeyK",
  },
};

export type Experience = {
  id: number;
  periods: { start: string; end: string }[];
  title: string;
  company: string;
  description: string[];
  skills: SkillNames[];
};

export const EXPERIENCE: Experience[] = [
  {
    id: 1,
    periods: [{ start: "May 2026", end: "Present" }],
    title: "Software Developer (AI/ML)",
    company: "Mantra Softech India Pvt Ltd · Ahmedabad, India",
    description: [
      "Working on computer vision and deep learning projects, building real-world AI solutions.",
      "Architecting low-latency edge inference pipelines and optimizing model throughput.",
      "Deploying computer vision models into production environments.",
    ],
    skills: [
      SkillNames.PYTHON,
      SkillNames.TENSORFLOW,
      SkillNames.OPENCV,
      SkillNames.PYTORCH,
      SkillNames.DOCKER,
      SkillNames.FASTAPI,
    ],
  },
];

export const themeDisclaimers = {
  light: [
    "Warning: Light mode emits a gazillion lumens of pure radiance!",
    "Caution: Light mode ahead! Please don't try this at home.",
    "Only trained professionals can handle this much brightness. Proceed with sunglasses!",
    "Brace yourself! Light mode is about to make everything shine brighter than your future.",
    "Flipping the switch to light mode... Are you sure your eyes are ready for this?",
  ],
  dark: [
    "Light mode? I thought you went insane... but welcome back to the dark side!",
    "Switching to dark mode... How was life on the bright side?",
    "Dark mode activated! Thanks you from the bottom of my heart, and my eyes too.",
    "Welcome back to the shadows. How was life out there in the light?",
    "Dark mode on! Finally, someone who understands true sophistication.",
  ],
};
