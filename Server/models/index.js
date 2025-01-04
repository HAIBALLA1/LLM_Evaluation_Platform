'use strict';

import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configPath = path.resolve(__dirname, '../config/config.json');

const configFile = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const config = configFile[env];

const db = {};

const sequelize = config.use_env_variable
    ? new Sequelize(process.env[config.use_env_variable], config)
    : new Sequelize(config.database, config.username, config.password, config);

const modelFiles = fs
    .readdirSync(__dirname)
    .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js');

// Charger tous les modèles en utilisant Promise.all
await Promise.all(
    modelFiles.map(async (file) => {
        const model = (await import(path.join(__dirname, file))).default(sequelize, Sequelize.DataTypes);
        db[model.name] = model; // Ajout au db object
        console.log(`Model added to db object: ${model.name}`);
    })
);

Object.keys(db).forEach((modelName) => {
    console.log(`Associating model: ${modelName}`); // Log les modèles disponibles pour les associations
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
