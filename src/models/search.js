import { prisma } from "../config/prisma.js";

export class searchModel {
  static async createSearch({ userId, criterio }) {
    return await prisma.busqueda.create({
      data: {
        id_usuario: userId,
        criterio: criterio,
      },
    })
  }
}