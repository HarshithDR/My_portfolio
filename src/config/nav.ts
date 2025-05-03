
import {
  Home,
  UserCircle,
  Wrench,
  Briefcase,
  FolderKanban,
  Award,
  Newspaper, // Changed from Rss
  Mail,
  Github,
  Linkedin,
  Rss, // Keep Rss for social links if needed
  FileText, // Example: Using FileText for Blogs if Newspaper is used elsewhere
  GraduationCap, // Added Education icon
} from 'lucide-react';

// Ensure all page routes start with /
export const navItems = [
  { name: 'Home', href: '/', icon: Home }, // Root path
  { name: 'About', href: '/about', icon: UserCircle },
  { name: 'Skills', href: '/skills', icon: Wrench },
  { name: 'Experience', href: '/experience', icon: Briefcase },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Education', href: '/education', icon: GraduationCap }, // Added Education
  { name: 'Achievements', href: '/achievements', icon: Award },
  { name: 'Blogs', href: '/blog', icon: FileText }, // Use FileText or Newspaper
  { name: 'Contact', href: '/contact', icon: Mail },
];

export const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/HarshithDR', icon: Github, label: 'GitHub Profile'},
    { name: 'LinkedIn', href: 'https://linkedin.com/in/harshith-deshalli-ravi', icon: Linkedin, label: 'LinkedIn Profile'},
    { name: 'Medium', href: 'https://medium.com/@harshithdr10', icon: Rss, label: 'Medium Blog'}, // Keep Rss for Medium link
    { name: 'Devpost', href: 'https://devpost.com/harshithdr10', icon: Award, label: 'Devpost Profile'}, // Use Award icon
    { name: 'Email', href: 'mailto:harshithdr10@gmail.com', icon: Mail, label: 'Send Email'},
];
