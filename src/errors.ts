import type { FastifyReply } from 'fastify';

/** Format d'erreur commun (org/knowledge/conventions.md) : { code, message, details }. */
export function sendError(reply: FastifyReply, status: number, code: string, message: string, details: Record<string, unknown> = {}) {
  return reply.status(status).send({ code, message, details });
}
