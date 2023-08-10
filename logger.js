import pino from "pino"
import "dotenv/config"

const myLevels = {
    notice: 35
}

const logLevel = process.env.PINO_LOG_LEVEL || "info"

const transport = pino.transport({
    targets: [{
        level: logLevel,
        target: 'pino/file', // logs to the standard output by default
    }, {
        level: logLevel,
        target: 'pino/file', 
        options: { destination: `${process.cwd()}/app.log` }
    }]
});

const logger = pino(
    {
        level: "trace",
        customLevels: myLevels,
        formatters: {
            bindings: (bindings) => {
                //return {node_ver: process.version}
            }
        },
        timestamp: pino.stdTimeFunctions.isoTime,
    },
    transport
    // pino.destination(`${process.cwd()}/app.log`)
)

export { logger }


