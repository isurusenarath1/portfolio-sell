import { Request, Response } from 'express';
import Portfolio, { IPortfolio } from '../models/portfolio.model';

export const getPortfolio = async (req: Request, res: Response) => {
  try {
    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolio', error });
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
    res.status(500).json({ message: 'Error creating portfolio', error });
  }
};

export const updatePortfolio = async (req: Request, res: Response) => {
  try {
    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    Object.assign(portfolio, req.body);
    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error updating portfolio', error });
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
    res.status(500).json({ message: 'Error deleting portfolio', error });
  }
}; 