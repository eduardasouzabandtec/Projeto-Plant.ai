'use strict';

/* 
lista e explicação dos Datatypes:
https://codewithhugo.com/sequelize-data-types-a-practical-guide/
*/

module.exports = (sequelize, DataTypes) => {
    let Usuario = sequelize.define('Usuario',{
		idProduto: {
			field:"idCliente",
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},		
		tipoDeVaso : {
			field:"tipoDeVaso ",
			type: DataTypes.INTEGER,
			allowNull: false
		},
		fkCliente: {
			field:"fkCliente",
			type: DataTypes.STRING,
			allowNull: false
		},
		fkPlanta: {
			field:"fkPlanta",
			type: DataTypes.STRING,
			allowNull: false
		},
	}, 
	{
		tableName: 'Produto', 
		freezeTableName: true, 
		underscored: true,
		timestamps: false,
	});

    return Usuario;
};
