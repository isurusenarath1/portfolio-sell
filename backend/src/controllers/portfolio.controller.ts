import { Request, Response } from 'express';
import Portfolio, { IPortfolio } from '../models/portfolio.model';

export const getPortfolio = async (req: Request, res: Response) => {
  try {
    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      // If no portfolio exists, create one with default values
      const defaultPortfolio = new Portfolio({
        hero: {
          name: "Your Name",
          role: "Your Role",
          subtitle: "Your Subtitle",
          welcomeMessage: "Welcome to my portfolio",
          image: "https://res.cloudinary.com/doxkkbljh/image/upload/v1/portfolio/placeholder"
        }
      });
      await defaultPortfolio.save();
      return res.json(defaultPortfolio);
    }
    res.json(portfolio);
  } catch (error) {
    console.error('Error in getPortfolio:', error);
    res.status(500).json({ message: 'Error fetching portfolio data' });
  }
};

export const createPortfolio = async (req: Request, res: Response) => {
  try {
    const existingPortfolio = await Portfolio.findOne();
    if (existingPortfolio) {
      return res.status(400).json({ message: 'Portfolio already exists' });
    }

    const portfolio = new Portfolio(req.body);
    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (error) {
    console.error('Error in createPortfolio:', error);
    res.status(500).json({ message: 'Error creating portfolio' });
  }
};

export const updatePortfolio = async (req: Request, res: Response) => {
  try {
    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Update only the provided fields
    if (req.body.hero) {
      portfolio.hero = {
        ...portfolio.hero,
        ...req.body.hero
      };
    }

    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    console.error('Error in updatePortfolio:', error);
    res.status(500).json({ message: 'Error updating portfolio' });
  }
};

export const deletePortfolio = async (req: Request, res: Response) => {
  try {
    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    await portfolio.deleteOne();
    res.json({ message: 'Portfolio deleted successfully' });
  } catch (error) {
    console.error('Error in deletePortfolio:', error);
    res.status(500).json({ message: 'Error deleting portfolio' });
  }
};

export const updateSkills = async (req: Request, res: Response) => {
  try {
    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const { frontend, backend, tools } = req.body;

    portfolio.skills = {
      frontend: frontend || portfolio.skills.frontend,
      backend: backend || portfolio.skills.backend,
      tools: tools || portfolio.skills.tools,
    };

    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    console.error('Error in updateSkills:', error);
    res.status(500).json({ message: 'Error updating skills' });
  }
};

// Education Controllers
export const addEducation = async (req: Request, res: Response) => {
  try {
    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    const newEducation = { ...req.body, id: new Date().getTime() };
    portfolio.education.push(newEducation);
    await portfolio.save();
    res.status(201).json(portfolio.education);
  } catch (error) {
    console.error('Error in addEducation:', error);
    res.status(500).json({ message: 'Error adding education' });
  }
};

export const updateEducation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    const eduIndex = portfolio.education.findIndex((edu) => edu.id.toString() === id);
    if (eduIndex === -1) {
      return res.status(404).json({ message: 'Education entry not found' });
    }
    portfolio.education[eduIndex] = { ...portfolio.education[eduIndex], ...req.body };
    await portfolio.save();
    res.json(portfolio.education);
  } catch (error) {
    console.error('Error in updateEducation:', error);
    res.status(500).json({ message: 'Error updating education' });
  }
};

export const deleteEducation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    const initialLength = portfolio.education.length;
    portfolio.education = portfolio.education.filter((edu) => edu.id.toString() !== id);
    if (portfolio.education.length === initialLength) {
      return res.status(404).json({ message: 'Education entry not found' });
    }
    await portfolio.save();
    res.json(portfolio.education);
  } catch (error) {
    console.error('Error in deleteEducation:', error);
    res.status(500).json({ message: 'Error deleting education' });
  }
};

// Experience Controllers
export const addExperience = async (req: Request, res: Response) => {
  try {
    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    const newExperience = { ...req.body, id: new Date().getTime() };
    portfolio.experience.push(newExperience);
    await portfolio.save();
    res.status(201).json(portfolio.experience);
  } catch (error) {
    console.error('Error in addExperience:', error);
    res.status(500).json({ message: 'Error adding experience' });
  }
};

export const updateExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    const expIndex = portfolio.experience.findIndex((exp) => exp.id.toString() === id);
    if (expIndex === -1) {
      return res.status(404).json({ message: 'Experience entry not found' });
    }
    portfolio.experience[expIndex] = { ...portfolio.experience[expIndex], ...req.body };
    await portfolio.save();
    res.json(portfolio.experience);
  } catch (error) {
    console.error('Error in updateExperience:', error);
    res.status(500).json({ message: 'Error updating experience' });
  }
};

export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    const initialLength = portfolio.experience.length;
    portfolio.experience = portfolio.experience.filter((exp) => exp.id.toString() !== id);
    if (portfolio.experience.length === initialLength) {
      return res.status(404).json({ message: 'Experience entry not found' });
    }
    await portfolio.save();
    res.json(portfolio.experience);
  } catch (error) {
    console.error('Error in deleteExperience:', error);
    res.status(500).json({ message: 'Error deleting experience' });
  }
};

// Project Controllers
export const addProject = async (req: Request, res: Response) => {
  try {
    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    const newProject = { ...req.body, id: new Date().getTime() };
    portfolio.projects.push(newProject);
    await portfolio.save();
    res.status(201).json(portfolio.projects);
  } catch (error) {
    console.error('Error in addProject:', error);
    res.status(500).json({ message: 'Error adding project' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    const projIndex = portfolio.projects.findIndex((p) => p.id.toString() === id);
    if (projIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }
    portfolio.projects[projIndex] = { ...portfolio.projects[projIndex], ...req.body };
    await portfolio.save();
    res.json(portfolio.projects);
  } catch (error) {
    console.error('Error in updateProject:', error);
    res.status(500).json({ message: 'Error updating project' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    const initialLength = portfolio.projects.length;
    portfolio.projects = portfolio.projects.filter((p) => p.id.toString() !== id);
    if (portfolio.projects.length === initialLength) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await portfolio.save();
    res.json(portfolio.projects);
  } catch (error) {
    console.error('Error in deleteProject:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
}; 