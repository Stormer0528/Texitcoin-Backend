import { SaleReportInput } from '@/type';
import { createConnection, Connection } from 'mysql2/promise';
import { PrismaClient } from '@prisma/client';
import { CreateMemberInput } from '@/entity/member/member.type';
import { isEmpty } from 'class-validator';

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

  const [rows] = await connection.execute(
    'SELECT txc_affiliate.mlm_purchase_history.invoice_no AS invoiceNo, txc_affiliate.mlm_login.username AS username, CONCAT("+", txc_affiliate.mlm_login.phone_code, " ", txc_affiliate.mlm_login.phone) AS mobile, txc_affiliate.mlm_login.email AS email, txc_affiliate.mlm_package.package AS productName, txc_affiliate.mlm_purchase_history.order_date AS issuedAt, txc_affiliate.mlm_purchase_history.payment_method AS paymentMethod, txc_affiliate.mlm_purchase_history.order_amount AS amount, txc_affiliate.mlm_purchase_history.hashpower AS hashPower, txc_affiliate.mlm_login.asset_id AS assetId FROM txc_affiliate.mlm_purchase_history LEFT JOIN txc_affiliate.mlm_login ON txc_affiliate.mlm_purchase_history.order_user_id = txc_affiliate.mlm_login.user_id LEFT JOIN  txc_affiliate.mlm_package ON txc_affiliate.mlm_purchase_history.order_product_id = txc_affiliate.mlm_package.package_id;'
  );

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

  const [rows] = await connection.execute(
    'SELECT username, CONCAT(first_name, " ", last_name) AS fullname, user_id AS userId, CONCAT("+", phone_code, " ", phone) AS mobile, email, password, primary_address AS address, asset_id AS assetId, TXCpayout AS txcPayout, blockio AS txcCold, join_date AS createdAt FROM txc_affiliate.mlm_login;'
  );

  const members: CreateMemberInput[] = rows as CreateMemberInput[];

  return members;
};
