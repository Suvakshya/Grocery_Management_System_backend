import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// ============================================
// ALGORITHM 1: Moving Average (Time Series Analysis)
// ============================================
const calculateMovingAverage = (data, windowSize = 7) => {
  // Moving Average Algorithm: SMA = (sum of prices in window) / windowSize
  // Time Complexity: O(n)
  // Space Complexity: O(n)
  const movingAverages = [];
  for (let i = 0; i <= data.length - windowSize; i++) {
    const window = data.slice(i, i + windowSize);
    const sum = window.reduce((acc, val) => acc + val.value, 0);
    movingAverages.push({
      date: data[i + Math.floor(windowSize / 2)].date,
      value: sum / windowSize
    });
  }
  return movingAverages;
};

// ============================================
// ALGORITHM 2: Exponential Smoothing (Forecasting)
// ============================================
const exponentialSmoothing = (data, alpha = 0.3) => {
  // Exponential Smoothing Algorithm: Ft = α * At-1 + (1-α) * Ft-1
  // where Ft is forecast, At is actual value, α is smoothing factor
  // Time Complexity: O(n)
  // Space Complexity: O(n)
  const smoothed = [];
  if (data.length === 0) return smoothed;
  
  // Initialize with first value
  smoothed.push({
    date: data[0].date,
    value: data[0].value
  });
  
  // Apply exponential smoothing
  for (let i = 1; i < data.length; i++) {
    const previousSmoothed = smoothed[i - 1].value;
    const currentActual = data[i].value;
    const smoothedValue = alpha * currentActual + (1 - alpha) * previousSmoothed;
    
    smoothed.push({
      date: data[i].date,
      value: smoothedValue
    });
  }
  
  return smoothed;
};

// ============================================
// ALGORITHM 3: Linear Regression (Trend Analysis)
// ============================================
const linearRegression = (data) => {
  // Linear Regression Algorithm: y = mx + b
  // where m = slope, b = intercept
  // Using Least Squares Method
  // Time Complexity: O(n)
  // Space Complexity: O(1)
  
  const n = data.length;
  if (n === 0) return { slope: 0, intercept: 0, rSquared: 0 };
  
  // Calculate means
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  
  for (let i = 0; i < n; i++) {
    const x = i + 1; // Using index as x (time)
    const y = data[i].value;
    
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }
  
  const meanX = sumX / n;
  const meanY = sumY / n;
  
  // Calculate slope (m)
  const slope = (sumXY - n * meanX * meanY) / (sumX2 - n * meanX * meanX);
  
  // Calculate intercept (b)
  const intercept = meanY - slope * meanX;
  
  // Calculate R-squared (coefficient of determination)
  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    const x = i + 1;
    const y = data[i].value;
    const yPred = slope * x + intercept;
    
    ssRes += Math.pow(y - yPred, 2);
    ssTot += Math.pow(y - meanY, 2);
  }
  
  const rSquared = 1 - (ssRes / ssTot);
  
  return { slope, intercept, rSquared };
};

// ============================================
// ALGORITHM 4: Seasonal Decomposition
// ============================================
const seasonalDecomposition = (data, period = 7) => {
  // Seasonal Decomposition Algorithm: Y = T + S + R
  // where Y = original series, T = trend, S = seasonal, R = residual
  // Time Complexity: O(n)
  // Space Complexity: O(n)
  
  if (data.length < period * 2) {
    return { seasonal: [], trend: [], residual: [] };
  }
  
  // Step 1: Calculate trend using moving average
  const trend = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(period / 2));
    const end = Math.min(data.length - 1, i + Math.floor(period / 2));
    const window = data.slice(start, end + 1);
    const avg = window.reduce((sum, d) => sum + d.value, 0) / window.length;
    trend.push({ date: data[i].date, value: avg });
  }
  
  // Step 2: Calculate detrended series
  const detrended = data.map((d, i) => ({
    date: d.date,
    value: d.value - trend[i].value
  }));
  
  // Step 3: Calculate seasonal indices
  const seasonal = [];
  const seasonalIndices = new Array(period).fill(0);
  const seasonalCounts = new Array(period).fill(0);
  
  for (let i = 0; i < detrended.length; i++) {
    const seasonIndex = i % period;
    seasonalIndices[seasonIndex] += detrended[i].value;
    seasonalCounts[seasonIndex]++;
  }
  
  // Average seasonal indices
  for (let i = 0; i < period; i++) {
    seasonalIndices[i] = seasonalCounts[i] > 0 
      ? seasonalIndices[i] / seasonalCounts[i] 
      : 0;
  }
  
  // Create seasonal series
  for (let i = 0; i < data.length; i++) {
    seasonal.push({
      date: data[i].date,
      value: seasonalIndices[i % period]
    });
  }
  
  // Step 4: Calculate residuals
  const residual = data.map((d, i) => ({
    date: d.date,
    value: d.value - trend[i].value - seasonal[i].value
  }));
  
  return { seasonal, trend, residual };
};

