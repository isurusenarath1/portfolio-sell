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
  addExperience,
  updateExperience,
  deleteExperience,
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

// Experience routes
router.post('/experience', addExperience);
router.put('/experience/:id', updateExperience);
router.delete('/experience/:id', deleteExperience);

export default router; 