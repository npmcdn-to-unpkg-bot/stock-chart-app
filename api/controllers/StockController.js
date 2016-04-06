/**
 * StockController
 *
 * @description :: Server-side logic for managing stocks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    // _config: {
    //     actions: false,
    //     shortcuts: false,
    //     rest: false
    // },

    addStock: function(req, res) {
        var stock = req.allParams();

        if (req.isSocket && req.method === 'POST') {
            Stock
                .findOne({
                    symbol: stock.symbol
                })
                .exec(function(err, result) {
                    if (err)
                        return res.negotiate(err);
                    if (!result) {
                        Stock
                            .create(stock)
                            .exec(function(err, result) {
                                if (err)
                                    return res.negotiate(err);

                                Stock.publishCreate({
                                    id: result.id,
                                    symbol: result.symbol,
                                    name: result.name
                                });

                                return res.ok()
                            });
                    }
                });
        }
        else if (req.isSocket) {
            Stock.watch(req.socket);
            console.log('User subscribed to ' + req.socket.id);
        }
    },

    removeStock: function(req, res) {
        var id = req.param('id');

        Stock
            .destroy({
                id: id
            })
            .exec(function(err, results) {
                if (err)
                    return res.negotiate(err);
                if (results.length < 1)
                    return res.notFound();

                Stock.publishDestroy(results[0].id, undefined, {
                    previous: results[0]
                });

                return res.ok();
            });
    },

    redirectAll: function(req, res) {
        return res.redirect('/');
    },
};
