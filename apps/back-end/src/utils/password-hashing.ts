import bcryptjs from "bcryptjs";

export const generateHash = async (password = '') => {
    const salt = await bcryptjs.genSaltSync(10)
    const hashPassword = await bcryptjs.hash(password, salt)
    return hashPassword
}

export const compareHash = async (password = '', hashPassword = '') => {
    const passwordMatch = await bcryptjs.compare(password, hashPassword)

    return passwordMatch
}