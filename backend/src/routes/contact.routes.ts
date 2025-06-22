import express from 'express';
import {
  getContacts,
  getContact,
  createContact,
  updateContactStatus,
  deleteContact,
  getContactStats,
} from '../controllers/contact.controller';

const router = express.Router();

// Admin routes (protected)
router.get('/', getContacts);
router.get('/stats', getContactStats);
router.get('/:id', getContact);
router.put('/:id/status', updateContactStatus);
router.delete('/:id', deleteContact);

// Public route (for contact form)
router.post('/', createContact);

export default router; 