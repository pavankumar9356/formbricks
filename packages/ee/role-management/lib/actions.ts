"use server";

import { getServerSession } from "next-auth";
import { hasOrganizationAccess, hasOrganizationAuthority, isOwner } from "@formbricks/lib/auth";
import { authOptions } from "@formbricks/lib/authOptions";
import { updateInvite } from "@formbricks/lib/invite/service";
import {
  getMembershipByUserIdOrganizationId,
  transferOwnership,
  updateMembership,
} from "@formbricks/lib/membership/service";
import { AuthenticationError, AuthorizationError, ValidationError } from "@formbricks/types/errors";
import type { TInviteUpdateInput } from "@formbricks/types/invites";
import type { TMembershipUpdateInput } from "@formbricks/types/memberships";
import type { TUser } from "@formbricks/types/user";

export const transferOwnershipAction = async (organizationId: string, newOwnerId: string) => {
  const session = await getServerSession(authOptions);
  const user = session?.user as TUser;
  if (!session) {
    throw new AuthenticationError("Not authenticated");
  }

  if (!user) {
    throw new AuthenticationError("Not authenticated");
  }

  const hasAccess = await hasOrganizationAccess(user.id, organizationId);
  if (!hasAccess) {
    throw new AuthorizationError("Not authorized");
  }

  const isUserOwner = await isOwner(user.id, organizationId);
  if (!isUserOwner) {
    throw new AuthorizationError("Not authorized");
  }

  if (newOwnerId === user.id) {
    throw new ValidationError("You are already the owner of this organization");
  }

  const membership = await getMembershipByUserIdOrganizationId(newOwnerId, organizationId);
  if (!membership) {
    throw new ValidationError("User is not a member of this organization");
  }

  await transferOwnership(user.id, newOwnerId, organizationId);
};

export const updateInviteAction = async (
  inviteId: string,
  organizationId: string,
  data: TInviteUpdateInput
) => {
  const session = await getServerSession(authOptions);
  const user = session?.user as TUser;

  if (!user) {
    throw new AuthenticationError("Not authenticated");
  }

  if (!session) {
    throw new AuthenticationError("Not authenticated");
  }

  const isUserAuthorized = await hasOrganizationAuthority(user.id, organizationId);

  if (!isUserAuthorized) {
    throw new AuthenticationError("Not authorized");
  }

  return await updateInvite(inviteId, data);
};

export const updateMembershipAction = async (
  userId: string,
  organizationId: string,
  data: TMembershipUpdateInput
) => {
  const session = await getServerSession(authOptions);
  const user = session?.user as TUser;

  if (!user) {
    throw new AuthenticationError("Not authenticated");
  }

  if (!session) {
    throw new AuthenticationError("Not authenticated");
  }

  const isUserAuthorized = await hasOrganizationAuthority(user.id, organizationId);

  if (!isUserAuthorized) {
    throw new AuthenticationError("Not authorized");
  }

  return await updateMembership(userId, organizationId, data);
};
