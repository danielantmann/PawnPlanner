import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';

import { getDashboardToday } from '../../controllers/dashboards/getDashboardToday';
import { getDashboardWeekly } from '../../controllers/dashboards/getDashboardWeekly';
import { getDashboardMonthly } from '../../controllers/dashboards/getDashboardMonthly';
import { getDashboardYearly } from '../../controllers/dashboards/getDashboardYearly';
import { compareDashboardPeriods } from '../../controllers/dashboards/compareDashboardPeriods';

/**
 * @openapi
 * tags:
 *   - name: Dashboards
 *     description: Dashboard statistics and analytics
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     DashboardPeriodStats:
 *       type: object
 *       properties:
 *         income:
 *           type: number
 *         appointments:
 *           type: number
 *         completed:
 *           type: number
 *         cancelled:
 *           type: number
 *         noShow:
 *           type: number
 *         durationMinutes:
 *           type: number
 *         revenuePerHour:
 *           type: number
 *         ticketAverage:
 *           type: number
 *         topService:
 *           type: string
 *           nullable: true
 *
 *     DashboardWeeklyStats:
 *       allOf:
 *         - $ref: '#/components/schemas/DashboardPeriodStats'
 *         - type: object
 *           properties:
 *             activity:
 *               type: array
 *               items:
 *                 type: number
 *
 *     DashboardComparison:
 *       type: object
 *       properties:
 *         from:
 *           $ref: '#/components/schemas/DashboardPeriodStats'
 *         to:
 *           $ref: '#/components/schemas/DashboardPeriodStats'
 *         differenceAbsolute:
 *           type: number
 *         differencePercentage:
 *           type: number
 */

/**
 * @openapi
 * /dashboards/today:
 *   get:
 *     summary: Get today's dashboard statistics
 *     tags:
 *       - Dashboards
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardPeriodStats'
 */

/**
 * @openapi
 * /dashboards/weekly:
 *   get:
 *     summary: Get weekly dashboard statistics
 *     tags:
 *       - Dashboards
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weekly statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardWeeklyStats'
 */

/**
 * @openapi
 * /dashboards/monthly:
 *   get:
 *     summary: Get monthly dashboard statistics
 *     tags:
 *       - Dashboards
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardPeriodStats'
 */

/**
 * @openapi
 * /dashboards/yearly:
 *   get:
 *     summary: Get yearly dashboard statistics
 *     tags:
 *       - Dashboards
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Yearly statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardPeriodStats'
 */

/**
 * @openapi
 * /dashboards/compare:
 *   get:
 *     summary: Compare two date ranges
 *     tags:
 *       - Dashboards
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromStart
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: fromEnd
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: toStart
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: toEnd
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Comparison statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardComparison'
 */

const router = Router();

router.use(authMiddleware);

router.get('/today', getDashboardToday);
router.get('/weekly', getDashboardWeekly);
router.get('/monthly', getDashboardMonthly);
router.get('/yearly', getDashboardYearly);
router.get('/compare', compareDashboardPeriods);

export default router;
