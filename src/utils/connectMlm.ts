import { SaleReportInput } from '@/type';
import { createConnection, Connection } from 'mysql2/promise';
import { Member, Prisma, PrismaClient } from '@prisma/client';

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

export const getSales = async (members: Member[]) => {
  const connection: Connection = await connectToDatabase();

  console.log('Connected to affiliate database to fetch sales...');

  const [rows] = await connection.execute(
    `SELECT
      mph.invoice_no AS invoiceNo,
      ml.user_id AS userId,    
      mp.package_id AS packageId,
      mph.payment_method AS paymentMethod,
      mph.order_amount AS amount,
      mph.hashpower AS hashPower,
      mph.order_date AS orderedAt
    FROM 
      mlm_purchase_history as mph
      LEFT JOIN mlm_login as ml ON mph.order_user_id = ml.user_id
      LEFT JOIN mlm_package as mp ON mph.order_product_id = mp.package_id;`
  );

  console.log(`Fetched ${(rows as []).length} users info from affiliate`);

  const data: SaleReportInput[] = rows as SaleReportInput[];

  const memberIds = members.reduce((prev, { id, userId }) => ({ ...prev, [userId]: id }), {});

  const sales = data.map(({ userId, ...row }) => ({ ...row, memberId: memberIds[userId] }));

  await connection.end();
  console.log(`Close connection to affiliate database successfully...`);

  return sales;
};

export const getMembers = async () => {
  const connection: Connection = await connectToDatabase();

  console.log('Connected affiliate database to fetch members...');

  const [rows] = await connection.execute(`
    SELECT
      username,
      CONCAT(first_name, " ", last_name) AS fullName,
      user_id AS userId,
      CONCAT("+", phone_code, " ", phone) AS mobile,
      email,
      password,
      primary_address AS address,
      asset_id AS assetId,
      TXCpayout AS txcPayout,
      blockio AS txcCold,
      join_date AS createdAt 
    FROM mlm_login;`);

  console.log(`Fetched ${(rows as []).length} members from affiliate`);

  await connection.end();
  console.log(`Close connection to affiliate database successfully...`);

  return rows as Prisma.MemberCreateInput[];
};
