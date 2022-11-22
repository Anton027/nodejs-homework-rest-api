const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const contactsRouter = require('./routes/api/contacts');
const authRouter = require('./routes/api/auth');
const userRouter = require('./routes/api/user');


app.use(morgan('dev'));
app.use(cors());
app.use(express.json());



app.use('/api/auth', authRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/user', userRouter)

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

  // if (err.message.includes('duplicate key error collection')) {
  //   throw new Conflict('User with this email already registered')
  // }

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