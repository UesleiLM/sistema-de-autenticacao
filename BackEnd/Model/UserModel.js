const db = require('../config/database');

// olhando a alteração

// exemplo para frança

class UserModel {
    async createUser({ nome, idade, email, senha }) {
        const [result] = await db.query(
            "INSERT INTO usuarios (nome, idade, email, senha) VALUES (?, ?, ?, ?)",
            [nome, parseInt(idade), email, senha]
        );
        return result.insertId;  
    }

    async getAllUsers() {
        const [rows] = await db.query("SELECT * FROM usuarios");
        return rows;  
    }

    async getUserByEmail(email){
        const [user] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        return user[0];
    }

    async getUserById(id){
        const [user] = await db.query("SELECT id, nome, idade, email FROM usuarios WHERE id = ?", [parseInt(id)]);
        return user[0];
    }
    
}

module.exports = new UserModel();
