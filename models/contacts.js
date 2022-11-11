// const fs = require('fs/promises')
// const path = require("path");

// const contactsPath = path.join(
//   __dirname,
//   "./contacts.json"
// );

// const listContacts = async () => {
//   const contacts = fs.readFile(contactsPath);
//   return JSON.parse(contacts);
// }

// const getContactById = async (contactId) => {
//   const contacts = await listContacts();
//   const contact = contacts.find(
//     item => item.id === contactId.toString());
//   return contact;
// }

// const removeContact = async (contactId) => {
//   const contacts = await listContacts();
//   const contact = await getContactById(contactId);

//   if (!contact) {
//     return null;
//   }
//   const deleteContact = contacts.filter(
//     (item) => item.id !== contactId.toString());
//   await fs.writeFile(
//     contactsPath,
//     JSON.stringify(deleteContact)
//   );
//   return contact;
// }

// const addContact = async (body) => {
//   const contacts = await listContacts();
//   contacts.push(body);
//   await fs.writeFile(contactsPath,
//     JSON.stringify(contacts))
// }

// const updateContact = async (contactId, body) => {
//   const newContact = {
//     contactId,
//     name: body.name,
//     email: body.email,
//     phone: body.phone,
//   };
//   const deletedContact = await removeContact(
//     contactId
//   );
//   if (!deletedContact) {
//     return;
//   }
//   await addContact(newContact);
//   return newContact;
// }

// const updateStatusContact = async (contactId, body) => {

// }
// module.exports = {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
//   updateStatusContact
// }

// -----nhw03
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