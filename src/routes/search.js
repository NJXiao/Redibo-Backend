const Router = require("express");
const { searchController } = require("../controllers/search");

const searchRouter = Router()

searchRouter.post('/', searchController.createSearch)
searchRouter.get('/:id', searchController.getSearchByUserId)
searchRouter.delete('/:id', searchController.deleteSearchById)

module.exports = { searchRouter }