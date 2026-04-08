// // const baseUrl = process.env.NODE_ENV === 'production' 
// //   ? 'https://api.paypal.com' 
// //   : 'https://api.sandbox.paypal.com';

// // export class PayPalService {
// //   static async getAccessToken() {
// //     const clientId = process.env.PAYPAL_CLIENT_ID;
// //     const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    
// //     const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
// //     const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
// //       method: 'POST',
// //       headers: {
// //         'Authorization': `Basic ${auth}`,
// //         'Content-Type': 'application/x-www-form-urlencoded',
// //       },
// //       body: 'grant_type=client_credentials'
// //     });

// //     const data = await response.json();
// //     return data.access_token;
// //   }

// //   static async createOrder(amount) {
// //     const accessToken = await this.getAccessToken();

// //     const orderData = {
// //       intent: 'CAPTURE',
// //       purchase_units: [{
// //         amount: {
// //           currency_code: 'USD',
// //           value: amount.toFixed(2)
// //         }
// //       }]
// //     };

// //     const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'Authorization': `Bearer ${accessToken}`,
// //       },
// //       body: JSON.stringify(orderData)
// //     });

// //     return await response.json();
// //   }

// //   static async captureOrder(orderId) {
// //     const accessToken = await this.getAccessToken();

// //     const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'Authorization': `Bearer ${accessToken}`,
// //       }
// //     });

// //     return await response.json();
// //   }
// // }

// // export default PayPalService;














// // import axios from 'axios';

// // const baseUrl = process.env.NODE_ENV === 'production' 
// //   ? 'https://api.paypal.com' 
// //   : 'https://api.sandbox.paypal.com';

// // class PayPalService {
// //   static async getAccessToken() {
// //     try {
// //       const clientId = process.env.PAYPAL_CLIENT_ID;
// //       const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
      
// //       const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      
// //       const response = await axios.post(
// //         `${baseUrl}/v1/oauth2/token`,
// //         'grant_type=client_credentials',
// //         {
// //           headers: {
// //             'Authorization': `Basic ${auth}`,
// //             'Content-Type': 'application/x-www-form-urlencoded',
// //           }
// //         }
// //       );
      
// //       return response.data.access_token;
// //     } catch (error) {
// //       console.error('Error getting PayPal access token:', error.response?.data || error.message);
// //       throw new Error('Failed to get PayPal access token');
// //     }
// //   }

// //   static async createOrder(amount, returnUrl, cancelUrl) {
// //     try {
// //       const accessToken = await this.getAccessToken();

// //       const orderData = {
// //         intent: 'CAPTURE',
// //         purchase_units: [{
// //           amount: {
// //             currency_code: 'USD',
// //             value: amount.toFixed(2)
// //           }
// //         }],
// //         application_context: {
// //           return_url: returnUrl,
// //           cancel_url: cancelUrl,
// //           shipping_preference: 'NO_SHIPPING',
// //           user_action: 'PAY_NOW'
// //         }
// //       };

// //       const response = await axios.post(
// //         `${baseUrl}/v2/checkout/orders`,
// //         orderData,
// //         {
// //           headers: {
// //             'Content-Type': 'application/json',
// //             'Authorization': `Bearer ${accessToken}`,
// //           }
// //         }
// //       );

// //       return response.data;
// //     } catch (error) {
// //       console.error('Error creating PayPal order:', error.response?.data || error.message);
// //       throw new Error('Failed to create PayPal order');
// //     }
// //   }

// //   static async captureOrder(orderId) {
// //     try {
// //       const accessToken = await this.getAccessToken();

// //       const response = await axios.post(
// //         `${baseUrl}/v2/checkout/orders/${orderId}/capture`,
// //         {},
// //         {
// //           headers: {
// //             'Content-Type': 'application/json',
// //             'Authorization': `Bearer ${accessToken}`,
// //           }
// //         }
// //       );

// //       return response.data;
// //     } catch (error) {
// //       console.error('Error capturing PayPal order:', error.response?.data || error.message);
// //       throw new Error('Failed to capture PayPal order');
// //     }
// //   }
// // }

// // export default PayPalService;










// import axios from 'axios';

// const baseUrl = process.env.NODE_ENV === 'production' 
//   ? 'https://api.paypal.com' 
//   : 'https://api.sandbox.paypal.com';

// class PayPalService {
//   static async getAccessToken() {
//     try {
//       const clientId = process.env.PAYPAL_CLIENT_ID;
//       const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
      
