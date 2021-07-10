module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    deadline: DataTypes.DATE,
    status : DataTypes.STRING,
    priority: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  Todo.associate = (models) => {
    // associations can be defined here
    Todo.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    });
  };
  return Todo;
};
