import mongoose, { Schema, Document } from 'mongoose';

export interface IPortfolio extends Document {
  hero: {
    name: string;
    role: string;
    subtitle: string;
    welcomeMessage: string;
    image: string;
  };
  skills: {
    frontend: string[];
    backend: string[];
    tools: string[];
  };
  education: Array<{
    id: number;
    degree: string;
    institution: string;
    year: string;
    description: string;
  }>;
  experience: Array<{
    id: number;
    title: string;
    company: string;
    period: string;
    responsibilities: string[];
  }>;
  projects: Array<{
    id: number;
    title: string;
    description: string;
    image: string;
    techStack: string[];
    liveUrl: string;
    githubUrl: string;
  }>;
  settings: {
    tabName: string;
    tabImage: string;
    logoText: string;
    cvUrl: string;
    contact: {
      email: string;
      phone: string;
      address: string;
    };
    social: {
      github: string;
      linkedin: string;
    };
  };
}

const PortfolioSchema: Schema = new Schema({
  hero: {
    name: { type: String, required: true },
    role: { type: String, required: true },
    subtitle: { type: String, required: true },
    welcomeMessage: { type: String, required: true },
    image: { type: String, required: true }
  },
  skills: {
    frontend: [{ type: String }],
    backend: [{ type: String }],
    tools: [{ type: String }]
  },
  education: [{
    id: { type: Number, required: true },
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    year: { type: String, required: true },
    description: { type: String, required: true }
  }],
  experience: [{
    id: { type: Number, required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    period: { type: String, required: true },
    responsibilities: [{ type: String }]
  }],
  projects: [{
    id: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    techStack: [{ type: String }],
    liveUrl: { type: String, required: true },
    githubUrl: { type: String, required: true }
  }],
  settings: {
    tabName: { type: String, default: "My Portfolio" },
    tabImage: { type: String, default: "/placeholder-logo.svg" },
    logoText: { type: String, default: "Portfolio" },
    cvUrl: { type: String, default: "" },
    contact: {
      email: { type: String, default: "contact@example.com" },
      phone: { type: String, default: "+1 234 567 890" },
      address: { type: String, default: "City, Country" }
    },
    social: {
      github: { type: String, default: "https://github.com" },
      linkedin: { type: String, default: "https://linkedin.com" }
    }
  }
}, {
  timestamps: true
});

export default mongoose.model<IPortfolio>('Portfolio', PortfolioSchema); 