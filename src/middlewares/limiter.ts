import ratelimit from "express-rate-limit";

const limiter = ratelimit({
  windowMs: 30 * 1000,
  max: 10,
  message: "Too many request, please repeat in a moment",
});

export default limiter;
