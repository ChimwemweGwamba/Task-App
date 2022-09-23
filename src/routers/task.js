const express = require('express')
const router = new express.Router()
const Task = require('../models/task')


// Add Task
router.post('/tasks', async (req, res)  => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


// Get All Tasks
router.get('/tasks', async (req, res)  => {
    
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    }
    catch (e) {
        res.status(500).send()
    }
})


// Get Task By ID
router.get('/tasks/:id', async (req, res)  => {
    const _id = req.params.id

    try {
        const task =  await Task.findById(_id)

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    }
    catch (e) {
        res.status(500).send()
    }
})


// Update task
router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)
    )

    // Check if update contains required fields
    if (!isValidOperation) {
        return res.status(400).send({ error: 'invalid updates!'})
    }

    try {
        const task = await Task.findById(req.params.id)
        
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        
        if (!task) {
            return res.status(404).send()
        }
 
        res.send(task)
    }
    catch (e) {
        res.status(400).send(e)
    }
})


// Delete task
router.delete('/tasks/:id', async (req,res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router