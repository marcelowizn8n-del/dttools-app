/**
 * Middleware to check if user has reached their AI project generation limit
 * Based on their subscription plan
 */

import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { users, subscriptionPlans } from "../../shared/schema";
import { eq } from "drizzle-orm";

export interface AiProjectLimitError {
  error: string;
  code: "AI_PROJECT_LIMIT_REACHED" | "NO_SUBSCRIPTION_PLAN" | "PLAN_NOT_FOUND";
  currentUsage: number;
  limit: number | null;
  planName: string;
  upgradeUrl: string;
}

export async function checkAiProjectLimits(
  req: Request,
  res: Response<AiProjectLimitError | any>,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get user with subscription info
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = user[0];

    // Check if user has a subscription plan
    if (!userData.subscriptionPlanId) {
      return res.status(403).json({
        error: "Você precisa de um plano ativo para usar a geração de projetos com IA.",
        code: "NO_SUBSCRIPTION_PLAN",
        currentUsage: userData.aiProjectsUsed || 0,
        limit: null,
        planName: "Nenhum",
        upgradeUrl: "/pricing",
      });
    }

    // Get subscription plan details
    const plan = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.id, userData.subscriptionPlanId))
      .limit(1);

    if (!plan || plan.length === 0) {
      return res.status(404).json({
        error: "Plano de assinatura não encontrado",
        code: "PLAN_NOT_FOUND",
        currentUsage: userData.aiProjectsUsed || 0,
        limit: null,
        planName: "Desconhecido",
        upgradeUrl: "/pricing",
      });
    }

    const planData = plan[0];
    const currentUsage = userData.aiProjectsUsed || 0;
    const limit = planData.maxAiProjects;

    // If limit is null, it's unlimited
    if (limit === null) {
      // User has unlimited AI projects - allow
      return next();
    }

    // Check if user has reached their limit
    if (currentUsage >= limit) {
      return res.status(403).json({
        error: `Você atingiu o limite de ${limit} projeto${limit > 1 ? 's' : ''} AI gerado${limit > 1 ? 's' : ''} do plano ${planData.displayName}. Faça upgrade para gerar mais projetos.`,
        code: "AI_PROJECT_LIMIT_REACHED",
        currentUsage,
        limit,
        planName: planData.displayName,
        upgradeUrl: "/pricing",
      });
    }

    // User is within limits - allow
    next();
  } catch (error) {
    console.error("Error checking AI project limits:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Increment user's AI projects used count
 * Call this after successfully generating a project
 */
export async function incrementAiProjectsUsed(userId: string): Promise<void> {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user && user.length > 0) {
      const currentUsage = user[0].aiProjectsUsed || 0;
      await db
        .update(users)
        .set({ aiProjectsUsed: currentUsage + 1 })
        .where(eq(users.id, userId));

      console.log(`✅ Incremented AI projects used for user ${userId}: ${currentUsage} → ${currentUsage + 1}`);
    }
  } catch (error) {
    console.error("Error incrementing AI projects used:", error);
    throw error;
  }
}
