const router = require("express").Router();
const Message = require("../models/Message");  // Ensure the correct model is used

router.post("/", async (req, res) => {
    const { conversationId, senderId, text } = req.body;
    
    const newMessage = new Message({
        conversationId,
        senderId,
        text,
    });

    try {
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ message: error.message });
    }
});


router.get("/:conversationId", async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId : req.params.conversationId,
        });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
})

module.exports = router;
