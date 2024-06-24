import { SaleReportInput } from '@/type';
import { createConnection, Connection } from 'mysql2/promise';
import { PrismaClient } from '@prisma/client';
import { CreateMemberInput } from '@/entity/member/member.type';

const prisma = new PrismaClient();

async function connectToDatabase(): Promise<Connection> {
  const connection = await createConnection({
    host: process.env.HOSTNAME,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });

  return connection;
}

export const getStatistics = async () => {
  const statistics = await prisma.statistics.findMany();

  return statistics;
};

export const getSales = async () => {
  const connection: Connection = await connectToDatabase();

  console.log('Connected to affiliate database to fetch sales');

  const [rows] = await connection.execute(
    `SELECT mlm_purchase_history.invoice_no AS invoiceNo, mlm_login.username AS username, CONCAT("+", mlm_login.phone_code, " ", mlm_login.phone) AS mobile, mlm_login.email AS email, mlm_package.package AS productName, mlm_purchase_history.order_date AS issuedAt, mlm_purchase_history.payment_method AS paymentMethod, mlm_purchase_history.order_amount AS amount, mlm_purchase_history.hashpower AS hashPower, mlm_login.asset_id AS assetId FROM mlm_purchase_history LEFT JOIN mlm_login ON mlm_purchase_history.order_user_id = mlm_login.user_id LEFT JOIN mlm_package ON mlm_purchase_history.order_product_id = mlm_package.package_id;`
  );

  console.log('Fetched users info from affiliate');

  const data: SaleReportInput[] = rows as SaleReportInput[];

  const members = await prisma.member.findMany();

  const memberIds = members.reduce((prev, { id, username }) => ({ ...prev, [username]: id }), {});

  const sales = data.map(
    ({ username, issuedAt, invoiceNo, productName, paymentMethod, amount, hashPower }) => {
      return {
        memberId: memberIds[username],
        username,
        issuedAt,
        invoiceNo,
        productName,
        paymentMethod,
        amount,
        hashPower,
      };
    }
  );

  return sales;
};

export const getMembers = async () => {
  const connection: Connection = await connectToDatabase();

  console.log('Connected affiliate database to fetch members');

  const [rows] = await connection.execute(
    'SELECT username, CONCAT(first_name, " ", last_name) AS fullname, user_id AS userId, CONCAT("+", phone_code, " ", phone) AS mobile, email, password, primary_address AS address, asset_id AS assetId, TXCpayout AS txcPayout, blockio AS txcCold, join_date AS createdAt FROM mlm_login;'
  );

  const members: CreateMemberInput[] = rows as CreateMemberInput[];

  return members;
};
