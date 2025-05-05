
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Cpu, Database, Cloud, BrainCircuit, Code, Wrench, BarChart, GitBranch, Terminal, Sigma, Briefcase, Network, LineChart, Recycle, Boxes, Cog } from 'lucide-react';
import skillData from '@/data/skills.json'; // Import JSON data

// --- SVG Icon Components (Keep these as they are needed for mapping) ---
const PythonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500 dark:text-blue-400">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path fill="#FFD43B" d="M10 16.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5 1.5zm4-11c.83 0 1.5.67 1.5 1.5S14.83 8.5 14 8.5s-1.5-.67-1.5-1.5.67-1.5 1.5 1.5z"/>
        <path fill="#306998" d="M10.38 15.16l-1.1-3.33c-.17-.51.17-.93.71-.93h1.92c.55 0 .88.42.71.93l-1.1 3.33c-.38 1.15-1.15 1.15-1.53 0zm3.24-6.31l1.1 3.33c.17.51-.17.93-.71.93h-1.92c-.55 0-.88-.42-.71-.93l1.1-3.33c.38-1.15 1.15-1.15 1.53 0z"/>
    </svg>
);
const CppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600 dark:text-blue-500">
      <path d="M13.5 9.41V6.59c0-.59-.39-1.13-.96-1.33L3.5 2.1C2.93 1.9 2.27 2.14 1.98 2.66L.28 5.71c-.29.52-.13 1.17.37 1.48l4.06 2.46c.5.3 1.13.18 1.49-.29l1.3-1.65c.2-.26.58-.26.78 0l1.3 1.65c.36.47.99.59 1.49.29l4.06-2.46c.5-.31.66-.96.37-1.48l-.38-.64zM10.5 9.41V6.59c0-.59.39-1.13.96-1.33L20.5 2.1c.57-.2 1.23.04 1.52.56l1.7 3.05c.29.52.13 1.17-.37 1.48l-4.06 2.46c-.5.3-1.13.18-1.49-.29l-1.3-1.65c-.2-.26-.58-.26-.78 0l-1.3 1.65c-.36-.47-.99.59-1.49-.29l-4.06-2.46c-.5-.31-.66-.96-.37-1.48l.38-.64zM13.5 14.59v2.82c0 .59-.39 1.13-.96 1.33l-9.04 3.16c-.57.2-1.23-.04-1.52-.56l-1.7-3.05c-.29-.52-.13-1.17.37-1.48l4.06-2.46c.5-.3 1.13.18 1.49.29l1.3 1.65c.2.26.58.26.78 0l1.3-1.65c.36-.47.99-.59 1.49-.29l4.06 2.46c.5.31.66.96.37 1.48l-.38.64zm-3 0v2.82c0 .59.39 1.13.96 1.33l9.04 3.16c.57.2 1.23-.04 1.52-.56l1.7-3.05c.29-.52.13-1.17-.37-1.48l-4.06-2.46c-.5-.3-1.13.18-1.49-.29l-1.3-1.65c-.2-.26-.58-.26-.78 0l-1.3 1.65c-.36-.47-.99-.59-1.49-.29l-4.06 2.46c-.5.31-.66-.96-.37 1.48l.38.64z"/>
    </svg>
);
const JsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F7DF1E" className="w-6 h-6"> {/* Yellow background */}
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM10.84 16.8V8.96h1.86c.6 0 1.07.09 1.42.26.34.17.61.43.79.77.18.34.27.78.27 1.31 0 .5-.09.91-.27 1.23-.18.32-.45.56-.79.71-.35.15-.82.23-1.42.23h-.86v3.33h-1zm2.03-5.21c.26-.1.46-.27.59-.52.13-.25.2-.57.2-1 0-.42-.07-.75-.21-.98-.14-.23-.35-.38-.64-.45-.28-.07-.65-.11-1.1-.11h-.7v3.06h.71c.52 0 .93-.05 1.25-.1zm4.4 5.21h-1.63l1.48-4.38h-1.35l-1.4 4.38h-1.63l2.44-7.84h2.32l2.44 7.84z"/>
    </svg>
);
const ShellIcon = () => <Terminal className="w-6 h-6 text-gray-400 dark:text-gray-500" />;
const CIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-700 dark:text-blue-600">
      <path d="M14.57 3.08C13.22 2.39 11.61 2 10 2 5.58 2 2 5.58 2 10s3.58 8 8 8c1.61 0 3.22-.39 4.57-1.08l-1.5-2.59C12.28 14.76 11.17 15 10 15c-2.76 0-5-2.24-5-5s2.24-5 5-5c1.17 0 2.28.24 3.07.68l1.5-2.59z"/>
    </svg>
);
const RIcon = () => ( // Simple R icon
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600 dark:text-blue-500">
      <path d="M13.5 2.5A4.5 4.5 0 0 0 9 7v1H7v12h2V9.5c0-.28.22-.5.5-.5h2a2.5 2.5 0 0 1 0 5H10v2h1.5a4.5 4.5 0 0 0 0-9z"/>
    </svg>
);
const TensorFlowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF6F00" className="w-6 h-6"> {/* Orange */}
      <path d="M6.5 12.38L12 15.6l5.5-3.22V9.17l-2.75 1.6v3.13l-2.75 1.6-2.75-1.6V10.76l-2.75-1.6v3.22zM12 2L3 7.5v9L12 22l9-5.5v-9L12 2zm0 2.31L18.5 8 12 11.69 5.5 8 12 4.31z"/>
    </svg>
);
const PyTorchIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#EE4C2C" className="w-6 h-6"> {/* Red-Orange */}
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.44 14.44c-.3.3-.71.44-1.11.44-.4 0-.81-.14-1.11-.44L12 14.22l-2.22 2.22c-.3.3-.71.44-1.11.44-.4 0-.8-.14-1.11-.44-.59-.6-.59-1.6 0-2.2L10.78 12 8.56 9.78c-.6-.6-.6-1.6 0-2.2.59-.59 1.6-.59 2.2 0L12 9.78l2.22-2.22c.6-.6 1.6-.6 2.2 0 .6.6.6 1.6 0 2.2L13.22 12l2.22 2.22c.59.61.59 1.61 0 2.22zM19.5 12c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zM6 12c0 .83-.67 1.5-1.5 1.5S3 12.83 3 12s.67-1.5 1.5-1.5 1.5.67 1.5 1.5z"/>
    </svg>
);
const NltkIcon = () => <BrainCircuit className="w-6 h-6 text-green-600 dark:text-green-500" />;
const LangchainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-600 dark:text-purple-500">
       <path d="M19.9 12.65c-1.12-1.88-2.79-3.16-4.74-3.8.33-.91.46-1.89.4-2.88-.14-2.45-2.18-4.4-4.64-4.4-2.33 0-4.29 1.75-4.61 4.03-.05.36-.06.73-.04 1.1.06.97.31 1.91.73 2.75-1.95.64-3.62 1.92-4.74 3.8-.9 1.51-1.3 3.25-1.22 5.02.13 2.73 1.78 5.08 4.19 6.17 2.44 1.1 5.16.92 7.38-.48 2.22-1.4 3.7-3.74 3.83-6.47.1-1.77-.3-3.51-1.22-5.02zm-7.9 5.5c-1.89 0-3.43-1.54-3.43-3.43s1.54-3.43 3.43-3.43 3.43 1.54 3.43 3.43-1.54 3.43-3.43 3.43z"/>
    </svg>
);
const HuggingFaceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-500 dark:text-yellow-400"> {/* Simplified Hugging Face Emoji */}
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c-2.48 0-4.5 2.02-4.5 4.5S9.52 15 12 15s4.5-2.02 4.5-4.5S14.48 6 12 6zm0 7c-1.38 0-2.5-1.12-2.5-2.5S10.62 8 12 8s2.5 1.12 2.5 2.5S13.38 13 12 13zm-4 4h8v2H8v-2z"/>
    </svg>
);
const OpenCvIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
      <circle cx="30" cy="70" r="25" fill="#f00"/>
      <circle cx="70" cy="70" r="25" fill="#0f0"/>
      <circle cx="50" cy="35" r="25" fill="#00f"/>
    </svg>
);
const UnslothIcon = () => <Briefcase className="w-6 h-6 text-pink-500 dark:text-pink-400" />; // Placeholder, Unsloth logo complex
const NlpIcon = () => <BrainCircuit className="w-6 h-6 text-blue-500 dark:text-blue-400" />;
const CnnIcon = () => <BrainCircuit className="w-6 h-6 text-orange-500 dark:text-orange-400" />;
const RlIcon = () => <BrainCircuit className="w-6 h-6 text-green-500 dark:text-green-400" />;
const LlmIcon = () => <BrainCircuit className="w-6 h-6 text-purple-500 dark:text-purple-400" />;
const DiffusionIcon = () => <BrainCircuit className="w-6 h-6 text-teal-500 dark:text-teal-400" />; // Placeholder
const LlamaCppIcon = () => <Cpu className="w-6 h-6 text-gray-600 dark:text-gray-400" />; // Placeholder
const VectorDbIcon = () => <Database className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />;
const RegressionIcon = () => <LineChart className="w-6 h-6 text-red-500 dark:text-red-400" />;
const ClassificationIcon = () => <Boxes className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />;
const ClusteringIcon = () => <Network className="w-6 h-6 text-lime-500 dark:text-lime-400" />;
const EnsembleIcon = () => <Briefcase className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />; // Using Briefcase as placeholder
const BackpropIcon = () => <Recycle className="w-6 h-6 text-amber-500 dark:text-amber-400" />;
const NeuralNetworkIcon = () => <Network className="w-6 h-6 text-fuchsia-500 dark:text-fuchsia-400" />;
const ModelPipelineIcon = () => <Cog className="w-6 h-6 text-slate-500 dark:text-slate-400" />; // Placeholder
const ModelTrainingIcon = () => <Wrench className="w-6 h-6 text-rose-500 dark:text-rose-400" />;
const GitIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F05033" className="w-6 h-6"> {/* Git Orange */}
      <path d="M23.3 10.6c-.2-.2-.4-.3-.7-.3H18v-1c0-1.1-.9-2-2-2h-2.1c-.5 0-1-.2-1.4-.6L11.1 5c-.8-.8-2-.8-2.8 0L6.9 6.4c-.4.4-.9.6-1.4.6H3c-1.1 0-2 .9-2 2v1H.7c-.3 0-.5.1-.7.3-.2.2-.3.4-.3.7v2c0 .3.1.5.3.7.2.2.4.3.7.3h.3v1c0 1.1.9 2 2 2h2.1c.5 0 1 .2 1.4.6l1.4 1.4c.4.4.9.6 1.4.6s1-.2 1.4-.6l1.4-1.4c.4-.4.9-.6-1.4-.6H16c1.1 0 2-.9 2-2v-1h.3c.3 0 .5-.1.7-.3.2-.2.3-.4.3-.7v-2c0-.3-.1-.5-.3-.7zm-1.7 2.1h-1.7c-.5 0-1 .2-1.4.6L17.1 15c-.8.8-2 .8-2.8 0l-1.4-1.4c-.4-.4-.9-.6-1.4-.6s-1 .2-1.4.6L8.7 15c-.8.8-2 .8-2.8 0l-1.4-1.4c-.4-.4-.9-.6-1.4-.6H1.4v-1.5h1.7c.5 0 1-.2 1.4-.6L5.9 10c.8-.8 2-.8 2.8 0l1.4 1.4c.4.4.9.6 1.4.6s1-.2 1.4-.6l1.4-1.4c.8-.8 2-.8 2.8 0l1.4 1.4c.4.4.9.6 1.4.6h1.7v1.5z"/>
    </svg>
);
const DockerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2496ED" className="w-6 h-6"> {/* Docker Blue */}
        <path d="M23.11 11.5l-1.73-1.13V8.62h-1.7v1.77l-1.7-1.1V7.56h-1.7v1.8l-1.7-1.12V6.5h-1.7v1.82l-1.7-1.14V5.46H9.16v1.83L7.46 6.16V4.43H5.76v1.85L4.06 5.16V3.43H2.36v9.06c0 1.67.68 3.18 1.78 4.28s2.6 1.78 4.28 1.78h8.99c3.31 0 6-2.69 6-6v-1.05zm-13 5.58c-1.97 0-3.58-1.6-3.58-3.58s1.6-3.58 3.58-3.58 3.58 1.6 3.58 3.58-1.61 3.58-3.58 3.58zM3.36 9.74h1.7v1.73H3.36V9.74zm3.4 0h1.7v1.73H6.76V9.74zm3.4 0h1.7v1.73h-1.7V9.74zm3.4 0h1.7v1.73h-1.7V9.74zm3.4 0h1.7v1.73h-1.7V9.74z"/>
    </svg>
);
const AwsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF9900" className="w-6 h-6"> {/* AWS Orange */}
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M10.16 17.76c-.27-.28-.4-.64-.4-.99 0-.4.16-.78.49-1.1l3.76-3.76c.34-.34.51-.71.51-.11 0-.4-.17-.78-.51-1.11l-3.76-3.76c-.33-.33-.49-.71-.49-1.11 0-.35.13-.71.4-1l.78-.78c.28-.27.63-.4.99-.4.4 0 .78.16 1.11.49l5.63 5.63c.34.34.51.71.51 1.11 0 .4-.17.78-.51 1.11l-5.63 5.63c-.33.33-.71.49-1.11.49-.36 0-.71-.13-1-.4l-.78-.78zM8.5 12c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z"/>
    </svg>
);
const GcpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6"> {/* Multi-color GCP logo */}
      <path fill="#4285F4" d="M12 9.47c1.54 0 2.79 1.25 2.79 2.79s-1.25 2.79-2.79 2.79-2.79-1.25-2.79-2.79 1.25-2.79 2.79-2.79m0-1.67c-2.48 0-4.48 2-4.48 4.48s2 4.48 4.48 4.48 4.48-2 4.48-4.48-2-4.48-4.48-4.48z"/>
      <path fill="#EA4335" d="M12 4.27c3.49 0 6.37 2.44 6.9 5.7H5.1c.53-3.26 3.41-5.7 6.9-5.7z"/>
      <path fill="#FBBC05" d="M5.1 14.06h13.8c-.53 3.26-3.41 5.7-6.9 5.7s-6.37-2.44-6.9-5.7z"/>
      <path fill="#34A853" d="M19.73 12c0-.46-.04-.91-.12-1.35H4.39c-.08.44-.12.89-.12 1.35s.04.91.12 1.35h15.22c.08-.44.12-.89.12-1.35z"/>
    </svg>
);
const JenkinsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#D24939" className="w-6 h-6"> {/* Jenkins Red */}
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
    </svg>
);
const KubeflowIcon = () => <Cloud className="w-6 h-6 text-blue-500 dark:text-blue-400" />;
const AirflowIcon = () => <Cloud className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />;
const MlflowIcon = () => <Wrench className="w-6 h-6 text-blue-600" />;
const WandbIcon = () => <BarChart className="w-6 h-6 text-yellow-400" />;
const IbmCloudIcon = () => <Cloud className="w-6 h-6 text-blue-800 dark:text-blue-300" />;
const SparkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#E25A1C" className="w-6 h-6"> {/* Spark Orange */}
      <path d="M13.5 2.02L12 3.53l-1.5-1.51L12 .5l1.5 1.52zm-2.95 2.95L9.04 6.47l1.51 1.5L12 6.47l-1.45-1.5zm5.9 0L15 6.47l1.51 1.5L18 6.47l-1.45-1.5zm-11.8 5.9L3.14 12.38l1.5 1.51L6.14 12.38l-1.5-1.51zm14.7 0l-1.51 1.5 1.5 1.51L20.86 12.38l-1.5-1.51zM10.55 15l-1.51 1.5 1.5 1.51 1.45-1.5-1.44-1.51zm2.9 0L12 16.47l1.5 1.51 1.45-1.5-1.51-1.51zM10.5 20.47L12 21.98l1.5-1.51L12 18.97l-1.5 1.5z"/>
    </svg>
);
const HadoopIcon = () => <Database className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />;
const SqlIcon = () => <Database className="w-6 h-6 text-cyan-700 dark:text-cyan-600" />;
const MongoDbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4DB33D" className="w-6 h-6"> {/* MongoDB Green */}
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-.18 15.5c-2.43 0-4.42-1.77-4.75-4.09h9.49c-.33 2.32-2.32 4.09-4.74 4.09zm6.59-5.5H5.59c-.22-1.74.81-3.39 2.46-4.17.56-.27 1.18-.41 1.83-.41 1.1 0 2.1.36 2.91 1.02.73.6 1.18 1.44 1.21 2.56h3.61c-.02-.6-.17-1.17-.45-1.71-.86-1.66-2.47-2.77-4.37-2.77-1.64 0-3.11.83-4.03 2.14C7.85 9.94 7.5 11.22 7.5 12.57c0 2.23 1.46 4.14 3.5 4.76.56.17 1.14.27 1.73.27 1.6 0 3.03-.73 4.01-1.96.75-.94 1.12-2.08 1.12-3.27 0-.1-.01-.2-.02-.3H18.41z"/>
    </svg>
);
const CalculusIcon = () => <Sigma className="w-6 h-6 text-gray-500" />;
const TimeSeriesIcon = () => <LineChart className="w-6 h-6 text-gray-500" />; // Use LineChart
const StatisticsIcon = () => <BarChart className="w-6 h-6 text-gray-500" />;
const DsaIcon = () => <Network className="w-6 h-6 text-gray-500" />; // Use Network for DSA
const LinearAlgebraIcon = () => <Sigma className="w-6 h-6 text-gray-500" />; // Use Sigma for Linear Algebra
const FaissIcon = () => <Database className="w-6 h-6 text-blue-400" />; // Placeholder
const ChromaIcon = () => <Database className="w-6 h-6 text-purple-400" />; // Placeholder
const RedisIcon = () => ( // Simple Redis icon
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#DC382D" className="w-6 h-6">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2zm0 4h2v6h-2z"/>
    </svg>
);
const QdrantIcon = () => <Database className="w-6 h-6 text-green-400" />; // Placeholder

