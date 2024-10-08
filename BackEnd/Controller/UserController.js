const UserModel = require('../Model/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserController {
    async CreateUser(req, res) {
        const { nome, idade, email, senha } = req.body;

        if (!nome || !idade || !email || !senha) {
            return res.status(400).json({ message: 'Preencha todos os campos' });
        }

        //Passando a senha para Hash
        const salt = await bcrypt.genSalt(12);
        const senhaHash = await bcrypt.hash(senha, salt);

        try {
            const user = await UserModel.getUserByEmail(email);
            if (user) {
                return res.status(400).json({ message: 'O Email já está em uso!' });
            }

            const lastId = await UserModel.createUser({ nome, idade, email, senha: senhaHash });
            return res.status(200).json({ message: 'Usuário criado com sucesso!', id: lastId });
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            return res.status(500).json({ message: 'Erro ao criar usuário' });
        }
    }

    async ViewAllUser(req, res) {
        try {
            const users = await UserModel.getAllUsers();
            return res.status(200).json(users);
        } catch (err) {
            console.error("Erro ao buscar usuários:", err);
            return res.status(500).json({ message: 'Erro ao buscar usuários' });
        }
    }

    async GetUserById(req, res){
        const {id} = req.params;

        try {
            const user = await UserModel.getUserById(id);

            if(!user){
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            return res.status(200).json(user);

        } catch (error) {
            console.log(error);
            return res.status(500).json({message: 'Erro interno no servidor!'});
        }

    }

    async LoginUser(req, res) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: 'Preencha todos os campos' });
        }

        const user = await UserModel.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        //verifica se as senhas coincidem
        const verificaSenha = await bcrypt.compare(senha, user.senha);

        if (!verificaSenha) {
            return res.status(422).json({ message: 'Senha inválida!' });
        }

        try {
            const secret = process.env.SECRET;
            const token = jwt.sign({
                id: user._id,
            },
                secret,
            )
            return res.status(200).json({message: 'Autenticação realizada com sucesso!', token});

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Aconteceu um erro no servivdor, tente novamente mais tarde!' });
        }

    }

    async checkToken(req, res, next){
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1];

        if(!token){
            return res.status(401).json({message: 'Acesso negado!'});
        }

        try {
            const secret = process.env.SECRET;
            jwt.verify(token, secret);
            
            next();

        } catch (error) {
            return res.status(400).json({message: 'Token inválido!'});
        }
    }

}

module.exports = new UserController();
