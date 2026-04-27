/**
 * lib/prisma.js — Prisma Client singleton
 * Reused across all controllers to avoid connection pool exhaustion
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
