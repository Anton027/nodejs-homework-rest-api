// const express = require('express')
// const logger = require('morgan')
// const cors = require('cors')

// const contactsRouter = require('./routes/api/contacts')

// const app = express()

// const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

// app.use(logger(formatsLogger))
// app.use(cors())
// app.use(express.json())

// app.use('/api/contacts', contactsRouter)

// app.use((req, res) => {
//   res.status(404).json({ message: 'Sorry, page not found' })
// })

// app.use((err, req, res, next) => {
//   res.status(500).json({ message: err.message })
// })

// module.exports = app

//   Home work 03 mangoDb

const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

const contactsRouter = require('./routes/api/contacts')

app.use('/api/contacts', contactsRouter);

app.use('./routes/api', (req,res) => {
  return res.status(404).json({
    message: 'Sorry, page not found'
  })
})

app.use((err, req, res, next) => {
  console.error(`App error: ${err.message}, ${err.name}`);

  if (err.name === 'validationError') {
    return res.status(400).json({
      message: err.message
    })
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: "Internal server error!"
  });
});

module.exports = {
  app,
}