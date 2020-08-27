const knex = require("knex")

const databases = {};

class DatabaseManager {

	static get(key) {
            key = key || process.env.MYSQL_DBNAME || 'revrentals'

		if(!databases[key]) {
			databases[key] = knex({

			  client: "mysql",

			  connection: {

			    host: process.env.MYSQL_HOST || "localhost",
			    port: process.env.MYSQL_PORT || 8889,
			    user: process.env.MYSQL_USER || "root",
			    password: process.env.MYSQL_PASS || "root",
			    database: key
			  }

			});
		}

		return databases[key];

	}
}


module.exports = DatabaseManager;
