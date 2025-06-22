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
    res.status(500).json({ message: 'Error deleting education' });
  }
}; 