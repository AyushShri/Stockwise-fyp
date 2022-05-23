const checkAuth = require('../middleware/check-auth');
const express = require('express');
const router = express.Router();

const DashboardControllers = require('../controllers/DashboardControllers');

router.get('/getDashboard',checkAuth,DashboardControllers.getDashboard)
router.post('/getStockInformation',checkAuth,DashboardControllers.getStockInformation)
router.get('/getAlertType',checkAuth,DashboardControllers.getAlertType)
router.get('/getSubAlertType',checkAuth,DashboardControllers.getSubAlertType)
router.post('/storeAlertData',checkAuth,DashboardControllers.insertAlerts)
router.post('/updateAlertData',checkAuth,DashboardControllers.updateAlerts)
router.post('/deleteAlertData',checkAuth,DashboardControllers.deleteAlerts)
router.post('/getAllAlertData',checkAuth,DashboardControllers.getAllAlerts)
router.post('/getAlertData',checkAuth,DashboardControllers.getAlerts)
router.post('/checkPrefernces',checkAuth,DashboardControllers.checkPrefernces)
router.post('/disablePrefernces',checkAuth,DashboardControllers.disablePrefernces)

module.exports = router; 