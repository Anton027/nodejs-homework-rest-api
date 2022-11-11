const express = require('express');
const { tryCatchWrapper } = require('../../helpers')
const router = express.Router();
const contacts = require('../../models/contacts');

router.get('/', tryCatchWrapper(contacts.getAll));

router.post('/', tryCatchWrapper(contacts.createContact));

router.delete('/:contactId', tryCatchWrapper(contacts.deleteById));

router.put('/:contactId', tryCatchWrapper(contacts.updateById));

router.get('/:contactId', tryCatchWrapper(contacts.findOneById));

router.patch('/:contactId/favorite', tryCatchWrapper(contacts.updateStatusContact));

module.exports = router;
