let callCount = 0;
let lastReset = Date.now();

const MAX_CALLS_PER_DAY = parseInt(process.env.MAX_API_CALLS_PER_DAY || 500);

function incrementCallCount() {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  // Reset daily
  if (now - lastReset > oneDay) {
    callCount = 0;
    lastReset = now;
  }

  callCount++;
}

function canMakeCall() {
  return callCount < MAX_CALLS_PER_DAY;
}

function getUsageStats() {
  return {
    callCount,
    max: MAX_CALLS_PER_DAY,
    remaining: MAX_CALLS_PER_DAY - callCount,
    resetIn: 24 * 60 * 60 * 1000 - (Date.now() - lastReset)
  };
}

module.exports = {
  incrementCallCount,
  canMakeCall,
  getUsageStats
};
