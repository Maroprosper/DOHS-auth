const { User } = require('../models');

exports.show = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).send({ error: 'User not found' });

    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
