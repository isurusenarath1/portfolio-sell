import { Request, Response } from 'express';
import Contact, { IContact } from '../models/contact.model';

// Get all contacts with pagination and filtering
export const getContacts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const skip = (page - 1) * limit;
    
    let query: any = {};
    
    // Filter by status
    if (status && ['unread', 'read', 'replied'].includes(status)) {
      query.status = status;
    }
    
    // Search in name, email, subject, or message
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      contacts,
      pagination: {
        currentPage: page,
        totalPages,
        totalContacts: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error in getContacts:', error);
    res.status(500).json({ message: 'Error fetching contacts' });
  }
};

// Get a single contact by ID
export const getContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (error) {
    console.error('Error in getContact:', error);
    res.status(500).json({ message: 'Error fetching contact' });
  }
};

// Create a new contact (for public contact form)
export const createContact = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const contact = new Contact({
      name,
      email,
      subject,
      message,
      status: 'unread'
    });
    
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    console.error('Error in createContact:', error);
    res.status(500).json({ message: 'Error creating contact' });
  }
};

// Update contact status
export const updateContactStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['unread', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (error) {
    console.error('Error in updateContactStatus:', error);
    res.status(500).json({ message: 'Error updating contact status' });
  }
};

// Delete a contact
export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error in deleteContact:', error);
    res.status(500).json({ message: 'Error deleting contact' });
  }
};

// Get contact statistics
export const getContactStats = async (req: Request, res: Response) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const unreadContacts = await Contact.countDocuments({ status: 'unread' });
    const readContacts = await Contact.countDocuments({ status: 'read' });
    const repliedContacts = await Contact.countDocuments({ status: 'replied' });
    
    // Get recent contacts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentContacts = await Contact.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });
    
    res.json({
      total: totalContacts,
      unread: unreadContacts,
      read: readContacts,
      replied: repliedContacts,
      recent: recentContacts
    });
  } catch (error) {
    console.error('Error in getContactStats:', error);
    res.status(500).json({ message: 'Error fetching contact statistics' });
  }
}; 