
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
    Cpu, Database, Cloud, BrainCircuit, Code, Wrench, BarChart, GitBranch, Terminal, Sigma, Briefcase, Network, LineChart, Recycle, Boxes, Cog,
    Library, Palette, DatabaseBackup, Table, Server, AreaChart, FlaskConical, Container, Workflow, AppWindow, Copy, Target, Settings2, DatabaseZap, Combine, Puzzle, Zap, Binary, Layers, GalleryThumbnails, Calculator, TrendingUp, PieChart, GitMerge, SquareSigma, Rabbit // Removed DatabaseLock
} from 'lucide-react';
import skillData from '@/data/skills.json'; // Import JSON data

// --- SVG Icon Components (Keep specific logos, replace generics later) ---
const PythonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fill="#306998" d="M17.6 13.46a6.54 6.54 0 01-3.92-3.04l-.1-.18-1.19-.1a5.54 5.54 0 00-3.35 1.04l-.18.13-.86 1.08a4.06 4.06 0 00-1.2 2.47l-.02.27v4.29a4.44 4.44 0 004.44 4.44h4.29a4.44 4.44 0 004.44-4.44v-4.29a4.28 4.28 0 00-2.35-3.73zm-5.14 8.15a2.07 2.07 0 112.07-2.07 2.07 2.07 0 01-2.07 2.07z"/>
      <path fill="#FFD43B" d="M11.13 18.17a6.54 6.54 0 01-3.04-3.92l-.1-.18-.1-1.19a5.54 5.54 0 001.04-3.35l.13-.18 1.08-.86a4.06 4.06 0 002.47-1.2l.27-.02h4.29a4.44 4.44 0 004.44-4.44v-4.29A4.44 4.44 0 0017.91.33H13.62a4.28 4.28 0 00-3.73-2.35H6.46A6.54 6.54 0 012.54 2l-.18.1-.18 1.19a5.54 5.54 0 00-1.04 3.35l-.13.18-.86 1.08A4.06 4.06 0 001 10.37l-.02.27v4.29a4.44 4.44 0 004.44 4.44h4.29c1.34 0 2.6-.58 3.52-1.56l-.1-1.64zm8.15-5.14a2.07 2.07 0 112.07-2.07 2.07 2.07 0 01-2.07 2.07z"/>
    </svg>
);
const CppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600 dark:text-blue-500">
        <path d="M19.11 11.15l-1.78-3.01c-.25-.43-.74-.66-1.22-.66h-3.1V4.07c0-.59-.48-1.07-1.07-1.07H7.1c-.59 0-1.07.48-1.07 1.07v3.41H3.1c-.48 0-.97.23-1.22.66L.1 11.15c-.25.43-.25.95 0 1.38l1.78 3.01c.25.43.74.66 1.22.66h3.1v3.41c0 .59.48 1.07 1.07 1.07h4.81c.59 0 1.07-.48 1.07-1.07v-3.41h3.1c.48 0 .97-.23 1.22-.66l1.78-3.01c.25-.43.25-.95 0-1.38zM8.17 15.43h1.87v1.87H8.17v-1.87zm0-3.74h1.87v1.87H8.17v-1.87zm0-3.74h1.87v1.87H8.17V7.95zm5.8 7.48h-1.87v-1.87h1.87v1.87zm0-3.74h-1.87v-1.87h1.87v1.87zm0-3.74h-1.87V7.95h1.87v1.87z"/>
    </svg>
);
const JsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 630 630" className="w-6 h-6">
        <rect width="630" height="630" fill="#f7df1e"/>
        <path d="m423.2 492.19c12.69 20.72 29.2 35.95 58.4 35.95 24.53 0 40.2-12.26 40.2-29.2 0-20.3-16.1-27.49-43.1-39.3l-14.8-6.35c-42.72-18.2-71.1-41-71.1-89.2 0-44.4 33.83-78.2 86.7-78.2 37.64 0 64.7 12.69 84.6 43.1l-46.4 29.6c-10.15-18.2-21.1-25.37-38.2-25.37-17.34 0-28.33 11-28.33 25.37 0 17.76 11 24.53 33 33.83l14.8 6.35c50.3 21.57 78.7 43.56 78.7 93 0 53.3-41.87 82.5-98.1 82.5-54.98 0-90.5-26.2-107.88-60.54zm-209.13 5.13h56.5v-213.8h-56.5z"/>
    </svg>
);
const ShellIcon = () => <Terminal className="w-6 h-6 text-gray-400 dark:text-gray-500" />;
const CIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-6 h-6">
        <path fill="#5c6bc0" d="M64 128c35.346 0 64-28.654 64-64S99.346 0 64 0 0 28.654 0 64s28.654 64 64 64z"/>
        <path fill="#FFF" d="M103.572 74.508c-5.76 10.345-15.561 17.568-26.817 20.329-11.255 2.76-23.152.369-32.973-6.758-9.821-7.128-16.514-18.224-18.101-30.484-1.587-12.26 1.89-24.767 9.576-34.841 6.504-8.692 16.344-14.735 27.147-16.683 10.803-1.949 21.959-.725 31.693 4.779l-13.316 16.876c-4.088-2.591-8.939-3.425-13.555-2.466-4.616.959-8.599 3.651-11.381 7.604-2.781 3.953-4.172 8.761-3.89 13.57.282 4.809 2.26 9.391 5.595 12.985 3.335 3.593 7.795 5.946 12.692 6.668 4.896.722 9.896-.005 14.215-2.099 4.319-2.094 7.687-5.44 9.632-9.626l15.179 16.948z"/>
    </svg>
);
const RIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 768" className="w-6 h-6">
      <path fill="#fff" d="M0 0h768v768H0z"/>
      <path fill="#276dc2" d="M576.8 384c0 111.3-90.5 201.7-201.7 201.7s-201.7-90.5-201.7-201.7S263.7 182.3 375.1 182.3 576.8 272.7 576.8 384z"/>
      <path fill="#fff" d="M375.1 215.2c-94.6 0-171.6 77-171.6 171.6s77 171.6 171.6 171.6 171.6-77 171.6-171.6c0-53.5-24.8-102.7-65.2-134.4-37.5-30-85.3-41.6-131.7-36.4l25.3 25.3v91.7H436c22.4 0 31.1 18.1 27.4 38.3-8.7 46.1-50.5 78.9-98.3 78.9-55.5 0-100.7-45.2-100.7-100.7s45.2-100.7 100.7-100.7c20.3 0 39.6 6 56.3 16.8v-30.5c-17-7.9-36.1-12.4-56.3-12.4z"/>
    </svg>
);
const TensorFlowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 105 128" className="w-6 h-6">
        <path fill="#FF6F00" d="M52.5 0L0 30v67.5L52.5 128l52.5-30.5V30L52.5 0zm31.5 86.25l-9 5.25v10.5l15 8.75L105 105V48.75l-21 12v25.5zm-15-10.5l-16.5-9.5-16.5 9.5v19l16.5 9.5 16.5-9.5v-19zM21 96.75L6 105V48.75l21 12V96.75zm0-42L36 48v10.5L21 63.75V54.75zm31.5-19L84 54.75v31.5l-9 5.25v-31.5L52.5 46.25zM36 48l16.5-9.5 16.5 9.5-16.5 9.5L36 48z"/>
    </svg>
);
const PyTorchIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-6 h-6">
        <path fill="#ee4c2c" d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm17.6 100.8c-1.3 1.3-3.2 2-5 2s-3.7-.7-5-2L64 91.2l-7.6 7.6c-1.3 1.3-3.2 2-5 2s-3.7-.7-5-2c-2.7-2.7-2.7-7.1 0-9.8L56.8 81.4l-7.4-7.4c-2.7-2.7-2.7-7.1 0-9.8 2.7-2.7 7.1-2.7 9.8 0L64 69.4l5.2-5.2c2.7-2.7 7.1-2.7 9.8 0s2.7 7.1 0 9.8L71.2 81.4l7.4 7.4c2.8 2.6 2.8 7.1 0 9.8zm25.6-36.8c0 3.7-3 6.7-6.7 6.7s-6.7-3-6.7-6.7 3-6.7 6.7-6.7 6.7 3 6.7 6.7zM26.7 64c0 3.7-3 6.7-6.7 6.7S13.3 67.7 13.3 64s3-6.7 6.7-6.7 6.7 3 6.7 6.7z"/>
    </svg>
);
const NltkIcon = () => <Library className="w-6 h-6 text-green-600 dark:text-green-500" />; // Using a library icon as placeholder
const LangchainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="w-6 h-6">
        <rect width="256" height="256" fill="none"/>
        <path fill="#8f77ff" d="M178.4,56.6A94.4,94.4,0,0,0,128,38a93.8,93.8,0,0,0-50.4,18.6C59.9,73.2,45,94.4,41.2,118.8a97.6,97.6,0,0,0,1.4,52.8c4.5,21.9,16.6,41.4,34.4,55.3a94.1,94.1,0,0,0,101.8,0c17.8-13.9,29.9-33.4,34.4-55.3a97.6,97.6,0,0,0,1.4-52.8C211,94.4,196.1,73.2,178.4,56.6Z"/>
        <path fill="#fff" d="M128,104a24,24,0,1,0,24,24A24,24,0,0,0,128,104Zm0,40a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z"/>
        <path fill="#fff" d="M96.4,158.1a4,4,0,0,0-4.1,3.1,58.2,58.2,0,0,0,0,33.6,4,4,0,0,0,4.1,3.1h63.2a4,4,0,0,0,4.1-3.1,58.2,58.2,0,0,0,0-33.6,4,4,0,0,0-4.1-3.1H128Z"/>
    </svg>
);
const HuggingFaceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
        <path fill="#FFDA2C" d="M50 10 C 27.9086 10 10 27.9086 10 50 C 10 72.0914 27.9086 90 50 90 C 72.0914 90 90 72.0914 90 50 C 90 27.9086 72.0914 10 50 10 Z"/>
        <path fill="#000000" d="M34 40 C 34 35.5817 37.5817 32 42 32 C 46.4183 32 50 35.5817 50 40 C 50 44.4183 46.4183 48 42 48 C 37.5817 48 34 44.4183 34 40 Z M 58 40 C 58 35.5817 61.5817 32 66 32 C 70.4183 32 74 35.5817 74 40 C 74 44.4183 70.4183 48 66 48 C 61.5817 48 58 44.4183 58 40 Z M 32 60 C 32 56 38 54 50 54 C 62 54 68 56 68 60 L 68 64 L 32 64 L 32 60 Z"/>
    </svg>
);
const OpenCvIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
      <circle cx="30" cy="70" r="25" fill="#f00"/>
      <circle cx="70" cy="70" r="25" fill="#0f0"/>
      <circle cx="50" cy="35" r="25" fill="#00f"/>
    </svg>
);
const UnslothIcon = () => <Rabbit className="w-6 h-6 text-pink-500 dark:text-pink-400" />; // Use a similar animal icon
const NlpIcon = () => <Combine className="w-6 h-6 text-blue-500 dark:text-blue-400" />; // More abstract
const CnnIcon = () => <Layers className="w-6 h-6 text-orange-500 dark:text-orange-400" />; // Represents layers
const RlIcon = () => <Target className="w-6 h-6 text-green-500 dark:text-green-400" />; // Represents goal-oriented learning
const LlmIcon = () => <BrainCircuit className="w-6 h-6 text-purple-500 dark:text-purple-400" />; // Keep for LLM
const DiffusionIcon = () => <GalleryThumbnails className="w-6 h-6 text-teal-500 dark:text-teal-400" />; // Image generation related
const LlamaCppIcon = () => <Binary className="w-6 h-6 text-gray-600 dark:text-gray-400" />; // Represents code/low-level
const VectorDbIcon = () => <DatabaseZap className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />; // More specific DB icon
const RegressionIcon = () => <TrendingUp className="w-6 h-6 text-red-500 dark:text-red-400" />; // Represents trend/line
const ClassificationIcon = () => <Puzzle className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />; // Represents categorizing/fitting
const ClusteringIcon = () => <Network className="w-6 h-6 text-lime-500 dark:text-lime-400" />; // Keep network for grouping
const EnsembleIcon = () => <Boxes className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />; // Represents multiple models
const BackpropIcon = () => <Recycle className="w-6 h-6 text-amber-500 dark:text-amber-400" />; // Keep for feedback loop concept
const NeuralNetworkIcon = () => <Workflow className="w-6 h-6 text-fuchsia-500 dark:text-fuchsia-400" />; // Represents interconnected nodes
const ModelPipelineIcon = () => <GitMerge className="w-6 h-6 text-slate-500 dark:text-slate-400" />; // Represents workflow/steps
const ModelTrainingIcon = () => <Settings2 className="w-6 h-6 text-rose-500 dark:text-rose-400" />; // Represents tuning/process
const GitIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F05033" className="w-6 h-6">
      <path d="M23.3 10.6c-.2-.2-.4-.3-.7-.3H18v-1c0-1.1-.9-2-2-2h-2.1c-.5 0-1-.2-1.4-.6L11.1 5c-.8-.8-2-.8-2.8 0L6.9 6.4c-.4.4-.9.6-1.4.6H3c-1.1 0-2 .9-2 2v1H.7c-.3 0-.5.1-.7.3-.2.2-.3.4-.3.7v2c0 .3.1.5.3.7.2.2.4.3.7.3h.3v1c0 1.1.9 2 2 2h2.1c.5 0 1 .2 1.4.6l1.4 1.4c.4.4.9.6 1.4.6s1-.2 1.4-.6l1.4-1.4c.4-.4-.9-.6-1.4-.6H16c1.1 0 2-.9 2-2v-1h.3c.3 0 .5-.1.7-.3.2-.2.3-.4.3-.7v-2c0-.3-.1-.5-.3-.7zm-1.7 2.1h-1.7c-.5 0-1 .2-1.4.6L17.1 15c-.8.8-2 .8-2.8 0l-1.4-1.4c-.4-.4-.9-.6-1.4-.6s-1 .2-1.4.6L8.7 15c-.8.8-2 .8-2.8 0l-1.4-1.4c-.4-.4-.9-.6-1.4-.6H1.4v-1.5h1.7c.5 0 1-.2 1.4-.6L5.9 10c.8-.8 2-.8 2.8 0l1.4 1.4c.4.4.9.6 1.4.6s1-.2 1.4-.6l1.4-1.4c.8-.8 2-.8 2.8 0l1.4 1.4c.4.4.9.6 1.4.6h1.7v1.5z"/>
    </svg>
);
const DockerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2496ED" className="w-6 h-6">
        <path d="M23.11 11.5l-1.73-1.13V8.62h-1.7v1.77l-1.7-1.1V7.56h-1.7v1.8l-1.7-1.12V6.5h-1.7v1.82l-1.7-1.14V5.46H9.16v1.83L7.46 6.16V4.43H5.76v1.85L4.06 5.16V3.43H2.36v9.06c0 1.67.68 3.18 1.78 4.28s2.6 1.78 4.28 1.78h8.99c3.31 0 6-2.69 6-6v-1.05zm-13 5.58c-1.97 0-3.58-1.6-3.58-3.58s1.6-3.58 3.58-3.58 3.58 1.6 3.58 3.58-1.61 3.58-3.58 3.58zM3.36 9.74h1.7v1.73H3.36V9.74zm3.4 0h1.7v1.73H6.76V9.74zm3.4 0h1.7v1.73h-1.7V9.74zm3.4 0h1.7v1.73h-1.7V9.74zm3.4 0h1.7v1.73h-1.7V9.74z"/>
    </svg>
);
const AwsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
       <path fill="#FF9900" d="M 18.47,79.05 C 14.52,76.8 11.16,73.44 8.9,69.49 6.65,65.55 5.53,61.05 5.53,56.01 c 0,-4.37 0.69,-8.51 2.07,-12.42 1.38,-3.91 3.39,-7.45 6.04,-10.64 2.65,-3.18 5.85,-5.83 9.6,-7.94 3.75,-2.11 7.9,-3.59 12.42,-4.44 4.52,-0.85 9.02,-0.85 13.5,0 4.48,0.85 8.65,2.33 12.42,4.44 3.77,2.11 6.97,4.76 9.62,7.94 2.65,3.18 4.65,6.73 6.04,10.64 1.38,3.91 2.07,8.05 2.07,12.42 0,5.03 -1.12,9.53 -3.37,13.5 -2.25,3.95 -5.61,7.31 -9.08,9.57 -3.47,2.25 -7.75,3.91 -12.85,4.97 -5.09,1.06 -10.54,1.06 -16.34,-0 -5.8,-1.06 -10.8,-2.72 -14.98,-4.97 z M 61.95,34.77 c -1.17,-0.85 -2.44,-1.28 -3.82,-1.28 -1.38,0 -2.65,0.43 -3.82,1.28 L 36.8,51.25 c -1.17,0.85 -1.76,2.02 -1.76,3.5 0,1.48 0.59,2.67 1.76,3.56 l 3.63,2.62 c 1.17,0.85 2.44,1.28 3.82,1.28 1.38,0 2.65,-0.43 3.82,-1.28 l 11.84,-8.56 c 1.17,-0.85 1.76,-2.02 1.76,-3.5 0,-1.48 -0.59,-2.67 -1.76,-3.56 l -3.63,-2.62 z m 15.9,16.48 c -1.17,-0.85 -2.44,-1.28 -3.82,-1.28 -1.38,0 -2.65,0.43 -3.82,1.28 l -11.84,8.56 c -1.17,0.85 -1.76,2.02 -1.76,3.5 0,1.48 0.59,2.67 1.76,3.56 l 3.63,2.62 c 1.17,0.85 2.44,1.28 3.82,1.28 1.38,0 2.65,-0.43 3.82,-1.28 l 11.84,-8.56 c 1.17,-0.85 1.76,-2.02 1.76,-3.5 0,-1.48 -0.59,-2.67 -1.76,-3.56 l -3.63,-2.62 z M 50,69.46 c -1.38,0 -2.65,0.43 -3.82,1.28 l -3.63,2.62 c -1.17,0.85 -1.76,2.02 -1.76,3.5 0,1.48 0.59,2.67 1.76,3.56 l 11.84,8.56 c 1.17,0.85 2.44,1.28 3.82,1.28 1.38,0 2.65,-0.43 3.82,-1.28 l 3.63,-2.62 c 1.17,0.85 1.76,2.02 1.76,3.5 0,-1.48 -0.59,-2.67 -1.76,-3.56 l -11.84,-8.56 c -1.17,-0.85 -2.44,-1.28 -3.82,-1.28 z" />
       <path fill="#232F3E" d="M 50,7.03 C 62.81,7.03 74.89,10.6 84.63,16.86 94.37,23.12 101.2,31.7 104.16,41.67 107.11,51.64 106.04,62.4 101.11,71.96 96.18,81.52 87.74,89.26 77.28,94.02 72.91,96.01 68.29,97.57 63.52,98.65 61.69,99.03 59.82,99.31 57.92,99.49 56.01,99.66 54.05,99.75 52.06,99.75 47.94,99.75 43.89,99.44 39.93,98.83 36.16,97.95 32.61,96.83 29.34,95.48 24.53,93.23 20.33,90.3 16.8,86.77 12.76,82.73 9.67,78.15 7.64,73.09 5.96,67.63 4.68,61.87 3.84,55.91 3.47,49.84 3.61,43.74 4.27,37.75 5.43,31.94 7.08,26.46 9.17,21.45 11.67,17.01 14.53,13.23 17.7,10.17 21.12,7.91 24.75,6.49 28.53,5.95 32.41,6.3 36.34,7.54 40.22,9.66 43.95,12.6 47.47,16.3 50.71,20.65 53.61,25.59 56.11,30.99 58.17,36.78 59.74,42.85 60.81,49.11 61.33,55.47 61.33,61.87 c 0,0.95 -0.03,1.91 -0.09,2.86 -0.11,1.91 -0.37,3.8 -0.76,5.63 -0.67,3.08 -1.84,5.96 -3.44,8.56 -2.14,3.47 -5.2,6.06 -8.92,7.54 -3.73,1.48 -7.98,1.84 -12.17,1.06 -4.19,-0.78 -8.05,-2.67 -11.16,-5.45 -3.1,-2.78 -5.27,-6.39 -6.25,-10.4 -0.98,-4.01 -0.74,-8.26 0.7,-12.17 1.44,-3.91 3.93,-7.31 7.21,-9.89 3.28,-2.58 7.24,-4.25 11.51,-4.83 0.81,-0.11 1.62,-0.17 2.44,-0.17 4.27,0 8.33,1.17 11.78,3.35 2.93,1.82 5.27,4.37 6.75,7.43 0.91,1.89 1.46,3.98 1.58,6.11 0.04,0.7 0.06,1.41 0.06,2.11 0,1.72 -0.21,3.42 -0.62,5.09 -0.67,2.7 -2.04,5.18 -3.98,7.23 -1.94,2.04 -4.4,3.61 -7.15,4.54 -2.75,0.93 -5.69,1.18 -8.6,0.72 -2.9,-0.46 -5.69,-1.64 -8.1,-3.42 -2.4,-1.79 -4.37,-4.14 -5.76,-6.85 -1.38,-2.72 -2.11,-5.74 -2.11,-8.81 0,-3.1 0.74,-6.11 2.11,-8.81 1.38,-2.72 3.35,-5.06 5.76,-6.85 2.4,-1.79 5.2,-2.96 8.1,-3.42 2.9,-0.46 5.84,-0.21 8.6,0.72 2.75,0.93 5.2,2.5 7.15,4.54 1.94,2.04 3.31,4.52 3.98,7.23 0.41,1.67 0.62,3.37 0.62,5.09 0,0.7 -0.02,1.41 -0.06,2.11 -0.12,2.13 -0.67,4.22 -1.58,6.11 -1.48,3.05 -3.82,5.6 -6.75,7.43 -3.44,2.18 -7.5,3.35 -11.78,3.35 -0.82,0 -1.62,-0.06 -2.44,-0.17 -4.27,-0.58 -8.23,-2.25 -11.51,-4.83 -3.28,-2.58 -5.76,-5.98 -7.21,-9.89 -1.44,-3.91 -1.68,-8.16 -0.7,-12.17 0.98,-4.01 3.15,-7.62 6.25,-10.4 3.1,-2.78 6.97,-4.67 11.16,-5.45 4.19,-0.78 8.44,-0.42 12.17,1.06 3.73,1.48 6.78,4.08 8.92,7.54 1.61,2.62 2.77,5.5 3.44,8.56 0.39,1.82 0.65,3.72 0.76,5.63 0.06,0.95 0.09,1.91 0.09,2.86 z" />
    </svg>
);
const GcpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
      <path fill="#4285F4" d="M12 9.47c1.54 0 2.79 1.25 2.79 2.79s-1.25 2.79-2.79 2.79-2.79-1.25-2.79-2.79 1.25-2.79 2.79-2.79m0-1.67c-2.48 0-4.48 2-4.48 4.48s2 4.48 4.48 4.48 4.48-2 4.48-4.48-2-4.48-4.48-4.48z"/>
      <path fill="#EA4335" d="M12 4.27c3.49 0 6.37 2.44 6.9 5.7H5.1c.53-3.26 3.41-5.7 6.9-5.7z"/>
      <path fill="#FBBC05" d="M5.1 14.06h13.8c-.53 3.26-3.41 5.7-6.9 5.7s-6.37-2.44-6.9-5.7z"/>
      <path fill="#34A853" d="M19.73 12c0-.46-.04-.91-.12-1.35H4.39c-.08.44-.12.89-.12 1.35s.04.91.12 1.35h15.22c.08-.44.12-.89.12-1.35z"/>
    </svg>
);
const JenkinsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 1000" className="w-6 h-6">
      <path fill="#D24939" d="M420.9 0C188.5 0 0 188.5 0 420.9s188.5 420.9 420.9 420.9 420.9-188.5 420.9-420.9S653.3 0 420.9 0zm0 673.4c-14.9 0-26.9-12.1-26.9-26.9v-53.8c0-14.9 12.1-26.9 26.9-26.9s26.9 12.1 26.9 26.9v53.8c0 14.8-12.1 26.9-26.9 26.9zm0-161.5c-14.9 0-26.9-12.1-26.9-26.9V331.2c0-14.9 12.1-26.9 26.9-26.9s26.9 12.1 26.9 26.9v153.8c0 14.8-12.1 26.9-26.9 26.9z"/>
      <circle fill="#FFFFFF" cx="420.9" cy="817.4" r="42.1"/>
    </svg>
);
const KubeflowIcon = () => <FlaskConical className="w-6 h-6 text-blue-500 dark:text-blue-400" />; // Lab icon
const AirflowIcon = () => <Workflow className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />; // Workflow icon
const MlflowIcon = () => <GitBranch className="w-6 h-6 text-blue-600" />; // Branching/versioning icon
const WandbIcon = () => <AreaChart className="w-6 h-6 text-yellow-400" />; // Chart icon
const IbmCloudIcon = () => <Cloud className="w-6 h-6 text-blue-800 dark:text-blue-300" />; // Keep generic cloud
const SparkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-6 h-6">
        <path fill="#E25A1C" d="M64 0L51.7 12.3 64 24.6l12.3-12.3L64 0zM39.4 24.6L27.1 36.9l12.3 12.3L51.7 36.9 39.4 24.6zm49.2 0L76.3 36.9l12.3 12.3L100.9 36.9 88.6 24.6zM12.3 51.7L0 64l12.3 12.3L24.6 64 12.3 51.7zm103.4 0L103.4 64l12.3 12.3L128 64l-12.3-12.3zM39.4 88.6L27.1 76.3 39.4 64l12.3 12.3-12.3 12.3zm49.2 0L76.3 76.3 88.6 64l12.3 12.3-12.3 12.3zM64 103.4L51.7 115.7 64 128l12.3-12.3L64 103.4z"/>
    </svg>
);
const HadoopIcon = () => <DatabaseBackup className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />; // Data storage icon
const SqlIcon = () => <Table className="w-6 h-6 text-cyan-700 dark:text-cyan-600" />; // Table icon
const MongoDbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 184 184" className="w-6 h-6">
        <path fill="#4DB33D" d="M131.1,34.6c-15.4-15.4-37.1-25.1-61.1-25.1S46.1,19.2,30.7,34.6C15.3,50,5.6,71.7,5.6,95.7 c0,12.9,2.5,25.8,7.6,37.8c10.4,24.3,29.5,43.4,53.8,53.8c12,5.1,24.9,7.6,37.8,7.6s25.8-2.5,37.8-7.6 c24.3-10.4,43.4-29.5,53.8-53.8c5.1-12,7.6-24.9,7.6-37.8C156.2,59.7,146.5,34.6,131.1,34.6z M109.6,126.3 c-14.3,14.3-35.9,20.9-57.4,16.3c-21.6-4.6-38.1-21.1-42.7-42.7c-4.6-21.6,2-43.1,16.3-57.4c14.3-14.3,35.9-20.9,57.4-16.3 c21.6,4.6,38.1,21.1,42.7,42.7C130.5,90.4,123.9,112,109.6,126.3z"/>
        <path fill="#FFFFFF" d="M106.8,70.1c-3.1-3.1-6.7-5.3-10.7-6.7c-4-1.4-8.3-2.1-12.7-2.1c-11.1,0-21.1,4.6-28.1,12.3 c-4.7,5.1-7.7,11.4-9,18.3h28.3c0.4-3.2,1.8-6.2,4.1-8.6c2.7-2.7,6.2-4.1,10.1-4.1c3.9,0,7.4,1.4,10.1,4.1 c2.3,2.3,3.6,5.3,4.1,8.6h28.3c-1.4-6.8-4.4-13.2-9-18.3C114.5,74.6,110.9,72.4,106.8,70.1z M70,116.2 C70,116.2,70,116.2,70,116.2c3.4,8.5,9.7,15,18.1,18.1c8.5,3.1,17.7,3.1,26.2,0c8.5-3.1,14.8-9.7,18.1-18.1 c0,0,0,0,0,0H70z"/>
    </svg>
);
const FaissIcon = () => <Database className="w-6 h-6 text-blue-400" />; // Use Database icon for Faiss
const ChromaIcon = () => <Palette className="w-6 h-6 text-purple-400" />; // Color/vector concept
const RedisIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-6 h-6">
      <path fill="#DC382D" d="M112 64c0 26.5-21.5 48-48 48S16 90.5 16 64 37.5 16 64 16s48 21.5 48 48z"/>
      <path fill="#fff" d="M64 40v16h16v8H64v24H48V64H32v-8h16V40z"/>
    </svg>
);
const QdrantIcon = () => <Server className="w-6 h-6 text-green-400" />; // Server/DB icon
const CalculusIcon = () => <Calculator className="w-6 h-6 text-gray-500" />; // Calculator for math
const TimeSeriesIcon = () => <LineChart className="w-6 h-6 text-gray-500" />; // Keep LineChart
const StatisticsIcon = () => <PieChart className="w-6 h-6 text-gray-500" />; // Pie chart for stats
const DsaIcon = () => <Copy className="w-6 h-6 text-gray-500" />; // Represents structure/copying data
const LinearAlgebraIcon = () => <SquareSigma className="w-6 h-6 text-gray-500" />; // Matrix/sigma concept


