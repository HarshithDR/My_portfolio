
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Cpu, Database, Cloud, BrainCircuit, Code, Wrench, BarChart, GitBranch } from 'lucide-react'; // Added GitBranch

// Placeholder SVGs - Adjust size to w-6 h-6
const PythonIcon = () => <Code className="w-6 h-6 text-primary" />;
const TensorFlowIcon = () => <BrainCircuit className="w-6 h-6 text-primary" />;
const PyTorchIcon = () => <BrainCircuit className="w-6 h-6 text-primary" />;
const NltkIcon = () => <BrainCircuit className="w-6 h-6 text-primary" />;
const LangchainIcon = () => <BrainCircuit className="w-6 h-6 text-primary" />;
const HuggingFaceIcon = () => <BrainCircuit className="w-6 h-6 text-primary" />;
const OpenCvIcon = () => <Cpu className="w-6 h-6 text-primary" />;
const NlpIcon = () => <BrainCircuit className="w-6 h-6 text-primary" />;
const CnnIcon = () => <BrainCircuit className="w-6 h-6 text-primary" />;
const RlIcon = () => <BrainCircuit className="w-6 h-6 text-primary" />;
const LlmIcon = () => <BrainCircuit className="w-6 h-6 text-primary" />;
const GitIcon = () => <GitBranch className="w-6 h-6 text-primary" />; // Use GitBranch
const DockerIcon = () => <Cloud className="w-6 h-6 text-primary" />; // Consider a more specific Docker icon if available
const AwsIcon = () => <Cloud className="w-6 h-6 text-primary" />;
const GcpIcon = () => <Cloud className="w-6 h-6 text-primary" />;
const JenkinsIcon = () => <Wrench className="w-6 h-6 text-primary" />;
const KubeflowIcon = () => <Cloud className="w-6 h-6 text-primary" />;
const AirflowIcon = () => <Cloud className="w-6 h-6 text-primary" />;
const SparkIcon = () => <Database className="w-6 h-6 text-primary" />;
const HadoopIcon = () => <Database className="w-6 h-6 text-primary" />;
const SqlIcon = () => <Database className="w-6 h-6 text-primary" />;
const MongoDbIcon = () => <Database className="w-6 h-6 text-primary" />;
const CppIcon = () => <Code className="w-6 h-6 text-primary" />;
const JsIcon = () => <Code className="w-6 h-6 text-primary" />;
const ShellIcon = () => <Code className="w-6 h-6 text-primary" />;
const CalculusIcon = () => <BarChart className="w-6 h-6 text-primary" />; // Placeholder
const StatisticsIcon = () => <BarChart className="w-6 h-6 text-primary" />; // Placeholder

interface SkillCategory {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  skills: { name: string; icon: React.ComponentType<{ className?: string }> }[];
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Programming Languages',
    icon: Code,
    skills: [
      { name: 'Python', icon: PythonIcon },
      { name: 'C++', icon: CppIcon },
      { name: 'JavaScript', icon: JsIcon },
      { name: 'Shell', icon: ShellIcon },
      { name: 'C', icon: Code }, // Generic Code icon
    ],
  },
  {
    title: 'AI/ML Frameworks & Libraries',
    icon: BrainCircuit,
    skills: [
      { name: 'TensorFlow', icon: TensorFlowIcon },
      { name: 'PyTorch', icon: PyTorchIcon },
      { name: 'NLTK', icon: NltkIcon },
      { name: 'Langchain', icon: LangchainIcon },
      { name: 'Transformers', icon: HuggingFaceIcon }, // Alias
      { name: 'Hugging Face', icon: HuggingFaceIcon },
      { name: 'OpenCV', icon: OpenCvIcon },
      { name: 'Langgraph', icon: LangchainIcon }, // Alias
      { name: 'MCP', icon: BrainCircuit }, // Generic
    ],
  },
    {
    title: 'AI/ML Concepts',
    icon: BrainCircuit,
    skills: [
      { name: 'NLP', icon: NlpIcon },
      { name: 'CNN', icon: CnnIcon },
      { name: 'Reinforcement Learning', icon: RlIcon },
      { name: 'LLM Fine-tuning', icon: LlmIcon },
      { name: 'RAG / GraphRAG', icon: LlmIcon },
      { name: 'Cross-Modal Learning', icon: BrainCircuit },
      { name: 'PEFT', icon: LlmIcon },
      { name: 'vLLM', icon: LlmIcon },
      { name: 'Tokenization & Embeddings', icon: BrainCircuit },
    ],
  },
  {
    title: 'Cloud & DevOps/LLMOps',
    icon: Cloud,
    skills: [
      { name: 'AWS (Sagemaker)', icon: AwsIcon },
      { name: 'GCP', icon: GcpIcon },
      { name: 'Git', icon: GitIcon },
      { name: 'Docker', icon: DockerIcon },
      { name: 'Jenkins', icon: JenkinsIcon },
      { name: 'Kubeflow', icon: KubeflowIcon },
      { name: 'Airflow', icon: AirflowIcon },
      { name: 'MLflow', icon: Wrench }, // Generic
      { name: 'WandB', icon: Wrench }, // Generic
      { name: 'IBM Cloud', icon: Cloud }, // Generic
    ],
  },
  {
    title: 'Databases & Big Data',
    icon: Database,
    skills: [
      { name: 'Apache Spark', icon: SparkIcon },
      { name: 'Hadoop', icon: HadoopIcon },
      { name: 'SQL', icon: SqlIcon },
      { name: 'MongoDB', icon: MongoDbIcon },
    ],
  },
    {
    title: 'Mathematics',
    icon: BarChart, // Placeholder
    skills: [
      { name: 'Calculus', icon: CalculusIcon },
      { name: 'Time Series', icon: BarChart },
      { name: 'Advanced Statistics', icon: StatisticsIcon },
    ],
  },
];

const SkillsSection: React.FC = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  const iconVariants = {
     hover: { scale: 1.15, rotate: 3 }, // Slightly increase hover scale
     tap: { scale: 0.9 }
  }

  return (
    <section
      id="skills"
      className="py-12 md:py-16 px-4 md:px-8 bg-transparent scroll-mt-20" // Changed background to transparent
    >
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary">Technical Skills</h2> {/* Reduced bottom margin */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Reduced gap */}
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full border border-border rounded-xl overflow-hidden bg-card"> {/* Keep card small */}
                <CardHeader className="flex flex-row items-center gap-3 p-3 bg-muted/30 border-b"> {/* Reduced padding and gap */}
                   <category.icon className="w-5 h-5 text-accent" /> {/* Smaller header icon */}
                  <CardTitle className="text-lg font-semibold text-primary">{category.title}</CardTitle> {/* Reduced title size */}
                </CardHeader>
                <CardContent className="p-4"> {/* Reduced padding */}
                  <ul className="flex flex-wrap gap-3"> {/* Reduced gap */}
                    {category.skills.map((skill) => (
                      <motion.li
                        key={skill.name}
                        className="flex flex-col items-center text-center p-1.5 rounded-lg transition-colors duration-200 hover:bg-accent/10" // Reduced padding
                        whileHover="hover"
                        whileTap="tap"
                      >
                         <motion.div variants={iconVariants}>
                            <skill.icon /> {/* Icons are already w-6 h-6 */}
                         </motion.div>
                        <span className="mt-1.5 text-xs font-medium text-foreground">{skill.name}</span> {/* Reduced margin-top and text size */}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