// ============================================
// ALGORITHM 5: Statistical Measures
// ============================================
const calculateStatistics = (data) => {
  // Statistical Measures: Mean, Median, Mode, Variance, Standard Deviation, Quartiles
  // Time Complexity: O(n log n) due to sorting
  // Space Complexity: O(n)
  
  if (data.length === 0) return null;
  
  const values = data.map(d => d.value).sort((a, b) => a - b);
  const n = values.length;
  
  // Mean (Average)
  const mean = values.reduce((a, b) => a + b, 0) / n;
  
  // Median (Q2)
  const median = n % 2 === 0 
    ? (values[n/2 - 1] + values[n/2]) / 2 
    : values[Math.floor(n/2)];
  
  // Mode (most frequent value)
  const frequency = {};
  let maxFreq = 0;
  let mode = values[0];
  values.forEach(v => {
    frequency[v] = (frequency[v] || 0) + 1;
    if (frequency[v] > maxFreq) {
      maxFreq = frequency[v];
      mode = v;
    }
  });
  
  // Variance and Standard Deviation
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
  const stdDeviation = Math.sqrt(variance);
  
  // Quartiles
  const q1 = values[Math.floor(n * 0.25)];
  const q3 = values[Math.floor(n * 0.75)];
  const iqr = q3 - q1; // Interquartile Range
  
  // Coefficient of Variation
  const cv = (stdDeviation / mean) * 100;
  
  // Skewness (measure of asymmetry)
  let skewness = 0;
  if (stdDeviation > 0) {
    skewness = values.reduce((acc, val) => 
      acc + Math.pow((val - mean) / stdDeviation, 3), 0) / n;
  }
  
  // Kurtosis (measure of tailedness)
  let kurtosis = 0;
  if (stdDeviation > 0) {
    kurtosis = values.reduce((acc, val) => 
      acc + Math.pow((val - mean) / stdDeviation, 4), 0) / n - 3;
  }
  
  return {
    mean,
    median,
    mode,
    variance,
    stdDeviation,
    q1,
    q3,
    iqr,
    cv,
    skewness,
    kurtosis,
    min: values[0],
    max: values[n - 1],
    range: values[n - 1] - values[0]
  };
};

// ============================================
// ALGORITHM 6: Profit Analysis with CAGR
// ============================================
const calculateCAGR = (startValue, endValue, years) => {
  // Compound Annual Growth Rate (CAGR)
  // Formula: CAGR = (End Value / Start Value)^(1/years) - 1
  // Time Complexity: O(1)
  
  if (startValue === 0 || years === 0) return 0;
  return Math.pow(endValue / startValue, 1 / years) - 1;
};

// ============================================
// ALGORITHM 7: Customer Lifetime Value (CLV)
// ============================================
const calculateCLV = (orders, customerId) => {
  // Customer Lifetime Value Algorithm
  // CLV = (Average Order Value) × (Purchase Frequency) × (Customer Lifespan)
  // Time Complexity: O(n)
  
  const customerOrders = orders.filter(o => o.userId === customerId);
  if (customerOrders.length === 0) return 0;
  
  const totalSpent = customerOrders.reduce((sum, o) => sum + o.amount, 0);
  const avgOrderValue = totalSpent / customerOrders.length;
  
  // Calculate purchase frequency (orders per month)
  const dates = customerOrders.map(o => new Date(o.createdAt));
  const firstDate = Math.min(...dates);
  const lastDate = Math.max(...dates);
  const monthsActive = Math.max(1, (lastDate - firstDate) / (1000 * 60 * 60 * 24 * 30));
  const purchaseFrequency = customerOrders.length / monthsActive;
  
  // Assume average customer lifespan of 36 months (3 years)
  const customerLifespan = 36;
  
  return avgOrderValue * purchaseFrequency * customerLifespan;
};

