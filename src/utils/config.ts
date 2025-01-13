import dotenv from "dotenv";
dotenv.config();

const Config = {
  sentryDSN: process.env.SENTRY_DSN,
  serverName: process.env.SERVER_NAME,
  serverPort: Number(process.env.PORT) || 3000, // Ensure it's a number and provide a default
  environment: process.env.SERVER_ENVIRONMENT as string,
  providusCardURL: process.env.PROVIDUS_CARD_BASE_URL as string,
  providusApiVersionURL: process.env.PROVIDUS_CARD_API_VERSION as string,
};

export default Config;