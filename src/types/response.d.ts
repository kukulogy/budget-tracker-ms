import { ReplyGenericInterface } from "fastify/types/reply";

interface ResponseSchema extends ReplyGenericInterface {
  status: number;
  code: string;
  data: {};
}