// ============================================
// MAIN CONTROLLER: Get Analytics Dashboard Data
// ============================================
export const getAnalytics = async (req, res) => {
  try {
    const { timeRange = '30days' } = req.query;
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch(timeRange) {
      case '7days':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // Fetch orders
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate('items.product');

    const allOrders = await Order.find().populate('items.product');

    // ============================================
    // 1. Revenue Analysis
    // ============================================
    const dailyRevenue = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.toDateString() === currentDate.toDateString();
      });
      
      const revenue = dayOrders.reduce((sum, o) => sum + o.amount, 0);
      
      dailyRevenue.push({
        date: new Date(currentDate),
        value: revenue
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Apply algorithms
    const movingAverage7 = calculateMovingAverage(dailyRevenue, 7);
    const movingAverage30 = calculateMovingAverage(dailyRevenue, 30);
    const exponentialSmooth = exponentialSmoothing(dailyRevenue, 0.3);
    const regression = linearRegression(dailyRevenue);
    const seasonal = seasonalDecomposition(dailyRevenue, 7);
    const statistics = calculateStatistics(dailyRevenue);

    // ============================================
    // 2. Profit Analysis
    // ============================================
    const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
    
    // Calculate cost (assuming 60% of selling price is cost)
    // You can adjust this based on your actual cost data
    const totalCost = orders.reduce((sum, o) => {
      const orderCost = o.items.reduce((itemSum, item) => {
        const product = item.product;
        const cost = product?.price ? product.price * 0.6 : 0; // 60% of original price
        return itemSum + (cost * item.quantity);
      }, 0);
      return sum + orderCost;
    }, 0);
    
    const grossProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    // ============================================
    // 3. Order Status Analysis
    // ============================================
    const statusCounts = {};
    const paymentStatusCounts = { Paid: 0, Pending: 0 };
    
    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
      if (order.isPaid) {
        paymentStatusCounts.Paid++;
      } else {
        paymentStatusCounts.Pending++;
      }
    });

    // ============================================
    // 4. Payment Method Analysis
    // ============================================
    const paymentMethodCounts = {};
    orders.forEach(order => {
      paymentMethodCounts[order.paymentType] = (paymentMethodCounts[order.paymentType] || 0) + 1;
    });

    // ============================================
    // 5. Product Performance Analysis
    // ============================================
    const productSales = {};
    const productRevenue = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product?._id || 'unknown';
        const productName = item.product?.name || 'Unknown Product';
        
        if (!productSales[productId]) {
          productSales[productId] = { name: productName, quantity: 0, revenue: 0 };
        }
        
        productSales[productId].quantity += item.quantity;
        productSales[productId].revenue += (item.product?.offerPrice || 0) * item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // ============================================
    // 6. Customer Analysis
    // ============================================
    const uniqueCustomers = new Set(orders.map(o => o.userId)).size;
    const ordersPerCustomer = orders.length / (uniqueCustomers || 1);
    const avgOrderValue = totalRevenue / (orders.length || 1);
    
    // Calculate CLV for each customer
    const customerValues = {};
    allOrders.forEach(order => {
      if (!customerValues[order.userId]) {
        customerValues[order.userId] = {
          total: 0,
          orders: []
        };
      }
      customerValues[order.userId].total += order.amount;
      customerValues[order.userId].orders.push(order);
    });

    const clvValues = Object.keys(customerValues).map(userId => 
      calculateCLV(allOrders, userId)
    );
    
    const avgCLV = clvValues.length > 0 
      ? clvValues.reduce((a, b) => a + b, 0) / clvValues.length 
      : 0;

    // ============================================
    // 7. Growth Metrics
    // ============================================
    // Compare with previous period
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - (endDate - startDate) / (1000 * 60 * 60 * 24));
    
    const previousOrders = await Order.find({
      createdAt: { $gte: previousPeriodStart, $lt: startDate }
    });

    const previousRevenue = previousOrders.reduce((sum, o) => sum + o.amount, 0);
    const revenueGrowth = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : 100;

    // Calculate CAGR - FIXED: Define cagr outside the if block
    let cagr = 0; // Initialize cagr here

    const firstOrder = allOrders[allOrders.length - 1];
    const lastOrder = allOrders[0];
    if (firstOrder && lastOrder) {
      const firstDate = new Date(firstOrder.createdAt);
      const lastDate = new Date(lastOrder.createdAt);
      const years = (lastDate - firstDate) / (1000 * 60 * 60 * 24 * 365);
      cagr = calculateCAGR( // Now using the outer cagr variable
        previousRevenue || totalRevenue,
        totalRevenue,
        Math.max(1, years)
      );
    }
    // cagr is now accessible here because we defined it outside

    // ============================================
    // 8. Cancellation Analysis
    // ============================================
    const cancelledOrders = orders.filter(o => o.status === 'Cancelled');
    const cancellationRate = orders.length > 0 
      ? (cancelledOrders.length / orders.length) * 100 
      : 0;
    
    const cancelledRevenue = cancelledOrders.reduce((sum, o) => sum + o.amount, 0);
    const revenueLossPercentage = totalRevenue > 0 
      ? (cancelledRevenue / totalRevenue) * 100 
      : 0;

    // ============================================
    // 9. Forecasting (Next 30 days)
    // ============================================
    const forecast = [];
    for (let i = 1; i <= 30; i++) {
      const forecastValue = regression.slope * (dailyRevenue.length + i) + regression.intercept;
      forecast.push({
        day: i,
        value: Math.max(0, forecastValue) // Ensure non-negative
      });
    }

    // ============================================
    // Response
    // ============================================
    res.status(200).json({
      success: true,
      data: {
        // Time Series Analysis
        dailyRevenue,
        movingAverage7,
        movingAverage30,
        exponentialSmooth,
        regression,
        seasonal,
        forecast,
        
        // Statistical Measures
        statistics,
        
        // Financial Metrics
        financials: {
          totalRevenue,
          totalCost,
          grossProfit,
          profitMargin,
          revenueGrowth,
          cagr: cagr || 0 // Now cagr is defined
        },
        
        // Order Metrics
        orderMetrics: {
          totalOrders: orders.length,
          avgOrderValue,
          statusCounts,
          paymentStatusCounts,
          paymentMethodCounts,
          cancellationRate,
          cancelledRevenue,
          revenueLossPercentage
        },
        
        // Customer Metrics
        customerMetrics: {
          totalCustomers: uniqueCustomers,
          ordersPerCustomer,
          avgOrderValue,
          avgCLV,
          clvDistribution: clvValues
        },
        
        // Product Performance
        topProducts,
        
        // Algorithm Explanations (for teacher)
        algorithms: {
          movingAverage: {
            description: "Simple Moving Average (SMA) calculates the average of data points over a specified window. Used to smooth out short-term fluctuations and highlight longer-term trends.",
            formula: "SMA = (P₁ + P₂ + ... + Pₙ) / n",
            complexity: "O(n) time, O(n) space"
          },
          exponentialSmoothing: {
            description: "Exponential smoothing gives more weight to recent observations while not discarding older ones entirely. The smoothing factor α (alpha) controls the rate of decay.",
            formula: "Fₜ = α × Aₜ₋₁ + (1-α) × Fₜ₋₁",
            complexity: "O(n) time, O(n) space"
          },
          linearRegression: {
            description: "Linear regression finds the best-fit line through data points using the least squares method. Used for trend analysis and forecasting.",
            formula: "y = mx + b, where m = Σ((x - x̄)(y - ȳ)) / Σ(x - x̄)²",
            complexity: "O(n) time, O(1) space"
          },
          seasonalDecomposition: {
            description: "Decomposes time series into trend, seasonal, and residual components using additive decomposition.",
            formula: "Y = T + S + R",
            complexity: "O(n) time, O(n) space"
          },
          statisticalMeasures: {
            description: "Comprehensive statistical analysis including measures of central tendency, dispersion, and shape.",
            formulas: {
              mean: "x̄ = Σx / n",
              variance: "σ² = Σ(x - x̄)² / n",
              skewness: "γ₁ = E[(x - μ)/σ]³",
              kurtosis: "γ₂ = E[(x - μ)/σ]⁴ - 3"
            },
            complexity: "O(n log n) time, O(n) space"
          },
          cagr: {
            description: "Compound Annual Growth Rate measures the mean annual growth rate over a specified period.",
            formula: "CAGR = (EV / BV)^(1/n) - 1",
            complexity: "O(1) time, O(1) space"
          },
          clv: {
            description: "Customer Lifetime Value predicts the total revenue a business can expect from a single customer account.",
            formula: "CLV = (Average Order Value) × (Purchase Frequency) × (Customer Lifespan)",
            complexity: "O(n) time, O(1) space"
          }
        }
      }
    });
    
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating analytics",
      error: error.message
    });
  }
};

// ============================================
// Export individual algorithms for explanation
// ============================================
export const algorithms = {
  movingAverage: calculateMovingAverage,
  exponentialSmoothing,
  linearRegression,
  seasonalDecomposition,
  calculateStatistics,
  calculateCAGR,
  calculateCLV
};