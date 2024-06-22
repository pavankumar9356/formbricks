"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@formbricks/lib/authOptions";
import { hasUserEnvironmentAccess } from "@formbricks/lib/environment/auth";
import { canUserAccessIntegration } from "@formbricks/lib/integration/auth";
import { createOrUpdateIntegration, deleteIntegration } from "@formbricks/lib/integration/service";
import { AuthorizationError } from "@formbricks/types/errors";
import { TIntegrationInput } from "@formbricks/types/integration";

export const createOrUpdateIntegrationAction = async (
  environmentId: string,
  integrationData: TIntegrationInput
) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authenticated");

  const isAuthorized = await hasUserEnvironmentAccess(session.user.id, environmentId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await createOrUpdateIntegration(environmentId, integrationData);
};

export const deleteIntegrationAction = async (integrationId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessIntegration(session.user.id, integrationId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await deleteIntegration(integrationId);
};
