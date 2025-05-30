import { Address } from '@/types';
import { GuildClient } from '@guildxyz/sdk';
import {
  Guild,
  GuildReward,
  LeaderboardItem,
  MembershipResult,
  PublicUserProfile,
  Requirement,
  Role,
  RoleReward,
} from '@guildxyz/types';

export class GuildXyzService {
  constructor(private readonly guildClient: GuildClient) {}

  async fetchGuild(guildIdOrUrlName: number | string): Promise<Guild | undefined> {
    return this.guildClient.guild.get(guildIdOrUrlName);
  }

  async fetchGuilds(guildIds: number[]): Promise<Guild[]> {
    return this.guildClient.guild.getMany(guildIds);
  }

  async fetchRoleName(guildId: number, roleId: number): Promise<Role | undefined> {
    return this.guildClient.guild.role.get(guildId, roleId) as any;
  }

  async fetchRoleNames(guildId: number): Promise<Role[]> {
    return this.guildClient.guild.role.getAll(guildId) as any;
  }

  async fetchRoleRewards(guildId: number, roleId: number): Promise<RoleReward[]> {
    return this.guildClient.guild.role.reward.getAll(guildId, roleId) as any;
  }

  async fetchRoleRequirements(guildId: number, roleId: number): Promise<Requirement[]> {
    return this.guildClient.guild.role.requirement.getAll(guildId, roleId) as any;
  }

  async fetchGuildRewards(guildId: number): Promise<GuildReward[]> {
    return this.guildClient.guild.reward.getAll(guildId) as any;
  }

  async fetchUserProfile(address: Address): Promise<PublicUserProfile | undefined> {
    return this.guildClient.user.getProfile(address);
  }

  async fetchUserMembership(address: Address): Promise<MembershipResult[]> {
    return this.guildClient.user.getMemberships(address);
  }

  async fetchUserGuildMembership(
    address: Address,
    guildId: number
  ): Promise<MembershipResult | undefined> {
    const memberships = await this.fetchUserMembership(address);
    return memberships.find(item => item.guildId === guildId);
  }

  async fetchRankInGuild(
    address: Address,
    guildId: number,
    guildPlatformId: number
  ): Promise<LeaderboardItem> {
    return this.guildClient.user.getRankInGuild(address, guildId, guildPlatformId);
  }
}
