import { Client } from "pg"
import dotenv from "dotenv"

dotenv.config()

const USER = process.env.PGUSER
const PASS = process.env.PGPASSWORD
const HOST = process.env.PGHOST
const PORT = process.env.PGPORT
const NAME = process.env.PGNAME

const client = new Client({
  user: USER,
  host: HOST,
  password: PASS,
  port: Number(PORT),
})

const createDb = async () => {
  try {
    await client.connect()
    const res = await client.query(
      `SELECT datname FROM pg_catalog.pg_database WHERE datname = '${NAME}'`
    )

    if (res.rowCount === 0) {
      console.log(`${NAME} database not found, creating it.`)
      await client.query(`CREATE DATABASE "${NAME}";`)
      console.log(`created database ${NAME}`)
    } else {
      console.log(`${NAME} database exists.`)
    }

    await client.end()
  } catch (error) {
    console.error(error)
  }
}

createDb()
