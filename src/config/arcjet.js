import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import { ENV } from "./env.js";

// initialize arcjet with security settings
export const aj = arcjet({
  key: ENV.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    // protects from common attacks like SQL injection, XSS, and CSRF
    shield({ mode: "LIVE" }),

    // block all bots except search engine
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),

    // rate limit requests to prevent abuse
    tokenBucket({
      mode: "LIVE",
      refillRate: 10, // refill rate per minute
      interval: 10, // refill interval in seconds
      capacity: 15, // max requests per minute
    }),
  ],
});
