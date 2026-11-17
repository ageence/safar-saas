"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Créer un programme Omra
export async function createOmraProgram(agencyId: string, data: any) {
  try {
    const program = await prisma.omraProgram.create({
      data: {
        title: data.title,
        departureDate: new Date(data.departureDate),
        returnDate: new Date(data.returnDate),
        agencyId: agencyId,
      }
    });
    revalidatePath("/dashboard/omra");
    return { success: true, programId: program.id };
  } catch (error) {
    return { success: false, error: "Erreur serveur" };
  }
}

// 2. Ajouter une Chambre (Double, Triple, Quad)
export async function addRoomToProgram(programId: string, data: any) {
  try {
    await prisma.room.create({
      data: {
        hotelName: data.hotelName,
        city: data.city,
        type: data.type,
        capacity: data.type === "DOUBLE" ? 2 : data.type === "TRIPLE" ? 3 : 4,
        programId: programId,
      }
    });
    revalidatePath(`/dashboard/omra/${programId}`);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// 3. Ajouter un Bus
export async function addBusToProgram(programId: string, name: string, capacity: number) {
  try {
    await prisma.bus.create({
      data: { name, capacity, programId }
    });
    revalidatePath(`/dashboard/omra/${programId}`);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}