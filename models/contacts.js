const { createNotFoundHttpError } = require("../helpers");
const { Contact } = require('../models/contact.model');

async function getAll(req, res, next) {
  const contacts = await Contact.find();

  res.json({
    contacts
  });
};

async function createContact(req, res, next) {
  if (!req.body.favorite) {
    req.body.favorite = false;
  }
  const newContact = Contact.create(req.body);
  if (newContact) {
    return res.status(201).json({
    message: "contact created"
  })
  }
  return next(createNotFoundHttpError());
};

async function deleteById(req, res, next) {
  const { contactId } = req.params;
  const contact = Contact.findById({ _id: contactId })
  if (contact) {
    await Contact.findByIdAndDelete({
    _id: contactId
  });
  return res.status(200).json({
    message: "contact deleted"
  });
  }
  return next(createNotFoundHttpError());
}

async function updateById(req, res, next) {
  const { contactId } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate({
    _id: contactId
  }, req.body, {new:true});
  return res.status(200).json({ contacts: updatedContact })
};

async function findOneById(req, res, next) {
  const { contactId } = req.params;

  const contact = await Contact.findOne({ _id: contactId, });
  return res.json({ contacts: contact });
}

async function updateStatusContact(req, res, next) {
  const { contactId } = req.params;
  const body = req.params.favorite;

  const newContact = await Contact.findByIdAndUpdate(
    { _id: contactId },
    { body },
    { new: true }
  )
  if (newContact) {
    return res.status(201).json({ contacts:newContact })
  }
  return next(createNotFoundHttpError());
}

module.exports = {
  getAll,
  createContact,
  deleteById,
  updateById,
  findOneById,
  updateStatusContact
}