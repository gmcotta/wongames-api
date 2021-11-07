const cartItems = async (cart) => {
  let games = []
  await Promise.all(
    cart?.map(async (game) => {
      const validGame = await strapi.services.game.findOne({ id: game.id })
      if (validGame) games.push(validGame)
    })
  )
  return games
}

const total = async (games) => {
  const total = await games.reduce((acc, game) => {
    return acc + game.price
  }, 0)
  return Number((total * 100).toFixed(0))
}

const cartGameIds = async (cart) => {
  return await cart.map((game) => ({
    id: game.id
  }))
}

module.exports = {
  cartItems,
  total,
  cartGameIds
}
