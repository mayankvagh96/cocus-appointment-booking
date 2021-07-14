import logger from "pino";
import dayjs from "dayjs";

const log = logger({
  prettyPrint: true,
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`
}, logger.destination("./cocus-appointment-booking-api-server.log"));

export default log;
