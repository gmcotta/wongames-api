'use strict';

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const { sanitizeEntity } = require('strapi-utils')

module.exports = {
  createPaymentIntent: async (ctx) => {
    const { cart } = ctx.request.body
    const cartGameIds = await strapi.config.functions.cart.cartGameIds(cart)
    const games = await strapi.config.functions.cart.cartItems(cartGameIds)
    if(!games.length) {
      ctx.response.status = 404
      return {
        error: 'No valid games found'
      }
    }
    const amount = await strapi.config.functions.cart.total(games)
    if (amount === 0) return { freeGames: true }
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        metadata: { cart: JSON.stringify(cartGameIds) }
      })
      return paymentIntent
    } catch(err) {
      return err.raw.message
    }
  },
  create: async (ctx) => {
    const { cart, paymentIntentId, paymentMethod } = ctx.request.body
    const token = strapi.plugins['users-permissions'].services.jwt.getToken(ctx)
    const userId = token.id
    const userInfo = await strapi
      .query('user', 'users-permissions')
      .findOne({ id: userId })
    const cartGameIds = await strapi.config.functions.cart.cartGameIds(cart)
    const games = await strapi.config.functions.cart.cartItems(cartGameIds)
    const total_in_cents = await strapi.config.functions.cart.total(games)
    let paymentInfo
    if (total_in_cents > 0) {
      try {
        paymentInfo = await stripe.paymentMethods.retrieve(paymentMethod)
        console.log(paymentInfo)
      } catch (error) {
        ctx.response.status = 402
        return { error: error.message }
      }
    }
    const entry = {
      total_in_cents,
      payment_intent_id: paymentIntentId,
      card_brand: paymentInfo?.card?.brand,
      card_last4: paymentInfo?.card?.last4,
      games,
      user: userInfo
    }
    const entity = await strapi.services.order.create(entry)
    return sanitizeEntity(entity, { model: strapi.models.order })
  }
};
