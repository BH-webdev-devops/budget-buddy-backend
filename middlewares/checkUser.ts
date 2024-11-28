import {NextFunction, Request, Response} from 'express'
import {query} from "../database/db"
import {User} from "../types/User"

export const checkIfUserExists = (checkForExistence: boolean) => {

    return async (req: Request, res: Response, next: NextFunction): Promise<any> => {

        const {username, email, password} = req.body

        try {

            const result = await query("SELECT * FROM users WHERE email=$1", [email])

            if (checkForExistence) {

                if (result.rows.length > 0) {
                    (req as Request & {user: User}).user = result.rows[0]
                    next()
                } else {
                    return res.status(400).json({message: "User does not exist!"})
                }
            } else {

                if (result.rows.length > 0) {
                    return res.status(404).json({message: "User already exists"})
                }
    
                next()
            }
        } catch (err) {
            console.log(err)
            return res.status(500).json({message: "Internal server error!"})
        }
    }
}