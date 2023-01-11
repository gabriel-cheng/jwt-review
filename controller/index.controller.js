const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    deleteUser: async(req, res) => {
        const id = req.params.id;
        const userFinded = await User.findById(id);

        if(!userFinded) {
            return res.status(404).json({message: "Usuário não encontrado!"});
        }

        try {
            await User.deleteOne({_id:id});

            return res.status(200).json({message: "Usuário deletado com sucesso!"});
        } catch(err) {
            console.log({applicationError: err});
            return res.status(500).json({message: "Erro interno de servidor, tente novamente mais tarde."});
        }
    },
    updateUserPassword: async(req, res) => {
        const id = req.params.id;
        const { userPassword } = req.body;

        const salt = await bcrypt.genSalt(12);
        const passHash = await bcrypt.hash(userPassword, salt);

        const newPass = {
            userPassword: passHash
        };

        if(!userPassword) {
            return res.status(400).json({message: "Você precisa informar uma senha!"});
        }

        try {
            const updatedPassword = await User.updateOne({_id:id}, newPass);

            if(updatedPassword.matchedCount == 0) {
                return res.status(404).json({message: "O usuário não foi encontrado!"});
            }

            return res.status(201).json({message: "Sua senha foi atualizada com sucesso!"});
        } catch(err) {
            console.log({applicationError: err});
            return res.status(500).json({message: "Erro interno de servidor, tente novamente mais tarde."});
        }
    },
    updateUser: async(req, res) => {
        const id = req.params.id;
        const { userName, userEmail } = req.body;

        const user = {
            userName,
            userEmail,
        };

        try {
            const updatedUser = await User.updateOne({_id:id}, user);

            if(updatedUser.matchedCount == 0) {
                return res.status(404).json({message: "O usuário não foi encontrado!"});
            }

            return res.status(201).json({message: "Usuário atualizado com sucesso!"});
        } catch(err) {
            console.log({applicationError: err});
            return res.status(500).json({message: "Erro interno de servidor, tente novamente mais tarde."});
        }
    },
    findUserById: async(req, res) => {
        const id = req.params.id;

        try {
            const userFinded = await User.findById(id);

            if(!userFinded) {
                return res.status(404).json({message: "Usuário não encontrado!"});
            }

            return res.status(200).json({user: userFinded});
        } catch(err) {
            console.log({applicationError: err});
            return res.status(500).json({message: "Erro interno de servidor, tente novamente mais tarde."});
        }
    },
    userLogin: async(req, res) => {
        const { userEmail, userPassword } = req.body;

        if(!userEmail) {
            return res.status(400).json({message: "O e-mail é obrigatório!"});
        }
        if(!userPassword) {
            return res.status(400).json({message: "A senha é obrigatória!"});
        }

        const user = await User.findOne({userEmail: userEmail});

        if(!user) {
            return res.status(404).json({message: "Usuário não encontrado!"});
        }

        const checkPassword = await bcrypt.compare(userPassword, user.userPassword);

        if(!checkPassword) {
            return res.status(400).json({message: "Senha incorreta!"});
        }

        try {
            const secret = process.env.SECRET;

            const token = jwt.sign({
                id: user._id,
                admin: user.userAdmin
            }, secret);

            return res.status(200).json({message: "Login realizado com sucesso!", token: token});
        } catch(err) {
            console.log({applicationError: err});
            return res.status(500).json({message: "Erro interno de servidor, tente novamente mais tarde."});
        }
    },
    registerNewUser: async(req, res) => {
        const { userName, userEmail, userAdmin, userPassword } = req.body;
        const salt = await bcrypt.genSalt(12);
        const passHash = await bcrypt.hash(userPassword, salt);

        const newUser = {
            userName,
            userEmail,
            userAdmin,
            userPassword: passHash
        };

        if(!userAdmin) {
            newUser.userAdmin = false;
        }

        if(!userName) {
            return res.status(400).json({message: "Você precisa inserir seu nome!"});
        }

        const emailExist = await User.findOne({userEmail: userEmail});

        if(emailExist) {
            return res.status(400).json({message: "O e-mail informado já existe no sistema, por favor insira outro!"});
        }
        if(!userEmail) {
            return res.status(400).json({message: "Você precisa inserir um e-mail!"});
        }
        if(!userPassword) {
            return res.status(400).json({message: "Você precisa inserir uma senha!"});
        }

        try {
            User.create(newUser);

            return res.status(201).json({message: "Usuário criado com sucesso!"});
        } catch(err) {
            console.log({applicationError: err});
            return res.status(500).json({message: "Erro interno de servidor, tente novamente mais tarde."});
        }
    },
    index: async(req, res) => {
        try {
            const allUsers = await User.find();
    
            return res.status(200).json(allUsers);
        } catch(err) {
            console.log({applicationError: err});
            return res.status(500).json({message: "Erro interno de servidor, tente novamente mais tarde."});
        }
    }
};