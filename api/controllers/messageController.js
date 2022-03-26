const Message = require('../models/Message')

// Add message
exports.messageCreateOne = async (req, res) => {
  const newMessage = new Message(req.body)

  try {
    const savedMessage = await newMessage.save()
    res.status(200).send(savedMessage)
  } catch (err) {
    res.status(500).send(err)
  }
}

// Get message
exports.messageGetByConvId = async (req, res) => {
  try {
    const message = await Message.find({ conversationId: req.params.conversationId })
    res.status(200).send(message)
  } catch (err) {
    res.status(500).send(err)
  }
}