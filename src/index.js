const polka = require('polka');
const axios = require('axios');
const prometheus = require('prom-client');
require('dotenv').config();

const nodeLastBlockUri = new URL('/blocks/best', process.env.NODE_URL).href
const nodeHealthcheckPort = process.env.NODE_HEALTHCHECK_PORT
const nodeHealthcheckToleranceInSeconds = process.env.NODE_HEALTHCHECK_TOLERANCE_IN_SECONDS

const register = new prometheus.Registry();

const lastBlockTimestampGauge = new prometheus.Gauge({
    name: 'node_last_block_timestamp',
    help: 'Timestamp of the last block'
});

const secondsSinceLastBlockGauge = new prometheus.Gauge({
    name: 'node_seconds_since_last_block',
    help: 'Seconds since the last block'
});

const healthcheckStatusGauge = new prometheus.Gauge({
    name: 'node_healthcheck_status',
    help: 'Healthcheck status of the node'
});

register.registerMetric(lastBlockTimestampGauge);
register.registerMetric(secondsSinceLastBlockGauge);
register.registerMetric(healthcheckStatusGauge);

function writeLog(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
}

async function requestLogger(req, res, next) {
    writeLog(`Request - ${req.method}: ${req.url}`);
    next();
}

async function responseLogger(req, res, next) {
    writeLog(`Respond - ${res.statusCode}: ${JSON.stringify(req.node)}`)
    next();
}

async function healthChecker(req, res, next) {
    try {
        req.timestamp = await axios.get(nodeLastBlockUri)
            .then(response => {
                const lastBlockTimestamp = response.data.timestamp;
                const secondsSinceLastBlock = Math.floor(Date.now() / 1000) - lastBlockTimestamp;
                const isHealthy = Math.abs(secondsSinceLastBlock) < nodeHealthcheckToleranceInSeconds
                req.node = {
                    lastBlockTimestamp: lastBlockTimestamp,
                    secondsSinceLastBlock: secondsSinceLastBlock,
                    isHealthy: isHealthy
                };
                lastBlockTimestampGauge.set(lastBlockTimestamp);
                secondsSinceLastBlockGauge.set(secondsSinceLastBlock);
                healthcheckStatusGauge.set(isHealthy ? 1 : 0);
            });
        next();
    } catch (error) {
        writeLog(`Error - ${error}`);
        res.statusCode = 500;
        res.end(`Error: ${error}`);
    }
}

async function writeMetrics(req, res) {
    const metrics = [
        `node_last_block_timestamp ${req.node.lastBlockTimestamp.toString()}`,
        `node_seconds_since_last_block ${req.node.secondsSinceLastBlock.toString()}`,
        `node_healthcheck_status ${req.node.isHealthy ? '1' : '0'}`
    ].join('\n');

    res.setHeader('Content-Type', register.contentType);
    res.end(metrics);
}

polka()
    .use(requestLogger, healthChecker)
    .get('/healthcheck', (req, res) => {
        if (!req.node.isHealthy) {
            res.statusCode = 500;
        }
        res.end(JSON.stringify(req.node));
    })
    .get('/metrics', async (req, res) => {
        try {
            await writeMetrics(req, res);
        } catch (error) {
            res.statusCode = 500;
            res.end(`Error: ${error}`);
        }
    })
    .use(responseLogger)
    .listen(nodeHealthcheckPort, () => {
        writeLog(`Environment configuration:`)
        writeLog(`  NODE_LAST_BLOCK_URI: ${nodeLastBlockUri}`);
        writeLog(`  NODE_HEALTHCHECK_PORT: ${nodeHealthcheckPort}`);
        writeLog(`  NODE_HEALTHCHECK_TOLERANCE_IN_SECONDS: ${nodeHealthcheckToleranceInSeconds}`);
        writeLog(`Running - http://localhost:${nodeHealthcheckPort}`);
    });