// Map icon names (from JSON) to the actual icon components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code, Python: PythonIcon, Cpp: CppIcon, Js: JsIcon, Shell: ShellIcon, C: CIcon, R: RIcon,
  Wrench, TensorFlow: TensorFlowIcon, PyTorch: PyTorchIcon, Nltk: NltkIcon, Langchain: LangchainIcon, Transformers: HuggingFaceIcon, HuggingFace: HuggingFaceIcon, OpenCV: OpenCvIcon, Langgraph: LangchainIcon, MCP: BrainCircuit, Unsloth: UnslothIcon,
  BrainCircuit, Nlp: NlpIcon, Rl: RlIcon, Llm: LlmIcon, Diffusion: DiffusionIcon, LlamaCpp: LlamaCppIcon,
  Cog, Cnn: CnnIcon, Regression: RegressionIcon, Classification: ClassificationIcon, Clustering: ClusteringIcon, Ensemble: EnsembleIcon, Backprop: BackpropIcon, NeuralNetwork: NeuralNetworkIcon, ModelPipeline: ModelPipelineIcon, ModelTraining: ModelTrainingIcon,
  Cloud, Aws: AwsIcon, Gcp: GcpIcon, Git: GitIcon, Docker: DockerIcon, Jenkins: JenkinsIcon, Kubeflow: KubeflowIcon, Airflow: AirflowIcon, Mlflow: MlflowIcon, Wandb: WandbIcon, IbmCloud: IbmCloudIcon,
  Database, Spark: SparkIcon, Hadoop: HadoopIcon, Sql: SqlIcon, MongoDb: MongoDbIcon, VectorDb: VectorDbIcon, Faiss: FaissIcon, Chroma: ChromaIcon, Redis: RedisIcon, Qdrant: QdrantIcon,
  Sigma, Calculus: CalculusIcon, TimeSeries: TimeSeriesIcon, Statistics: StatisticsIcon, Dsa: DsaIcon, LinearAlgebra: LinearAlgebraIcon,
  // Add default icon if needed
  Default: Wrench,
};

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
     hover: { scale: 1.15, rotate: 3 },
     tap: { scale: 0.9 }
  };

  // Function to get the icon component based on name, falling back to a default
  const getIconComponent = (iconName: string | undefined): React.ComponentType<{ className?: string }> => {
      return iconName ? (iconMap[iconName] || iconMap['Default']) : iconMap['Default'];
  };


  return (
    <section
      id="skills"
      className="py-12 md:py-16 px-4 md:px-8 bg-transparent scroll-mt-20"
    >
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">Technical Skills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillData.map((category, index) => {
            const CategoryIcon = getIconComponent(category.icon); // Get category icon component
            return (
              <motion.div
                key={category.title}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full border border-border rounded-xl overflow-hidden bg-card">
                  <CardHeader className="flex flex-row items-center gap-3 p-4 bg-muted/30 border-b">
                     <CategoryIcon className="w-6 h-6 text-accent" />
                    <CardTitle className="text-lg md:text-xl font-semibold text-primary">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-5">
                    <ul className="flex flex-wrap gap-4">
                      {category.skills.map((skill) => {
                         const SkillIcon = getIconComponent(skill.icon); // Get skill icon component
                         return (
                           <motion.li
                             key={skill.name}
                             className="flex flex-col items-center text-center p-2 rounded-lg transition-colors duration-200 hover:bg-accent/10"
                             whileHover="hover"
                             whileTap="tap"
                           >
                             <motion.div variants={iconVariants} className="w-7 h-7 flex items-center justify-center mb-1">
                               <SkillIcon />
                             </motion.div>
                             <span className="text-xs md:text-sm font-medium text-foreground">{skill.name}</span>
                           </motion.li>
                         );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
