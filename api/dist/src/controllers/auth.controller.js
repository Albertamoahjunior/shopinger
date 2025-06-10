"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customer_services_1 = require("../services/customer.services");
const auth_config_1 = require("../../config/auth.config");
//workers log in
const login = (req, res) => {
    console.log("logged In");
    res.status(200).json(req.user);
};
//customers sign up
const sign_up_customer = async (req, res) => {
    try {
        const { first_name, last_name, tel_number, email, password } = req.body;
        const hashed = (0, auth_config_1.hash_pass)(password);
        const existingCustomer = await (0, customer_services_1.exist)(email);
        if (existingCustomer && existingCustomer.length > 0)
            res.status(401).send("Customer already exist");
        else {
            const newCustomer = await (0, customer_services_1.add_customer)(first_name, last_name, tel_number, email, hashed);
            res.status(201).send("Successfully Signed Up");
        }
    }
    catch (error) {
        console.error("Error signing up customer:", error);
        res.status(500).send("Internal Server Error");
    }
};
const log_out = (req, res) => {
    req.logout((err) => {
        if (err)
            return err;
        res.send("Log out");
    });
};
exports.default = {
    login,
    sign_up_customer,
    log_out,
};
//# sourceMappingURL=auth.controller.js.map