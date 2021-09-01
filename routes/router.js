const express = require('express');

const router = express.Router()

// import routes
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const briefRoutes = require('./briefRoutes');
const clientRoutes = require('./clientRoutes');
const projectRoutes = require('./projectRoutes');
const categoryRoutes = require('./categoryRoutes');

//routes
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/posts', postRoutes)
router.use('/briefs', briefRoutes)
router.use('/clients', clientRoutes)
router.use('/projects', projectRoutes)
router.use('/categories', categoryRoutes)

module.exports = router