import express from 'express';
import {
  getPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  updateSkills,
  addEducation,
  updateEducation,
  deleteEducation,
} from '../controllers/portfolio.controller';

const router = express.Router();

router.get('/', getPortfolio);
router.post('/', createPortfolio);
router.put('/', updatePortfolio);
router.delete('/', deletePortfolio);
router.put('/skills', updateSkills);

// Education routes
router.post('/education', addEducation);
router.put('/education/:id', updateEducation);
router.delete('/education/:id', deleteEducation);

export default router; 