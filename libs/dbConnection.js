const mysql = require("mysql");

const dbConfig = {
	user: "dmuser",
	password: "dmuser",
	database: "litehq",
	host: "localhost",
	connectionLimit: 10,
	debug: false
};

module.exports = () => {
	try {
		let pool;
		let con;
		if (pool) con = pool.getConnection();
		else {
			pool = mysql.createPool(dbConfig);
			con = pool.getConnection();
		}
		return con;
	} catch (ex) {
		throw ex;
	}
};
