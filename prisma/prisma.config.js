import 'dotenv/config'

export default {
    schema: "./prisma/schema.prisma",
    datasource: {
        provider: "mysql",
        url: process.env.DATABASE_URL, // อย่าลืมกำหนดใน .env
    },
};