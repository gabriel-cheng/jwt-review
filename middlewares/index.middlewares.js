const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

module.exports = {
    checkAdminToken: async(req, res, next) => {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        const secret = process.env.SECRET;
        const isAdmin = jwt.decode(token, secret);

        if(!token) {
            return res.status(401).json({message: "Acesso negado! Você precisa informar um Token válido para continuar."});
        }

        if(isAdmin.admin == false || !isAdmin.admin) {
            const user = await User.findById(isAdmin.id, "-userAdmin -_id");

            return res.status(200).json(user);
        }

        try {
            jwt.verify(token, secret);
            next();
        } catch(err) {
            return res.status(401).json({message: "Token inválido!"});
        }
    }
};