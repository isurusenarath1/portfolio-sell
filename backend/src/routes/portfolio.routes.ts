import express from 'express';
import {
  getPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  updateSkills
} from '../controllers/portfolio.controller';

const router = express.Router();

router.get('/', getPortfolio);
router.post('/', createPortfolio);
router.put('/', updatePortfolio);
router.delete('/', deletePortfolio);
router.put('/skills', updateSkills);

export default router; 