const express = require('express');

const router = express.Router()

// import routes
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const projectRoutes = require('./projectRoutes');
const bookRoutes = require('./bookRoutes');
const categoryRoutes = require('./categoryRoutes');

//routes
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/posts', postRoutes)
router.use('/projects', projectRoutes)
router.use('/books', bookRoutes)
router.use('/categories', categoryRoutes)

module.exports = router