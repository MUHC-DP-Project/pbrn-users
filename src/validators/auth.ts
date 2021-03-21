import { body, param, ValidationChain } from "express-validator/check";

export function authValidator(method: string): ValidationChain[] {
    switch (method) {
        case "GET /verifyEmail": {
            return [param("jwtToken", "Invalid or missing 'jwtToken'").isString().exists()];
        }
        case "GET /approveUser": {
            return [param("jwtToken", "Invalid or missing 'jwtToken'").isString().exists()];
        }
        case "POST /signUp": {
            return [
                body("email", "Invalid or missing 'email'").isString().exists(),
                body("password", "Invalid or missing 'password'").isString().exists(),
                body("firstName", "Invalid or missing firstName").isString().exists(),
                body("lastName", "Invalid or missing lastName").isString().exists(),
                body("verificationNotes", "Invalid or missing verificationNotes").isString().exists(),
            ];
        }
        case "POST /signIn": {
            return [
                body("email", "Invalid or missing 'email'").isString().exists(),
                body("password", "Invalid or missing 'password'").isString().exists(),
            ];
        }
    }
}