// Map icon names (from JSON) to the actual icon components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Code, Python: PythonIcon, Cpp: CppIcon, Js: JsIcon, Shell: ShellIcon, C: CIcon, R: RIcon,
    Wrench, TensorFlow: TensorFlowIcon, PyTorch: PyTorchIcon, Nltk: NltkIcon, Langchain: LangchainIcon, Transformers: HuggingFaceIcon, HuggingFace: HuggingFaceIcon, OpenCV: OpenCvIcon, Langgraph: LangchainIcon, MCP: BrainCircuit, Unsloth: UnslothIcon,
    BrainCircuit, Nlp: NlpIcon, Rl: RlIcon, Llm: LlmIcon, Diffusion: DiffusionIcon, LlamaCpp: LlamaCppIcon, VectorDb: VectorDbIcon,
    Cog, Cnn: CnnIcon, Regression: RegressionIcon, Classification: ClassificationIcon, Clustering: ClusteringIcon, Ensemble: EnsembleIcon, Backprop: BackpropIcon, NeuralNetwork: NeuralNetworkIcon, ModelPipeline: ModelPipelineIcon, ModelTraining: ModelTrainingIcon,
    Cloud, Aws: AwsIcon, Gcp: GcpIcon, Git: GitIcon, Docker: DockerIcon, Jenkins: JenkinsIcon, Kubeflow: KubeflowIcon, Airflow: AirflowIcon, Mlflow: MlflowIcon, Wandb: WandbIcon, IbmCloud: IbmCloudIcon,
    Database, Spark: SparkIcon, Hadoop: HadoopIcon, Sql: SqlIcon, MongoDb: MongoDbIcon, Faiss: FaissIcon, Chroma: ChromaIcon, Redis: RedisIcon, Qdrant: QdrantIcon,
    Sigma, Calculus: CalculusIcon, TimeSeries: TimeSeriesIcon, Statistics: StatisticsIcon, Dsa: DsaIcon, LinearAlgebra: LinearAlgebraIcon,
    // Add default icon if needed
    Default: Zap, // Changed default to Zap
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
      // Ensure iconName exists and is a valid key in iconMap, otherwise use Default
      return (iconName && iconName in iconMap) ? iconMap[iconName] : iconMap['Default'];
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
                             className="flex flex-col items-center text-center p-2 rounded-lg transition-colors duration-200 hover:bg-accent/10 w-16" // Fixed width for consistency
                             whileHover="hover"
                             whileTap="tap"
                             title={skill.name} // Add tooltip on hover
                           >
                             <motion.div variants={iconVariants} className="w-7 h-7 flex items-center justify-center mb-1">
                               <SkillIcon />
                             </motion.div>
                             <span className="text-xs md:text-sm font-medium text-foreground truncate w-full">{skill.name}</span> {/* Truncate long names */}
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
