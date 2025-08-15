import { aj } from "../config/arcjet";

// Arcjet middleware for rate limiting, bot detection, and security
export const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // number of requests made
    });

    // Check if the request is denied
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({
          error: "Too Many Requests",
          message: "Rate limit exceeded. Please try again later.",
        });
      } else if (decision.reason.isBot()) {
        res.status(403).json({
          error: "Bot Access Denied",
          message: "Automated requests are not allowed.",
        });
      } else {
        res.status(403).json({
          error: "Forbidden",
          message: "Access denied by security policy.",
        });
      }
    }

    // spoofed bots
    if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
      res.status(403).json({
        error: "Spoofed Bot Detected",
        message: "Malicious activity detected.",
      });
    }

    next();
  } catch (error) {
    console.error("Arcjet Middleware Error:", error);
    next();
  }
};