//       if (!clientId || !clientSecret) {
//         throw new Error('PayPal credentials are missing');
//       }
      
//       const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      
//       const response = await axios.post(
//         `${baseUrl}/v1/oauth2/token`,
//         'grant_type=client_credentials',
//         {
//           headers: {
//             'Authorization': `Basic ${auth}`,
//             'Content-Type': 'application/x-www-form-urlencoded',
//           }
//         }
//       );
      
//       return response.data.access_token;
//     } catch (error) {
//       console.error('PayPal Auth Error:', error.response?.data || error.message);
//       throw new Error('Failed to get PayPal access token');
//     }
//   }

//   static async createOrder(amount, returnUrl, cancelUrl) {
//     try {
//       const accessToken = await this.getAccessToken();

//       const orderData = {
//         intent: 'CAPTURE',
//         purchase_units: [{
//           amount: {
//             currency_code: 'USD',
//             value: amount.toFixed(2)
//           }
//         }],
//         application_context: {
//           return_url: returnUrl,
//           cancel_url: cancelUrl,
//           shipping_preference: 'NO_SHIPPING',
//           user_action: 'PAY_NOW'
//         }
//       };

//       const response = await axios.post(
//         `${baseUrl}/v2/checkout/orders`,
//         orderData,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${accessToken}`,
//           }
//         }
//       );

//       return response.data;
//     } catch (error) {
//       console.error('PayPal Create Order Error:', error.response?.data || error.message);
//       throw new Error('Failed to create PayPal order');
//     }
//   }

//   static async captureOrder(orderId) {
//     try {
//       const accessToken = await this.getAccessToken();

//       const response = await axios.post(
//         `${baseUrl}/v2/checkout/orders/${orderId}/capture`,
//         {},
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${accessToken}`,
//           }
//         }
//       );

//       return response.data;
//     } catch (error) {
//       console.error('PayPal Capture Error:', error.response?.data || error.message);
//       throw new Error('Failed to capture PayPal order');
//     }
//   }
// }

// export default PayPalService;





// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// class StripeService {
//   static async createPaymentSession(items, totalAmount, orderId, successUrl, cancelUrl) {
//     try {
//       const lineItems = items.map(item => ({
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: item.name,
//           },
//           unit_amount: Math.round(item.price * 100),
//         },
//         quantity: item.quantity,
//       }));

//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         line_items: lineItems,
//         mode: 'payment',
//         success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
//         cancel_url: cancelUrl,
//         metadata: {
//           orderId: orderId
//         }
//       });
      
//       return session;
//     } catch (error) {
//       console.error('Stripe error:', error);
//       throw new Error('Failed to create payment session');
//     }
//   }

//   static async retrieveSession(sessionId) {
//     try {
//       const session = await stripe.checkout.sessions.retrieve(sessionId);
//       return session;
//     } catch (error) {
//       console.error('Stripe retrieve error:', error);
//       throw new Error('Failed to retrieve session');
//     }
//   }
// }

// export default StripeService;


















// import dotenv from 'dotenv';
// dotenv.config();

// import Stripe from 'stripe';

// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error('STRIPE_SECRET_KEY is missing from your .env file');
// }

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// class StripeService {
//   static async createPaymentSession(items, totalAmount, orderId, successUrl, cancelUrl) {
//     try {
//       const lineItems = items.map(item => ({
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: item.name,
//           },
//           unit_amount: Math.round(item.price * 100),
//         },
//         quantity: item.quantity,
//       }));

//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         line_items: lineItems,
//         mode: 'payment',
//         success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
//         cancel_url: cancelUrl,
//         metadata: {
//           orderId: orderId
//         }
//       });

//       return session;
//     } catch (error) {
//       console.error('Stripe error:', error);
//       throw new Error('Failed to create payment session');
//     }
//   }

//   static async retrieveSession(sessionId) {
//     try {
//       const session = await stripe.checkout.sessions.retrieve(sessionId);
//       return session;
//     } catch (error) {
//       console.error('Stripe retrieve error:', error);
//       throw new Error('Failed to retrieve session');
//     }
//   }
// }

// export default StripeService;














import dotenv from 'dotenv';
dotenv.config();

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing from your .env file');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class StripeService {
  static async createPaymentSession(items, totalAmount, orderId, successUrl, cancelUrl) {
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
      cancel_url: cancelUrl,
      metadata: { orderId }
    });

    return session;
  }

  static async retrieveSession(sessionId) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  }
}

export default StripeService;