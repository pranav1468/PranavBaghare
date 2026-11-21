import SlideShow from "@/components/slide-show";
import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

const PRANAV_PATH = "/assets/projects-screenshots/pranav";
const DEV = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/";

const ProjectsLinks = ({ live, repo }: { live?: string; repo?: string }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-start gap-3 my-3 mb-8">
      {live && live !== "#" && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={live}
        >
          <Button variant={"default"} size={"sm"}>
            Visit Project
            <ArrowUpRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
      {repo && repo !== "#" && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={repo}
        >
          <Button variant={"default"} size={"sm"}>
            GitHub
            <ArrowUpRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export type Skill = {
  title: string;
  bg: string;
  fg: string;
  icon: ReactNode;
};

const DevIcon = ({ src, alt }: { src: string; alt: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src} alt={alt} className="w-5 h-5 object-contain" />
);

const PROJECT_SKILLS = {
  python: {
    title: "Python",
    bg: "black",
    fg: "white",
    icon: <DevIcon src={`${DEV}python/python-original.svg`} alt="Python" />,
  },
  tensorflow: {
    title: "TensorFlow",
    bg: "black",
    fg: "white",
    icon: <DevIcon src={`${DEV}tensorflow/tensorflow-original.svg`} alt="TensorFlow" />,
  },
  keras: {
    title: "Keras",
    bg: "black",
    fg: "white",
    icon: <DevIcon src={`${DEV}keras/keras-original.svg`} alt="Keras" />,
  },
  opencv: {
    title: "OpenCV",
    bg: "black",
    fg: "white",
    icon: <DevIcon src={`${DEV}opencv/opencv-original.svg`} alt="OpenCV" />,
  },
  streamlit: {
    title: "Streamlit",
    bg: "black",
    fg: "white",
    icon: <DevIcon src={`${DEV}streamlit/streamlit-original.svg`} alt="Streamlit" />,
  },
};

export type Project = {
  id: string;
  category: string;
  title: string;
  src: string;
  screenshots: string[];
  skills: { frontend: Skill[]; backend: Skill[] };
  content: React.ReactNode | any;
  github?: string;
  live: string;
};

const projects: Project[] = [
  {
    id: "satellite-imagery-segmentation",
    category: "Computer Vision · Geospatial AI",
    title: "Satellite Imagery Segmentation & Deforestation Analysis",
    src: `${PRANAV_PATH}/satellite-segmentation.jpg`,
    screenshots: ["satellite-segmentation.jpg"],
    live: "#",
    github:
      "https://github.com/pranav1468/Satellite-Imagery-Segmentation-Deforestation-Analysis",
    skills: {
      frontend: [PROJECT_SKILLS.opencv],
      backend: [PROJECT_SKILLS.python, PROJECT_SKILLS.tensorflow],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Automated forest monitoring using multispectral satellite imagery and deep learning.
          </TypographyP>
          <TypographyP className="font-mono">
            Implemented a Modified U-Net (mU-Net) for pixel-wise forest segmentation and a
            Siamese U-Net for temporal change detection across multispectral Sentinel-2 &amp;
            MODIS tiles, leveraging weak supervision with vegetation indices to reduce manual
            labeling effort.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />

          <TypographyH3 className="my-4 mt-8">Pipeline &amp; Results</TypographyH3>
          <ul className="list-disc ml-6 font-mono space-y-2 mb-6">
            <li>
              <strong>Pipeline:</strong> Multispectral Satellite Input -&gt; Vegetation Index
              Computation -&gt; Weak Supervision Labeling -&gt; mU-Net Segmentation -&gt; Siamese
              U-Net Change Detection -&gt; Forest Loss/Gain Output.
            </li>
            <li>
              <strong>Metrics:</strong> Dice Loss + BCE, mIoU: 0.88, reliable forest loss and gain
              detection across monitored regions.
            </li>
            <li>
              <strong>Tech Stack:</strong> Python, TensorFlow, mU-Net, Siamese U-Net, GDAL,
              Rasterio.
            </li>
          </ul>
          <SlideShow images={[`${PRANAV_PATH}/satellite-segmentation.jpg`]} />
        </div>
      );
    },
  },
  {
    id: "pneumonia-diagnosis",
    category: "Medical AI · Deep Learning",
    title: "Automated Pneumonia Diagnosis System",
    src: `${PRANAV_PATH}/pneumonia-gradcam.jpg`,
    screenshots: ["pneumonia-gradcam.jpg"],
    live: "#",
    github:
      "https://github.com/pranav1468/Automated-Pneumonia-Diagnosis-System-",
    skills: {
      frontend: [PROJECT_SKILLS.opencv],
      backend: [PROJECT_SKILLS.python, PROJECT_SKILLS.tensorflow],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Deep learning pipeline for pneumonia detection from chest X-rays using DenseNet121.
          </TypographyP>
          <TypographyP className="font-mono">
            Built a chest X-ray screening pipeline (5,800+ radiographs) starting with a custom CNN
            baseline and fine-tuning an ImageNet-pretrained DenseNet121 with Grad-CAM visual
            explanations, optimized for high recall to minimize missed pneumonia cases.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />

          <TypographyH3 className="my-4 mt-8">Evaluation &amp; Results</TypographyH3>
          <ul className="list-disc ml-6 font-mono space-y-2 mb-6">
            <li>
              <strong>Dataset:</strong> 5,800+ chest X-ray radiographs.
            </li>
            <li>
              <strong>Metrics:</strong> Accuracy: 91%, Recall: 94%, F1-Score: 0.91.
            </li>
            <li>
              <strong>Tech Stack:</strong> Python, TensorFlow, DenseNet121, Grad-CAM, OpenCV.
            </li>
          </ul>
          <SlideShow images={[`${PRANAV_PATH}/pneumonia-gradcam.jpg`]} />
        </div>
      );
    },
  },
  {
    id: "traffic-sign-recognition",
    category: "Autonomous Systems · CNN",
    title: "Autonomous Vehicle Traffic Sign Recognition",
    src: `${PRANAV_PATH}/traffic-sign-gtsrb.jpg`,
    screenshots: ["traffic-sign-gtsrb.jpg"],
    live: "#",
    github:
      "https://github.com/pranav1468/Autonomous-Vehicle-Traffic-Sign-Recognition",
    skills: {
      frontend: [PROJECT_SKILLS.streamlit, PROJECT_SKILLS.opencv],
      backend: [PROJECT_SKILLS.python, PROJECT_SKILLS.keras],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Multi-class CNN for traffic sign recognition on GTSRB achieving 99.7% validation accuracy.
          </TypographyP>
          <TypographyP className="font-mono">
            Designed and trained a multi-class CNN across 43 traffic sign classes on the GTSRB
            dataset (50,000+ images) with preprocessing and augmentation for illumination and
            viewpoint robustness, deployed as an interactive Streamlit web app.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />

          <TypographyH3 className="my-4 mt-8">Pipeline &amp; Results</TypographyH3>
          <ul className="list-disc ml-6 font-mono space-y-2 mb-6">
            <li>
              <strong>Pipeline:</strong> Image Input -&gt; Preprocessing &amp; Augmentation -&gt;
              Multi-class CNN (43 classes) -&gt; Streamlit Web App -&gt; Real-time Inference.
            </li>
            <li>
              <strong>Metrics:</strong> Validation Accuracy: 99.7%, Inference Latency: 4.8ms.
            </li>
            <li>
              <strong>Tech Stack:</strong> Python, Keras, CNN, Streamlit, OpenCV.
            </li>
          </ul>
          <SlideShow images={[`${PRANAV_PATH}/traffic-sign-gtsrb.jpg`]} />
        </div>
      );
    },
  },
];

export default projects;
