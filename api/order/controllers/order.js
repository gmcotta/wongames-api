'use strict';

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

module.exports = {
  createPaymentIntent: async (ctx) => {
    const { cart } = ctx.request.body
    let games = []
    await Promise.all(
      cart?.map(async (game) => {
        const validGame = await strapi.services.game.findOne({ id: game.id })
        if (validGame) games.push(validGame)
      })
    )
    if(!games.length) {
      ctx.response.status = 404
      return {
        error: 'No valid games found'
      }
    }
    const total = games.reduce((acc, game) => {
      return acc + game.price
    }, 0)
    if(total === 0) {
      return { freeGames: true }
    }
    const total_in_cents = total * 100
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total_in_cents,
        currency: 'usd',
        metadata: { integration_check: "accept_a_payment" }
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

    return { cart, paymentIntentId, paymentMethod, userInfo }
  }
};
