const logger = require('../config/logger');

const output = {
  getContents: async (req, res) => {
    res.send('good');
  },
};

const input = {

};

module.exports = {
	output,
	input,
};
